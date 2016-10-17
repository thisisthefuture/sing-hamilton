var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var http = require('http');
var app = express();
var ranChars = require('./RandomCharacter.js');
var allSongs = require('./GetAllSongs.js');

var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
// views is directory for all template files
app.set('views', __dirname + '/views');
app.use(expressLayouts);
// use res.render to load up an ejs view file

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.set('port', (process.env.PORT || 5000));


// index page
app.get('/', function(req, res) {
//	var yourRole = ranChars.getRandomCharacter();
	var songList = allSongs.getSongList();
	var numberOfCharacters = ranChars.numberOfRoles;
	//console.log(numberOfCharacters);
    res.render('pages/index', {
    	//yourRole: yourRole,
			songList: songList,
    	numberOfCharacters: numberOfCharacters
    });
});

app.post('/whosSinging', function(req, res) {
	var singers = ranChars.makeAssignmentsByName(req.body.singerList, req.body.songChoice);
	res.render('pages/assignments', {
		assignments: singers,
		song: req.body.songChoice
	});
});

app.post('/numberOfSingers', function(req, res) {
	console.log('number of singers from website = ' + req.body.numberOfSingers);
	var assignments = ranChars.makeAssignmentsByTotalSingers(req.body.numberOfSingers);
	res.render('pages/assignments', {
		assignments: assignments
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
