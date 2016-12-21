import {db} from '../../mongo';
import bcyrpt from 'bcrypt-nodejs';
import uuid from 'node-uuid';
import validateUser from './utils/validateUser';

module.exports = function(req, res, next) {
  const body = req.body;
  validateUser(req, res, (err) => {
    if (err) {
      next(err);
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
