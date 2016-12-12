import {db} from '../../mongo'
import bcrypt from 'bcrypt-nodejs'
import {ObjectID} from 'mongodb';

module.exports = function(req, res, next) {
  if (req.user && req.user.accessMethod === 'token') {
    let body = req.body;
    if (!body.oldPassword || !body.newPassword) {
      next({
        user: true,
        status: 400,
        message: 'Request must have a newPassword and oldPassword.'
      });
    } else if (bcrypt.compareSync(body.oldPassword, req.user.password)) {
      db.user.update({'_id': ObjectID(req.user._id)}, {
        $set: {
          password: bcrypt.hashSync(body.newPassword)
        }
      }, (err) => {
        if (err) { next(err) }
        else {
          res.send();
        }
      });
    } else {
      next({
        user: true,
        status: 401,
        message: 'Invalid old password'
      });
    }
  } else {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  }
}
