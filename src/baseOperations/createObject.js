import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import getObject from './getObject';
import validateSchema from 'stages/share/validateSchema.stage'

/* options (optional):
{
  type: the type of this object (if already fetched),
  isTypeValidationDone: true if type validation was already done
  private: true if this is to create a private file
  saveToResponse: true if the result of this should be saved to the response
}
*/
export default function createObject(scope, object, path, saveTo, options = {}) {
  scope.type = options.type;
  return Promise.try(() => {
      if (object._permissions || object._id) {
        scope.errors[path.join('.')] = 'The object to be created must not have a _permissions or _id attribute.'
      }
    })
    .then(() => {
      if (options.type == null) {
        return getObject(scope, 'type_type', object._type, ['type'], 'type');
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      delete object._type;
      if (!options.isTypeValidationDone) {
        validateSchema(object, scope.type.properties, scope.errors, path);
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      object._permissions = {
        owner: scope.user._id
      }
      if (!options.private) {
        object._permissions.read = ['all'];
      }
    })
    .then(() => request.post(process.env.ES_URL + '/object/' + scope.type._id).send(object))
    .then((result) => scope[saveTo] = result.body)
    .then(() => {
      if (options.saveToResponse) {
        scope.addItem('created', Object.assign(object, {
          _type: scope[saveTo]._type,
          _id: scope[saveTo]._id
        }))
      }
    })
    .catch((err) => { throw err })
}
