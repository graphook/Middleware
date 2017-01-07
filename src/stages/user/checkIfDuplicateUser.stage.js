import {db} from 'mongo';

export default function(body, errors) {
  return db.user.find({
    $or: [
      { email: body.email },
      { username: body.username }
    ]
  }).toArray().then((matchingUsers) => {
    if (matchingUsers.length > 0) {
      matchingUsers.forEach((user) => {
        if (user.username === body.username) {
          errors['body.username'] = 'username already used';
        }
        if (user.email === body.email) {
          errors['body.password'] = 'email already used';
        }
      });
    }
  }).catch((err) => {
    throw err;
  });
}
