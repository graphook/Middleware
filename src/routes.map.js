
const routes = [
  {
    method: 'get',
    path: '/v1/set',
    handler: require('./handlers/set/getSets.handler')
  },
  {
    method: 'get',
    path: '/v1/set/:id',
    hander: require('./handlers/set/getSet.handler')
  },
  {
    method: 'get',
    path: '/v1/set/:id/item/:itemId',
    hander: require('./handlers/set/getItem.handler')
  },
  {
    method: 'post',
    path: '/v1/set/:id/item/search',
    hander: require('./handlers/set/searchSet.handler')
  },
  {
    method: 'post',
    path: '/v1/set',
    handler: require('./handlers/set/createSet.handler')
  },
  {
    method: 'put',
    path: '/v1/set/:id',
    handler: require('./handlers/set/updateSetMetadata.handler')
  },
  {
    method: 'put',
    path: '/v1/set/:id/add',
    handler: require('./handlers/set/addToSet.handler')
  },
  {
    method: 'put',
    path: '/v1/set/:id/remove',
    handler: require('./handlers/set/removeFromSet.handler')
  },
  {
    method: 'delete',
    path: '/v1/set/',
    handler: require('./handlers/set/deleteSet.handler')
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
  }
]

export default routes;
