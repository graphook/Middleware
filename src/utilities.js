export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

export const cloneAssign = (obj, assignment = {}, keysToDelete = []) => {
  let cloned = clone(obj);
  keysToDelete.forEach((key) => {
    delete cloned[key];
  });
  return Object.assign(cloned, assignment);
}
