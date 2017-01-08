import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, id, body) {
  console.log(body);
  console.log(id);
  return db[collection].findAndModify({ '_id': ObjectId(id) }, null, { $set: body }, { new: true }).then((result) => {
    console.log(result)
    scope[collection + 's'].updated.push(result.value);
    scope.status = 200;
  }).catch((err) => {
    throw err;
  })
}
