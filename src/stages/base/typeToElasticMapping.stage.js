import {validTypes} from 'appConstants';

const recursiveESMapping = function(scope, type, path) {
  if (type.type === 'object') {
    let esType = {
      type: 'nested',
      properties: {}
    };
    Object.keys(type.fields).forEach((field) => {
      esType.properties[field] = recursiveESMapping(scope, type.fields[field], path.concat(['fields', field]));
    });
    return esType;
  } else if (type.type === 'array') {
    return recursiveESMapping(scope, type.items, path.concat(['items']));
  } else if (validTypes.has(type.type)) {
    return { type: type.type }
  }
}

export default function typeToElasticMapping(scope, type, path, saveTo) {
  scope[saveTo] = recursiveESMapping(scope, type.properties, path.concat('properties'));
  scope[saveTo].dynamic = 'false';
  delete scope[saveTo].type;
  scope[saveTo].properties._permissions = {
    type: 'nested',
    properties: {
      owner: {
        type: 'keyword'
      },
      read: {
        type: 'keyword'
      },
      update: {
        type: 'keyword'
      },
      delete: {
        type: 'keyword'
      },
      readPermissionsRead: {
        type: 'keyword'
      },
      readPermissionsAdd: {
        type: 'keyword'
      },
      readPermissionsRemove: {
        type: 'keyword'
      },
      updatePermissionsRead: {
        type: 'keyword'
      },
      updatePermissionsAdd: {
        type: 'keyword'
      },
      updatePermissionsRemove: {
        type: 'keyword'
      },
      deletePermissionsRead: {
        type: 'keyword'
      },
      deletePermissionsAdd: {
        type: 'keyword'
      },
      deletePermissionsRemove: {
        type: 'keyword'
      },
    }
  }
}
