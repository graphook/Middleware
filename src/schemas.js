export const type = {
  title: "Type",
  description: "A zenow type provides the schema for all objects that ascribe to this type.",
  properties: {
    type: "object",
    required: ["title", "properties", "_type"],
    fields: {
      title: {
        type: "text",
        description: "The title of the type."
      },
      _type: {
        type: "keyword",
        constant: "type_type"
      },
      description: {
        type: "text",
        default: ""
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
        allowOtherProperties: true
      },
      tags: {
        type: "array",
        items: {
          type: "text"
        },
        default: []
      }
    }
  }
}

export const set = {
  title: "Set",
  description: "A zenow set provides an abstraction on the zenow api to organize data. It represents a collection of objects of the same type.",
  properties: {
    type: "object",
    requires: ["title", "properties", "_type"],
    fields: {
      title: {
        type: "text",
        description: "The title of the type."
      },
      description: {
        type: "text",
        default: ""
      },
      type: {
        type: "object",
        requires: ["_id"],
        fields: {
          _id: {
            type: "keyword"
          },
          title: {
            type: "text"
          }
        }
      },
      creator: {
        type: "object",
        requires: ["_id"],
        fields: {
          _id: {
            type: "keyword"
          },
          username: {
            type: "text"
          }
        }
      },
      stars: {
        type: "integer"
      },
      numberOfItems: {
        type: "integer"
      },
      tags: {
        type: "array",
        items: {
          type: "text"
        },
        default: []
      }
    }
  }
}
