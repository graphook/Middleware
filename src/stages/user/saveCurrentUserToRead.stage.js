import {db} from 'mongo';

export default function(scope) {
  scope.users.read.push(scope.user);
}
