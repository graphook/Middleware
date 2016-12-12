import {db} from '../../mongo'
import createItems from './util/createItems'
import {ObjectId} from 'mongodb'

module.exports = function(req, res, next) {
  let items = req.body;
  let setId = req.params.id;
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    db.type.findOne({ uses: ObjectId(req.params.id) }, (err, result) => {
      const type = result;
      if (err) { next(err) }
      else {
        createItems(setId, type, items, (err, result) => {
          if (err) { next(err) }
          else {
            res.status(201).send(result)
          }
        })
      }
    });
  }
}
