
export default function (err, req, res, next) {
  if (process.env.ENV !== 'prod') {
    if (err.stack) {
      console.error(err.stack);
    } else {
      console.error(err);
    }
  }
  if (typeof err.message === 'object') {
    res.setHeader('Content-Type', 'application/json');
  }
  if (err.user) {
    res.status(err.status || 400).send(err.message);
  } else {
    if (process.env.ENV === 'prod') {
      res.status(500).send();
    } else {
      res.status(500).send(err);
    }
  }
}
