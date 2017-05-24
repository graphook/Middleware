
const cleansers = {
  read: (object) => {
    delete object._permissions;
    return object;
  },
  created: (object) => {
    delete object._permissions;
    return object;
  },
  updated: (object) => {
    delete object._permissions;
    return object;
  },
  deleted: (object) => {
    delete object._permissions;
    return object;
  }
}

export default function cleanse(info) {
  const result = {};
  Object.keys(cleansers).forEach((action) => {
    const typeKeys = Object.keys(info[action]);
    if (typeKeys.length > 0) {
      result[action] = {};
      typeKeys.forEach((typeKey) => {
        result[action][typeKey] = info[action][typeKey].map((object) => cleansers[action](object))
      })
    }
  });
  return result;
}
