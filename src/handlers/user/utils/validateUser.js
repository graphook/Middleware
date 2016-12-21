import {db} from '../../../mongo'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function(req, res, next) {
  let body = req.body;
  if (!body.username || !body.email || !body.password) {
    next({
      user: true,
      status: 400,
      message: {
        username: (!body.username) ? 'required' : undefined,
        email: (!body.email) ? 'required' : undefined,
        password: (!body.password) ? 'required' : undefined
      }
    });
  } else if (!emailRegex.test(body.email)) {
    next({
      user: true,
      status: 400,
      message: {
        email: 'invalid email'
      }
    });
  } else {
    db.user.find({ $or: [{ email: body.email }, { username: body.username }] }).toArray((err, matchingUsers) => {
      if (err) { next(err) }
      else if (matchingUsers.length > 0) {
        let toSendError = {
          user: true,
          status: 409,
          message: {}
        };
        matchingUsers.forEach((user) => {
          if (user.username === body.username) {
            toSendError.message.username = 'username already used';
          }
          if (user.email === body.email) {
            toSendError.message.email = 'email already used';
          }
        });
        next(toSendError)
      } else {
        next()
      }
    })
  }
}
