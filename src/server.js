import express from 'express';
import path from 'path';

import {startMongo, db} from './mongo'
import routes from './routes.map'
import bodyParser from 'body-parser'
import errorHandler from './middleware/errorHandler'
import lookupUser from './middleware/lookupUser'
import logRequest from './middleware/logRequest'

export default function startServer() {
  startMongo();
  let app = express();
  app.use(bodyParser.json());
  app.use(lookupUser);
  app.use(logRequest);
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
  app.use(errorHandler);
  let port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log('Application listening on ', port);
  });
}
