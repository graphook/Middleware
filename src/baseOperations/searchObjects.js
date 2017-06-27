import Promise from 'bluebird';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import request from 'superagent';
import checkIfObjectAllowsUser from 'stages/share/checkifObjectAllowsUser.stage'

/*
{
  saveToResponse: true if the result of this should be saved to the result
}
*/
//
export default function searchObjects(scope, query, path, saveTo, options = {}) {
  return Promise.try(() => request.post(process.env.ES_URL + '/object/_search').send({
      query: {
        bool: {
          must: query.query,
          filter: [
            {
              nested: {
                path: '_permissions',
                query: {
                  bool: {
                    should: [
                      { term: { '_permissions.owner': scope.user._id } },
                      { term: { '_permissions.read': scope.user._id } },
                      { term: { '_permissions.read': 'all' } }
                    ],
                    "minimum_should_match" : 1
                  }
                }
              }
            }
          ]
        }
      }
    }))
    .then((result) => scope[saveTo] = result.body.hits.hits.map((hit) => {
      return Object.assign(hit._source, {
        _type: hit._type,
        _id: hit._id
      })
    }))
    .then(() => {
      if (options.saveToResponse) {
        scope[saveTo].forEach((object) => {
          scope.addItem('read', object);
        })
      }
    })
    .catch((err) => {
      if (err.response && err.response.body && err.response.body.error && err.response.body.error.reason) {
        scope.errors[path.join('.')] = err.response.body.error.reason;
      } else {
        throw err
      }
    })
}
