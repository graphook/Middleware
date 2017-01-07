
const cleansers = {
  users: (user) => {
    delete user.password;
    delete user.tokens;
    return user;
  },
  types: (type) => {
    return type;
  },
  sets: (set) => {
    return set;
  },
  items: (item) => {
    return item;
  }
}

export default function cleanse(type, info) {
  const result = {};
  if (info.read.length > 0) result.read = info.read.map(cleansers[type]);
  if (info.created.length > 0) result.created = info.created.map(cleansers[type]);
  if (info.updated.length > 0) result.updated = info.updated.map(cleansers[type]);
  if (info.deleted.length > 0) result.deleted = info.deleted.map(cleansers[type]);
  if (Object.keys(result).length > 0) return result;
}
