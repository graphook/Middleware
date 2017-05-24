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
export default function createObject(scope, objects, path, saveTo, options = {}) {
  scope.type = options.type;
  if (objects.length < 1) {
    return;
  }
  return Promise.try(() => {
      if (options.type == null) {
        return getObject(scope, 'type_type', objects[0]._type, ['type'], 'type');
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      objects.forEach((object, index) => {
        delete object._type;
        if (!options.isTypeValidationDone) {
          validateSchema(object, scope.type.properties, scope.errors, path.concat(index));
        }
      });
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      scope.requestBody = [];
      objects.forEach((object) => {
        object._permissions = {
          owner: scope.user._id
        }
        if (!options.private) {
          object._permissions.read = ['all'];
        }
        scope.requestBody.push({
          index: {
            _index: 'object',
            _type: scope.type._id,
          }
        })
        scope.requestBody.push(object);
      });
    })
    .then(() => request.post(process.env.ES_URL + '/_bulk')
      .send(scope.requestBody.reduce((acc, val) => acc + JSON.stringify(val) + '\n', '')))
    .then((result) => scope[saveTo] = result.body)
    .then(() => {
      if (options.saveToResponse) {
        objects.forEach((object, index) => {
          scope.addItem('created', Object.assign(object, {
            _type: scope[saveTo].items[index].index._type,
            _id: scope[saveTo].items[index].index._id
          }))
        });
      }
    })
    .catch((err) => { console.log(err); throw err })
}
