import {db} from '../../../mongo'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function(req, res, errors, next) {
  db.user.find({ $or: [{ email: body.email }, { username: body.username }] }).toArray((err, matchingUsers) => {
    if (err) { next(err) }
    else if (matchingUsers.length > 0) {
      matchingUsers.forEach((user) => {
        if (user.username === body.username) {
          errors['body.username'] = 'username already used';
        }
        if (user.email === body.email) {
          errors['body.password'] = 'email already used';
        }
      });
    }
    next();
  })
}
