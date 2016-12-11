import {db} from '../../mongo'

module.exports = function(req, res, next) {
  res.status(404).send('This route is not implemented yet')
}
