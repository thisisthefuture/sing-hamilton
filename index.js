var express = require('express');
var app = express();

var ranChars = require('./RandomCharacter.js');
//console.out(characters.length);


app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	var roles = ranChars.numberOfRoles();
    res.render('pages/index', {
    	numOfRoles: roles
    });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


