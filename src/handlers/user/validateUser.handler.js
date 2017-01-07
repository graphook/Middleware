import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory';
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage';
import logRequest from 'stages/share/logRequest.stage';
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkIfDuplicateUser from 'stages/user/checkIfDuplicateUser.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


const requestBodyType = {
  title: "Create User Request",
  description: "The request body of a request to create a user in Zenow v1.",
  properties: {
    type: "object",
    requires: ["username", "email", "password"],
    fields: {
      username: {
        type: "string",
        description: "The name of the user. This will be public on Zenow. Usernames must consist of letters, numbers, -, or _ and be between 3 and 30 characters in length.",
        regex: "^[a-zA-Z0-9\\-_]{3,30}$"
      },
      email: {
        type: "string",
        description: "The user's email",
        regex: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,4}$"
      },
      password: {
        type: "string",
        description: "The user's password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
        regex: "^[a-zA-Z0-9$-/:-?{-~!\"^_`\\[\\]]"
      }
    }
  }
}

module.exports = function(req, res) {
  const errors = {};
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => logRequest(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => checkIfDuplicateUser(scope.req.body, scope.errors))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
