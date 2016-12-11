
const recursiveCheck = function(type) {
  if (type.type === 'object') {
    if (!type.properties) { return false }
    const propKeys = Object.keys(type.properties);
    for (let i = 0; i < propKeys.length; i ++) {
      if (!recursiveCheck(type.properties[propKeys[i]])) {
        return false;
      }
    }
    return true;
  } else if (type.type === 'array') {
    if (!type.items) { return false }
    return recursiveCheck(type.items)
  } else {
    return type.type === 'string' || type.type === 'number' || type.type === 'boolean';
  }
}

export default function(type) {
  if (!type.title || !type.properties) {
    return false
  }
  type.type = 'object'
  return recursiveCheck(type)
}
