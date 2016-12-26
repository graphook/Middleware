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
  } else if (!Array.isArray(req.body)) {
    next({
      user: true,
      status: 401,
      message: "The body should be an array of all item ids to remove."
    });
  } else {
    const toRemove = req.body.map((id) => { return ObjectId(id) })
    async.parallel({
      item: (cb) => {
        // find and remove all items that are only in this set
        db.item.remove({ _id: { $in: toRemove } , _sets: { $size: 1, $eq: req.params.id }}, (err) => {
          if (err) { cb(err) }
          else {
            // remove this set from all other items
            db.item.update({ _id: { $in: toRemove }, _sets: req.params.id }, {
              $pull: {
                _sets: req.params.id
              }
            }, (err) => {
              cb(err)
            });
          }
        });
      },
      set: (cb) => {
        // remove items from this set
        db.set.update({ '_id': ObjectId(req.params.id) }, {
          $pullAll: {
            items: toRemove
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

}
