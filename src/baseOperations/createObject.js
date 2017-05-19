import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import getObject from './getObject';
import validateSchema from 'stages/share/validateSchema.stage';

// Note: type and isTypeValidationDone are optional parameters
export default function createObject(scope, object, path, type, isTypeValidationDone) {
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
    .then(() => request.post(process.env.ES_URL + '/object/' + object._type).send(object))
    .then((result) => console.log(result))
    .catch((err) => { console.log(err); throw err })
}
