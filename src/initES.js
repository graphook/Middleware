
import request from 'superagent';
import {type_type, set_type, type_set, set_set} from 'defaultObjects';
import typeToElasticMapping from 'stages/base/typeToElasticMapping.stage';

// ES
export default function() {
  const scope = {};
  return request.get(process.env.ES_URL + '/object')
  .then((result) => console.info("OBJECT index already exists"))
  .catch((err) => {
    console.info("OBJECT index does not exist. Creating it.")
    return request.put(process.env.ES_URL + '/object')
      .send({
        settings: {
          "index.mapper.dynamic": false
        }
      })
  })
  // Create the type_type
  .then(() => typeToElasticMapping(scope, type_type, [], 'type_type'))
  .then(() => delete scope.type_type.properties._type)
  .then(() => request.put(process.env.ES_URL + '/object/_mapping/type_type').send({ type_type: scope.type_type}))
  .then((result) => console.info("Successfully added the type map"))
  .catch((err) => console.info(err))
  .then(() => Object.assign(type_type, {
    _permissions: {
      owner: 'zenow',
      read: ['all']
    },
    _sets: [ 'type_set' ]
  }))
  .then(() => request.put(process.env.ES_URL + '/object/type_type/type_type').send(type_type))
  .then((result) => console.info("Successfully added the type object"))
  .catch((err) => console.info(err))
  // Create the set_type
  .then(() => typeToElasticMapping(scope, set_type, [], 'set_type'))
  .then(() => delete scope.set_type.properties._type)
  .then(() => request.put(process.env.ES_URL + '/object/_mapping/set_type').send({ set_type: scope.set_type}))
  .then((result) => console.info("Successfully added the set type map"))
  .catch((err) => console.info(err))
  .then(() => Object.assign(set_type, {
    _permissions: {
      owner: 'zenow',
      read: ['all']
    },
    _sets: [ 'type_set' ]
  }))
  .then(() => request.put(process.env.ES_URL + '/object/type_type/set_type').send(set_type))
  .then((result) => console.info("Successfully added the set type object"))
  .catch((err) => console.info(err))
  // Create the type_set
  .then(() => request.put(process.env.ES_URL + '/object/set_type/type_set').send(type_set))
  .then((result) => console.info("Successfully added the type set object"))
  .catch((err) => console.info(err))
  // Create the set_set
  .then(() => request.put(process.env.ES_URL + '/object/set_type/set_set').send(set_set))
  .then((result) => console.info("Successfully added the set set object"))
  .catch((err) => { console.info(err); })
}
