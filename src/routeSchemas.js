import {usernameRegex, emailRegex, passwordRegex} from 'appConstants';
import {set_type, type_type} from 'defaultObjects'

const searchParameters = {
  type: "object",
  fields: {
    page: {
      type: "integer",
      description: "The page number to query (starts at 0)"
    },
    count: {
      type: "integer",
      description: "The number of objects per page"
    }
  }
}

const deleteBody = {
  type: 'array',
  items: {
    type: 'keyword',
    description: 'The id of the object to delete'
  }
}

const updateType = {
  type: "array",
  items: {
    type: "object",
    requires: ["ids", "query"],
    description: "A pairing between object ids to be updated and the way to update them",
    fields: {
      ids: {
        type: "array",
        description: "The object ids to be updated",
        items: {
          type: "keyword"
        }
      },
      query: {
        type: "object",
        description: "The way the objects should be updated",
        fields: {
          $inc: {
            type: "object",
            allowOtherFields: true,
            description: "Increment a number. The key is a period-separated string representing the key in the object to increment. The value is the number by which the value will be incremented. Use negative numbers to decrement.",
            fields: {}
          },
          $mul: {
            type: "object",
            allowOtherFields: true,
            description: "Multiply a number. The key is a period-separated string representing the key in the object to multiplied. The value is the number by which the value will be multiplied.",
            fields: {}
          },
          $rename: {
            type: "object",
            allowOtherFields: true,
            description: "Rename a field. The key is a period-separated string representing the key in the object to renamed. The value is the name to which the field will be renamed.",
            fields: {}
          },
          $set: {
            type: "object",
            allowOtherFields: true,description: "Set a field. The key is a period-separated string representing the key in the object to set. The value is the value to which the field will be set.",
            fields: {}
          },
          $unset: {
            type: "object",
            allowOtherFields: true,
            description: "Removes a field. The key is a period-separated string representing the key in the object to unset. The value does not matter.",
            fields: {}
          },
          $min: {
            type: "object",
            allowOtherFields: true,
            description: "Set a field if the value is less than the current value. The key is a period-separated string representing the key in the object to set. The value is the value to which the field will be set.",
            fields: {}
          },
          $max: {
            type: "object",
            allowOtherFields: true,
            description: "Set a field if the value is greater than the current value. The key is a period-separated string representing the key in the object to set. The value is the value to which the field will be set.",
            fields: {}
          },
          $addToSet: {
            type: "object",
            allowOtherFields: true,
            description: "Add a value to a collection only if it is unique to that collection. The key is a period-separated string representing the key in the object of the collection. The value is the value to add to the collection.",
            fields: {}
          },
          $pop: {
            type: "object",
            allowOtherFields: true,
            description: "Remove the last or first value of a collection. The key is a period-separated string representing the key in the object of the collection. The value is a positive number to remove the last value and a negative number to remove the first value.",
            fields: {}
          },
          $pullAll: {
            type: "object",
            allowOtherFields: true,
            description: "Remove all values of a kind from a collection. The key is a period-separated string representing the key in the object of the collection. The value is the value to remove.",
            fields: {}
          },
          $push: {
            type: "object",
            allowOtherFields: true,
            description: "Add a value to a collection. The key is a period-separated string representing the key in the object of the collection. The value is the value to add to the collection.",
            fields: {}
          }
        }
      }
    }
  }
}

const routeSchemas = {
  testRoute: {

  },
  getObject: {

  },
  searchObject: {
    params: searchParameters
  },
  createObject: {
    body: {
      "type": "object",
      "requires": ["_type"],
      "allowOtherFields": true,
      "fields": {
        "_type": {
          "type": "keyword",
          "description": "The type id of the object"
        }
      }
    }
  },
  updateObject: {
    body: updateType
  },
  deleteObject: {
    body: deleteBody
  },
  getToken: {
    body: {
      type: "object",
      requires: ["password"],
      requiresAtLeast: {
        count: 1,
        fields: ["username", "password"]
      },
      fields: {
        username: {
          type: "keyword",
          description: "The name of the user. This will be public on Zenow. Usernames must consist of letters, numbers, -, or _ and be between 3 and 30 characters in length.",
          regex: usernameRegex
        },
        email: {
          type: "keyword",
          description: "The user's email",
          regex: emailRegex
        },
        password: {
          type: "keyword",
          description: "The user's password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
          regex: passwordRegex
        }
      }
    }
  },
  createUser: {
    body: {
      type: "object",
      requires: ["username", "email", "password"],
      fields: {
        username: {
          type: "keyword",
          description: "The name of the user. This will be public on Zenow. Usernames must consist of letters, numbers, -, or _ and be between 3 and 30 characters in length.",
          regex: usernameRegex
        },
        email: {
          type: "keyword",
          description: "The user's email",
          regex: emailRegex
        },
        password: {
          type: "keyword",
          description: "The user's password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
          regex: passwordRegex
        }
      }
    }
  },
  validateUser: {
    body: {
      type: "object",
      requires: ["username", "email", "password"],
      fields: {
        username: {
          type: "keyword",
          description: "The name of the user. This will be public on Zenow. Usernames must consist of letters, numbers, -, or _ and be between 3 and 30 characters in length.",
          regex: usernameRegex
        },
        email: {
          type: "keyword",
          description: "The user's email",
          regex: emailRegex
        },
        password: {
          type: "keyword",
          description: "The user's password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
          regex: passwordRegex
        }
      }
    }
  },
  getUser: {

  },
  createSet: {
    body: set_type.properties
  },
  searchSet: {
    params: searchParameters
  },
  getSet: {

  },
  updateSet: {
    body: updateType
  },
  deleteSet: {

  },
  addItems: {
    body: {
      "type": "object",
      "requires": ["_type"],
      "allowOtherFields": true,
      "fields": {
        "_type": {
          "type": "keyword",
          "description": "The type id of the object"
        }
      }
    }
  },
  searchItems: {
    params: searchParameters
  },
  getItem: {

  },
  updateItem: {
    body: updateType
  },
  removeItems: {
    body: deleteBody
  },
  starSet: {

  },
  unstarSet: {

  },
  getType: {

  },
  createType: {
    body: type_type.properties
  },
  searchType: {
    params: searchParameters
  }
}

export default routeSchemas;