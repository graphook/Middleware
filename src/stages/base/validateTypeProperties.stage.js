// This is my favourite file. It's pretty meta.
import validateSchema from '../share/validateSchema.stage';

const validTypes = new Set([
  'object',
  'array',
  'keyword',
  'text',
  'long',
  'integer',
  'short',
  'byte',
  'double',
  'float',
  'date',
  'boolean',
  'any',
  'id',
  'integer_range',
  'float_range',
  'long_range',
  'double_range',
  'date_range'
]);
const objectSchema = {
  type: 'object',
  requires: ['type'],
  fields: {
    type: {
      type: 'keyword'
    },
    constant: {
      type: 'any'
    },
    fields: {
      type: 'object',
      allowOtherFields: true,
      fields: {},
      default: {},
    },
    requires: {
      type: 'array',
      items: {
        type: 'keyword'
      },
      default: []
    },
    default: {
      type: 'any'
    },
    description: {
      type: 'text',
      default: ""
    },
    allowOtherFields: {
      type: 'boolean',
      default: false
    },
    requiresAtLeast: {
      type: 'object',
      requires: ['count', 'fields'],
      fields: {
        count: {
          type: 'number'
        },
        fields: {
          type: 'array',
          items: {
            type: 'keyword'
          }
        }
      }
    }
  }
}
const arraySchema = {
  type: 'object',
  requires: ['type'],
  fields: {
    type: {
      type: 'keyword'
    },
    constant: {
      type: 'any'
    },
    items: {
      type: 'object',
      allowOtherFields: true,
      fields: {},
      default: {
        type: 'any'
      }
    },
    description: {
      type: 'text',
      default: ""
    },
    default: {
      type: 'any'
    }
  }
}
const stringSchema  = {
  type: 'object',
  requires: ['type'],
  fields: {
    type: {
      type: 'keyword'
    },
    constant: {
      type: 'any'
    },
    default: {
      type: 'any'
    },
    description: {
      type: 'text',
      default: ""
    },
    regex: {
      type: 'keyword'
    }
  }
}
const otherSchema = {
  type: 'object',
  requires: ['type'],
  fields: {
    type: {
      type: 'keyword'
    },
    constant: {
      type: 'any'
    },
    default: {
      type: 'any'
    },
    description: {
      type: 'text',
      default: ""
    }
  }
}

export default function recursiveCheck(type, errors, path) {
  if (!validTypes.has(type.type)) {
    errors[path.join('.')] = type.type + ' is not a valid type.';
  } else if (type.type === 'object') {
    const curErrorNumber = Object.keys(errors).length;
    validateSchema(type, objectSchema, errors, path);
    if (Object.keys(errors).length === curErrorNumber) {
      Object.keys(type.fields).forEach((field) => {
        const tempPath = path.slice(0);
        tempPath.push(field);
        recursiveCheck(type.fields[field], errors, path.concat(['fields', field]));
      });
    }
  } else if (type.type === 'array') {
    const curErrorNumber = errors.length;
    validateSchema(type, arraySchema, errors, path);
    if (errors.length === curErrorNumber) {
      recursiveCheck(type.items, errors, path.concat(['items']));
    }
  } else if (type.type === 'text' || type.type === 'keyword') {
    validateSchema(type, stringSchema, errors, path);
  } else {
    validateSchema(type, otherSchema, errors, path);
  }
  if (type.constant) {
    validateSchema(type.constant, type, errors, path.concat(['constant']));
  }
}
