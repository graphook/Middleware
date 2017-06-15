import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import createType from 'baseOperations/createType';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {type} from 'schemas';

module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => {
      if (req.body._type && req.body._type !== 'type_type') {
        scope.errors['body._type'] = "This is not a type. Should be type_type"
      }
    })
    .then(() => createType(scope, req.body, ['body']))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
