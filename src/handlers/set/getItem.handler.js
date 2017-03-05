import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import logRequest from 'stages/share/logRequest.stage'
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import response from 'stages/share/response.stage';
import simpleFind from 'stages/share/simpleFind.stage'
import handleError from 'stages/share/handleError.stage';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId, 'params.itemId': scope.req.params.itemId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleFind(scope, 'item', scope.req.params.itemId, 'foundItem', ['item']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      if (!new Set(scope.foundItem._sets.map(set => set._id)).has(scope.req.params.setId)) {
        scope.errors['set.item'] = 'Set ' + scope.req.params.setId + ' does not contain item ' + scope.req.params.itemId;
        scope.items.read = [ null ];
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
