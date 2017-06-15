import {db} from 'mongo';

export default function(scope) {
  scope.auth.user = scope.user;
}
