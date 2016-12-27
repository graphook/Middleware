import {db} from '../../mongo'
import {ObjectId} from 'mongodb'
import createItems from './util/createItems.js'

module.exports = function(req, res, next) {
  let set = req.body;
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else if (!set.title || !set.type) {
    next({
      user: true,
      status: 400,
      message: "The set must have a title and a type."
    });
  } else {
    // Get the type for this set
    db.type.findOne({ '_id': ObjectId(set.type) }, (err, result) => {
      if (err) { next(err) }
      else if (!result) {
        next({
          user: true,
          status: 400,
          message: "Type " + set.type + " does not exist."
        });
      } else {
        const type = result;
        // Insert the set
        db.set.insert({
          title: set.title,
          description: set.description,
          icon: set.icon,
          stars: 0,
          type: set.type,
          typeName: type.title,
          tags: set.tags,
          _creator: req.user._id
        }, (err, result) => {
          if (err) { next(err) }
          else {
            // Update the type to tell it that this set is using it
            const returnedSet = result;
            const setId = result.insertedIds[0].toString();
            db.type.update({ '_id': ObjectId(set.type) }, {
              $push: {
                uses: setId
              },
              $inc: {
                numUses: 1
              }
            }, (err, result) => {
              if (err) { next(err) }
              else {
                // Create the items that go in this set
                createItems(setId, type, set.items, req.user._id, (err, result) => {
                  if (err) { next(err) }
                  else {
                    result.set = returnedSet
                    res.status(201).send(result)
                  }
                });
              }
            });
          }
        });
      }
    })
  }
}
