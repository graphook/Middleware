import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import getObject from './getObject';
import validateSchema from 'stages/share/validateSchema.stage'

/* options (optional):
{
  types: a map of the type id to the type (if already fetched). We won't waste
      time fetching this type if it is present here. These should already have
      successfully gone through the security check,
  objects: a map of the object id to the object (if already fetched). We won't
      waste time fetching this object if it is present here. These should
      already have successfully gone through the security check.
  saveToResponse: true if the result of this should be saved to the response
}
*/
const updaterSchema = {
  type: "array",
  items: {
    type: "object",
    requires: ["ids", "query"],
    fields: {
      ids: {
        type: "array",
        items: {
          type: "keyword"
        }
      },
      query: {
        type: "object",
        fields: {
          $inc: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $mul: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $rename: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $set: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $unset: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $min: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $max: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $addToSet: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $pop: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $pullAll: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          },
          $push: {
            type: "object",
            allowOtherFields: true,
            fields: {}
          }
        }
      }
    }
  }
}

// Check Updater Schema
// Get the objects
// Make sure access is granted to all objects
// Get Object Types
// Make sure access is granted to all object types
// apply query to object
// Check if the updated objects work with the type
// save the object
export default function updateObjects(scope, updaters, path, saveTo, options = {}) {
  scope.type = options.type;
  if (updaters.length < 1) {
    return;
  }
  return Promise.try(() => validateSchema(updaters, updaterSchema, scope.errors, path))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      scope.objectIdsToFetch = updaters.reduce((aggArr, updater) => aggArr.concat(updater.ids), []);
      if (options.objects) {
        const alreadyFetchedIds = new Set(Object.keys(options.objects));
        scope.objectIdsToFetch = scope.objectIdsToFetch.filter((id) => !alreadyFetchedIds.has(id));
      }
    })
    .then(() => request.get(process.env.ES_URL + '/object/_search').send({
      query: {
        terms: {
          _id: scope.objectIdsToFetch
        }
      }
    }))
    .then((result) => {
      console.log(JSON.stringify(result.body, null, 2));
    })
    .catch((err) => { throw err })
}
