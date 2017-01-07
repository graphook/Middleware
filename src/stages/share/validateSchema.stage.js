
export default function recursiveCheck(item, type, errors, path, parent, parentKey) {
  if (type.default && !item && parent && parentKey) {
    parent[parentKey] = type.default;
  }
  if (type.type === 'object') {
    if (typeof item !== 'object') {
      errors[path.join('.')] = ' should be an object but is a ' + typeof item;
      return;
    }
    const fieldKeys = Object.keys(type.fields);
    const itemFieldSet = new Set(Object.keys(item));
    if (type.requires) {
      type.requires.forEach((field) => {
        if (item[field] == null) {
          errors[[...path, field].join('.')] = 'is required';
        }
      });
    }
    if (type.requiresAtLeast) {
      let count = 0;
      type.requiresAtLeast.fields.forEach((field) => {
        if (item[field] != null) {
          count++;
        }
      });
      if (count < type.requiresAtLeast.count) {
        let str = 'Requires at least ' + type.requiresAtLeast.count + ' fields out of'
        type.requiresAtLeast.fields.forEach((field) => {
          str += ' ' + field + ',';
        });
        errors[path.join('.')] = str;
      }
    }
    fieldKeys.forEach((field) => {
      itemFieldSet.delete(field);
      if (item[field] != null) {
        const tempPath = path.slice(0);
        tempPath.push(field);
        recursiveCheck(item[field], type.fields[field], errors, tempPath, item, field);
      }
    })
    if (!type.allowOtherFields && itemFieldSet.size !== 0) {
      let str = 'Does not allow the fields';
      itemFieldSet.forEach((field) => {
        str += ' ' + field + ',';
      });
      errors[path.join('.')] = str;
    }
  } else if (type.type === 'array') {
    if (!Array.isArray(item)) {
      errors[path.join('.')] = 'Should be an array but is a ' + typeof item;
      return;
    }
    for (let i = 0; i < item.length; i++) {
      const tempPath = path.slice(0);
      tempPath.push(i);
      recursiveCheck(item[i], type.items, errors, tempPath, item, i);
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
  } else if (type.type !== 'any') {
    errors[path.join('.')] = 'Is a type that should not exist (' + type.type + '). Use a different Zenow type.';
  }
}
