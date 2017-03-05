import cleanse from '../util/cleanse';

export default function(scope) {
  scope.status = scope.status || 200;
  scope.res.status(scope.status).send({
    status: scope.status,
    errors: scope.errors,
    auth: scope.auth,
    users: cleanse('users', scope.users),
    types: cleanse('types', scope.types),
    sets: cleanse('sets', scope.sets),
    items: cleanse('items', scope.items)
  });
}
