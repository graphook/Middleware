import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import getObject from './getObject';
import validateSchema from 'stages/share/validateSchema.stage';

// Note: type and isTypeValidationDone are optional parameters
export default function createObject(scope, object, path, saveTo, shouldPutInResponse = true, type, isTypeValidationDone) {
  scope.type = type;
  return Promise.try(() => {
      if (type == null) {
        return getObject(scope, 1, object._type, 'type');
      }
    })
    .then(() => {
      if (!isTypeValidationDone) {
        validateSchema(object, type.properties, scope.errors, path);
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      delete object._type;
    })
    .then(() => request.post(process.env.ES_URL + '/object/' + scope.type._type).send(object))
    .then((result) => scope[saveTo] = result.body)
    .catch((err) => { throw err })
}
