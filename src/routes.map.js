import samples from 'testHelpers/requestData';
import schemas from './routeSchemas'

const routes = [
  {
    method: 'get',
    path: '/',
    handler: require('./handlers/welcome.handler'),
    category: 'Other',
    description: 'Calling this route will yield a welcome message. Use this route to test your connection to the server.',
    sample: samples.testRoute,
    schemas: schemas.testRoute
  },

  {
    method: 'get',
    path: '/v2/object/:objectId',
    handler: require('./handlers/object/readObject.handler'),
    category: 'Base Operations',
    description: 'Get an object with a certain object Id.',
    sample: samples.getObject,
    schemas: schemas.getObject
  },
  {
    method: 'post',
    path: '/v2/object/search',
    handler: require('./handlers/object/searchObject.handler'),
    category: 'Base Operations',
    description: 'Search for any object. Go to the "Search Tutorial" to learn how to format the body.',
    sample: samples.searchObject,
    schemas: schemas.searchObject
  },
  {
    method: 'post',
    path: '/v2/object',
    handler: require('./handlers/object/createObject.handler'),
    category: 'Base Operations',
    description: 'Create an object of any type.',
    notes: [
      'It is not possible to set the "numberOfSets" field of Types manually as this number must correspond to the number of sets with this type.',
      'It is not possible to set the "numberOfItems" field of Sets manually as this number must correspond to the number of items within this set.',
      'It is not possible to set the "stars" field of Sets manually. Nice try ;)'
    ],
    sample: samples.createObject,
    schemas: schemas.createObject
  },
  {
    method: 'put',
    path: '/v2/object',
    handler: require('./handlers/object/updateObject.handler'),
    category: 'Base Operations',
    description: 'Update any number of objects. Use the body to define the objects to update. See the "Updating Tutorial" to learn how to make updates.',
    notes: [
      'It is not possible to update the "properties" field of Types. Please create a new type if that is what you wish to do.',
      'It is not possible to update the "numberOfSets" field of Types manually as this number must correspond to the number of sets with this type.',
      'It is not possible to update the "numberOfItems" field of Sets manually as this number must correspond to the number of items within this set.',
      'It is not possible to update the "stars" field of Sets manually. Nice try ;)'
    ],
    sample: samples.updateObject,
    schemas: schemas.updateObject
  },
  {
    method: 'delete',
    path: '/v2/object',
    handler: require('./handlers/object/deleteObject.handler'),
    category: 'Base Operations',
    description: 'Delete any object by passing an array of object Ids to delete.',
    notes: [
      'It is not possible to delete Types.',
      'If you delete a Set using this method, it will not automatically delete all items that are associated with only this set. If you wish to do this, use the DELETE /v2/set/:setId route.',
      'If you delete a member of a Set using this method, it will remove that member from all Sets. If you only wish to remove an item from one Set, use the DELETE /v2/set/:setId/item route.'
    ],
    sample: samples.deleteObject,
    schemas: schemas.deleteObject
  },


  {
    method: 'post',
    path: '/v2/auth/token',
    handler: require('./handlers/user/getToken.handler'),
    category: 'Authentication',
    description: 'Get a token to query the api by passing a username/email and password',
    sample: samples.getToken,
    schemas: schemas.getToken
  },
  {
    method: 'post',
    path: '/v2/user',
    handler: require('./handlers/user/createUser.handler'),
    category: 'Authentication',
    description: 'Create a new user',
    doNotDocument: true,
    samples: samples.createUser,
    schemas: schemas.createUser
  },
  {
    method: 'post',
    path: '/v2/user/validate',
    handler: require('./handlers/user/validateUser.handler'),
    category: 'Authentication',
    description: 'Validate that a given user\'s credentials do not conflict with other users.',
    sample: samples.validateUser,
    schemas: schemas.validateUser
  },
  {
    method: 'get',
    path: '/v2/user',
    handler: require('./handlers/user/getUser.handler'),
    category: 'Authentication',
    description: 'Get the user that is currently logged in.',
    sample: samples.getUser,
    schemas: schemas.getUser
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
  // Set
  {
    method: 'post',
    path: '/v2/set',
    handler: require('./handlers/set/createSet.handler'),
    category: 'Set Operations',
    description: 'Create a new data Set.',
    sample: samples.createSet,
    schemas: schemas.createSet
  },
  {
    method: 'post',
    path: '/v2/set/search',
    handler: require('./handlers/set/searchSet.handler'),
    category: 'Set Operations',
    description: 'Search all data Sets officially a part of zenow. Go to the "Search Tutorial" to learn how to format the body.',
    sample: samples.searchSet,
    schemas: schemas.searchSet
  },
  {
    method: 'get',
    path: '/v2/set/:setId',
    handler: require('./handlers/set/readSet.handler'),
    category: 'Set Operations',
    description: 'Get a specific Set given a set id.',
    sample: samples.getSet,
    schemas: schemas.getSet
  },
  {
    method: 'put',
    path: '/v2/set/:setId',
    handler: require('./handlers/set/updateSet.handler'),
    category: 'Set Operations',
    description: 'Update a specific set given a set id. See the "Updating Tutorial" to learn how to make updates.',
    sample: samples.updateSet,
    schemas: schemas.updateSet
 },
  {
    method: 'delete',
    path: '/v2/set/:setId',
    handler: require('./handlers/set/deleteSet.handler'),
    category: 'Set Operations',
    description: 'Delete a specific set given a set id.',
    notes: [ 'If an object is a member of only this set, that object will also be deleted. If you do not want this to happen use DELETE /v2/object' ],
    sample: samples.deleteSet,
    schemas: schemas.deleteSet
  },
  // Items
  {
    method: 'post',
    path: '/v2/set/:setId/item',
    handler: require('./handlers/set/addItems.handler'),
    category: 'Set Item Operations',
    description: 'Add an Items to the Set.',
    sample: samples.addItems,
    schemas: schemas.addItems
  },
  {
    method: 'post',
    path: '/v2/set/:setId/item/search',
    handler: require('./handlers/set/searchItems.handler'),
    category: 'Set Item Operations',
    description: 'Search items within the Set. Go to the "Search Tutorial" to learn how to format the body.',
    sample: samples.searchItems,
    schemas: schemas.searchItems
  },
  {
    method: 'get',
    path: '/v2/set/:setId/item/:itemId',
    handler: require('./handlers/set/readItem.handler'),
    category: 'Set Item Operations',
    description: 'Get a specific item within the Set.',
    sample: samples.getItem,
    schemas: schemas.getItem
  },
  {
    method: 'put',
    path: '/v2/set/:setId/item',
    handler: require('./handlers/set/updateItems.handler'),
    category: 'Set Item Operations',
    description: 'Update Items in a set. See the "Updating Tutorial" to learn how to make updates.',
    sample: samples.updateItem,
    schemas: schemas.updateItem
  },
  {
    method: 'delete',
    path: '/v2/set/:setId/item',
    handler: require('./handlers/set/removeItems.handler'),
    category: 'Set Item Operations',
    description: 'Remove items from a set.',
    notes: [
      'This will delete the Item if this is the sole Set of which it is a member. Otherwise the Item will continue existing as a part of other Sets. If you wish to remove this item from all sets of which it is a member use the DELETE /v2/object route.'
    ],
    sample: samples.removeItems,
    schemas: schemas.removeItems
  },
  {
    method: 'put',
    path: '/v2/set/:setId/star',
    handler: require('./handlers/set/starSet.handler'),
    category: 'Set Operations',
    description: 'Star a set for a particular user.',
    notes: [
      'It is not possible to star a set multiple times per user.'
    ],
    sample: samples.starSet,
    schemas: schemas.starSet
  },
  {
    method: 'put',
    path: '/v2/set/:setId/unstar',
    handler: require('./handlers/set/unstarSet.handler'),
    category: 'Set Operations',
    description: 'Unstar a set for a particular user.',
    sample: samples.unstarSet,
    schemas: schemas.unstarSet
  },
  // Insights
  /*{
    method: 'post',
    path: '/v2/set/:setId/insight',
    handler: require('./handlers/set/addInsight.handler')
  },
  {
    method: 'post',
    path: '/v2/set/:setId/insight/search',
    handler: require('./handlers/set/searchInsight.handler')
  },
  {
    method: 'get',
    path: '/v2/set/:setId/insight/:insightId',
    handler: require('./handlers/set/readInsight.handler')
  },
  {
    method: 'put',
    path: '/v2/set/:setId/insight/:insightId',
    handler: require('./handlers/set/updateItems.handler')
  },
  {
    method: 'delete',
    path: '/v2/set/:setId/insight/:insightId',
    handler: require('./handlers/set/removeInsight.handler')
  },*/






  {
    method: 'get',
    path: '/v2/type/:typeId',
    handler: require('./handlers/type/readType.handler'),
    category: 'Type Operations',
    description: 'Get a specific Type given a type id',
    sample: samples.getType,
    schemas: schemas.getType
  },
  {
    method: 'post',
    path: '/v2/type',
    handler: require('./handlers/type/createType.handler'),
    category: 'Type Operations',
    description: 'Create a Type. Go to the "Type Tutorial" to learn how to format the body.',
    sample: samples.createType,
    schemas: schemas.createType
  },
  {
    method: 'post',
    path: '/v2/type/search',
    handler: require('./handlers/type/searchType.handler'),
    category: 'Type Operations',
    description: 'Search for Types. Go to the "Search Tutorial" to learn how to format the body.',
    sample: samples.searchType,
    schemas: schemas.searchType
  }
]

export default routes;
