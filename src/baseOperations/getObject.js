import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';

/*
{
  saveToResponse: true if the result of this should be saved to the result
}
*/
export default function createObject(scope, typeName, id, path, saveTo, options = {}) {
  return Promise.try(() => request.get(process.env.ES_URL + '/object/' + typeName + '/' + id))
    .then((result) => scope[saveTo] = Object.assign(result.body._source, {
      _type: result.body._type,
      _id: result.body._id
    }))
    .then(() => {
      if (options.saveToResponse) {
        scope.addItem('read', scope[saveTo]);
      }
    })
    .catch((err) => {
      if (err.status === 404) {
        scope.errors[path.join('.')] = "Resource does not exist.";
        scope.status = 404;
      } else {
        throw err
      }
    })
}
