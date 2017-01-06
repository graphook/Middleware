import {db} from '../../mongo'
import validateObjectId from '../../validators/objectId.validator';
import cleanseMongoQuery from './util/cleanseMongoQuery';

module.exports = function(req, res, next) {
  // pass the search query to a find function
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    try {
      let query = cleanseMongoQuery(req.body || {});
      const count = parseInt(req.query.count) || 10;
      const page = parseInt(req.query.page) || 0;
      db.set.find(query).skip(count * page).limit(count).toArray((err, result) => {
        if (err) { next(err) }
        else {
          res.send(result)
        }
      });
    } catch(e) {
      next({
        user: true,
        status: 400,
        message: 'Error: ' + e
      });
    }
  }
}
