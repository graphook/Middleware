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
    // check if this set has already been starred by this user
    db.user.findOne({ _id: ObjectId(req.user._id), stars: req.params.id }, (err, user) => {
      if (err) { next(err) }
      else if (user) {
        next({
          user: true,
          status: 400,
          message: "The user has already starred this set."
        });
      } else {
        async.parallel({
          set: (cb) => {
            // increment stars on this set
            db.set.update({ _id: ObjectId(req.params.id) }, {
              $inc: {
                stars: 1
              }
            }, cb)
          },
          user: (cb) => {
            // add this set to the sets that are starred by this user
            db.user.update({ _id: ObjectId(req.user._id) }, {
              $push: {
                stars: req.params.id
              }
            }, cb)
          }
        }, (err) => {
          if (err) { next(err) }
          res.send()
        });
      }
    });
  }
}
