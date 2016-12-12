import {db} from '../../mongo'
import {ObjectId} from 'mongodb'

module.exports = function(req, res, next) {
  // pass the search query to a find function
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    let query = req.body || {};
    query._sets = ObjectId(req.params.id);
    db.item.find(query).toArray((err, result) => {
      if (err) { next(err) }
      else {
        res.send(result)
      }
    });
  }
}
