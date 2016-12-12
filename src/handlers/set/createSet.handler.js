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
        db.set.insert({
          title: set.title,
          description: set.description,
          stars: 0,
          type: ObjectId(set.type),
          tags: set.tags
        }, (err, result) => {
          if (err) { next(err) }
          else {
            const returnedSet = result;
            const setId = result.insertedIds[0];
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
                createItems(setId, type, set.items, (err, result) => {
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
