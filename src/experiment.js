import applyUpdateQuery from 'stages/base/applyUpdateQuery.stage';

const object = {
  "set": [
    {
      "a": 5,
      "b": 6
    },
    {
      "a": 2,
      "b": 5
    },
    {
      "a": 1,
      "b": 2
    }
  ],
  "numbers": [3, 4, 2, 5, 1, 7, 2, 3],
}

const query = {
  "$pullAll": {
    "numbers": [3]
  }
}

const scope = {
  errors: {}
};

applyUpdateQuery(scope, object, query, ['body'], 'saved');

console.log('ERRORS -------------------')
console.log(JSON.stringify(scope.errors, null, 2));
console.log('RESULT--------------------')
console.log(JSON.stringify(scope.saved, null, 2))
