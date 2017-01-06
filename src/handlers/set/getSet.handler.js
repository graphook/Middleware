import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

// TODO: handle errors for non ids
module.exports = function(req, res, next) {
  // get set by id
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    db.set.findOne({ _id: ObjectId(req.params.id)}, (err, result) => {
      if (err) { next(err) }
      else if (!result) {
        next({
          user: true,
          status: 404,
          message: "Set not found."
        });
      } else {
        res.send(result);
      }
    });
  }
}
