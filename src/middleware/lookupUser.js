import {db} from '../mongo'

export default function(req, res, next) {
  const apiKey = req.query.apikey
  const token = req.get('Authorization')
  if (apiKey) {
    db.user.findOne({ key: apiKey }, (err, user) => {
      if (err) { res.status(500).send(err); }
      else {
        req.user = user;
        req.user._id = req.user._id.toString();
        req.user.accessMethod = 'apikey';
        next();
      }
    });
  } else if (token && token === process.env.CLIENT_SECRET) {
    req.user = {
      accessMethod: 'client'
    }
    next();
  } else if (token) {
    db.user.findOne({ tokens: token }, (err, user) => {
      if (err) { res.status(500).send(err); }
      else if (user) {
        req.user = user;
        req.user._id = req.user._id.toString();
        req.user.accessMethod = 'token';
        next();
      } else {
        next()
      }
    });
  } else {
    next();
  }
}
