import {db} from '../../mongo';
import bcyrpt from 'bcrypt-nodejs';
import uuid from 'node-uuid';
import validateUser from './utils/validateUser';
import validateRequest from '../../validators/item.validator.js';

const requestBodyType = {
  title: "Create User Request",
  description: "The request body of a request to create a user in Zenow v1.",
  properties: {
    username: {
      required: true,
      type: "string",
      description: "The name of the user. This will be public on Zenow. Usernames must consist of letters, numbers, -, or _ and be between 3 and 30 characters in length.",
      regex: "^[a-zA-Z0-9\\-_]{3,30}$"
    },
    email: {
      required: true,
      type: "string",
      description: "The user's email",
      regex: "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,4}$"
    },
    password: {
      required: true,
      type: "string",
      description: "The user's password. Passwords must consist of letters, numbers, or one of these symbols: $-/:-?{-~!\"^_`[]",
      regex: "^[a-zA-Z0-9$-/:-?{-~!\"^_`\\[\\]]"
    }
  }
}

module.exports = function(req, res, next) {
  const body = req.body;
  const errors = [];
  validateRequest(body, requestBodyType, errors, ['body']);
  validateUser(req, res, errors, () => {
    if (errors) {
      next(errors);
    } else {
      const userKey = uuid.v4();
      db.user.insert({
        username: body.username,
        email: body.email,
        password: bcyrpt.hashSync(body.password),
        key: userKey,
        tokens: [],
        stars: []
      }, (err) => {
        if (err) { next(err) }
        else {
          res.status(201).send({
            username: body.username,
            email: body.email,
            key: userKey
          });
        }
      });
    }
  })
}
