
export default const type = {
  title: "Create Type Request",
  description: "The request body of a request to create a type in Zenow v1.",
  properties: {
    title: {
      required: true,
      type: "string"
    },
    description: {
      required: false,
      type: "string",
      default: ""
    },
    properties: {
      required: true,
      type: "object",
      properties: {},
      allowOtherProperties: true
    }
  }
}
