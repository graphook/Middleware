import Promise from 'bluebird';
import scopeFactory from 'stages/util/scopeFactory'
import checkIfUser from 'stages/share/checkIfUser.stage'
import logRequest from 'stages/share/logRequest.stage'
import validateRequest from 'stages/share/validateSchema.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import validateTypeProperties from 'stages/type/validateTypeProperties.stage';
import simpleFind from 'stages/share/simpleFind.stage';
import simpleInsert from 'stages/share/simpleInsert.stage';
import checkItems from 'stages/set/checkItems.stage';
import addItemsToSet from 'stages/set/addItemsToSet.stage';
import response from 'stages/share/response.stage';
import handleError from 'stages/share/handleError.stage';
import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

const requestBodyType = {
  title: "Create Set Type",
  description: "The request body of a request to create a set in Zenow v1.",
  properties: {
    type: "object",
    required: ["title", "type"],
    fields: {
      title: {
        type: "string",
        description: "The title of the type."
      },
      description: {
        type: "string",
        default: ""
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        },
        default: [],
      },
      type: {
        type: "id"
      },
      items: {
        type: 'array',
        items: {
          type: 'any'
        }
      }
    }
  }
}

module.exports = function(req, res) {
  const scope = scopeFactory(req, res);
  scope.req.body.items = scope.req.body.items || [];
  Promise.try(() => checkIfUser(scope))
    .then(() => logRequest(scope))
    .then(() => validateRequest(scope.req.body, requestBodyType.properties, scope.errors, ['body']))
    .then(() => throwErrorIfNeeded(scope.errors))
    // find type
    .then(() => simpleFind(scope, 'type', scope.req.body.type, 'foundType', ['body', 'type']))
    .then(() => throwErrorIfNeeded(scope.errors))
    // check the items to see if they're legit
    .then(() => checkItems(scope, scope.req.body.items, scope.foundType.properties, scope.foundType._id, ['body.items']))
    .then(() => throwErrorIfNeeded(scope.errors))
    // create set
    .then(() => simpleInsert(scope, 'set', {
      title: scope.req.body.title,
      description: scope.req.body.description,
      type: {
        _id: scope.req.body.type,
        title: scope.foundType.title
      },
      tags: scope.req.body.tags,
      creator: {
        _id: scope.user._id,
        username: scope.user.username
      },
      stars: 0,
      items: []
    }, 'insertedSet'))
    // create and update items
    .then(() => Promise.all([
      addItemsToSet(scope, scope.req.body.items, scope.insertedSet[0], scope.foundType, scope.user),
      db.type.update({ '_id': ObjectId(scope.foundType._id) }, {
        $push: {
          uses: {
            _id: scope.insertedSet._id,
            title: scope.insertedSet.title
          }
        },
        $inc: {
          numUses: 1
        }
      })
    ]))
    // update set
    .then(() => {
      // cleanse scope
      scope.types.read = [];
      scope.items.read = [];
      scope.sets.created = scope.sets.updated;
      scope.sets.updated = [];
    })
    .then(() => response(scope))
    .catch((err) => handleError(err, scope));
}
