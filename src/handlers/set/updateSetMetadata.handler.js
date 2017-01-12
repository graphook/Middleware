import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import checkAccess from 'stages/share/checkAccess.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import simpleUpdate from 'stages/share/simpleUpdate.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


const requestBodyType = {
  title: "Update Set Request",
  description: "The request body of a request to update a set in Zenow v1.",
  properties: {
    type: "object",
    fields: {
      title: {
        type: "string",
        description: "The title of the set."
      },
      description: {
        type: "string"
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleFind(scope, 'set', scope.req.params.setId, 'foundSet', ['params', 'setId']))
    .then(() => checkAccess(scope, scope.foundSet._access, scope.user, 'set', scope.req.params.setId))
    .then(() => simpleUpdate(scope, 'set', scope.req.params.setId, { $set: scope.req.body }))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
