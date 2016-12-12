import {db} from '../../mongo'
import bcyrpt from 'bcrypt-nodejs'
import uuid from 'node-uuid'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function(req, res, next) {
  let body = req.body;
  if (!body.username || !body.email || !body.password) {
    console.log('here')
    next({
      user: true,
      status: 400,
      message: 'Request must have a username, email, and password.'
    });
  } else if (!emailRegex.test(body.email)) {
    next({
      user: true,
      status: 400,
      message: body.email + ' is not an acceptable email.'
    });
  } else {
    db.user.find({ $or: [{ email: body.email }, { username: body.username }] }).toArray((err, usersWithEmail) => {
      if (err) { next(err) }
      else if (usersWithEmail.length > 0) {
        next({
          user: true,
          status: 409,
          message: 'The email ' + body.email + ' or the username ' + body.username + ' is already registered.'
        })
      } else {
        const userKey = uuid.v4();
        db.user.insert({
          username: body.username,
          email: body.email,
          password: bcyrpt.hashSync(body.password),
          key: userKey,
          tokens: []
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
}
