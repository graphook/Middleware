import {db} from '../../mongo'

module.exports = function(req, res, next) {
  if (!req.user) {
    next({
      user: true,
      status: 401,
      message: "Access denied."
    });
  } else {
    const count = parseInt(req.query.count) || 10;
    const q = req.query.q;
    const page = parseInt(req.query.page);
    db.type.find({
      $text: {
        $search: q
      }
    }).sort({ numUses: -1 }).skip(count * (page - 1)).limit(count).toArray((err, result) => {
      if (err) { next(err) }
      else {
        res.status(200).send(result);
      }
    })
  }
}
