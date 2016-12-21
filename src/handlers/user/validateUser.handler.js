import validateUser from './utils/validateUser'

module.exports = function(req, res, next) {
  validateUser(req, res, (err) => {
    if (err) {
      next(err);
    } else {
      res.send('user is valid');
    }
  })
}
