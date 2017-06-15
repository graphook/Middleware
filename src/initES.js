
import request from 'superagent';
import {type, set} from 'schemas';
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
// Create the type_type
.then(() => typeToElasticMapping(scope, type, [], 'type_type'))
.then(() => delete scope.type_type.properties._type)
.then(() => request.put(process.env.ES_URL + '/object/_mapping/type_type').send({ type_type: scope.type_type}))
.then((result) => console.log("Successfully added the type map"))
.catch((err) => console.log(err))
.then(() => Object.assign(type, {
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: [ 'type_set' ]
}))
.then(() => request.put(process.env.ES_URL + '/object/type_type/type_type').send(type))
.then((result) => console.log("Successfully added the type object"))
.catch((err) => console.log(err))
// Create the set_type
.then(() => typeToElasticMapping(scope, set, [], 'set_type'))
.then(() => delete scope.set_type.properties._type)
.then(() => request.put(process.env.ES_URL + '/object/_mapping/set_type').send({ set_type: scope.set_type}))
.then((result) => console.log("Successfully added the set type map"))
.catch((err) => console.log(err))
.then(() => Object.assign(set, {
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: [ 'type_set' ]
}))
.then(() => request.put(process.env.ES_URL + '/object/type_type/set_type').send(type))
.then((result) => console.log("Successfully added the set type object"))
.catch((err) => console.log(err))
// Create the type_set
.then(() => request.put(process.env.ES_URL + '/object/set_type/type_set').send({
  title: "Zenow Types",
  description: "All types indexed by the database and officially searchable by the zenow ui",
  tags: ["zenow", "type", "meta"],
  type: {
    _id: "set_type",
    title: "set"
  },
  creator: {
    _id: 'zenow',
    username: 'zenow'
  },
  stars: 0,
  numberOfItems: 2,
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: ['set_set']
}))
.then((result) => console.log("Successfully added the type set object"))
.catch((err) => console.log(err))
// Create the set_set
.then(() => request.put(process.env.ES_URL + '/object/set_type/set_set').send({
  title: "Zenow Sets",
  description: "All sets officially searchable by the zenow ui.",
  tags: ["zenow", "set", "meta"],
  type: {
    _id: "set_set",
    title: "set"
  },
  creator: {
    _id: 'zenow',
    username: 'zenow'
  },
  stars: 0,
  numberOfItems: 2,
  _permissions: {
    owner: 'zenow',
    read: ['all']
  },
  _sets: ['set_set']
}))
.then((result) => console.log("Successfully added the set set object"))
.catch((err) => console.log(err))
