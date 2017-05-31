/* options:
{
  avoidErrors: true if you don't want this to add errors, and it should just return false
}
*/

export default function(scope, action, object, path, options = {}) {
  if (scope.user._id === object._permissions.owner ||
      object._permissions[action].includes(scope.user._id) ||
      object._permissions[action].includes('all')) {
    return true;
  }
  if (!avoidErrors) {
    scope.errors[path.join('.')] = "You do not have permission to access this object."
    scope.status = 401;
  }
  return false;
}
