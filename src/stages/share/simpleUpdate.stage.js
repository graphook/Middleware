import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, id, body, saveTo, path) {
  return db[collection].findAndModify({ '_id': ObjectId(id) }, null, { $set: body }, { new: true }).then((result) => {
    result.value._id = result.value._id.toString();
    scope[saveTo] = result.value
    scope[collection + 's'].updated.push(result.value);
  }).catch((err) => {
    throw err;
  })
}
