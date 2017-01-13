
const cleansers = {
  users: (user) => {
    // REMEMBER TO UPDATE THE CLEANSE IN getToken.stage.js
    delete user.password;
    delete user.tokens;
    return user;
  },
  types: (type) => {
    delete type._access;
    return type;
  },
  sets: (set) => {
    delete set._access;
    return set;
  },
  items: (item) => {
    delete item._access;
    return item;
  }
}

export default function cleanse(type, info) {
  const result = {};
  if (info.read.length > 0) result.read = info.read.filter(elem => elem != null).map(cleansers[type]);
  if (info.created.length > 0) result.created = info.created.filter(elem => elem != null).map(cleansers[type]);
  if (info.updated.length > 0) result.updated = info.updated.filter(elem => elem != null).map(cleansers[type]);
  if (info.deleted.length > 0) result.deleted = info.deleted.filter(elem => elem != null).map(cleansers[type]);
  if (Object.keys(result).length > 0) return result;
}
