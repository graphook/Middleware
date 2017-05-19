
const routes = [
  {
    method: 'get',
    path: '/',
    handler: require('./handlers/welcome.handler')
  },



  {
    method: 'post',
    path: '/v2/type',
    handler: require('./handlers/object/createType.handler')
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
  },
  {
    method: 'get',
    path: '/v2/user',
    handler: require('./handlers/user/getUser.handler')
  }
]

export default routes;
