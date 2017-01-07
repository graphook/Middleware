import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory';
import checkIfUser from 'stages/share/checkIfUser.stage';
import logRequest from 'stages/share/logRequest.stage';
import saveCurrentUserToRead from 'stages/user/saveCurrentUserToRead.stage';
import regenerateKey from 'stages/user/regenerateKey.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => regenerateKey(scope))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
