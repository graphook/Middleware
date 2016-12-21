import {db} from '../../../mongo'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function(req, res, next) {
  let body = req.body;
  let errMessage = {};
  let errored = false;
  if (!body.username || !body.email || !body.password) {
    errored = true;
    errMessage.username = (!body.username) ? 'required' : undefined,
    errMessage.email = (!body.email) ? 'required' : undefined,
    errMessage.password = (!body.password) ? 'required' : undefined
  } else if (!emailRegex.test(body.email)) {
    errored = true;
    errMessage.email = 'invalid email'
  }
  db.user.find({ $or: [{ email: body.email }, { username: body.username }] }).toArray((err, matchingUsers) => {
    if (err) { next(err) }
    else if (matchingUsers.length > 0) {
      errored = true;
      matchingUsers.forEach((user) => {
        if (user.username === body.username) {
          errMessage.username = 'username already used';
        }
        if (user.email === body.email) {
          errMessage.email = 'email already used';
        }
      });
    }
    if (errored) {
      next({
        status: 400,
        user: true,
        message: errMessage
      });
    } else {
      next();
    }
  })
}
