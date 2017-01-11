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

// TODO: Complete

// Wow, 5 queries. Surely there has to be a faster way of doing this, but I couldn't
// think of one. Well, there is seeing what effect the query will have on the documents
// on the server, but implementing that check seems like too much.
export default function(scope, collection, find, update, saveTo, path) {
  // TODO: Don't forget to find the type
  const subScope = {};
  // check to see if the update input is valid
  Object.keys(update).forEach((updateKey) => {
    if (!validQueriesSet.has(updateKey)) {
      scope.errors[[...path, updateKey].join('.')] = 'Updates only allow the following keys:' + validQueries.map(key => ' ' + key);
    }
  });
  if (Object.keys(scope.errors).length > 0) {
    throw scope;
  }

  return db[collection].find(find).toArray().then((result) => {
    if (result.length === 0) {
      console.log('is empty')
      scope.errors[path.join('.')] = 'Could not find any matching ' + collection + 's.'
      throw {};
    }
    subScope.old = {};
    result.forEach((item) => {
      subScope.old[item._id.toString()] = Object.assign(item, { _id: item._id.toString() });
    })
    console.log(subScope);
  })
  .then(() => db[collection].update(find, update, {multi: true}))
  .then(() => db[collection].find({ '_id': { $in: Object.keys(subScope.old).map(id => ObjectId(id)) } }, update).toArray())
  .then((result) => {
    // check if the new ones are valid
    console.log(result);
  })
  .catch((err) => {
    if (err) {
      throw err;
    }
  })
}
