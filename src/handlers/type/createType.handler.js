import {db} from '../../mongo'
import validateType from '../../validators/type.validator.js'

module.exports = function(req, res, next) {
  let type = req.body;
  type.type = 'object';
  type.numUses = 0;
  type.uses = [];
  delete type.uses;
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else if (!validateType(type)) {
    next({
      user: true,
      status: 400,
      message: "The provided format is invalid."
    });
  } else {
    db.type.insert(type, (err, inserted) => {
      if (err) { next(err) }
      else {
        res.status(201).send(inserted)
      }
    });
  }
}
