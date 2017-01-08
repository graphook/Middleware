import {db} from '../../mongo';

export default function(scope, collection, body) {
  return db[collection].insert(body).then((result) => {
    scope[collection + 's'].created = scope[collection + 's'].created.concat(result.ops);
    scope.status = 201;
  }).catch((err) => {
    throw err;
  })
}
