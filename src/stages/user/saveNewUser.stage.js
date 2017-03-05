import Promise from 'bluebird';
import {db} from 'mongo';
import bcyrpt from 'bcrypt-nodejs';
import uuid from 'node-uuid';

export default function(body, scope) {
  const userKey = uuid.v4();
  return db.user.insert({
    username: body.username,
    email: body.email,
    password: bcyrpt.hashSync(body.password),
    key: userKey,
    tokens: [],
    stars: []
  }).then((result) => {
    scope.users.created = scope.users.created.concat(result.ops);
    scope.status = 201;
  }).catch((err) => {
    throw err;
  });
}
