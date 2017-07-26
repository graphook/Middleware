import {familySet, familySetId} from './sampleData';
import request from 'superagent';
import Promise from 'bluebird';
import typeToElasticMapping from 'stages/base/typeToElasticMapping.stage';


export default function(done) {
  const scope = {};
  Promise.try(() => request.put(process.env.ES_URL + '/object/set_type/' + familySetId).send(familySet))
  .then((result) => console.info("Added the familySet object"))
  .then(() => done())
  .catch((err) => { console.info(err); done(); })
}
