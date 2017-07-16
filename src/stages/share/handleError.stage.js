import Promise from 'bluebird';
import {db} from 'mongo';
import cleanse from '../util/cleanse';

export default function(err, scope) {
  if (err instanceof Error) {
    if (process.env.prod) {
      db.error.insert({
        scope: scope,
        stack: err.stack,
        time: new Date()
      })
    }
    scope.status = 500;
    scope.errors.server = 'Server error. Please contact me at jaxoncreed@gmail.com with details regarding how this error occurs.'
    if (process.env.ENV !== 'prod') {
      console.error(err.stack);
      scope.errors.server = err.stack;
    }
  }
  scope.status = scope.status || 400;
  scope.res.status(scope.status).send(Object.assign(cleanse(scope), {
    status: scope.status,
    errors: scope.errors
  }));
}
