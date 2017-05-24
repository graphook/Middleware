import Promise from 'bluebird';
import Scope from 'stages/util/Scope'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateSchema from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import getObject from 'baseOperations/getObject';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';

const parameterSchema = {
  type: 'object',
  allowOtherFields: true,
  fields: {
    typeId: {
      type: 'keyword'
    },
    objectId: {
      type: 'keyword'
    }
  }
}

module.exports = function(req, res) {
  const scope = new Scope(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => validateSchema(req.params , parameterSchema, scope.errors, ['url_parameters']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => getObject(scope, req.params.typeId, req.params.objectId, ['object'], 'retrieved', { saveToResponse: true }))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
