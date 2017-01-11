import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import updatePassword from 'stages/user/updatePassword.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


const requestBodyType = {
  title: "Create User Request",
  description: "The request body of a request to update a user's password in Zenow v1.",
  properties: {
    type: "object",
    requires: ["newPassword", "oldPassword"],
    fields: {
      newPassword: {
        type: "string",
        description: "The desired new password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
        regex: "^[a-zA-Z0-9$-/:-?{-~!\"^_`\\[\\]]"
      },
      oldPassword: {
        type: "string",
        description: "The user's current password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
        regex: "^[a-zA-Z0-9$-/:-?{-~!\"^_`\\[\\]]"
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => updatePassword(scope, scope.req.body))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
