
export default function(item, type, errors, path, parent, parentKey) {
  if (type.required && !item) {
    errors[path.join('.')] = 'required';
    return;
  } else if (type.default && !item && parent && parentKey) {
    parent[parentKey] = type.default;
  } else if (!type.required && !item) {
    return;
  }
  if (type.type === 'object') {
    if (typeof item !== 'object') {
      errors[path.join('.')] = ' should be an object but is a ' + typeof item;
      return;
    }
    const propKeys = Object.keys(type.properties);
    const itemPropertySet = Set(Object.keys(item));
    for (let i = 0; i < propKeys.length; i ++) {
      itemPropertySet.delete(propKeys[i]);
      const tempPath = this.props.path.slice(0);
      tempPath.push(propKeys[i]);
      recursiveCheck(item[propKeys[i]], type.properties[propKeys[i]], tempPath, errors, item, propKeys[i]);
    }
    if (!type.allowOtherProperties && itemPropertySet.size !== 0) {
      let str = 'Does not allow the properties ';
      itemPropertySet.forEach((property) => {
        str += ' ' + property + ',';
      });
      errors[path.join('.')] = str;
    }
  } else if (type.type === 'array') {
    if (!Array.isArray(item)) {
      errors[path.join('.')] = 'Should be an array but is a ' + typeof item;
      return;
    }
    for (let i = 0; i < item.length; i++) {
      const tempPath = this.props.path.slice(0);
      tempPath.push(i);
      recursiveCheck(item[i], type.items, tempPath, errors, item, i);
    }
  } else if (type.type === 'string') {
    if (typeof item !== 'string') {
      errors[path.join('.')] = 'Should be an string but is a ' + typeof item;
    } else if (type.regex && !(new RegExp(type.regex)).test(item)) {
      errors[path.join('.')] = 'Must follow the regular expression ' + type.regex;
    }
  } else if (type.type === 'number') {
    if (typeof item !== 'number') {
      errors[path.join('.')] = 'Should be an number but is a ' + typeof item;
    }
  } else if (type.type === 'boolean') {
    if (typeof item !== 'boolean') {
      errors[path.join('.')] = 'Should be an boolean but is a ' + typeof item;
    }
  } else {
    errors[path.join('.')] = 'Is a type that should not exist. Use a different Zenow type.';
  }

}
