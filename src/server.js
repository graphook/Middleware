import express from 'express';
import path from 'path';

import {startMongo, db} from './mongo'
import routes from './routes.map'
import bodyParser from 'body-parser'

export default function startServer() {
  startMongo();
  let app = express();
  app.use(bodyParser.json());
  routes.forEach((route) => {
    try {
      if (route.middleware) {
        route.middleware.forEach((func) => {
          app[route.method](route.path, func);
        });
      }
      if (route.handler) {
        app[route.method](route.path, route.handler);
      }
    } catch(e) {
      console.log('Error at route ', route, e);
    }
  });
  let port = process.env.PORT || 3030;
  app.listen(port, () => {
    console.log('Application listening on ', port);
  });
}
