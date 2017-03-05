export default function(req, res) {
  return {
    req: req,
    res: res,
    errors: {},
    users: {
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
    },
    items: {
      read: [],
      created: [],
      updated: [],
      deleted: []
    }
  }
}
