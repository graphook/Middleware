import {db} from '../../mongo'
import {ObjectID} from 'mongodb'
import bcrypt from 'bcrypt-nodejs';

export default function(scope, body) {
  if (!bcrypt.compareSync(body.oldPassword, scope.user.password)) {
    scope.errors['body.oldPassword'] = 'Does not match the current password.'
    throw scope;
  }
  const encryptedPass = bcrypt.hashSync(body.newPassword);
  return db.user.update({'_id': ObjectID(scope.user._id)}, {
    $set: {
      password: encryptedPass
    }
  })
  .then(() => {
    scope.user.password = encryptedPass;
    scope.users.updated.push(scope.user);
  })
  .catch((err) => {
    throw err;
  });
}
