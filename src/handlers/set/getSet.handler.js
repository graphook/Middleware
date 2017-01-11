import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import response from 'stages/share/response.stage';
import simpleFind from 'stages/share/simpleFind.stage'
import handleError from 'stages/share/handleError.stage';

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => checkMongoIds(scope, { 'params.setId': scope.req.params.setId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleFind(scope, 'set', scope.req.params.setId, 'foundSet', ['set']))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}


/*
// TODO: handle errors for non ids
module.exports = function(req, res, next) {
  // get set by id
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    db.set.findOne({ _id: ObjectId(req.params.id)}, (err, result) => {
      if (err) { next(err) }
      else if (!result) {
        next({
          user: true,
          status: 404,
          message: "Set not found."
        });
      } else {
        res.send(result);
      }
    });
  }
}
*/
