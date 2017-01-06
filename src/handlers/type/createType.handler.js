import {db} from '../../mongo';
import validateItem from '../../validators/item.validator.js';
import validateType from '../../validators/type.validator.js';

const requestBodyType = {
  title: "Create Type Request",
  description: "The request body of a request to create a type in Zenow v1.",
  properties: {
    title: {
      required: true,
      type: "string",
      description: "The title of the type."
    },
    description: {
      required: false,
      type: "string",
      default: ""
    },
    properties: {
      required: true,
      type: "object",
      properties: {},
      allowOtherProperties: true
    },
    tags: {
      required: false,
      type: "array",
      default: [],
    }
  }
}

module.exports = function(req, res, next) {
  let type = req.body;
  type.type = 'object';
  type.numUses = 0;
  delete type.uses;
  type.uses = [];
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
