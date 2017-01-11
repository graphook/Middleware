import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import validateTypeProperties from 'stages/type/validateTypeProperties.stage';
import checkAccess from 'stages/share/checkAccess.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import advancedFind from 'stages/share/advancedFind.stage';
import simpleInsert from 'stages/share/simpleInsert.stage';
import checkItems from 'stages/set/checkItems.stage';
import addItemsToSet from 'stages/set/addItemsToSet.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';

const requestBodyType = {
  title: "Create Set Type",
  description: "The request body of a request to create a set in Zenow v1.",
  properties: {
    type: 'array',
    items: {
      type: 'any'
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId }))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    // Get set and type
    .then(() => Promise.all([
      simpleFind(scope, 'set', scope.req.params.setId, 'foundSet', ['params', 'setId']),
      advancedFind(scope, 'type', { 'uses._id': scope.req.params.setId }, 'foundTypes', ['params', 'setId', 'type'])
    ]))
    // Confirm the correct auth
    .then(() => checkAccess(scope, scope.foundSet._access, scope.user, 'set', scope.req.params.setId))
    // Validate the items
    .then(() => checkItems(scope, scope.req.body, scope.foundTypes[0].properties, scope.foundTypes[0]._id, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    // Add items to set
    .then(() => addItemsToSet(scope, scope.req.body, scope.foundSet, scope.foundTypes[0], scope.user))
    .then(() => {
      scope.types.read = [];
      scope.sets.read = [];
    })
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
