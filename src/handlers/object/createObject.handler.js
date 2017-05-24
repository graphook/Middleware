import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import createType from './createType.handler';
import createObject from 'baseOperations/createObject';
import createObjects from 'baseOperations/createObjects';

module.exports = function(req, res) {
  if (req.body._type && req.body._type === 'type_type') {
    return createType(req, res);
  }
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => {
      if (Array.isArray(req.body)) {
        return createObjects(scope, req.body, ['body'], 'saved', { saveToResponse: true });
      } else {
        return createObject(scope, req.body, ['body'], 'saved', { saveToResponse: true });
      }
    })
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
