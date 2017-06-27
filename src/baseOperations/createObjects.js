import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import getObject from './getObject';
import validateSchema from 'stages/share/validateSchema.stage';
import updateObjects from 'baseOperations/updateObjects';
import {set_type} from 'defaultObjects';

/* options (optional):
{
  type: the type of this object (if already fetched),
  isTypeValidationDone: true if type validation was already done
  private: true if this is to create a private file
  saveToResponse: true if the result of this should be saved to the response
}
*/
const objectSchema = {
  "type": "object",
  "requires": ["_type"],
  "allowOtherFields": true,
  "fields": {
    "_type": {
      "type": "keyword"
    }
  }
}

// TODO: Future versions of this may want to allow you to create objects of different types in one request
export default function createObjects(scope, objects, path, saveTo, options = {}) {
  scope.objectType = options.type;
  if (objects.length < 1) {
    return;
  }
  return Promise.try(() => objects.forEach((object, index) =>
      validateSchema(object, objectSchema, scope.errors, ['body', index])))
    .then(() => {
      if (options.type == null) {
        return getObject(scope, objects[0]._type, ['type'], 'objectType');
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      objects.forEach((object, index) => {
        delete object._type;
        scope.objectType.properties.fields._sets = { type: 'array', items: { type: 'keyword' } }
        if (!options.isTypeValidationDone) {
          validateSchema(object, scope.objectType.properties, scope.errors, path.concat(index));
        }
      });
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => {
      scope.requestBody = [];
      objects.forEach((object) => {
        object._permissions = {
          owner: scope.user._id
        }
        if (!options.private) {
          object._permissions.read = ['all'];
        }
        scope.requestBody.push({
          index: {
            _index: 'object',
            _type: scope.objectType._id,
          }
        })
        scope.requestBody.push(object);
      });
    })
    .then(() => {
      let setMap = {};
      let usesSets = false;
      objects.forEach((object) => {
        if (object._sets) {
          usesSets = true;
          object._sets.forEach((setName) => {
            setMap[setName] = (setMap[setName]) ? setMap[setName] + 1 : 1;
          });
        } else {
          object._sets = [];
        }
      });
      const updateOptions = {
        types: {},
        beforeUpdate: (scope, objects) => {
          Object.keys(objects).forEach((objectKey) => {
            if (objects[objectKey]._type !== 'set_type') {
              scope.errors[objectKey + '._type'] = objectKey + ' is not a set.'
            } else if (scope.objectType._id !== objects[objectKey].type._id) {
              scope.errors[objectKey + '.type'] = objectKey + ' is a set, but its type (' + objects[objectKey].type._id + ') does not match the object\'s type.'
            }
          });
          throwErrorIfNeeded(scope.errors);
        }
      };
      updateOptions.types[scope.objectType._id] = set_type;
      if (usesSets) {
        return updateObjects(scope, Object.keys(setMap).map((setKey) => { return {
          ids: [setKey],
          query: {
            $inc: {
              numberOfItems: setMap[setKey]
            }
          }
        }}), ['setsAddedTo'], 'updatedSets', updateOptions);
      }
    })
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => request.post(process.env.ES_URL + '/_bulk')
      .send(scope.requestBody.reduce((acc, val) => acc + JSON.stringify(val) + '\n', ''))
      .then((result) => scope[saveTo] = result.body))
    .then(() => {
      if (options.saveToResponse) {
        scope.status = 201;
        objects.forEach((object, index) => {
          scope.addItem('created', Object.assign(object, {
            _type: scope[saveTo].items[index].index._type,
            _id: scope[saveTo].items[index].index._id
          }))
        });
        if (scope.updatedSets) {
          Object.keys(scope.updatedSets).forEach((updatedSetsKey) => {
            scope.addItem('updated', scope.updatedSets[updatedSetsKey]);
          });
        }
      }
    })
    .catch((err) => { throw err })
}
