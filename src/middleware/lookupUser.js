import {db} from '../mongo'

export default function(req, res, next) {
  const apiKey = req.query.apikey
  const token = req.get('Authorization')
  if (apiKey) {
    db.user.findOne({ key: apiKey }, (err, user) => {
      if (err) { res.status(500).send(err); }
      else {
        req.user = user;
        req.user.accessMethod = 'apikey';
        console.log(req.user)
        next();
      }
    });
  } else if (token) {
    db.user.findOne({ tokens: token }, (err, user) => {
      if (err) { res.status(500).send(err); }
      else if (user) {
        req.user = user;
        req.user.accessMethod = 'token';
        console.log(req.user)
        next();
      } else {
        next()
      }
    });
  } else {
    next();
  }
}
