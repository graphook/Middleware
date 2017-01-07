
const routes = [
  {
    method: 'get',
    path: '/',
    handler: require('./handlers/welcome.handler')
  },
  {
    method: 'get',
    path: '/v1/set',
    handler: require('./handlers/set/getSets.handler')
  },
  {
    method: 'get',
    path: '/v1/set/:id',
    handler: require('./handlers/set/getSet.handler')
  },
  {
    method: 'post',
    path: '/v1/set/search',
    handler: require('./handlers/set/searchSet.handler')
  },
  {
    method: 'post',
    path: '/v1/set/:id/item/search',
    handler: require('./handlers/set/searchItem.handler')
  },
  {
    method: 'get',
    path: '/v1/set/:id/item/:itemId',
    handler: require('./handlers/set/getItem.handler')
  },
  {
    method: 'post',
    path: '/v1/set',
    handler: require('./handlers/set/createSet.handler')
  },
  {
    method: 'post',
    path: '/v1/set/:id/clone',
    handler: require('./handlers/set/cloneSet.handler')
  },
  {
    method: 'put',
    path: '/v1/set/:id',
    handler: require('./handlers/set/updateSetMetadata.handler')
  },
  {
    method: 'post',
    path: '/v1/set/:id/item',
    handler: require('./handlers/set/addToSet.handler')
  },
  {
    method: 'delete',
    path: '/v1/set/:id/item',
    handler: require('./handlers/set/removeFromSet.handler')
  },
  {
    method: 'put',
    path: '/v1/set/:id/item/:itemId',
    handler: require('./handlers/set/updateItem.handler')
  },
  {
    method: 'delete',
    path: '/v1/set/:id',
    handler: require('./handlers/set/deleteSet.handler')
  },
  {
    method: 'put',
    path: '/v1/set/:id/star',
    handler: require('./handlers/set/starSet.handler')
  },
  {
    method: 'put',
    path: '/v1/set/:id/unstar',
    handler: require('./handlers/set/unstarSet.handler')
  },
  {
    method: 'get',
    path: '/v1/type',
    handler: require('./handlers/type/getTypes.handler')
  },
  {
    method: 'get',
    path: '/v1/type/:id',
    handler: require('./handlers/type/getType.handler')
  },
  {
    method: 'post',
    path: '/v1/type',
    handler: require('./handlers/type/createType.handler')
  },
  {
    method: 'put',
    path: '/v1/type/:id',
    handler: require('./handlers/type/updateType.handler')
  },
  {
    method: 'delete',
    path: '/v1/type/:id',
    handler: require('./handlers/type/deleteType.handler')
  },
  {
    method: 'post',
    path: '/v1/auth/token',
    handler: require('./handlers/user/getToken.handler')
  },
  {
    method: 'post',
    path: '/v1/user',
    handler: require('./handlers/user/createUser.handler')
  },
  {
    method: 'post',
    path: '/v1/user/validate',
    handler: require('./handlers/user/validateUser.handler')
  },
  {
    method: 'put',
    path: '/v1/user',
    handler: require('./handlers/user/updateUser.handler')
  },
  {
    method: 'put',
    path: '/v1/user/password',
    handler: require('./handlers/user/updatePassword.handler')
  },
  {
    method: 'put',
    path: '/v1/user/key',
    handler: require('./handlers/user/regenerateKey.handler')
  },
  {
    method: 'get',
    path: '/v1/user',
    handler: require('./handlers/user/getUser.handler')
  }
]

export default routes;
