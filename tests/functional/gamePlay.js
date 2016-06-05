define([
	'require',
	'intern!tdd',
	'intern/chai!assert'
], function (
	require,
	tdd,
	assert
) {
	tdd.suite('gamePlay', function () {
		var indexUrl = require.toUrl('../../index.html');
		var playerOneName = 'One';
		var playerTwoName = 'Two';

		var clickColumn = function (columnNumber) {
			return function () {
				return this.parent
					.findByCssSelector('.column[data-column="' + columnNumber + '"]')
							.click()
						.end();
			};
		};

		var getNumberOfPositionsOnScreen = function () {
			return this.parent
				.findAllByCssSelector('.position:not(.background)[class*=" player-"]')
				.then(function (nodes) {
					return nodes.length;
				});
		};

		var getPastStartForm = function (playerOneName, playerTwoName) {
			return function () {
				return this.parent.findById('playerOneTextBox')
					.type(playerOneName)
					.end()
				.findById('playerTwoTextBox')
					.type(playerTwoName)
					.end()
				.findById('startButton')
					.click()
					.end();
			};
		};

		var getInstructionText = function () {
			return this.parent
				.findById('instructionText')
					.getVisibleText();
		};

		tdd.beforeEach(function () {
			return this.remote
				.get(indexUrl)
				.setFindTimeout(5000);
		});

		tdd.suite('startForm', function () {
			tdd.test('game title is on page', function () {
				return this.remote
					.findByClassName('gameTitle')
					.getVisibleText()
					.then(function (text) {
						assert.strictEqual(text, 'Connect Four');
					});
			});

			tdd.test('pressing start uses player one name to tell whose turn it is', function () {
				return this.remote.then(getPastStartForm(playerOneName, playerTwoName))
					.then(getInstructionText)
					.then(function (text) {
						assert.include(text, playerOneName);
					});
			});
		});

		tdd.suite('winning', function () {

			tdd.beforeEach(function () {
				return this.remote.then(getPastStartForm(playerOneName, playerTwoName));
			});

			tdd.test('by column', function () {
				return this.remote
					.then(clickColumn(3))
					.then(clickColumn(4))
					.then(clickColumn(3))
					.then(clickColumn(4))
					.then(clickColumn(3))
					.then(clickColumn(4))
					.then(clickColumn(3))
					.then(getInstructionText)
						.then(function (text) {
							assert.include(text, playerOneName);
							assert.include(text, 'win');
						})
						.end()
					.then(getNumberOfPositionsOnScreen)
					.then(function (numberOfPositions) {
						assert.strictEqual(numberOfPositions, 7, 'number of moves on screen is incorrect');
					});
			});

			tdd.test('by row', function () {
				return this.remote
					.then(clickColumn(0))
					.then(clickColumn(0))
					.then(clickColumn(1))
					.then(clickColumn(1))
					.then(clickColumn(2))
					.then(clickColumn(2))
					.then(clickColumn(3))
					.then(getInstructionText)
						.then(function (text) {
							assert.include(text, playerOneName);
							assert.include(text, 'win');
						})
						.end()
					.then(getNumberOfPositionsOnScreen)
						.then(function (numberOfPositions) {
							assert.strictEqual(numberOfPositions, 7, 'number of moves on screen is incorrect');
						});
			});

			tdd.test('by dialog', function () {
				return this.remote
					.then(clickColumn(0))
					.then(clickColumn(1))
					.then(clickColumn(1))
					.then(clickColumn(2))
					.then(clickColumn(2))
					.then(clickColumn(3))
					.then(clickColumn(2))
					.then(clickColumn(3))
					.then(clickColumn(3))
					.then(clickColumn(0))
					.then(clickColumn(3))
					.then(getInstructionText)
						.then(function (text) {
							assert.include(text, playerOneName);
							assert.include(text, 'win');
						})
						.end()
					.then(getNumberOfPositionsOnScreen)
						.then(function (numberOfPositions) {
							assert.strictEqual(numberOfPositions, 11, 'number of moves on screen is incorrect');
						});
			});
		});
	});
});
