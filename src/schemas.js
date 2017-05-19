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
