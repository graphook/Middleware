
export default function (err, req, res, next) {
  if (typeof err.message === 'object') {
    res.setHeader('Content-Type', 'application/json');
    err.message = JSON.stringify(err.message);
  }
  if (err.user) {
    res.status(err.status || 400).send(err.message || 'Something went wrong');
  } else {
    if (process.env.ENV === 'prod') {
      res.status(500).send();
    } else {
      res.status(500).send(err);
    }
  }
}
