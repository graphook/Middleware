import {db} from '../../mongo'

module.exports = function(req, res, next) {
  // search for sets just like types
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    const count = parseInt(req.query.count) || 10;
    const query = (req.query.q) ? {
      $text: {
        $search: req.query.q
      }
    } : {};
    const page = parseInt(req.query.page) || 0;
    db.set.find(query).sort({ stars: -1 }).skip(count * page).limit(count).toArray((err, result) => {
      if (err) { next(err) }
      else {
        res.status(200).send(result);
      }
    })
  }
}
