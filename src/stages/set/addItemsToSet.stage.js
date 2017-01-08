import Promise from 'bluebird';
import simpleInsert from '../share/simpleInsert.stage'
import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, items, set, type, user) {
  const promises = [];
  const insertItems = items.filter(item => typeof item === 'object');
  const idItems = items.filter(item => typeof item === 'string');
  if (insertItems.length > 0) {
    promises.push(simpleInsert(scope,
      'item',
      insertItems.map(item => Object.assign(item, {
        _type: {
          _id: type._id,
          _type: type.title
        },
        _sets: [{
          _id: set._id,
          _title: set.title
        }],
        _creator: {
          _id: user._id,
          username: user.username
        }
      })),
      'addItemsToSetItemsCreated'
    ))
  }
  if (idItems.length > 0) {
    promises.push(db.item.update({ '_id': { $in: idItems.map(itemId => ObjectId(itemId)) } }, {
        $push: {
          _sets: set._id,
          _setTitles: set.title
        }
      }).then(() => {
        db.item.find({ '_id': { $in: idItems.map(itemId => ObjectId(itemId)) } }).toArray().then((result) => {
          scope.items.updated = scope.items.updated.concat(result);
        }).catch((err) => {
          throw err;
        })
      }).catch((err) => {
        throw err;
      }))
  }
  return Promise.all(promises).then(() => {
    const allItems = ((scope.addItemsToSetItemsCreated) ?
      idItems.concat(scope.addItemsToSetItemsCreated.map(item => item._id.toString())) :
      idItems);
    return db.set.findAndModify({ '_id': ObjectId(set._id) }, null, {
      $pushAll: {
        items: allItems
      }
    }, { new: true }).then((result) => {
      scope.sets.updated.push(result.value);
    }).catch((err) => {
      throw err;
    })
  });
}
