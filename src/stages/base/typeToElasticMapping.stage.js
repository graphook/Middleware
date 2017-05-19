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
}
