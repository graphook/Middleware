import {db} from '../../mongo'

module.exports = function(req, res, next) {
  let user = req.user;
  delete user.tokens;
  delete user.accessMethod;
  delete user.password;
  res.send(user);
}
