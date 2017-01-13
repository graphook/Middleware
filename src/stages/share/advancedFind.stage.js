import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, collection, find, saveTo, path, params) {
  let findQuery = db[collection].find(find)
  if (params && params.count) {
    const count = parseInt(params.count);
    const page = (params.page) ? parseInt(params.page) : 0;
    findQuery = findQuery.skip(count * page).limit(count);
  }
  return findQuery.toArray().then((result) => {
    if (result.length === 0) {
      scope.errors[path.join('.')] = 'Could not find any matching ' + collection + 's.';
    } else {
      result = result.map(item => Object.assign(item, { _id: item._id.toString() }));
    }
    scope[collection + 's'].read = scope[collection + 's'].read.concat(result);
    scope[saveTo] = result;
  }).catch((err) => {
    throw err;
  })
}
