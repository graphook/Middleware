import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import getToken from 'stages/user/getToken.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import constants from 'constants';

const requestBodyType = {
  title: "Create User Request",
  description: "The request body of a request to create a user in Zenow v1.",
  properties: {
    type: "object",
    requires: ["password"],
    requiresAtLeast: {
      count: 1,
      fields: ["username", "password"]
    },
    fields: {
      username: {
        type: "string",
        description: "The name of the user. This will be public on Zenow. Usernames must consist of letters, numbers, -, or _ and be between 3 and 30 characters in length.",
        regex: constants.usernameRegex
      },
      email: {
        type: "string",
        description: "The user's email",
        regex: constants.emailRegex
      },
      password: {
        type: "string",
        description: "The user's password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
        regex: constants.passwordRegex
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => getToken(scope))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
