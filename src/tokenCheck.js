import request from 'superagent'

export default function tokenCheck(req, res, next) {
  console.log('checking token');
  console.log(req.headers)
  console.log(req.query.auth)
  request.get('http://localhost:3000/confirm')
    .query({
      joint_token: req.query.auth
    })
    .end((err, users) => {
      users = JSON.parse(users.text);
      req.users = users;
      next();
    });
}
