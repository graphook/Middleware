import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import simpleRemove from 'stages/share/simpleRemove.stage';
import checkIfCanDeleteType from 'stages/type/checkIfCanDeleteType.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.typeId': scope.req.params.typeId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => checkIfCanDeleteType(scope, scope.req.params.typeId))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleRemove(scope, 'type', scope.req.params.typeId))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
