import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUserOrClient.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import validateTypeProperties from 'stages/type/validateTypeProperties.stage';
import simpleInsert from 'stages/share/simpleInsert.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';

const requestBodyType = {
  title: "Create Type Request",
  description: "The request body of a request to create a type in Zenow v1.",
  properties: {
    type: "object",
    required: ["title", "properties"],
    fields: {
      title: {
        type: "string",
        description: "The title of the type."
      },
      description: {
        type: "string",
        default: ""
      },
      properties: {
        requires: ["type"],
        type: "object",
        allowOtherFields: true,
        fields: {
          type: {
            type: 'constant',
            value: 'object'
          }
        },
        allowOtherProperties: true
      },
      tags: {
        type: "array",
        default: [],
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => validateTypeProperties(scope.req.body.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleInsert(scope, 'type', Object.assign(scope.req.body, { uses: [], numUses: 0 })))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
