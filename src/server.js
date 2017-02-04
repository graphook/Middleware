import express from 'express';
import path from 'path';

import {startMongo, db} from './mongo'
import routes from './routes.map'
import bodyParser from 'body-parser'

export default function startServer() {
  startMongo();
  let app = express();
  /*if (process.env.ENV === 'prod') {
    app.use((req, res, next) => {
      if (req.get('x-forwarded-proto') !== 'https') {
        res.redirect('https://' + req.hostname + req.originalUrl);
      } else
        next()
    });
  }*/

  app.use(bodyParser.json({limit: '50mb'}));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
  app.options('/*', (req, res) => {
    res.send();
  });
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
  if (process.env.ENV !== 'prod') {
    app.get('/test', require('./handlers/test.handler.js'));
  }
  app.use(function (req, res, next) {
    res.status(404).send({
      status: 404,
      errors: {
        'path': req.path + ' is not a valid path.'
      }
    })
  })
  let port = process.env.PORT || 3030;
  app.listen(port, () => {
    console.log('Application listening on ', port);
  });
}
