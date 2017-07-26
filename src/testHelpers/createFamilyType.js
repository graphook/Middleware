import {familyType, familyTypeId} from './sampleData';
import request from 'superagent';
import Promise from 'bluebird';
import typeToElasticMapping from 'stages/base/typeToElasticMapping.stage';
import {type_type} from 'defaultObjects';


export default function(done) {
  const scope = {};

  Promise.try(() => typeToElasticMapping(scope, familyType, [], 'familyType'))
    .then(() => delete scope.familyType.properties._type)
    .then(() => {
      scope.typePayload = {};
      scope.typePayload[familyTypeId] = scope.familyType;
    })
    .then(() => request.put(process.env.ES_URL + '/object/_mapping/' + familyTypeId).send(scope.typePayload))
    .catch((err) => console.info(err))
    .then(() => Object.assign(familyType, {
      _permissions: {
        owner: 'zenow',
        read: ['all']
      },
      _sets: [ 'type_set' ]
    }))
    .then(() => request.put(process.env.ES_URL + '/object/type_type/' + familyTypeId).send(familyType).then(() => console.info('Added familyType')))
    .then(() => { done() })
    .catch((err) => console.info(err))
}
