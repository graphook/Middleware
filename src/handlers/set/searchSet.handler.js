import {db} from '../../mongo'
import {ObjectId} from 'mongodb'

const objectIdRegex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
const objectIdFormat = (obj) => {
  if (typeof obj === 'object' && Array.isArray(obj)) {
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
  } else if (objectIdRegex.text()) {
    return ObjectId(obj);
  } else {
    return obj;
  }
}

const recursiveCleanse = (obj) => {
  if (typeof obj === 'object' && Array.isArray(obj)) {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      if (key === '_id') {
        newObj[key] = objectIdFormat(obj[key]);
      } else {
        newObj[key] = recursiveCleanse(obj[key]);
      }
    });
    return newObj
  } else if (typeof obj === 'object' && Array.isArray(obj)) {
    let newArr = [];
    obj.forEach((arrObj, index) => {
      newArr[index] = recursiveCleanse(arrObj);
    });
    return newArr;
  } else {
    return obj;
  }
}

module.exports = function(req, res, next) {
  // pass the search query to a find function
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    try {
      let query = recursiveCleanse(req.body || {});
    } catch(e) {
      next({
        user: true,
        status: 400,
        message: e
      });
    }

    query._sets = req.params.id;
    db.item.find(query).toArray((err, result) => {
      if (err) { next(err) }
      else {
        res.send(result)
      }
    });
  }
}
