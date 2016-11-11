require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import {Validator} from 'jsonschema';
import {MongoClient} from 'mongodb';
import {ObjectID} from 'mongodb';

import tokenCheck from './tokenCheck'

const uriString = 'mongodb://' + process.env.MONGO_URL + '/graphook';
const v = new Validator();

let db;
let document;

// Use connect method to connect to the Server
MongoClient.connect(uriString, (err, database) => {
  if (err) {
    console.log(err);
  }
  console.log("Connected correctly to mogno");
  db = database
  document = db.collection('document');
});

const cleanseDocument = function(doc) {
  let newDoc = JSON.parse(JSON.stringify(doc));
  const keys = ['_canRead', '_canSetReadPermission', '_canUpdate', '_canSetUpdatePermission', '_canDelete', '_canSetDeletePermission'];
  keys.forEach((key) => {
    delete newDoc[key];
  });
  return newDoc;
}

const server = express();

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.use(bodyParser.json());
server.use(tokenCheck)

// Get document by Id
server.get('/document/:id', (req, res) => {
  console.log(req.users);
  document.find({'_id': ObjectID(req.params.id), '_canRead': { $all: req.users}}).toArray((err, docs) => {
    if (err) {
      res.status(500).send();
    } else {
      res.send(docs.map((doc) => {
        return cleanseDocument(doc);
      }))
    }
  });
});

// Get document by search query
server.post('/document/search', (req, res) => {
  let searchQuery = cleanseDocument(req.body);

  searchQuery._canRead = {$all: req.users};
  console.log(searchQuery);
  document.find(searchQuery).toArray((err, docs) => {
    if (err) {
      res.status(500).send();
    } else {
      res.send(docs.map((doc) => {
        return cleanseDocument(doc);
      }))
    }
  });
});

// Insert a document
server.post('/document', (req, res) => {
  // TODO: clean document
  let doc = req.body;
  if (!doc._type) {
    res.status(401).send('must have a type')
  } else {
    doc._canRead = doc._canRead || req.users;
    doc._canSetReadPermission = doc._canSetReadPermission || req.users;
    doc._canUpdate = doc._canUpdate || req.users;
    doc._canSetUpdatePermission = doc._canSetUpdatePermission || req.users;
    doc._canDelete = doc._canDelete || req.users;
    doc._canSetDeletePermission = doc._canSetDeletePermission || req.users;
    document.findOne({'_id': ObjectID(doc._type)}, (err, typeDoc) => {
      //console.log(err);
      //console.log(typeDoc);
      let schema = cleanseDocument(typeDoc);
      delete schema._id;
      delete schema._type;
      const validation = v.validate(cleanseDocument(doc), schema);
      if (!validation.valid) {
        res.status(401).send(validation.errors);
      } else {
        document.insert(doc, (err, status) => {
          if (err) {
            console.log(err);
            res.status(500).send();
          } else {
            res.status(201).send();
          }
        });
      }
    });
  }
});

// Update a document
server.put('/document', (req, res) => {

});

// Delete a document
server.delete('/document', (req, res) => {

});

server.put('/document/cansetreadpermission', (req, res) => {

});

server.put('/document/cansetupdatepermission', (req, res) => {

});

server.put('/documents/cansetdeletepermission', (req, res) => {

});

let port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('Application listening on ', port);
});
