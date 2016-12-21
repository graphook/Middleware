import {db} from '../../mongo'
import bcrypt from 'bcrypt-nodejs'
import uuid from 'node-uuid'
import {ObjectID} from 'mongodb';

module.exports = function(req, res, next) {
  const body = req.body;
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else if ((!body.username && !body.email) || !body.password) {
    next({
      user: true,
      status: 400,
      message: 'Request must have a password and a username or email,.'
    });
  } else {
    db.user.findOne({ $or: [{ username: body.username }, { email: body.email }] }, (err, user) => {
      if (err) { next(err) }
      else if (bcrypt.compareSync(body.password, user.password)) {
        let token = uuid.v4();
        db.user.update({'_id': ObjectID(user._id)}, {
          $push: {
            tokens: token
          }
        }, (err) => {
          if (err) { next(err) }
          else {
            res.send({
              user: {
                username: user.username,
                email: user.email,
                key: user.key
              },
              token: token
            });
          }
        });
      } else {
        next({
          user: true,
          status: 401,
          message: 'Username or password was invalid.'
        })
      }
    });
  }
}
