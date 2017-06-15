import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkIfDuplicateUser from 'stages/user/checkIfDuplicateUser.stage';
import saveNewUser from 'stages/user/saveNewUser.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {usernameRegex, emailRegex, passwordRegex} from 'appConstants';


const requestBodyType = {
  title: "Create User Request",
  description: "The request body of a request to create a user in Zenow v1.",
  properties: {
    type: "object",
    requires: ["username", "email", "password"],
    fields: {
      username: {
        type: "keyword",
        description: "The name of the user. This will be public on Zenow. Usernames must consist of letters, numbers, -, or _ and be between 3 and 30 characters in length.",
        regex: usernameRegex
      },
      email: {
        type: "keyword",
        description: "The user's email",
        regex: emailRegex
      },
      password: {
        type: "keyword",
        description: "The user's password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
        regex: passwordRegex
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => checkIfDuplicateUser(scope.req.body, scope.errors))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => saveNewUser(scope.req.body, scope))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
