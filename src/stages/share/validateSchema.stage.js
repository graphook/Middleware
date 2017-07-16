
export default function recursiveCheck(item, type, errors, path, parent, parentKey) {
  if (type.constant && item !== type.constant) {
    errors[path.join('.')] = 'Must be the value: ' + type.constant;
  }
  if (type.type === 'object') {
    if (typeof item !== 'object') {
      errors[path.join('.')] = 'should be an object but is a ' + typeof item;
      return;
    }
    const itemFieldSet = new Set(Object.keys(item));
    if (type.requires) {
      type.requires.forEach((field) => {
        if (item[field] == null) {
          errors[[...path, field].join('.')] = 'is required';
        }
      });
    }
    if (type.cannotHave) {
      type.cannotHave.forEach((field) => {
        if (item[field] != null) {
          errors[[...path, field].join('.')] = 'cannot be present';
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
    Object.keys(type.fields).forEach((field) => {
      itemFieldSet.delete(field);
      if (item[field] != null) {
        const tempPath = path.slice(0);
        tempPath.push(field);
        recursiveCheck(item[field], type.fields[field], errors, tempPath, item, field);
      } else if (item[field] == null && type.fields[field].default != null) {
        item[field] = type.fields[field].default;
      }
    })
    if (!type.allowOtherFields && itemFieldSet.size !== 0) {
      let str = 'Does not allow the fields:';
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
  } else if (type.type === 'keyword' || type.type === 'text') {
    if (typeof item !== 'string') {
      errors[path.join('.')] = 'Should be a string but is a ' + typeof item;
    } else {
      if (type.regex && !(new RegExp(type.regex)).test(item)) {
        errors[path.join('.')] = 'Must follow the regular expression ' + type.regex;
      }
      if (type.enums && type.enums.indexOf(item) === -1) {
        errors[path.join('.')] = 'Is not a valid enum'
      }
    }
  } else if (type.type === 'long' || type.type === 'integer' || type.type === 'short' ||
      type.type === 'byte' || type.type === 'double' || type.type === 'float') {
    if (typeof item !== 'number') {
      errors[path.join('.')] = 'Should be a number but is a ' + typeof item;
    }
  } else if (type.type === 'boolean') {
    if (typeof item !== 'boolean') {
      errors[path.join('.')] = 'Should be a boolean but is a ' + typeof item;
    }
  } else if (type.type === 'date') {
    if (typeof item !== 'number') {
      errors[path.join('.')] = 'Should be a number representing time since epoch, but is ' + typeof item;
    }
  } else if (type.type === 'integer_range' || type.type === 'float_range' || type.type === 'long_range' ||
      type.type === 'double_range' || type.type === 'date_range') {
    if (typeof item !== 'object' || typeof item.gte !== 'number' || typeof item.lte !== 'number') {
      errors[path.join('.')] = 'The date range is not the proper format';
    }
  } else if (type.type === 'id') {
    if (typeof item !== 'string' || !(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).test(item)) {
      errors[path.join('.')] = item + ' is not a valid id';
    }
  } else if (type.type !== 'any') {
    errors[path.join('.')] = 'Is a type that should not exist (' + type.type + '). Use a different Zenow type.';
  }
}
