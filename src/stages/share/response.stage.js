import cleanse from '../util/cleanse';

export default function(scope) {
  scope.status = scope.status || 200;
  scope.res.status(scope.status).send(Object.assign(cleanse(scope), {
    status: scope.status
  }));
}
