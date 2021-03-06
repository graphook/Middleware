// This is my favourite file. It's pretty meta.
import validateSchema from '../share/validateSchema.stage';

const validTypes = new Set([
  'object',
  'array',
  'string',
  'number',
  'boolean',
  'any',
  'constant',
  'id'
]);
const objectSchema = {
  type: 'object',
  requires: ['type'],
  fields: {
    type: {
      type: 'string'
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
        type: 'string'
      },
      default: []
    },
    default: {
      type: 'any'
    },
    description: {
      type: 'string',
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
            type: 'string'
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
      type: 'string'
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
      type: 'string',
      default: ""
    },
    default: {
      type: 'any'
    }
  }
}
const constantSchema = {
  type: 'object',
  requires: ['type', 'value'],
  fields: {
    type: {
      type: 'string'
    },
    value: {
      type: 'any'
    },
    description: {
      type: 'string',
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
      type: 'string'
    },
    default: {
      type: 'any'
    },
    description: {
      type: 'string',
      default: ""
    },
    regex: {
      type: 'string'
    }
  }
}
const otherSchema = {
  type: 'object',
  requires: ['type'],
  fields: {
    type: {
      type: 'string'
    },
    default: {
      type: 'any'
    },
    description: {
      type: 'string',
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
  } else if (type.type === 'constant') {
    validateSchema(type, constantSchema, errors, path);
  } else if (type.type === 'string') {
    validateSchema(type, stringSchema, errors, path);
  } else {
    validateSchema(type, otherSchema, errors, path);
  }
}
