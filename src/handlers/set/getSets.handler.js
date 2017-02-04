import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import logRequest from 'stages/share/logRequest.stage';
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {db} from '../../mongo';
import constants from 'constants';

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
      },
      q: {
        type: 'string',
        default: ''
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => logRequest(scope))
    .then(() => validateRequest(scope.req.query, requestQuery.properties, scope.errors, ['query']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      const query = (req.query.q) ? {
        $text: {
          $search: req.query.q
        }
      } : {};
      const page = parseInt(scope.req.query.page);
      const count = parseInt(scope.req.query.count);
      return db.set.find(query).sort({ stars: -1 }).skip(count * page).limit(count).toArray().then((result) => {
        if (scope.sets.read.length === 0) result.push(null)
        scope.sets.read = scope.sets.read.concat(result);
      }).catch((err) => {
        throw err;
      })
    })
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
