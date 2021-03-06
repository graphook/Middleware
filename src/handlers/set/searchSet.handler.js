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
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => validateRequest(scope.req.query, requestQuery.properties, scope.errors, ['query'], scope.req.query))
    .then(() => cleanseMongoQuery(scope.req.body))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => advancedFind(scope, 'set', Object.assign(scope.req.body, {
      $or: [
        {
          '_access.isPrivate': false
        },
        {
          '_access.isPrivate': {
            $exists: false
          }
        },
        {
          '_access.isPrivate': true,
          '_access.creator': scope.user._id
        }
      ]
    }), 'foundSet', ['set']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
