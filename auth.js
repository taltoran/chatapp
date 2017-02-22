var token = require('token');

token.defaults.secret = 'SECRET_NSA_DATABASE';
// tokens are invalidated after this long
token.defaults.timeStep = 24 * 60 * 60; // 24h in seconds


function getLoginType(req, params) {
  if(token.verify(req.session.authEmail, req.session.authToken)) {
    params.loginType = 'Log Out';
    params.loginTypeUrl = '/logout';
  }
  else {
    params.loginType = 'Log In';
    params.loginTypeUrl = '/login';
  }
}


module.exports.getLoginType = getLoginType;