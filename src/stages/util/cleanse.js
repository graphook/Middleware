
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
  if (info) {
    info.read = info.read.map(cleansers[type]);
    info.created = info.created.map(cleansers[type]);
    info.updated = info.updated.map(cleansers[type]);
    info.deleted = info.deleted.map(cleansers[type]);
  }
  return info;
}
