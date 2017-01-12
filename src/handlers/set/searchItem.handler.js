import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import validateRequest from 'stages/share/validateSchema.stage';
import cleanseMongoQuery from 'stages/share/cleanseMongoQuery.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import advancedFind from 'stages/share/advancedFind.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {ObjectId} from 'mongodb';

const requestBodyType = {
  title: "Search Type",
  description: "The request body of a request to search in Zenow v1.",
  properties: {
    type: "object",
    fields: {},
    allowOtherFields: true
  }
}

// TODO: add pagination
module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId }))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => cleanseMongoQuery(scope.req.body))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => advancedFind(scope, 'item', Object.assign(scope.req.body, { '_sets._id': scope.req.params.setId }), 'foundItem', ['item']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
