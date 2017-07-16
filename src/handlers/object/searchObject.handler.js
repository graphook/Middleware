import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import searchObjects from 'baseOperations/searchObjects';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => logRequest(scope))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => searchObjects(scope, req.body, ['body'], 'retrieved', {
      saveToResponse: true,
      page: req.query.page,
      count: req.query.count
    }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
