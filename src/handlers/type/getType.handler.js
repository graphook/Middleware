import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateSchema from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.typeId': scope.req.params.typeId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleFind(scope, 'type', scope.req.params.typeId), null, ['params', 'typeId'])
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
