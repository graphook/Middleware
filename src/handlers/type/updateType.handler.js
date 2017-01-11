import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import simpleUpdate from 'stages/share/simpleUpdate.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


const requestBodyType = {
  title: "Update Type Request",
  description: "The request body of a request to update a type in Zenow v1.",
  properties: {
    type: "object",
    fields: {
      title: {
        type: "string",
        description: "The title of the type."
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
    .then(() => checkMongoIds(scope, { 'params.typeId': scope.req.params.typeId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleFind(scope, 'type', scope.req.params.typeId, 'foundType', ['params', 'typeId']))
    .then(() => checkAccess(scope, scope.foundType._access, scope.user, 'type', scope.params.typeId))
    .then(() => simpleUpdate(scope, 'type', scope.req.params.typeId, { $set: scope.req.body }))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
