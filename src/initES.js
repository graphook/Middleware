
import request from 'superagent';
import {type} from 'schemas';
import typeToElasticMapping from 'stages/base/typeToElasticMapping.stage';

// ES
const scope = {};
request.get(process.env.ES_URL + '/object')
.then((result) => console.log("OBJECT index already exists"))
.catch((err) => {
  console.log("OBJECT index does not exist. Creating it.")
  return request.put(process.env.ES_URL + '/object')
    .send({
      settings: {
        "index.mapper.dynamic": false
      }
    })
})
.then(() => typeToElasticMapping(scope, type, [], 'type_type'))
.then(() => delete scope.type_type.properties._type)
.then(() => request.put(process.env.ES_URL + '/object/_mapping/type_type').send({ type_type: scope.type_type}))
.then((result) => console.log("Successfully added the type map"))
.catch((err) => console.log(err))
.then(() => type._permissions = {
  owner: 'zenow',
  read: ['all']
})
.then(() => request.post(process.env.ES_URL + '/object/type_type').send(type))
.then((result) => console.log("Successfully added the type object"))
.catch((err) => console.log(err));
