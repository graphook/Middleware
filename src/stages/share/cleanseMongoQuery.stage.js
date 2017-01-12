import {ObjectId} from 'mongodb';

const validateObjectId = (id) => {
  return (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).test(id)
}

const objectIdFormat = (obj) => {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      newObj[key] = objectIdFormat(obj[key]);
    });
    return newObj
  } else if (typeof obj === 'object' && Array.isArray(obj)) {
    let newArr = [];
    obj.forEach((arrObj, index) => {
      newArr[index] = objectIdFormat(arrObj);
    });
    return newArr;
  } else if (validateObjectId(obj)) {
    return ObjectId(obj);
  } else {
    return obj;
  }
}

export default function cleanseMongoQuery(obj) {
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      if (key === '_id') {
        newObj[key] = objectIdFormat(obj[key]);
      } else {
        newObj[key] = cleanseMongoQuery(obj[key]);
      }
    });
    return newObj
  } else if (typeof obj === 'object' && Array.isArray(obj)) {
    let newArr = [];
    obj.forEach((arrObj, index) => {
      newArr[index] = cleanseMongoQuery(arrObj);
    });
    return newArr;
  } else {
    return obj;
  }
}
