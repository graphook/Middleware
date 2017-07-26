import chai from 'chai';
import request from 'supertest';
const expect = chai.expect;

/*
given: {
  method:
  path:
  body: {}
}

expected: {
  status:
  body: {}
  objects: {} // similar to the body, but it will cleanse the _id if not provided in expected
  errors: []
}
*/

export default function(app, given, expected, done) {
  let req = request(app);
  req = req[given.method](given.path);
  req = req.set('apikey', process.env.TEST_KEY)
  if (given.body) {
    req = req.send(given.body);
  }
  req.end((err, res) => {
    if (expected.errors) {
      expect(res.body.errors).to.exist;
      expected.errors.sort();
      let errValues = Object.keys(res.body.errors);
      errValues.sort();
      expect(expected.errors).to.deep.equal(errValues);
    }
    if (expected.body) {
      let cleansed = res.body;
      Object.keys(expected.body).forEach((crudKey) => {
        Object.keys(expected.body[crudKey]).forEach((typeKey) => {
          if (cleansed[crudKey] && cleansed[crudKey][typeKey]) {
            cleansed[crudKey][typeKey].forEach((object, index) => {
              if (expected.body[crudKey][typeKey][index] && expected.body[crudKey][typeKey][index]._id === "AUTO_GENERATED_ID") {
                object._id = "AUTO_GENERATED_ID";
              }
            });
          }
        })
      });
      expect(cleansed).to.deep.equal(expected.body)
    }
    if (expected.objects) {
      let cleansed = res.body;
      Object.keys(expected.objects).forEach((crudKey) => {
        Object.keys(expected.objects[crudKey]).forEach((typeKey) => {
          if (!expected.objects[crudKey][typeKey]._id && cleansed[crudKey] && cleansed[crudKey][typeKey]) {
            cleansed[crudKey][typeKey].forEach((object) => {
              delete object._id;
            });
          }
        })
      })
      expect(cleansed).to.deep.equal(Object.assign(expected.objects, {status: expected.status}))
    }
    expect(res.body.status).to.equal(expected.status);
    expect(res.status).to.equal(expected.status);
    done();
  })
}
