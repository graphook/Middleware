import {db} from '../../../mongo'
import async from 'async'
import validateItem from '../../../validators/item.validator'
import {ObjectId} from 'mongodb'


export default function(setId, type, items = [], userIdInput, parentCb) {
  let errors = [];
  let bulk = db.item.initializeUnorderedBulkOp();
  let idItems = [];
  let objectItems = [];
  const userId = userIdInput.toString();
  const typeId = type._id.toString();
  // Sort already created items and to be created items
  items.forEach((item) => {
    if (typeof item === 'object' && !Array.isArray(item)) {
      objectItems.push(item);
    } else if (typeof item === 'string') {
      idItems.push(item);
    } else {
      errors.push(item + ' is not a valid item.');
    }
  });
  // Validate Object items
  let validatedObjectItems = [];
  objectItems.forEach((item) => {
    item._type = typeId
    item._sets = [setId]
    item._creator = userId;
    if (!validateItem(item, type)) {
      errors.push(JSON.stringify(item) + ' does not follow the type.')
    } else {
      bulk.insert(item);
    }
  });
  // Create the requests to update the already created items
  idItems.forEach((itemId) => {
    bulk.find({ '_id': ObjectId(itemId), '_type': typeId, '_creator': userId }).updateOne({
      $push: {
        _sets: setId
      }
    });
  });
  // HACK: Due to limitations on Mongo, update does not return the ids of what
  // was actually updated. So we perform an extra query to see what was
  // changed.
  async.parallel({
      updated: (cb) => {
        // Get all qualified already created items
        db.item.find({ '_id': { $in: idItems.map(idItem => ObjectId(idItem)) }, '_type': typeId,
            '_creator': userId }).toArray((err, result) => {
          if (err) { cb(err) }
          else {
            let modifiedIds = [];
            let errors = [];
            var applicableIds = new Set(result.map((item) => {
              return item._id.toString();
            }));
            // Sort the items between qualified and unqualified
            idItems.forEach((itemId) => {
              if (applicableIds.has(itemId.toString())) {
                modifiedIds.push(itemId)
              } else {
                errors.push(itemId + ' could not be added to this set.');
              }
            });
            cb(null, {
              ids: modifiedIds,
              errors: errors
            });
          }
        })
      },
      inserted: (cb) => {
        // Run the request to update all items
        if (objectItems.length > 0 || idItems.lenth > 0) {
          bulk.execute((err, result) => {
            if (err) { cb(err) }
            cb(null, {
              ids: result.getInsertedIds().map((i) => { return i._id }),
              errors: []
            });
          });
        } else {
          cb(null, { ids: [], errors: [] })
        }
      }
    }, (err, results) => {
      if (err) { parentCb(err) }
      else {
        errors = errors.concat(results.inserted.errors).concat(results.updated.errors)
        let allIds = results.inserted.ids.concat(results.updated.ids).map(objectIds => objectIds.toString())
        // update the set to reference the newly created items and already created items
        console.log(setId);
        db.set.update({ '_id': ObjectId(setId), '_creator': userId }, {
          $pushAll: {
            items: allIds
          }
        }, (err, result) => {
          console.log(result);
          if (err) { parentCb(err) }
          else {
            parentCb(null, {
              updatedDocuments: allIds,
              errors: errors
            });
          }
        })
      }
    });
}
