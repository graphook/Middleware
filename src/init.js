import {startMongo, db} from './mongo'
import async from 'async'


startMongo(() => {
  async.parallel([
    (cb) => {
      db.set.createIndex({
        title: 'text',
        description: 'text',
        tags: 'text'
      }, cb);
    }, (cb) => {
      db.type.createIndex({
        title: 'text',
        description: 'text',
        tags: 'text'
      }, cb);
    }, (cb) => {
      db.item.createIndex({
        tags: 'text'
      }, cb);
    }
  ], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log('success');
    }
    process.exit();
  });
});
