import {db} from '../../mongo';

export default function(scope, collection, body, saveTo) {
  return db[collection].insert(body).then((result) => {
    result.ops.forEach((item) => {
      Object.assign(item, { _id: item._id.toString() })
    })
    scope[collection + 's'].created = scope[collection + 's'].created.concat(result.ops);
    scope[saveTo] = result.ops;
  }).catch((err) => {
    throw err;
  })
}
