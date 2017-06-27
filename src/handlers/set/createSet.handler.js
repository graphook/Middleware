import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import createObjects from 'baseOperations/createObjects';
import {set_type} from 'defaultObjects';


// TODO: fix
module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => validateSchema(req.body, setSchema, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      req.body.stars = 0;
      req.body.numberOfItems = 0;
    })
    .then(() => createObjects(scope, [req.body], ['body'], 'createResponse', {
      type: Object.assign(set_type, {_type: 'set_type', _id: 'set_type'}),
      isTypeValidationDone: true,
      saveToResponse: true,
      sets: ['set_set']
    }))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
