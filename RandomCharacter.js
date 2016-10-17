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
var re = /\r\n|\n\r|\n|\r/g;

var Singer = function(name) {
	this.name = name;
	this.role = [];
};



if (runFromConsole == 1 && namesFromConsole != undefined) {
	setup();
	makeAssignmentsByName(namesFromConsole);
}
else if (runFromConsole == 1) {
	setup();
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
		return 1; // there must be at least one singer
	}
}


function setup () {
	var charactersFromFile = fs.readFileSync('songs/SONG Alexander Hamilton', 'utf8'); // default song... TODO: clean this up
	charactersFromFile = charactersFromFile.toString().split('\n');
	loadCharacters(charactersFromFile);

}

function loadCharacters (rawCharacterList) {
	for (var i in rawCharacterList) {
		if (rawCharacterList[i].length > 1) // assumption: there will be no valid character name of length 1
		{
			characters[i] = {
				'name': rawCharacterList[i].split(re)[0].replace(re, '') 	// to remove unnecessary white-space
			}
		} else { // if we hit the empty line we're done with the file
			break;
		}
		setNumberOfRoles(characters.length);

		if (characters == undefined) {
			console.error('characters are missing...');
			throw new Error('characters are missing');
		}
	}
}

function makeAssignmentsByName(singers, song) {
		reset();
		if (singers == undefined || singers == '')
		{
			singers = 'You';
		}
		var singersList = singers.split(', '); // TODO: need to make this more resilient to what ppl will type


		if (song != undefined) {
			loadCharacters(require('./GetAllSongs').findRolesBySong(song).split(', '));
		}

		possibleCharacters = characters.slice();

		singerNumber = singersList.length;
		//console.log('our list of singers: ' + singersList);
		for (var i = 0; i < singerNumber; i++) {
			createSingers(i, singersList[i], possibleCharacters);
		}
		return characterAssignment;
}

function createSingers(i, name, possibleCharacters) {
		if (i < numberOfRoles) {
			characterAssignment[i] = new Singer(name);
			for (var j = i; j < numberOfRoles; j = j + singerNumber) {
				addRoleToList(characterAssignment[i], possibleCharacters[j]);
			}
		}
		else {
			doubleUpRoles(i, name)
		}
}

function addRoleToList (singer, role) {
	singer.role.push(role.name);

}

// let's double up the roles by adding another singer name to the assignment
function doubleUpRoles(i, name) {
	var buddyIndex = (i - numberOfRoles) % numberOfRoles;
	characterAssignment[buddyIndex].name = characterAssignment[buddyIndex].name + ', ' + name;

}

function reset() {
	characters.splice(0, characters.length); // clean-up characters
	characterAssignment.splice(0, characterAssignment.length); 	// cleaning any lingering old data
	possibleCharacters.splice(0, possibleCharacters.length);
	singerNumber = 0;

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
