
export default const type = {
  title: "Create Type Request",
  description: "The request body of a request to create a type in Zenow v1.",
  properties: {
    errors: []
    items: {
      read: [],
      created: [],
      updated: [],
      deleted: []
    },
    types: {
      read: [],
      created: [],
      updated: [],
      deleted: []
    },
    sets: {
      read: [],
      created: [],
      updated: [],
      deleted: []
    }
    users: {
      read: [],
      created: [],

    }
  }
}
