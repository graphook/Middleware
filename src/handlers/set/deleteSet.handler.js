import {db} from '../../mongo'
import {ObjectId} from 'mongodb'
import async from 'async'

module.exports = function(req, res, next) {
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    // get the set
    db.set.findOne({ '_id': ObjectId(req.params.id) }, (err, set) => {
      if (err) { next(err) }
      else if (!set) {
        next({
          user: true,
          status: 404,
          message: "Set not found."
        });
      } else if (set._creator.toString() !== req.user._id.toString()) {
        next({
          user: true,
          status: 401,
          message: "Access denied."
        });
      } else {
        async.parallel({
          item: (cb) => {
            // Find and delete all items that are only a part of this set
            db.item.remove({ _sets: { $size: 1, $eq: ObjectId(req.params.id) }}, (err) => {
              if (err) { cb(err) }
              else {
                // Find all other items and remove this set from them
                db.item.update({ _sets: ObjectId(req.params.id) }, {
                  $pull: {
                    _sets: ObjectId(req.params.id)
                  }
                }, (err) => {
                  cb(err)
                });
              }
            });
          },
          set: (cb) => {
            // remove the set
            db.set.deleteOne({ '_id': ObjectId(req.params.id) }, cb)
          },
          type: (cb) => {
            // remove from type
            db.type.update({ uses: ObjectId(req.params.id) }, {
              $pull: {
                uses: ObjectId(req.params.id)
              },
              $inc: {
                numUses: -1
              }
            }, cb)
          }
        }, (err, results) => {
          if (err) { next(err) }
          else {
            res.send(results.set);
          }
        });
      }
    })
  }
}
