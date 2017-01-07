import {db} from '../../mongo'
import {ObjectID} from 'mongodb'

module.exports = function(req, res, next) {
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    db.type.findOne({ '_id': ObjectID(req.params.id) }, (err, result) => {
      if (err) { next(err) }
      else {
        res.status(200).send(result);
      }
    })
  }
}
