import notImplemented from 'stages/share/notImplemented.stage';

module.exports = function(req, res) {
  notImplemented(req, res);
}

/*
module.exports = function(req, res, next) {
  let set = req.body;
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    // Get the set
    db.set.findOne({ '_id': ObjectId(req.params.id) }, (err, result) => {
      if (err) { next(err) }
      else if (!result) {
        next({
          user: true,
          status: 404,
          message: "Set not found."
        });
      } else {
        let set = result;
        // Change creator for the set
        set._creator = req.user._id
        delete set._id;
        // Re-insert the set with the new creator
        db.set.insert(set, (err, result) => {
          if (err) { next(err) }
          else {
            const insertedObject = result;
            const insertId = result.insertedIds[0];
            async.parallel({
              item: (cb) => {
                // Update the items in the set to have this set reference them
                db.item.update({ '_id': { $in: set.items }}, {
                  $push: {
                    _sets: insertId
                  }
                }, cb);
              },
              type: (cb) => {
                // Add this set to the type
                db.type.update({ _id: ObjectId(set.type) }, {
                  $push: {
                    uses: insertId
                  }
                }, cb);
              }
            }, (err, result) => {
              if (err) { next(err) }
              else {
                res.status(201).send(insertedObject);
              }
            })



            db.item.update({ '_id': { $in: set.items }}, {
              $push: {
                _sets: insertId
              }
            }, (err, result) => {

            })
          }
        });
      }
    });
  }
}
*/
