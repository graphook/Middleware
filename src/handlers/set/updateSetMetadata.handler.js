import {db} from '../../mongo'
import {ObjectId} from 'mongodb'

module.exports = function(req, res, next) {
  // Only able to update title, description, and tags
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    let update = {}
    if (req.body.title) update.title = req.body.title
    if (req.body.description) update.description = req.body.description
    if (req.body.tags) update.tags = req.body.tags
    if (req.body.icon) update.icon = req.body.icon
    db.set.update({ _id: ObjectId(req.params.id) }, {
      $set: update
    }, (err, result) => {
      if (err) { next(err) }
      else {
        res.send(result)
      }
    })
  }
}
