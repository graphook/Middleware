import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import checkMongoIds from 'stages/share/checkMongoIds.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import simpleUpdate from 'stages/share/simpleUpdate.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';


const requestBodyType = {
  title: "Update Type Request",
  description: "The request body of a request to update a type in Zenow v1.",
  properties: {
    type: "object",
    fields: {
      title: {
        type: "string",
        description: "The title of the type."
      },
      description: {
        type: "string"
      },
      tags: {
        type: "array"
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => checkMongoIds(scope, { 'params.typeId': scope.req.params.typeId }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => simpleUpdate(scope, 'type', scope.req.params.typeId, scope.req.body))
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}


/*
module.exports = function(req, res, next) {
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    let update = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags
    }
    db.type.update({ '_id': ObjectID(req.params.id) }, {
      $set: update
    }, (err, result) => {
      if (err) { next(err) }
      else {
        res.status(200).send(result);
      }
    })
  }
}
*/
