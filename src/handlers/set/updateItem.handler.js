import notImplemented from 'stages/share/notImplemented.stage';

module.exports = function(req, res) {
  notImplemented(req, res);
}

/*
module.exports = function(req, res, next) {
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    // Get the item
    db.findOne({ _id: ObjectId(req.params.itemId), _sets: req.paramsid }, (err, item) => {
      if (err) { next(err) }
      else if (!result) {
        next({
          user: true,
          status: 404,
          message: "Item not found in set."
        });
      } else if (!Array.isArray(req.body)) {
        next({
          user: true,
          status: 400,
          message: "Body must be an array of updates"
        });
      } else {
        // cleanse requests
        let updates = req.body
        delete updates._id
        delete updates._sets
        delete updates._types

        // if this is the user's item
        if (item._creator.toString() === req.user._id.toString()) {
          let bulk = db.item.initializeUnorderedBulkOp();
          updates.forEach((update) => {

          })
        } else {
          // TODO: implement this
          // if this is not the user's item
            // clone the item, replacing the _sets with only this set
              // replace the reference in the set with this item id
              // update this item
          next({
            user: true,
            status: 401,
            message: "Access Denied."
          });
        }
      }
    });
  }
}
*/
