
const routes = [
  {
    method: 'get',
    path: '/',
    handler: require('./handlers/welcome.handler')
  },

  {
    method: 'get',
    path: '/v2/object/:objectId',
    handler: require('./handlers/object/readObject.handler')
  },
  {
    method: 'post',
    path: '/v2/object/search',
    handler: require('./handlers/object/searchObject.handler')
  },
  {
    method: 'post',
    path: '/v2/object',
    handler: require('./handlers/object/createObject.handler')
  },
  {
    method: 'put',
    path: '/v2/object',
    handler: require('./handlers/object/updateObject.handler')
  },
  {
    method: 'delete',
    path: '/v2/object',
    handler: require('./handlers/object/deleteObject.handler')
  },


  {
    method: 'post',
    path: '/v2/auth/token',
    handler: require('./handlers/user/getToken.handler')
  },
  {
    method: 'post',
    path: '/v2/user',
    handler: require('./handlers/user/createUser.handler')
  },
  {
    method: 'post',
    path: '/v2/user/validate',
    handler: require('./handlers/user/validateUser.handler')
  },
  {
    method: 'get',
    path: '/v2/user',
    handler: require('./handlers/user/getUser.handler')
  },
/*
  {
    method: 'put',
    path: '/v2/user',
    handler: require('./handlers/user/updateUser.handler')
  },
  {
    method: 'put',
    path: '/v2/user/password',
    handler: require('./handlers/user/updatePassword.handler')
  },
  {
    method: 'put',
    path: '/v2/user/key',
    handler: require('./handlers/user/regenerateKey.handler')
  },*/


  {
    method: 'post',
    path: '/v2/type',
    handler: require('./handlers/type/createType.handler')
  },



  {
    method: 'post',
    path: '/v2/set',
    handler: require('./handlers/set/createSet.handler')
  }
]

export default routes;
