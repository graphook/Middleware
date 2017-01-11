import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, toRemove, saveTo, path) {
  return db[collection].find(toRemove).toArray().then((removedObjects) => {
    return db[collection].remove(toRemove).then((result) => {
      scope[saveTo] = removedObjects;
      scope[collection + 's'].deleted = scope[collection + 's'].deleted.concat(removedObjects);
    }).catch((err) => {
      throw err;
    })
  }).catch((err) => {
    throw err;
  })
}
