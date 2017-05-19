import Promise from 'bluebird';
import request from 'superagent';
import validateTypeProperties from 'stages/base/validateTypeProperties.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import typeToElasticMapping from 'stages/base/typeToElasticMapping.stage';
import createObject from './createObject';
import {type} from 'schemas';

export default function createType(scope, newType, path) {
  return Promise.try(() => validateTypeProperties(newType.properties, scope.errors, path.concat(['properties'])))
    .then(() => typeToElasticMapping(scope, newType, path, 'esMapping'))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => createObject(scope, newType, path, 'createResponse', Object.assign(type, {_type: 'type_type'}), true))
    .then(() => {
      let mappingToSend = {};
      mappingToSend[scope.createResponse._id] = scope.esMapping
      return request.put(process.env.ES_URL + '/object/_mapping/' + scope.createResponse._id).send(mappingToSend);
    })
    .catch((err) => { console.log(err); throw err })
}
