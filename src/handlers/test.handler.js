import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUserOrClient from 'stages/share/checkIfUserOrClient.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateSchema from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import advancedRemove from 'stages/share/advancedRemove.stage';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUserOrClient(scope))
    .then(() => advancedRemove(scope, 'item', { surname: 'Turner' }, 'removed', ['body']))
    .then(() => {
      console.log(scope.removed);
    })
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
