import {db} from '../../mongo';
import {ObjectID} from 'mongodb';

export default function(scope, collection, id, body) {
  return db[collection].update({ '_id': ObjectID(id) }, {
    $set: body
  }).then(() => {
    return db[collection].findOne({ '_id': ObjectID(id) }).then((result) => {
      scope[collection + 's'].updated.push(result);
    }).catch((err) => {
      throw err;
    });
  }).catch((err) => {
    throw err;
  })
}
