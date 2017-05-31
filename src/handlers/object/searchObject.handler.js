import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import searchObjects from 'baseOperations/searchObjects';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => searchObjects(scope, req.body, ['body'], 'retrieved', { saveToResponse: true }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
