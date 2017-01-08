import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, id, saveTo, path) {
  return db[collection].findOne({ '_id': ObjectId(id) }).then((result) => {
    if (result == null) {
      scope.errors[path.join('.')] = collection + ' ' + id + ' not found';
    } else {
      result._id = result._id.toString();
    }
    scope[collection + 's'].read.push(result);
    scope[saveTo] = result;
  }).catch((err) => {
    throw err;
  })
}
