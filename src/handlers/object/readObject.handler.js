import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import getObject from 'baseOperations/getObject';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => getObject(scope, req.params.objectId, ['object'], 'retrieved', { saveToResponse: true }))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
