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
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId }))
    .then(() => {
      if (!new Set(scope.user.stars).has(scope.req.params.setId)) {
        scope.errors['user'] = "User has not yet starred this set."
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => Promise.all([
      simpleUpdate(scope, 'set', scope.req.params.setId, {
        $inc: {
          stars: -1
        }
      }, 'updatedSet', ['set']),
      simpleUpdate(scope, 'user', scope.user._id, {
        $pull: {
          stars: scope.req.params.setId
        }
      }, 'updatedUser', ['user'])
    ]))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
