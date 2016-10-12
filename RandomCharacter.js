var fs = require('fs');
var runFromConsole = process.argv[2];		// an argument to check if the program is ran from the console (1 = true)
var singerNumber = process.argv[3]; 		// # of singers passed from the console
var namesFromConsole = process.argv[4];
var numberOfRoles = 0;									// variable for the # of roles for the selected song
var characterAssignment = [];						// array of assignments of the roles; items in the arary are objects
																				/*		{
																								name: string,
																								roles: array
																							}
																				*/
var characters = [];										// array of the characters in the song
var possibleCharacters = [];
var Singer = function(name) {
	this.name = name;
	this.role = [];
};


setup();

if (runFromConsole == 1 && namesFromConsole != undefined) {
	makeAssignmentsByName(namesFromConsole);
}
else if (runFromConsole == 1) {
	makeAssignmentsByTotalSingers();										// if we're running from the console, make assignments automatically; e.g., not waiting for a GET req
}

module.exports.numberOfRoles = numberOfRoles;							// share variables to be used in the webpage
module.exports.makeAssignmentsByTotalSingers = makeAssignmentsByTotalSingers;
module.exports.makeAssignmentsByName = makeAssignmentsByName;
/*

1. READ the FILE
2. PREP the program
	a. create array from file
	b. verify file
3. GET # of Singers
4. ASSIGN singers
5. PRESENT results

*/

// Is this character already taken by a singer?
function findCharacter (character, potentialAddition) {
	return character.name === potentialAddition;
}

function printArray (array) {
	for (var i = 0 ; i < array.length ; i++) {
		console.log(array[i]);
	}
}

function setNumberOfRoles(number) {
	numberOfRoles = number;
}

function getNumberOfRoles ()
{
	console.log(characters.length);
	return numberOfRoles;
}

function getRandomCharacter()
{
	return characterAssignment[Math.floor((Math.random() * characterAssignment.length))];
}

function checkSingerValue(passedSingerNumber, consoleSingerNumber) {
	console.log('in checkSingerValue: passedSingerNumber = ' + passedSingerNumber + ' consoleSingerNumber  = ' + consoleSingerNumber);

	if (consoleSingerNumber == undefined)
	{
		consoleSingerNumber = 1;
	}

	if (passedSingerNumber > 0 && consoleSingerNumber > 0)
	{
		console.log(passedSingerNumber + ' ' + consoleSingerNumber);
		if (passedSingerNumber > consoleSingerNumber)
		{
			console.log('hi?');
			return passedSingerNumber;
		}
		else
			return consoleSingerNumber;
	}
	else if (passedSingerNumber > consoleSingerNumber) {
		return passedSingerNumber;
	}
	else if (consoleSingerNumber > passedSingerNumber) {
		return consoleSingerNumber;
	}
	else if (passedSingerNumber == undefined && consoleSingerNumber != undefined)
		return consoleSingerNumber;
	else if (passedSingerNumber != undefined && consoleSingerNumber == undefined)
		return passedSingerNumber;
	else
	{
		console.log('are you here???');
		console.log('passedSingerNumber = ' + passedSingerNumber + ' consoleSingerNumber = ' + consoleSingerNumber);
		return 1; // there must be at least one singer
	}
}


function setup () {
	//var characters = [];

	var charactersFromFile = fs.readFileSync('songs/SONG Alexander Hamilton', 'utf8'); //, function (err, data) {
		/* if (err) {
			return console.log(err);
		}
		console.log('done reading'); */
	charactersFromFile = charactersFromFile.toString().split('\n');

	for (var i in charactersFromFile) {
		console.log(charactersFromFile[i]);
		if (charactersFromFile[i] != '\r')
		{
			characters[i] = {
				'name': charactersFromFile[i].split('\n')[0].replace(/(\r\n|\n|\r)/gm, ''),
	//			'gender': charactersFromFile[i].split(', ')[1].replace('\r', '') // trimmed on ',' when using the ENSEMBLE-Characters file
			}
		} else { // if we hit the empty line we're done with the file
			break;
		}
	}

	setNumberOfRoles(characters.length);

	if (characters == undefined) {
		console.error('characters are missing...');
		throw new Error('characters are missing');
	}
}

function addRoleToList (singer, role) {
	singer.role.push(role.name);

}

function makeAssignmentsByName(singers) {
		var singersList = singers.split(', '); // TODO: need to make this more resilient to what ppl will type
		reset();

		possibleCharacters = characters.slice();
		singerNumber = singersList.length;
		//console.log('our list of singers: ' + singersList);
		for (var i = 0; i < singerNumber; i++) {
			createSingers(i, singersList[i], possibleCharacters);
		}
		return characterAssignment;
}

function createSingers(i, name, possibleCharacters) {
		characterAssignment[i] = new Singer(name);	// temporarily using the loop iteration value as the Singer's name
		//console.log('i ' + i + ' name: ' + name + ' possibleCharacters:' + possibleCharacters);
		for (var j = i; j < numberOfRoles; j = j + singerNumber) {
			//console.log('singer# ' + i + ' j = ' + j + ' singer#:' + singerNumber);
			//console.log('role...' + possibleCharacters[j].name);
			addRoleToList(characterAssignment[i], possibleCharacters[j]);
		}
}

function reset() {
	characterAssignment.splice(0, characterAssignment.length); 	// cleaning any lingering old data
	possibleCharacters = characters.slice(); 								// lets not touch original list of characters. splice() clons array and returns reference to new array
	singerNumber = 0;
	console.log('resetting values');

}

function makeAssignmentsByTotalSingers(passedSingerNumber) {
	reset();
	console.log('from POST # of singers = ' + passedSingerNumber);

	var singers = checkSingerValue(passedSingerNumber, singerNumber);
	var newCharacter = false;
	var random = 0;

	if (singers == 0) {
		console.error('nobody is singing :(');
		throw new Error('nobody is singing..');
	} else if (singers > possibleCharacters.length) {
		console.error('whoops... too many singers right now. Only support 1 role per singer');
		throw new Error('too many people singing')
	}
	else {
		singerNumber = +singers;
		console.log('singers = ' + singerNumber);
	}

	//console.log('finding assignments for ' + singerNumber + ' people\n');

/*
	if singerNumber == 1 --> you sing everyone!
	if singerNumber == 2 --> singers alternate roles
	if singerNumber == 3 -->
*/
		for (var i = 0; i < singerNumber; i++) {
			createSingers(i, i+1, possibleCharacters);
		}



	// if singerNumber == numberOfRoles --> randomly assigns roles out
	/*
	for (var i = 0; i < singerNumber; i++) {
		//console.log('finding character for singer #' + (i+1));
		while (newCharacter == false) {

			random = Math.floor((Math.random() * possibleCharacters.length));
			//console.log('Considering....' + characters[random].name + '\n');

			if (characterAssignment.find(findCharacter, possibleCharacters[random].name) == undefined) {
				newCharacter = true;
				characterAssignment.push(possibleCharacters[random].name);
				possibleCharacters.splice(random, 1);
			}
			else {
				// keep looking...
				console.error('this should never happen if we are removing elements from the array after we add them');
			}
			console.log(characterAssignment[i]);
		}
		newCharacter = false;
	} */
	//console.log('done setup w/' + getNumberOfRoles());
	return characterAssignment;

}
