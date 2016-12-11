import {db} from '../../mongo'
import uuid from 'node-uuid'
import {ObjectID} from 'mongodb'

module.exports = function(req, res, next) {
  if (req.user && req.user.accessMethod === 'token') {
    const newKey = uuid.v4();
    db.user.update({ '_id': ObjectID(req.user._id) }, {
      $set: {
        key: newKey
      }
    }, (err) => {
      if (err) { next(err) }
      else {
        res.status(200).send({
          key: newKey
        });
      }
    })
  } else {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  }
}
