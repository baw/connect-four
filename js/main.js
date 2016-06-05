define([
	'js/instructionText',
	'js/Board'
], function (
	instructionText,
	Board
) {
	'use strict';
	var containerNode = document.getElementById('container');
	var playerOneTextBoxNode = document.getElementById('playerOneTextBox');
	var playerTwoTextBoxNode = document.getElementById('playerTwoTextBox');
	var startButtonNode = document.getElementById('startButton');
	var startFormNode = document.getElementById('startForm');

	startButtonNode.addEventListener('click', function () {
		var playerOneName = playerOneTextBoxNode.value;
		var playerTwoName = playerTwoTextBoxNode.value;

		var board = new Board(playerOneName, playerTwoName);

		instructionText.setWhosPlayingText(board.currentTurnsPlayerName());
		board.onPlayerChangeEvent(function () {
			instructionText.setWhosPlayingText(board.currentTurnsPlayerName());
		});
		board.onWinEvent(function () {
			instructionText.setWinText(board.currentTurnsPlayerName());
		});

		board.appendToNode(containerNode);

		startFormNode.remove();
	});
});
