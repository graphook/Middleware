import {MongoClient} from 'mongodb';
import {promisifyAll} from 'bluebird';

export let db = {};

export function startMongo(cb) {
  let uriString = uriString = 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS +
      '@' + process.env.MONGO_URL + '/' + process.env.MONGO_DB;
  if (!process.env.MONGO_USER || !process.env.MONGO_PASS) {
    uriString = 'mongodb://' + process.env.MONGO_URL + '/' + process.env.MONGO_DB;
  }

  // Use connect method to connect to the Server
  MongoClient.connect(uriString, (err, database) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected correctly to mongo");
      db.connection = database;
      db.user = promisifyAll(database.collection('user'));
      db.set = promisifyAll(database.collection('set'));
      db.item = promisifyAll(database.collection('item'));
      db.type = promisifyAll(database.collection('type'));
      db.request = promisifyAll(database.collection('request'));
    }
    if (cb) { cb() };
  });
}
