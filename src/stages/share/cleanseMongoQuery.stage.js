import {ObjectId} from 'mongodb';

const validateObjectId = (id) => {
  return (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).test(id)
}

const objectIdFormat = (obj) => {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    Object.keys(obj).forEach((key) => {
      obj[key] = objectIdFormat(obj[key]);
    });
    return obj
  } else if (typeof obj === 'object' && Array.isArray(obj)) {
    obj.forEach((arrObj, index) => {
      obj[index] = objectIdFormat(arrObj);
    });
    return obj;
  } else if (validateObjectId(obj)) {
    return ObjectId(obj);
  } else {
    return obj;
  }
}

export default function cleanseMongoQuery(obj) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    Object.keys(obj).forEach((key) => {
      if (key === '_id') {
        obj[key] = objectIdFormat(obj[key]);
      } else {
        obj[key] = cleanseMongoQuery(obj[key]);
      }
    });
    return obj;
  } else if (typeof obj === 'object' && Array.isArray(obj)) {
    obj.forEach((arrObj, index) => {
      obj[index] = cleanseMongoQuery(arrObj);
    });
    return obj;
  } else {
    return obj;
  }
}
