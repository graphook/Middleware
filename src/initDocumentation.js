import { route_type, route_set } from 'defaultObjects';
import request from 'superagent';
import Promise from 'bluebird';
import typeToElasticMapping from 'stages/base/typeToElasticMapping.stage';
import {type_type} from 'defaultObjects';
import routes from 'routes.map.js';
import createObjects from 'baseOperations/createObjects';
import Scope from 'stages/util/Scope';


export default function(done = () => {}) {
  const scope = new Scope({}, {});
  scope.user = {
    _id: "zenow",
    username: "zenow"
  }
  Promise.try(() => typeToElasticMapping(scope, route_type, [], 'route_type'))
    .then(() => delete scope.route_type.properties._type)
    .then(() => request.put(process.env.ES_URL + '/object/_mapping/route_type').send({ route_type: scope.route_type}))
    .catch((err) => console.info(err))
    .then(() => Object.assign(route_type, {
      _permissions: {
        owner: 'zenow',
        read: ['all']
      },
      _sets: [ 'type_set' ]
    }))
    .then(() => request.put(process.env.ES_URL + '/object/type_type/route_type').send(route_type))
    .then(() => console.info('Added route_type'))
    .then(() => request.put(process.env.ES_URL + '/object/set_type/route_set').send(route_set))
    .then((result) => console.info("Successfully added the route set object"))
    .catch((err) => console.info(err))
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    // Build the routes:
    .then(() => {
      scope.routeDocs = routes.map((route) => {
        try {
          return {
            _type: "route_type",
            category: route.category,
            description: route.description,
            notes: route.notes,
            method: route.method,
            path: route.path,
            protocol: 'https',
            domain: 'api.zenow.io',
            parameters: {
              type: "object",
              description: "The parameters given to the URL via the query (?).",
              requires: ['apikey'],
              fields: (route.schemas.params) ? Object.assign(route.schemas.params, {
                apikey: {
                  type: 'keyword',
                  description: 'The user access key for the api. This can also be passed in via a header variable.'
                }
              }) : {
                apikey: {
                  type: 'keyword',
                  description: 'The user access key for the api. This can also be passed in via a header variable.'
                }
              }
            },
            headers: {
              type: "object",
              description: "The header variables.",
              requires: ['apikey'],
              fields: {
                Authorization: {
                  type: 'keyword',
                  description: 'The user access key for the api. This can also be passed in via the url parameters.'
                }
              }
            },
            body: route.schemas.body,
            _sets: ["route_set"]
          }
        } catch(e) {
          console.error(route);
          console.error(e);
        }
      });
    })
    .then(() => createObjects(scope, scope.routeDocs, [ 'routes' ], 'savedRoutes', {}))
    .then(() => { done() })
    .catch((err) => console.info(err))
}
