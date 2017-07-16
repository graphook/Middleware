import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import simpleUpdate from 'stages/user/simpleUpdate.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import updateObjects from 'baseOperations/updateObjects';
import { set_type } from 'defaultObjects';


module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => {
      if (new Set(scope.user.stars).has(scope.req.params.setId)) {
        scope.errors['user'] = "User has already starred this set."
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => Promise.all([
      updateObjects(scope, [{
        ids: [ scope.req.params.setId ],
        query: {
          $inc: {
            stars: 1
          }
        }
      }], ['setId'], 'updatedSet', {
        types: { 'set_type': Object.assign(set_type, {_type: 'set_type', _id: 'set_type'}) },
        saveToResponse: true
      }),
      simpleUpdate(scope, 'user', scope.user._id, {
        $push: {
          stars: scope.req.params.setId
        }
      }, 'updatedUser', ['user'])
    ]))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
