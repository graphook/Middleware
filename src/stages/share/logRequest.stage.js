import {db} from 'mongo';

export default function(scope) {
  // This is not returned on purpose. There's no reason to
  // wait for something to log before proceeding
  db.request.insert({
    body: scope.req.body,
    path: scope.req.path,
    method: scope.req.method,
    user: scope.user
  });
}
