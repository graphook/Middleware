import {db} from '../../mongo';
import {ObjectId} from 'mongodb';

export default function(scope, id) {
  return db.type.findOne({ '_id': ObjectId(id) }).then((result) => {
    if (!result) {
      scope.errors['params.id'] = 'the id ' + id + ' does not correspond with a type.';
    } else if (result.numUses > 0) {
      scope.errors['type'] = 'Cannot delete a type with sets that use it. Delete sets first.'
    }
  }).catch((err) => {
    throw err;
  });
}
