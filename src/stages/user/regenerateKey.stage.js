import {db} from '../../mongo'
import uuid from 'uuid'
import {ObjectID} from 'mongodb'

export default function(scope) {
  const newKey = uuid.v4();
  return db.user.update({ '_id': ObjectID(scope.user._id) }, {
    $set: {
      key: newKey
    }
  }).then(() => {
    scope.user.key = newKey;
    scope.users.updated.push(scope.user);
  }).catch((err) => {
    throw err;
  })
}
