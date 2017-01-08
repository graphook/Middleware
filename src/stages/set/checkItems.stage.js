import validateSchema from '../share/validateSchema.stage'
import {ObjectId} from 'mongodb';
import {db} from '../../mongo';

export default function(scope, items, type, typeId, path) {
  if (items) {
    const idItems = [];
    const idItemIndexes = {};
    items.forEach((item, index) => {
      if (typeof item === 'object') {
        validateSchema(item, type, scope.errors, path.concat(index));
      } else if (typeof item === 'string' && (/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).test(item)) {
        idItems.push(item);
        idItemIndexes[item] = index;
      }
    });
    return db.item.find({
      '_id': { $in: idItems.map(id => ObjectId(id)) },
      '_type': typeId
    }).toArray().then((result) => {
      scope.items.read = scope.items.read.concat(result);
      const resultIds = new Set(result.map(item => item._id.toString()));
      const failedIds = idItems.filter(x => !resultIds.has(x));
      failedIds.forEach((failedId) => {
        scope.errors[path.concat(idItemIndexes[failedId]).join('.')] = 'Item with the id ' + failedId + ' is not of type ' + typeId
      });
    })
  }
}
