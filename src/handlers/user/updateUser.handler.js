import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import simpleUpdate from 'stages/share/simpleUpdate.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import constants from 'constants';


const requestBodyType = {
  title: "Create User Request",
  description: "The request body of a request to update a user in Zenow v1. Currently the only updatable item is the email.",
  properties: {
    type: "object",
    fields: {
      email: {
        type: "string",
        description: "The user's new email",
        regex: constants.emailRegex
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
    .then(() => simpleUpdate(scope, 'user', scope.user._id, { $set: scope.req.body }))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
