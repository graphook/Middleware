import chai from 'chai';
import request from 'supertest';
import startServer, {app} from 'server';
import preTest from 'testHelpers/preTest';
import standardTest from 'testHelpers/standardTest';
import createFamilyType from 'testHelpers/createFamilyType';
import createFamilySet from 'testHelpers/createFamilySet';
import {families, familySet} from 'testHelpers/sampleData';
import {cloneAssign} from 'utilities';

describe('Create Object', () => {
  before((done) => {
    startServer(() => preTest(() => createFamilyType(() => createFamilySet(done))));
  });
  beforeEach((done) => {
    setTimeout(() => { done() }, 1000);
  });
  it('should create an object', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: cloneAssign(families[0], { _type: 'familyType' })
    }, {
      status: 201,
      objects: {
        created: {
          familyType: [
            cloneAssign(families[0], { _sets: [], _type: 'familyType' })
          ]
        }
      }
    }, done);
  });
  it('should create multiple objects', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: families.map((family) => cloneAssign(family, { _type: 'familyType' }))
    }, {
      status: 201,
      objects: {
        created: {
          familyType: families.map((family => cloneAssign(family, { _sets: [], _type: 'familyType' })))
        }
      }
    }, done);
  })
  it ('should add the object to sets when sets are provided', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: families.map((family) => cloneAssign(family, { _type: 'familyType', _sets: [ 'familySet' ] }))
    }, {
      status: 201,
      objects: {
        created: {
          familyType: families.map((family => cloneAssign(family, { _sets: [ 'familySet' ], _type: 'familyType' })))
        },
        updated: {
          set_type: [ cloneAssign(familySet, { numberOfItems: families.length, _type: 'set_type' }, ['_permissions']) ]
        }
      }
    }, done);
  })
  it ('should error when given a set that doesnt exist', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: families.map((family) => cloneAssign(family, { _type: 'familyType', _sets: [ 'does not exist' ] }))
    }, {
      status: 400,
      errors: ['does not exist']
    }, done);
  })
  it ('should error when given an id for an object that is not a set', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: families.map((family) => cloneAssign(family, { _type: 'familyType', _sets: [ 'type_type' ] }))
    }, {
      status: 400,
      errors: ['type_type._type']
    }, done);
  })
  it ('should error when given a set with a type mismatch', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: families.map((family) => cloneAssign(family, { _type: 'familyType', _sets: [ 'type_set' ] }))
    }, {
      status: 400,
      errors: ['type_set.type']
    }, done);
  })
  it ('should error when there is a type mismatch', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: cloneAssign(families[0], { _type: 'set_type' })
    }, {
      status: 400,
      errors: ['body.0', 'body.0._type', 'body.0.title']
    }, done);
  })
  it ('should error when the provided type does not exist', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: cloneAssign(families[0], { _type: 'Does Not Exist' })
    }, {
      status: 404,
      errors: ['type']
    }, done);
  })
  it ('should resist attempts to set _permissions.', (done) => {
    standardTest(app, {
      path: '/v2/object',
      method: 'post',
      body: cloneAssign(families[0], { _type: 'familyType', _permissions: { owner: 'me', read: ['all'] } })
    }, {
      status: 400,
      errors: ['body.0']
    }, done);
  })
});
