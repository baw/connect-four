define([
	'intern!tdd',
	'intern/chai!assert',

	'js/Board'
], function (
	tdd,
	assert,
	Board
) {
	tdd.suite('Board', function () {
		var board;
		var PLAYER_ONE_NAME = 'Player one';
		var PLAYER_TWO_NAME = 'Player two';

		tdd.beforeEach(function () {
			board = new Board(PLAYER_ONE_NAME, PLAYER_TWO_NAME);
		});

		tdd.suite('before any moves', function () {
			tdd.test('#currentTurnsPlayerName is correct', function () {
				assert.strictEqual(board.currentTurnsPlayerName(), PLAYER_ONE_NAME);
				assert.notStrictEqual(board.currentTurnsPlayerName(), PLAYER_TWO_NAME);
			});

			tdd.test('#isWon is not won', function () {
				assert.isFalse(board.isWon());
			});
		});
	});
});
