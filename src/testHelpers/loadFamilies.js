import {families, familyIds, familyTypeId, familySetId} from './sampleData';
import Promise from 'bluebird';
import request from 'superagent';
import {cloneAssign} from 'utilities';

export default function(done) {
  const scope = {};
  const promises = [];
  families.forEach((family, index) => {
    promises.push(Promise.try(() => {
      return request.post(process.env.ES_URL + '/object/' + familyTypeId + '/' + familyIds[index])
        .send(cloneAssign(family, {
          _permissions: {
            owner: 'zenow',
            read: ['all']
          },
          _sets: [familySetId]
        }))
      })
      .then((result) => console.info("Added family " + index))
      .catch((err) => { console.info(err); }));
  });

  Promise.all(promises).then(() => { console.log('Added Families'); done(); });
};