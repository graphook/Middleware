import {families, familyIds, familySet, familySetId, familyTypeId} from 'testHelpers/sampleData';
import {type_set, set_set} from 'defaultObjects';
import {cloneAssign} from 'utilities';

const addFamilyMetadata = (family, index) => {
  return cloneAssign(family, {
    _id: familyIds[index],
    _sets: [ familySetId ],
    _type: familyTypeId
  });
}
const addSetMetadata = (set, setId) => {
  return cloneAssign(set, {
    _id: setId,
    _sets: [ 'set_set' ],
    _type: 'set_type'
  }, ['_permissions']);
}

const requestData = {
  testRoute: {
    path: '/',
    method: 'get',
    responseStatus: 200,
    responseBody: {
      status: 200
    }
  },
  getObject: {
    path: '/v2/object/' + familyIds[0],
    method: 'get',
    responseStatus: 200,
    responseBody: {
      status: 200,
      read: {
        [familyTypeId]: [addFamilyMetadata(families[0])]
      }
    }
  },
  searchObject: {
    path: '/v2/object/search',
    method: 'post',
    requestBody: {
      query: {
        match: {
          _all: '40'
        }
      }
    },
    responseStatus: 200,
    responseBody: {
      status: 200,
      read: {
        [familyTypeId]: [
          addFamilyMetadata(families[4], 4),
          addFamilyMetadata(families[5], 5)
        ]
      }
    }
  },
  createObject: {
    path: '/v2/object',
    method: 'post',
    requestBody: cloneAssign(families[0], { _type: familyTypeId }),
    responseStatus: 201,
    responseBody: {
      status: 201,
      created: {
        [familyTypeId]: [
          cloneAssign(families[0], { 
            _sets: [],
            _type: familyTypeId,
            _id: "AUTO_GENERATED_ID"
          })
        ]
      }
    }
  },
  updateObject: {
    path: '/v2/object',
    method: 'put',
    requestBody: [
      {
        ids: [familyIds[2], familyIds[3]],
        query: {
          $inc: {
            numberOfChildren: 1
          }
        }
      }
    ],
    responseStatus: 200,
    responseBody: {
      status: 200,
      updated: {
        [familyTypeId]: [
          addFamilyMetadata(cloneAssign(families[2], {
            numberOfChildren: families[2].numberOfChildren + 1
          }), 2),
          addFamilyMetadata(cloneAssign(families[3], {
            numberOfChildren: families[3].numberOfChildren + 1
          }), 3)
        ]
      }
    }
  },
  deleteObject: {
    path: '/v2/object',
    method: 'delete',
    requestBody: [ familyIds[6] ],
    responseStatus: 200,
    responseBody: {
      status: 200,
      deleted: {
        [familyTypeId]: [
          addFamilyMetadata(families[6], 6)
        ]
      }
    }
  },
  getToken: {

  },
  createUser: {

  },
  validateUser: {

  },
  getUser: {

  },
  createSet: {
    path: '/v2/set',
    method: 'post',
    requestBody: cloneAssign(familySet, { _type: familySetId }),
    responseStatus: 201,
    responseBody: {
      status: 201,
      created: {
        set_type: [
          cloneAssign(familySet, { 
            _sets: [],
            _type: 'set_type',
            _id: "AUTO_GENERATED_ID"
          })
        ]
      }
    }
  },
  searchSet: {
    path: '/v2/set/search',
    method: 'post',
    requestBody: {
      query: {
        match: {
          _all: 'meta'
        }
      }
    },
    responseStatus: 200,
    responseBody: {
      status: 200,
      read: {
        set_type: [
          addSetMetadata(type_set, 'type_set'),
          addSetMetadata(set_set, 'set_set')
        ]
      }
    }
  },
  getSet: {
    path: '/v2/object/' + familySetId,
    method: 'get',
    responseStatus: 200,
    responseBody: {
      status: 200,
      read: {
        set_type: [addSetMetadata(familySet, familySetId)]
      }
    }
  },
  updateSet: {
    path: '/v2/set/' + familySetId,
    method: 'put',
    requestBody: {
      $set: {
        description: 'sample'
      }
    },
    responseStatus: 200,
    responseBody: {
      status: 200,
      updated: {
        'set_type': [
          addSetMetadata(cloneAssign(familySet, {
            description: 'sample'
          }), familySetId)
        ]
      }
    }
  },
  deleteSet: {
    path: '/v2/set/' + familySetId,
    method: 'delete',
    responseStatus: 200,
    responseBody: {
      status: 200,
      deleted: {
        'set_type': [
          addSetMetadata(familySet, familySetId)
        ]
      }
    }
  },
  addItems: {

  },
  searchItems: {

  },
  getItem: {

  },
  updateItem: {

  },
  removeItmes: {

  },
  starSet: {

  },
  unstarSet: {

  },
  getType: {

  },
  createType: {

  },
  searchType: {

  }
}

export default requestData;