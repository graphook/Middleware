
import request from 'superagent';
import {type} from 'schemas';

// ES
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
.then(() => request.put(process.env.ES_URL + '/object/_mapping/type_type')
  .send({
    "type_type": {
      "dynamic": "false",
      "properties": {
        "title" : {
          "type" : "text"
        },
        "description": {
          "type": "keyword"
        },
        "tags": {
          "type": "text"
        }
      }
    }
  })
)
.then((result) => console.log("Successfully added the type map"))
.catch((err) => console.log(err))
.then(() => request.post(process.env.ES_URL + '/object/type_type').send(type))
.then((result) => console.log("Successfully added the type object"))
.catch((err) => console.log(err));
