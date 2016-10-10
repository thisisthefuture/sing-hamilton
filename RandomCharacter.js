var fs = require('fs');

var singerNumber = 14; //process.argv[2];
var numberOfRoles = 0;
var characterAssignment = [];
var characters = setup();

module.exports.getRandomCharacter = getRandomCharacter;
module.exports.numberOfRoles = numberOfRoles;

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
		console.log(array[i]);
	}
}

function setNumberOfRoles(number) {
	numberOfRoles = number;
}

function getNumberOfRoles ()
{
	//console.log(characters.length);
	return numberOfRoles;
}

function getRandomCharacter()
{
	return characterAssignment[Math.floor((Math.random() * characterAssignment.length))];
}

function setup () {
	var characters = [];
	var newCharacter = false;
	var random = 0;
	
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
	else if (singerNumber < 1 || singerNumber == undefined) {
		console.error('nobody is singing :(');
		throw new Error('nobody is singing..');
	} else if (singerNumber > characters.length) {	
		console.error('whoops... too many singers right now. Only support 1 role per singer');
		throw new Error('too many people singing')
	}

	for (var i = 0; i < singerNumber; i++) {
		//console.log('finding character for singer #' + (i+1));
		while (newCharacter == false) {
			
			random = Math.floor((Math.random() * characters.length));
			//console.log('Considering....' + characters[random].name + '\n');

			if (characterAssignment.find(findCharacter, characters[random].name) == undefined) {
				newCharacter = true;
				characterAssignment.push(characters[random].name);
				characters.splice(random, 1);

				//console.log("remaining # of unclaimed characters: " + characters.length);
				//printArray(characters)
				console.log("singer #" + (i+1) + ": " + characterAssignment[i] + '\n');
			}
			else {
				// keep looking...
				console.error('this should never happen if we are removing elements from the array after we add them');
			}
		}
		newCharacter = false;
	} 
	console.log('done setup w/' + getNumberOfRoles());
	return characterAssignment;

}
