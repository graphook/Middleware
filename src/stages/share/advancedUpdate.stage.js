import {db} from '../../mongo';
import {ObjectId} from 'mongodb';
import {isEqual} from 'lodash';

const validQueries = [
  '$inc',
  '$set',
  '$unset',
  '$min',
  '$max',
  '$currentDate'
];
const validQueriesSet = new Set(validQueries);

// Wow, 3 queries. Surely there has to be a faster way of doing this, but I couldn't
// think of one. Well, there is seeing what effect the query will have on the documents
// on the server, but implementing that check seems like too much.
export default function(scope, collection, find, update, saveTo, path) {
  const subScope = {};
  return db[collection].find(find).toArray().then((result) => {
    if (result.length === 0) {
      scope.errors[path.join('.')] = 'Could not find any matching ' + collection + 's.'
      throw {};
    }
    subScope.old = {};
    result.forEach((item) => {
      subScope.old[item._id.toString()] = Object.assign(item, { _id: item._id.toString() });
    })
  })
  .then(() => db[collection].update(find, update, {multi: true}))
  .then(() => db[collection].find({ '_id': { $in: Object.keys(subScope.old).map(id => ObjectId(id)) } }).toArray())
  .then((result) => {
    scope[saveTo] = [];
    result.forEach((item) => {
      if (!isEqual(item, subScope.old[item._id.toString()])) {
        scope[collection + 's'].updated.push(item);
        scope[saveTo].push(item);
      }
    });
  })
  .catch((err) => {
    if (err) {
      throw err;
    }
  })
}
