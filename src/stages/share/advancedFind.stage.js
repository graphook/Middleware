import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, find, saveTo, path) {
  return db[collection].find(find).toArray().then((result) => {
    if (result == null) {
      scope.errors[path.join('.')] = 'Could not find any matching ' + collection + 's.';
    } else {
      result._id = result._id.toString();
    }
    scope[collection + 's'].read = scope[collection + 's'].read.concat(result);
    scope[saveTo] = result;
  }).catch((err) => {
    throw err;
  })
}