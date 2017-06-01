import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import getObject from './getObject';
import validateSchema from 'stages/share/validateSchema.stage';
import searchObjects from './searchObjects';
import applyUpdateQuery from 'stages/base/applyUpdateQuery.stage';

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
// Get Object Types
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
    .then(() => searchObjects(scope, {
      query: {
        terms: {
          _id: scope.objectIdsToFetch
        }
      }
    }, ['searchQuery'], 'fetchedObjects'))
    .then(() => {
      scope.fetchedObjects = scope.fetchedObjects.reduce((objMap, obj) => {
        objMap[obj._id] = obj;
        return objMap;
      }, {});
      if (options.objects) {
        scope.fetchedObjects = Object.assign(scope.fetchedObjects, options.objects)
      }
    })
    .then(() => {
      scope.typeIdsToFetch = Object.keys(scope.fetchedObjects).reduce((aggSet, objKey) => {
        aggSet.add(scope.fetchedObjects[objKey]._type);
        return aggSet;
      }, new Set());
      if (options.objects) {
        const alreadyFetchedTypeIds = new Set(Object.keys(options.types));
        scope.typeIdsToFetch = scope.typeIdsToFetch.filter((id) => !alreadyFetchedTypeIds.has(id));
      }
      scope.typeIdsToFetch = Array.from(scope.typeIdsToFetch);
    })
    .then(() => searchObjects(scope, {
      query: {
        terms: {
          _id: scope.typeIdsToFetch
        }
      }
    }, ['searchQuery'], 'fetchedTypes'))
    .then(() => {
      scope.fetchedTypes = scope.fetchedTypes.reduce((typeMap, type) => {
        type.properties.fields._type = { type: 'keyword' };
        type.properties.fields._permissions = { type: 'object', allowOtherFields: true, fields: {} };
        type.properties.fields._id = { type: 'keyword' };
        typeMap[type._id] = type;
        return typeMap;
      }, {});
      if (options.types) {
        scope.fetchedTypes = Object.assign(scope.fetchedTypes, options.types);
      }
    })
    .then(() => updaters.forEach((updater, index) => {
      updater.ids.forEach((id, idIndex) => {
        if (!scope.fetchedTypes[scope.fetchedObjects[id]._type]) {
          delete scope.fetchedObjects[id];
          return;
        }
        scope.fetchedObjects[id] = applyUpdateQuery(scope, scope.fetchedObjects[id],
              updater.query, path.concat([index]), 'updatedObject');

        validateSchema(scope.fetchedObjects[id], scope.fetchedTypes[scope.fetchedObjects[id]._type].properties,
              scope.errors, path.concat([index, 'object', idIndex]));
      });
    }))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      scope.bulkRequest = Object.keys(scope.fetchedObjects).reduce((accArr, objKey) => {
        accArr.push({
          index: {
            _index: 'object',
            _type: scope.fetchedObjects[objKey]._type,
            _id: scope.fetchedObjects[objKey]._id
          }
        })
        let requestObj = JSON.parse(JSON.stringify(scope.fetchedObjects[objKey]))
        delete requestObj._type;
        delete requestObj._id;
        accArr.push(requestObj);
        return accArr;
      }, []);
    })
    .then(() => request.post(process.env.ES_URL + '/_bulk')
      .send(scope.bulkRequest.reduce((acc, val) => acc + JSON.stringify(val) + '\n', '')))
    .then(() => {
      Object.keys(scope.fetchedObjects).forEach((objKey) => {
        scope.addItem('updated', scope.fetchedObjects[objKey]);
      });
    })
    .catch((err) => { throw err })
}
