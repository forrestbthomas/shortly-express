var request = require('request');
var db = require('./../app/config');
var User = require('./../app/models/user');
var bcrypt = require('bcrypt-nodejs');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/

// compare a given password with a given username's hash value
exports.checkUser = function(username, pass, callback){
  // create a dummy model with the passed-in username and fetch it from the database
  new User({
    username: username
  })
  .fetch()
  .then(function(model){
    // use bcrypt to compare passed-in password with hash in database
    bcrypt.compare(pass, model.get('hash'), function(err, match){
      if(err) throw err;
      callback(match);
    });
  });
};

// Check session helper
exports.checkSession = function(req, res, next){
  //  grab the cookie from the request if it has one
  //  check that the cookie is valid
  console.log('after redirect: ' + req.session.user);
  if (req.session.user){
    // if so, call next
    next();
  } else {
    // if not, redirect to login
    res.redirect('/login');
  }
};
