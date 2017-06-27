import {startMongo, db} from './mongo'
import async from 'async'

export default function() {
  startMongo(() => {
    // Mongo
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
        console.info(err);
      } else {
        console.info('success');
      }
      process.exit();
    });
  });
}
