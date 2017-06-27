import initES from 'initES';
import request from 'superagent';
import Promise from 'bluebird';

export default function(done) {
  Promise.try(() => request.delete(process.env.ES_URL + '/object'))
    .catch((err) => { /*ignore*/ })
    .then(() => initES())
    .then(() => done())
    .catch((err) => { throw err; })
}
