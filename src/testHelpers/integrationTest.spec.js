import chai from 'chai';
import request from 'supertest';
import startServer, {app} from 'server';
import preTest from 'testHelpers/preTest';
import standardTest from 'testHelpers/standardTest';
import createFamilyType from 'testHelpers/createFamilyType';
import createFamilySet from 'testHelpers/createFamilySet';
import loadFamilies from 'testHelpers/loadFamilies';
import {families, familySet} from 'testHelpers/sampleData';
import {cloneAssign} from 'utilities';
import routes from 'routes.map';

const expect = chai.expect;


const runTest = (route, index) => {
  it(index + ': ' + route.method + " " + route.path, (done) => {
    standardTest(app, {
      path: route.sample.path,
      method: route.method,
      body: route.sample.requestBody
    }, {
      status: route.sample.responseStatus,
      body: route.sample.responseBody
    }, done);
  });
};

describe('Integration Tests', function() {
  this.timeout(10000);
  before((done) => {
    startServer(() => preTest(() => createFamilyType(() => createFamilySet(() => loadFamilies(done)))));
  });
  beforeEach((done) => {
    setTimeout(() => { done() }, 1000);
  });

  if (!isNaN(process.argv[process.argv.length - 1])) {
    const testNumber = parseInt(process.argv[process.argv.length - 1]);
    runTest(routes[testNumber], testNumber);
  } else {
    routes.forEach((route, index) => {
      runTest(route, index);
    })
  }

});


