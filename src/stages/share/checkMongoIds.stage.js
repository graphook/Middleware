const idRegex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

export default function(scope, ids) {
  Object.keys(ids).forEach((idKey) => {
    if (!idRegex.test(ids[idKey])) {
      scope.errors[idKey] = ids[idKey] + ' is not a valid id.';
    }
  });
}
