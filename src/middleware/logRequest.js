import {db} from '../mongo'

export default function(req, res, next) {
  db.request.insert({
    body: req.body,
    path: req.path,
    method: req.method,
    user: req.user
  });
  next();
}
