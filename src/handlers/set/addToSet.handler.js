import {db} from '../../mongo'
import createItems from './util/createItems'
import {ObjectId} from 'mongodb'
import async from 'async'

module.exports = function(req, res, next) {
  let items = req.body;
  let setId = req.params.id;
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    // Get the set and type documents
    async.parallel({
      set: (cb) => {
        db.set.findOne({ '_id': ObjectId(setId) }, cb);
      },
      type: (cb) => {
        db.type.findOne({ uses: req.params.id }, cb);
      }
    }, (err, results) => {
      results = results || {}
      const set = results.set;
      const type = results.type;
      if (err) { next( err ) }
      else if (!set._id) {
        next({
          user: true,
          status: 400,
          message: "Set not found."
        });
      } else if (!type) {
        next({
          user: true,
          status: 500,
          message: "The type for this set no longer exists."
        });
      } else if (set._creator.toString() !== req.user._id.toString()) {
        next({
          user: true,
          status: 401,
          message: "Access denied."
        });
      } else {
        // Create the items
        createItems(setId, type, items, req.user._id, (err, result) => {
          if (err) { next(err) }
          else {
            res.status(201).send(result)
          }
        })
      }
    });
  }
}
