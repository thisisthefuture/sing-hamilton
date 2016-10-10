var fs = require('fs');
var singerNumber = process.argv[2];
var runFromConsole = process.argv[3];
var numberOfRoles = 0;
var characterAssignment = [];
var characters = [];

setup();

if (runFromConsole == 1) {
	makeAssignments();
}

//module.exports.getRandomCharacter = getRandomCharacter;
module.exports.numberOfRoles = numberOfRoles;
module.exports.makeAssignments = makeAssignments;
/*

1. READ the FILE
2. PREP the program
	a. create array from file
	b. verify file
3. GET # of Singers
4. ASSIGN singers
5. PRESENT results

*/

function findCharacter (character, potentialAddition) {
	return character.name === potentialAddition;
}

function printArray (array) {
	for (var i = 0 ; i < array.length ; i++) {
		//console.log(array[i]);
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
	if (passedSingerNumber > 0 && consoleSingerNumber > 0)
	{
		if (passedSingerNumber > consoleSingerNumber)
			return passedSingerNumber;
		else
			return consoleSingerNumber
	} 
	else if (passedSingerNumber == undefined && consoleSingerNumber != undefined)
		return consoleSingerNumber;
	else if (passedSingerNumber != undefined && consoleSingerNumber == undefined)
		return passedSingerNumber;
	else
		return 1; // there must be at least one singer

}

function setup () {
	//var characters = [];


	var charactersFromFile = fs.readFileSync('ENSEMBLE-Characters', 'utf8') //, function (err, data) {
		/* if (err) {
			return console.log(err);
		}
		console.log('done reading'); */
	charactersFromFile = charactersFromFile.toString().split('\n');
	setNumberOfRoles(charactersFromFile.length);

	for (var i in charactersFromFile) {
		//console.log(charactersFromFile[i]);

		characters[i] = {
			'name': charactersFromFile[i].split(', ')[0],
			'gender': charactersFromFile[i].split(', ')[1].replace('\r', '')
		}
	}

	if (characters == undefined) {
		console.error('characters are missing...');
		throw new Error('characters are missing');
	}
}

function makeAssignments(passedSingerNumber) {
//	console.log('from POST # of singers = ' + passedSingerNumber);
	characterAssignment.splice(0, characterAssignment.length); // cleaning any lingering old data
	var possibleCharacters = characters.slice(); // lets not touch original list of characters. splice() clons array and returns reference to new array

//	console.log(possibleCharacters.length + 'unchoosen characters');

	var singers = checkSingerValue(passedSingerNumber, 1);
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
		singerNumber = singers;
	}

	console.log('finding assignments for ' + singerNumber + ' people\n');
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
		}
		newCharacter = false;
	} 
	//console.log('done setup w/' + getNumberOfRoles());
	return characterAssignment;

}
