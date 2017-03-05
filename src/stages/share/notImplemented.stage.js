
export default function(req, res) {
  res.status(501).send({
    status: 501,
    errors: {
      'path': 'Not implemented.'
    }
  })
}
