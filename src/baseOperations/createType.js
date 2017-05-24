import Promise from 'bluebird';
import request from 'superagent';
import validateSchema from 'stages/share/validateSchema.stage';
import validateTypeProperties from 'stages/base/validateTypeProperties.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import typeToElasticMapping from 'stages/base/typeToElasticMapping.stage';
import createObject from './createObject';
import {type} from 'schemas';

/*
{
  // none
}
*/
export default function createType(scope, newType, path, options = {}) {
  return Promise.try(() => validateSchema(newType, type.properties, scope.errors, path))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => validateTypeProperties(newType.properties, scope.errors, path.concat(['properties'])))
    .then(() => typeToElasticMapping(scope, newType, path, 'esMapping'))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => createObject(scope, newType, path, 'createResponse', {
      type: Object.assign(type, {_type: 'type_type', _id: 'type_type'}),
      isTypeValidationDone: true,
      saveToResponse: true
    }))
    .then(() => {
      let mappingToSend = {};
      mappingToSend[scope.createResponse._id] = scope.esMapping
      return request.put(process.env.ES_URL + '/object/_mapping/' + scope.createResponse._id).send(mappingToSend);
    })
    .catch((err) => { console.log(err); throw err })
}
