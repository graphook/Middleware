import {db} from '../../mongo'
import {ObjectId} from 'mongodb'

module.exports = function(req, res, next) {
  // get item by id
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    db.item.find({ _id: ObjectId(req.params.itemId), _sets: req.paramsid }, (err, result) => {
      if (err) { next(err) }
      else if (!result) {
        next({
          user: true,
          status: 404,
          message: "Item not found in this set."
        });
      } else {
        res.send(result);
      }
    });
  }
}
