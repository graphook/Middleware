import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, id) {
  return db[collection].findOne({ '_id': ObjectId(id) }).then((result) => {
    scope[collection + 's'].read.push(result);
    scope.status = 200;
  }).catch((err) => {
    throw err;
  })
}
