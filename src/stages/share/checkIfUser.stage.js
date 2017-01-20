import Promise from 'bluebird';
import {db} from 'mongo';

export default function(scope) {
  const apiKey = scope.req.query.apikey || scope.req.get('apikey');
  const token = scope.req.get('Authorization');
  if (apiKey) {
    return db.user.findOne({ key: apiKey }).then((user) => {
      if (!user) {
        scope.errors.auth = apiKey + ' is not a valid api key.';
        throw scope;
      }
      scope.user = user;
      scope.user._id = scope.user._id.toString();
      scope.user.accessMethod = 'apikey';
      delete scope.req.query.apikey;
    }).catch((err) => {
      throw err;
    });
  } else if (token && token === process.env.CLIENT_SECRET) {
    scope.status = 401;
    scope.errors.auth = 'Must log in to the website.'
    throw scope;
  } else if (token) {
    return db.user.findOne({ tokens: token }).then((user) => {
      if (!user) {
        scope.errors.auth = token + ' is not a valid token.';
        throw scope;
      }
      scope.user = user;
      scope.user._id = scope.user._id.toString();
      scope.user.accessMethod = 'token';
    }).catch((err) => {
      throw err;
    });
  } else {
    scope.status = 401;
    scope.errors.auth = 'Must provide an apikey, or access via the website.'
    throw scope;
  }
}
