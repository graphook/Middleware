import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import checkIfObjectAllowsUser from 'stages/share/checkifObjectAllowsUser.stage'

/*
{
  saveToResponse: true if the result of this should be saved to the result
}
*/
export default function createObject(scope, id, path, saveTo, options = {}) {
  return Promise.try(() => request.get(process.env.ES_URL + '/object/_search').send({
      query: {
        terms: {
          _id: [id]
        }
      }
    }))
    .then((result) => scope[saveTo] = Object.assign(result.body.hits.hits[0]._source, {
      _type: result.body.hits.hits[0]._type,
      _id: result.body.hits.hits[0]._id
    }))
    .then(() => checkIfObjectAllowsUser(scope, 'read', scope[saveTo], ['object']))
    .then(() => throwErrorIfNeeded(scope.errors))
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
