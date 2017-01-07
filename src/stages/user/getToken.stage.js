import {db} from '../../mongo';
import bcrypt from 'bcrypt-nodejs';
import ObjectID from 'mongodb';
import uuid from 'node-uuid';

export default function(scope) {
  const body = scope.req.body;
  return db.user.findOne({ $or: [{ username: body.username }, { email: body.email }] }).then((user) => {
    if (!user || !bcrypt.compareSync(body.password, user.password)) {
      scope.status = 401;
      scope.errors['auth'] = 'username / email and password do not match'
      throw scope;
    }
    const token = uuid.v4();
    return db.user.update({'_id': ObjectID(user._id)}, {
      $push: {
        tokens: token
      }
    }).then(() => {
      scope.auth = {
        token: token,
        user: {
          username: user.username,
          email: user.email,
          password: user.password
        }
      }
    }).catch((err) => {
      throw err;
    });
  }).catch((err) => {
    throw err;
  })
}
