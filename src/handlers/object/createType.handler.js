import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import createType from 'baseOperations/createType';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {type} from 'schemas';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => validateRequest(req.body, type.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => createType(scope, req.body, ['body']))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
