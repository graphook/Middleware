import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import checkAccess from 'stages/share/checkAccess.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import simpleRemove from 'stages/share/simpleRemove.stage';
import simpleUpdate from 'stages/share/simpleUpdate.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {ObjectId} from 'mongodb';


module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId, 'params.itemId': scope.req.params.itemId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => Promise.all([
      simpleFind(scope, 'set', scope.req.params.setId, 'foundSet', ['set']),
      simpleFind(scope, 'item', scope.req.params.itemId, 'foundItem', ['item'])
    ]))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => checkAccess(scope, scope.foundSet._access, scope.user, 'set', scope.req.params.setId))
    .then(() => {
      if (!new Set(scope.foundSet.items).has(scope.req.params.itemId)) {
        scope.errors['set.items'] = 'The set ' + scope.req.params.setId + ' does not contain ' + scope.req.params.itemId;
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      const promises = [
        simpleUpdate(scope, 'set', scope.req.params.setId, {
          $pull: { items: scope.req.params.itemId }
        }, 'updatedSet', ['set'])
      ];
      console.log(scope.foundItem._sets);
      console.log(scope.foundItem._sets.length);
      if (scope.foundItem._sets.length > 1) {
        promises.push(simpleUpdate(scope, 'item', scope.req.params.itemId, {
          $pull: { _sets: { _id: scope.req.params.setId } }
        }, 'updatedSet', ['set']));
      } else {
        promises.push(simpleRemove(scope, 'item', scope.req.params.itemId));
      }
      return Promise.all(promises);
    })
    .then(() => {
      scope.sets.read = [];
      scope.items.read = [];
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
