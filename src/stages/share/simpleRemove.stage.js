import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, id) {
  return db[collection].findAndModify({ '_id': ObjectId(id) }, null, null, { remove: true }).then((result) => {
    console.log(result);
    result.value._id = result.value._id.toString();
    scope[collection + 's'].deleted.push(result.value);
  }).catch((err) => {
    throw err;
  })
}
