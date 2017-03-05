import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import validateRequest from 'stages/share/validateSchema.stage';
import cleanseMongoQuery from 'stages/share/cleanseMongoQuery.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import advancedFind from 'stages/share/advancedFind.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {ObjectId} from 'mongodb';
import constants from 'constants';
import checkPrivateAccess from 'stages/share/checkPrivateAccess.stage';

const requestBodyType = {
  title: "Search Type",
  description: "The request body of a request to search in Zenow v1.",
  properties: {
    type: "object",
    fields: {},
    allowOtherFields: true
  }
}
const requestQuery = {
  title: "Create Type Request",
  description: "The request body of a request to create a type in Zenow v1.",
  properties: {
    type: 'object',
    fields: {
      count: {
        type: 'string',
        default: '10',
        regex: constants.numberRegex
      },
      page: {
        type: 'string',
        default: '0',
        regex: constants.numberRegex
      }
    }
  }
}

// TODO: add pagination
module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId }))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => validateRequest(scope.req.query, requestQuery.properties, scope.errors, ['query']))
    .then(() => cleanseMongoQuery(scope.req.body))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => advancedFind(scope, 'item', Object.assign(scope.req.body, { '_sets._id': scope.req.params.setId }), 'foundItem', ['item'], scope.req.query))
    .then(() => checkPrivateAccess(scope, scope.foundItem[0]._access, scope.user, 'item'))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
