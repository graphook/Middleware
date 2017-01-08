import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, id) {
  return db[collection].findAndModify({ '_id': ObjectId(id) }, null, null, { remove: true }).then((result) => {
    scope[collection + 's'].deleted.push(result.value);
    scope.status = 200;
  }).catch((err) => {
    throw err;
  })
}
