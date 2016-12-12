const recursiveCheck = function(item, type) {
  if (type.type === 'object') {
    if (typeof item !== 'object') { return false }
    const propKeys = Object.keys(type.properties);
    for (let i = 0; i < propKeys.length; i ++) {
      if (!item[propKeys[i]] ||
          !recursiveCheck(item[propKeys[i]], type.properties[propKeys[i]])) {
        return false;
      }
    }
    return true;
  } else if (type.type === 'array') {
    if (!Array.isArray(item)) { return false }
    for (let i = 0; i < item.length; i++) {
      if (!recursiveCheck(item[i], type.items)) {
        return false;
      }
    }
    return true;
  } else if (type.type === 'string') {
    return typeof item === 'string'
  } else if (type.type === 'number') {
    return typeof item === 'number';
  } else if (type.type === 'boolean') {
    return typeof item === 'boolean';
  }
  return false;
}

export default function(item, type) {
  if (item._type !== type._id) { return false }
  return recursiveCheck(item, type)
}
