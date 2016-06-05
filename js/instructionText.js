define(function () {
	'use strict';

	var instructionTextNode = document.getElementById('instructionText');
	var setWhosPlayingText = function (name) {
		instructionTextNode.textContent = `Player ${name} it's your turn!`;
	};

	var setWinText = function (name) {
		instructionTextNode.textContent = `Player ${name} wins!`;
	};

	return {
		setWhosPlayingText,
		setWinText
	};
});
