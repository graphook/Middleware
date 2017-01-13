import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import validateTypeProperties from 'stages/type/validateTypeProperties.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import simpleRemove from 'stages/share/simpleRemove.stage';
import simpleUpdate from 'stages/share/simpleUpdate.stage';
import advancedUpdate from 'stages/share/advancedUpdate.stage';
import advancedRemove from 'stages/share/advancedRemove.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {ObjectId} from 'mongodb';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  scope.req.body.items = scope.req.body.items || [];
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    // get set
    .then(() => simpleFind(scope, 'set', scope.req.params.setId, 'foundSet', ['params', 'typeId']))
    .then(() => throwErrorIfNeeded(scope.errors))
    // check Access
    .then(() => Promise.all([
      // find and delete all items only a part of this set
      advancedRemove(scope, 'item', { _sets: { $size: 1 }, '_sets._id': scope.req.params.setId }, 'removedItems', ['item']).then(() => {
        // Remove this set from other items
        advancedUpdate(scope, 'item', { '_sets.id': scope.req.params.setId }, {
          $pull: {
            _sets: { _id: scope.req.params.id }
          }
        }, 'unassociatedItems', ['item'])
      }),
      // Remove the set
      simpleRemove(scope, 'set', scope.req.params.setId, 'removedSet', ['set']),
      // Remove the set from the type
      simpleUpdate(scope, 'type', scope.foundSet.type._id, {
        $pull: {
          'uses': { '_id': scope.req.params.setId }
        },
        $inc: {
          numUses: -1
        }
      }, 'updatedType', ['type'])
    ]))

    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
