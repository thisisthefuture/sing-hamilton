var express = require('express');
var http = require('http');
var app = express();
var ranChars = require('./RandomCharacter.js');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
//	var yourRole = ranChars.getRandomCharacter();
	var numberOfCharacters = ranChars.numberOfRoles;
	//console.log(numberOfCharacters);
    res.render('pages/index', {
    	//yourRole: yourRole,
    	numberOfCharacters: numberOfCharacters
    });
});


app.post('/numberOfSingers', function(req, res) {
	console.log('got a POST request');
	console.log(req.body);
	var assignments = ranChars.makeAssignments(req.body.numberOfSingers);
	res.render('pages/assignments', {
		assignments: assignments
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


