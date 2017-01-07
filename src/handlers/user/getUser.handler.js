import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory';
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage';
import logRequest from 'stages/share/logRequest.stage';
import saveCurrentUserToRead from 'stages/user/saveCurrentUserToRead.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => logRequest(scope))
    .then(() => saveCurrentUserToRead(scope))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
