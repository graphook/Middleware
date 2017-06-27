import {isEqual} from 'lodash';
import {clone} from 'utilities';

// returns an array of all the parents
const getParentFromRoute = function(object, routeArr) {
  let parents = [object];
  for (let i = 0; i < routeArr.length - 1; i++) {
    let tempParents = [];
    for (let j = 0; j < parents.length; j++) {
      if (routeArr[i] === '$' && Array.isArray(parents[j])) {
        tempParents = tempParents.concat(parents[j]);
      } else if (parents[j][routeArr[i]] == null) {
        parents[j] = null;
      } else {
        parents[j] = parents[j][routeArr[i]];
      }
    }
    if (tempParents.length > 0) {
      parents = tempParents;
    }
    parents = parents.filter((value) => value != null);
    if (parents.length === 0) {
      return [];
    }
  }
  parents.filter((parent) => routeArr[routeArr.length - 1] === '$' || parent[routeArr[routeArr.length - 1]] != null);
  return parents;
}

const standardUpdate = function(scope, query, object, path, queryPreCheckFunc, updateFunc) {
  Object.keys(query).forEach((jsonRoute) => {
    if (queryPreCheckFunc) {
      const queryError = queryPreCheckFunc(query[jsonRoute]);
      if (queryError) {
        scope.errors[path.concat([jsonRoute]).join('.')] = queryError;
        return;
      }
    }
    const routeArr = jsonRoute.split('.');
    let parents = getParentFromRoute(object, routeArr);
    parents.forEach((parent) => {
      if (routeArr[routeArr.length - 1] === '$' && Array.isArray(parent)) {
        for (let i = 0; i < parent.length; i++) {
          updateFunc(parent, i, query[jsonRoute]);
        }
      } else {
        updateFunc(parent, routeArr[routeArr.length - 1], query[jsonRoute]);
      }
    });
  });
}

const operations = {
  '$inc': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, (queryValue) => {
      if (typeof queryValue !== 'number') {
        return 'Must be a number';
      }
    }, (parent, key, queryValue) => {
      parent[key] += queryValue;
    });
  },
  '$mul': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, (queryValue) => {
      if (typeof queryValue !== 'number') {
        return 'Must be a number';
      }
    }, (parent, key, queryValue) => {
      parent[key] *= queryValue;
    });
  },
  // TODO: this doesn't support the $ operator
  '$rename': (scope, query, object, path) => {
    let values = {};
    let parents = {};
    Object.keys(query).forEach((jsonRoute) => {
      const routeArr = jsonRoute.split('.');
      const parent = getParentFromRoute(object, routeArr)
      if (parent) {
        values[jsonRoute] = parent[routeArr[routeArr.length - 1]];
        parents[jsonRoute] = parent;
      }
    });
    Object.keys(parents).forEach((jsonRoute) => {
      parents[jsonRoute][query[jsonRoute]] = values[jsonRoute];
      // All this stuff is here to accomodate for swapped keys edge case
      let newNameRoute = jsonRoute.split('.');
      let oldField = newNameRoute.pop();
      newNameRoute.push(query[jsonRoute]);
      if (!parents[newNameRoute.join('.')]) {
        delete parents[jsonRoute][oldField];
      }
    });
  },
  '$set': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, null, (parent, key, queryValue) => {
      parent[key] = queryValue;
    });
  },
  '$unset': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, null, (parent, key, queryValue) => {
      delete parent[key];
    });
  },
  '$min': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, (queryValue) => {
      if (typeof queryValue !== 'number') {
        return 'Must be a number';
      }
    }, (parent, key, queryValue) => {
      if (queryValue < parent[key]) {
        parent[key] = queryValue;
      }
    });
  },
  '$max': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, (queryValue) => {
      if (typeof queryValue !== 'number') {
        return 'Must be a number';
      }
    }, (parent, key, queryValue) => {
      if (queryValue > parent[key]) {
        parent[key] = queryValue;
      }
    });
  },
  '$addToSet': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, null, (parent, key, queryValue) => {
      if (Array.isArray(parent[key]) && parent[key]
          .reduce((isNotInSet, val) => isNotInSet && !isEqual(val, queryValue), true)) {
        if (queryValue.$each && Array.isArray(queryValue.$each)) {
          parent[key] = parent[key].concat(queryValue.$each);
        } else {
          parent[key].push(queryValue);
        }
      }
    });
  },
  /* Pull requires a re-write of the query system, and that's beyond the scope right now
  TODO: Update this later to work
  '$pull': (scope, query, object, path) => {

  },
  */
  '$pullAll': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, (queryValue) => {
      if (!Array.isArray(queryValue)) {
        return 'Must be an array'
      }
    }, (parent, key, queryValue) => {
      if (Array.isArray(parent[key])) {
        parent[key].forEach((arrayItem, arrayIndex) => {
          queryValue.forEach((queryItem) => {
            if (isEqual(queryItem, arrayItem)) {
              parent[key][arrayIndex] = null;
            }
          })
        });
        parent[key] = parent[key].filter((val) => val != null);
      }
    });
  },
  '$pop': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, (queryValue) => {
      if (typeof queryValue !== 'number') {
        return 'Must be a number';
      }
    }, (parent, key, queryValue) => {
      if (Array.isArray(parent[key])) {
        if (queryValue > 0) {
          parent[key] = parent[key].slice(0, parent[key].length - 1);
        } else if (queryValue < 0) {
          parent[key] = parent[key].slice(1, parent[key].length);
        }
      }
    });
  },
  '$push': (scope, query, object, path) => {
    standardUpdate(scope, query, object, path, (queryValue) => {
      if (queryValue.$position != null && typeof queryValue.$position !== 'number') {
        return '$position must be a number'
      }
      if (queryValue.$slice != null && typeof queryValue.$slice !== 'number') {
        return '$slice must be a number'
      }
      if (queryValue.$each != null && !Array.isArray(queryValue.$each)) {
        return '$each must be an array'
      }
      if (queryValue.$sort != null && typeof queryValue.$sort != 'number' &&
          typeof queryValue.$sort != 'object' && Object.keys(queryValue.$sort).length !== 1) {
        return '$sort must be a number or an object with one key'
      }
    }, (parent, key, queryValue) => {
      if (Array.isArray(parent[key])) {
        if (queryValue.$slice === 0) {
          parent[key] = [];
        }
        let index = queryValue.$position || parent[key].length;
        if (queryValue.$each && Array.isArray(queryValue.$each)) {
          let before = parent[key].slice(0, index);
          let after = parent[key].slice(index, parent[key].length);
          parent[key] = before.concat(queryValue.$each).concat(after);
        } else if (Array.isArray(queryValue.$each)) {
          let clonedValue = clone(queryValue);
          delete clonedValue.$position;
          delete clonedValue.$slice;
          delete clonedValue.$sort;
          parent[key].splice(index, 0, clonedValue);
        }
        // TODO: Implement Sort
        if (queryValue.$sort) {
          parent[key].sort((a, b) => {
            let sortValue = queryValue.$sort;
            if (typeof queryValue.$sort !== 'number') {
              const key = Object.keys(queryValue.$sort)[0];
              a = a[key];
              b = b[key];
              sortValue = queryValue.$sort[key];
            }
            // This is to handle other types like strings and booleans, still ugly
            if (a > b) {
              return 1 * sortValue;
            } else if (b > a) {
              return -1 * sortValue;
            } else {
              return 0;
            }
          })
        }

        if (queryValue.$slice < 0) {
          parent[key] = parent[key].slice(parent[key].length + queryValue.$slice, parent[key].length);
        } else if (queryValue.$slice > 0) {
          parent[key] = parent[key].slice(0, queryValue.$slice);
        }
      }
    });
  }
}

export default function(scope, object, query, path, saveTo) {
  object = JSON.parse(JSON.stringify(object));
  Object.keys(query).forEach((field) => {
    if (!operations[field]) {
      scope.errors[path.concat([field]).join('.')] = field + ' is not a valid update field.'
    } else {
      operations[field](scope, query[field], object, path.concat(field));
    }
  });
  scope[saveTo] = object;
  return object;
}
