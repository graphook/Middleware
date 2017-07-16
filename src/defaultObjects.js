export const type_type = {
  title: "Type",
  description: "A zenow type provides the schema for all objects that ascribe to this type.",
  tags: ["set", "zenow", "meta"],
  properties: {
    type: "object",
    required: ["title", "properties", "_type", "meta"],
    fields: {
      title: {
        type: "text",
        description: "The title of the type."
      },
      description: {
        type: "text",
        default: "",
        description: "The description of the type."
      },
      tags: {
        type: "array",
        items: {
          type: "text"
        },
        default: [],
        description: "A list of terms to aid in searching."
      },
      properties: {
        requires: ["type"],
        cannotHave: ["_permissions", "_id"],
        type: "object",
        allowOtherFields: true,
        fields: {
          type: {
            type: 'keyword',
            contant: 'object'
          }
        },
        allowOtherProperties: true,
        description: "Defines the schema of the type. See the \"Type Tutorial\" in the documentation to learn how to format this."
      },
      _sets: {
        type: "array",
        items: {
          type: "keyword",
        },
        default: [],
        description: "Defines the Sets of which this object is a member."
      },
      _type: {
        type: "keyword",
        constant: "type_type",
        description: "Defines the object's Type as type_type."
      }
    }
  }
}

export const set_type = {
  title: "Set",
  description: "A zenow set provides an abstraction on the zenow api to organize data. It represents a collection of objects of the same type.",
  tags: ["set", "zenow", "meta"],
  properties: {
    type: "object",
    requires: ["title", "_type"],
    fields: {
      title: {
        type: "text",
        description: "The title of the set."
      },
      description: {
        type: "text",
        default: "",
        description: "The description of the set."
      },
      tags: {
        type: "array",
        items: {
          type: "text"
        },
        default: [],
        description: "A list of terms to aid in searching."
      },
      type: {
        type: "object",
        requires: ["_id"],
        fields: {
          _id: {
            type: "keyword",
            description: "The id of the Type all items in this set should be."
          },
          title: {
            type: "text",
            description: "The title of the Type all items in this set should be."
          }
        },
        description: "A small snapshot of the Type all items in this set should be."
      },
      creator: {
        type: "object",
        requires: ["_id"],
        fields: {
          _id: {
            type: "keyword",
            description: "The id of the user who created this Set."
          },
          username: {
            type: "text",
            description: "The username of the user who created this Set."
          }
        },
        description: "A small snapshot of the user who created this Set."
      },
      stars: {
        type: "integer",
        description: "The number of users who have starred this Set."

      },
      numberOfItems: {
        type: "integer",
        description: "The number of Items that are members of this Set."
      },
      _sets: {
        type: "array",
        items: {
          type: "keyword",
        },
        default: [],
        description: "Defines the Sets of which this object is a member."
      },
      _type: {
        type: "keyword",
        constant: "set_type",
        description: "Defines the object's Type as set_type."
      }
    }
  }
}

export const type_set = {
  title: "Zenow Types",
  description: "All types indexed by the database and officially searchable by the zenow ui",
  tags: ["zenow", "type", "meta"],
  type: {
    _id: "type_type",
    title: "type"
  },
  creator: {
    _id: 'zenow',
    username: 'zenow'
  },
  stars: 0,
  numberOfItems: 2,
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: ['set_set']
}

export const set_set = {
  title: "Zenow Sets",
  description: "All sets officially searchable by the zenow ui.",
  tags: ["zenow", "set", "meta"],
  type: {
    _id: "set_type",
    title: "set"
  },
  creator: {
    _id: 'zenow',
    username: 'zenow'
  },
  stars: 0,
  numberOfItems: 2,
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: ['set_set']
}

export const route_type = {
  title: "REST API Route Documentation",
  description: "Represents a route in a RESTful (REpresentational State Transfer) API.",
  tags: ["REST", "API", "request", "documentation", "code"],
  properties: {
    type: "object",
    requires: ["domain", "path", "_type"],
    fields: {
      category: {
        type: "text",
        description: "A descriptive category for this route."
      },
      description: {
        type: "text",
        description: "The description of the route."
      },
      notes: {
        type: "array",
        description: "A collection of notes that may apply to this route.",
        items: {
          type: "text"
        }
      },
      protocol: {
        type: "keyword",
        default: "https",
        enums: [ "http", "https" ],
        description: "The protocol of the request. Usually http or https."
      },
      domain: {
        type: "text",
        description: "The domain of the request. This also accepts IP addresses or 'localhost'"
      },
      port: {
        type: "integer",
        description: "Port number of the request. If there is none, leave this field blank."
      },
      path: {
        type: "text",
        description: "The path of the request. Must start with a slash."
      },
      method: {
        type: "keyword",
        enums: [ "get", "head", "post", "put", "delete", "connect", "options", "trace", "patch" ],
        description: "The http method of the request."
      },
      parameters: {
        type: "object",
        fields: {},
        allowOtherFields: true,
        description: "A type properties object to represent allowed url parameters. See the Zenow \"Type Tutorial\" for more information.",
        default: {}
      },
      headers: {
        type: "object",
        fields: {},
        allowOtherFields: true,
        description: "A type properties object to represent allowed headers. See the Zenow \"Type Tutorial\" for more information.",
        default: {}
      },
      body: {
        type: "object",
        fields: {},
        allowOtherFields: true,
        description: "A type properties object to represent the body schema. See the Zenow \"Type Tutorial\" for more information.",
        default: {}
      },
      _sets: {
        type: "array",
        items: {
          type: "keyword",
        },
        default: [],
        description: "Defines the Sets of which this object is a member."
      },
      _type: {
        type: "keyword",
        constant: "route_type",
        description: "Defines the object's Type as route_type."
      }
    }
  }
}

export const route_set = {
  title: "Zenow API V2 Routes",
  description: "Documentation of all the API endpoints in Zenow's API v2.",
  tags: ["zenow", "route", "endpoint", "api", "meta"],
  type: {
    _id: "route_type",
    title: "REST API Route Documentation"
  },
  creator: {
    _id: 'zenow',
    username: 'zenow'
  },
  stars: 0,
  numberOfItems: 0,
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: ['set_set']
}
