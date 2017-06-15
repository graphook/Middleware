import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import searchObjects from './searchObjects';
import validateSchema from 'stages/share/validateSchema.stage';
import checkIfObjectAllowsUser from 'stages/share/checkifObjectAllowsUser.stage';

/*
{
  saveToResponse: true if the result of this should be saved to the result
}
*/
const idsSchema = {
  type: 'array',
  items: {
    type: 'keyword'
  }
}
export default function deleteObjects(scope, ids, path, saveTo, options = {}) {
  return Promise.try(() => validateSchema(ids, idsSchema, scope.errors, path))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => searchObjects(scope, {
      query: {
        terms: {
          _id: ids
        }
      }
    }, ['searchQuery'], 'fetchedObjects'))
    .then(() => scope.fetchedObjects.forEach((obj, index) => {
      if (obj._type === 'type_type') {
        scope.errors[path.concat('object', index, '_type')] = 'Cannot delete a type.'
      }
      return checkIfObjectAllowsUser(scope, 'read', obj, [obj._id]);
    }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => request.post(process.env.ES_URL + '/_bulk').send(scope.fetchedObjects.reduce((aggStr, obj) => {
        aggStr += JSON.stringify({
          delete : {
            _index : 'object',
            _type : obj._type,
            _id : obj._id
          }
        }) + '\n';
        return aggStr;
      }, '')))
    .then(() => {
      if (scope.saveToResponse) {
        scope.fetchedObjects.forEach((obj) => scope.addItem('deleted', obj));
      }
    })
    .catch((err) => { console.log(err); throw err });
}
