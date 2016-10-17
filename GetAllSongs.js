var fs = require('fs');
var songsAndCharacters = {};
var re = /\r\n|\n\r|\n|\r/g;

module.exports.getSongList = getSongList;
module.exports.findRolesBySong = findRolesBySong;

function loadAllSongs () {
	var allSongsFromFile = fs.readFileSync('songs/SONGS All', 'utf8');
	allSongsFromFile = allSongsFromFile.toString().split('\n');					// separating songs+roles to each index

	for (var i in allSongsFromFile) {
		if (allSongsFromFile[i].length > 1 )															// ignore blank lines
		{
			allSongsFromFile[i] = allSongsFromFile[i].replace(re, '');
			var songData = allSongsFromFile[i].split(': ');
			songsAndCharacters[songData[0]] = songData[1];
		}
	}
}

function print(array) {
	for (var i in array) {
		console.log(array[i]);
	}
}

function getSongList () {
	var songList = [];
	for (var i in songsAndCharacters) {
		songList.push(i);
	}

	return songList;
}

function findRolesBySong(song) {
	return songsAndCharacters[song];	// must use [] notation to access object values, given keys are not valid via dot notation
}

loadAllSongs();
