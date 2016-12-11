import {MongoClient} from 'mongodb';

export let db = {};

export function startMongo(cb) {
  const uriString = 'mongodb://' + process.env.MONGO_URL + '/' + process.env.MONGO_DB;

  // Use connect method to connect to the Server
  MongoClient.connect(uriString, (err, database) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected correctly to mogno");
      db.connection = database;
      db.user = database.collection('user');
      db.set = database.collection('set');
      db.item = database.collection('item');
      db.type = database.collection('type');
      db.request = database.collection('request');
    }
    if (cb) { cb() };
  });
}
