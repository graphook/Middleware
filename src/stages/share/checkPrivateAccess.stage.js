
export default function(scope, access, user, collection, id) {
  // TODO: Make this more complicated with the access system
  if (access.isPrivate && user._id !== access.creator) {
    scope.errors['auth'] = "You do not have access to " + collection + ' ' + id;
    scope.status = 403;
    throw scope;
  }
}
