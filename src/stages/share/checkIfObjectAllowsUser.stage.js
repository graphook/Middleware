
export default function(scope, action, object, path) {
  if (scope.user._id === object._permissions.owner ||
      object._permissions[action].includes(scope.user._id) ||
      object._permissions[action].includes('all')) {
    return;
  }
  scope.errors[path.join('.')] = "You do not have permission to access this object."
  scope.status = 401;
}
