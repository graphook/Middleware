import Promise from 'bluebird';
import validateTypeProperties from 'stages/base/validateTypeProperties.stage';
import throwErrorIfNeeded from 'stages/share/throwErrorIfNeeded.stage';
import createObject from './createObject';
import {type} from 'schemas';

export default function createType(scope, newType, path) {
  return Promise.try(() => validateTypeProperties(newType.properties, scope.errors, path.concat(['properties'])))
    .then(() => throwErrorIfNeeded(scope.errors))
    .then(() => createObject(scope, newType, path, type, true))
    .catch((err) => { throw err })
}
