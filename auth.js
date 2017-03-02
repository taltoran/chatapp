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


// http://regexlib.com/REDetails.aspx?regexp_id=26
var emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
// The username should be one word that allows alphanumeric characters, as well as the – and _ characters.
var userNameRegex = /^[a-zA-Z0-9_\-]+$/;

function verifyInfo(userName, email, password, confirmPassword, firstName, lastName) {
    let errors = [];
    if(!userNameRegex.test(userName)) {
         errors.push('Username can only include alphanumeric characters, dashes, and underscores.');
    }
    if(!emailRegex.test(email)) {
        errors.push('Invalid email address.');
    }
    if(password.length < 6) {
         errors.push('Password must be at least 6 characters long.');
    }
    if(confirmPassword.length <= 0 || password != confirmPassword) {
         errors.push('Passwords do not match!');
    }
    if(firstName.length <= 0) {
        errors.push('Please enter a first name.');
    }
    if(lastName.length <= 0) {
        errors.push('Please enter a last name.');
    }
    
    return (errors.length>0) ? errors : undefined;
}


module.exports.getLoginType = getLoginType;
module.exports.verifyInfo = verifyInfo;
