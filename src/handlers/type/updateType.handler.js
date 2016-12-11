import {db} from '../../mongo'
import {ObjectID} from 'mongodb'

module.exports = function(req, res, next) {
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    let update = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags
    }
    db.type.update({ '_id': ObjectID(req.params.id) }, {
      $set: update
    }, (err, result) => {
      if (err) { next(err) }
      else {
        res.status(200).send(result);
      }
    })
  }
}
