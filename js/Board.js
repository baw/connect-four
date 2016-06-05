define(function () {
	'use strict';
	var NUMBER_OF_COLUMNS = 7;
	var NUMBER_OF_ROWS = 6;

	var Board = function (playerOneName, playerTwoName) {
		this._playerOne = { id: 1, name: playerOneName };
		this._playerTwo = { id: 2, name: playerTwoName };
		this._currentPlayerId = this._playerOne.id;
		this._isWonState = false;

		var boards = createBoards(this._boardClickHandler.bind(this));
		this._boardNode = boards.boardNode;
		this._memoryboard = boards.memoryBoard;
	};

	var createPosition = function () {
		var node = document.createElement('div');
		node.classList.add('position');
		return node;
	};

	var createBoards = function (boardClickHandler) {
		var boardNode = document.createElement('div');
		var memoryBoard = [];
		boardNode.classList.add('board');

		boardNode.addEventListener('click', boardClickHandler);

		for (var i = 0; i < NUMBER_OF_COLUMNS; i++) {
			var columnContainerNode = document.createElement('div');
			columnContainerNode.classList.add('column');
			columnContainerNode.dataset.column = i;

			memoryBoard.push([]);
			for (var j = 0; j < NUMBER_OF_ROWS; j++) {
				var positionNode = createPosition();
				var backgroundPositionNode = createPosition();
				backgroundPositionNode.classList.add('position', 'background');
				columnContainerNode.appendChild(backgroundPositionNode);
				columnContainerNode.appendChild(positionNode);

				memoryBoard[i].push({
					column: i,
					row: j,
					node: positionNode
				});
			}

			boardNode.appendChild(columnContainerNode);
		}

		return {
			boardNode,
			memoryBoard
		};
	};

	Board.prototype._handleClickOnColumn = function (column) {
		for (var i = this._memoryboard[column].length - 1; i >= 0 ; i--) {
			if (this._memoryboard[column][i].playerId === undefined) {
				this._memoryboard[column][i].playerId = this._currentPlayerId;
				this._memoryboard[column][i].node.classList.add(
					`player-${this._currentPlayerId}`,
					`position-${this._memoryboard[column][i].row}`
				);

				return; // exit the loop after the first empty circle is filled.
			}
		}
	};

	var checkRowWin = function (board) {
		var transposedBoard = board[0].map(function (column, index) {
			return board.map(function (row) {
				return row[index];
			});
		});
		return checkColumnWin(transposedBoard);
	};

	var checkColumnWin = function (board) {
		return board.some(function (column) {
			var currentPlayerId;
			var currentLength = 0;
			return column.some(function (position) {
				if (typeof currentPlayerId !== 'undefined' && position.playerId === currentPlayerId) {
					currentLength++;
				} else {
					currentPlayerId = position.playerId;
					currentLength = 1;
				}

				if (currentLength >= 4) {
					return true;
				}
			});
		});
	};

	var checkFourByFourSectionForWin = function (section) {
		var one = [section[0][0].playerId, section[1][1].playerId, section[2][2].playerId, section[3][3].playerId];
		var two = [section[0][3].playerId, section[1][2].playerId, section[2][1].playerId, section[3][0].playerId];

		return [one, two].some(function (group) {
			var totals = group.reduce(function (total, player) {
				if (player === undefined) {
					return total;
				}

				if (total[player] === undefined) {
					total[player] = 1;
				} else {
					total[player]++;
				}

				return total;
			}, {});

			return Object.keys(totals).some(function (player) {
				return totals[player] === 4;
			});
		});
	};

	var getFourByFourSection = function (board, startColumn, startRow) {
		var section = [];
		for (var i = startColumn; i < (startColumn + 4); i++) {
			section.push([]);
			for (var j = startRow; j < (startRow + 4); j++) {
				section[section.length - 1].push(board[i][j]);
			}
		}

		return section;
	};

	// could probably be done faster
	var checkDialogWin = function (board) {
		for (var i = 0; i < board.length - 3; i++) {
			for (var j = 0; j < board[i].length - 3; j++) {
				var section = getFourByFourSection(board, i, j);
				if (checkFourByFourSectionForWin(section)) {
					return true;
				}
			}
		}

		return false;
	};

	Board.prototype._boardClickHandler = function (event) {
		// stop responding to events once the game is won
		if (this._isWonState) {
			return;
		}

		var columnContainerNode = event.target;
		if (!event.target.classList.contains('column')) {
			columnContainerNode = event.target.parentNode;
		}

		var column = parseInt(columnContainerNode.dataset.column, 10);

		if (!isNaN(column)) {
			this._handleClickOnColumn(column);
			if (this.isWon()) {
				this._winHandler && this._winHandler();
			} else {
				this._switchPlayers();
			}
		}
	};

	Board.prototype._switchPlayers = function () {
		if (this._currentPlayerId === this._playerOne.id) {
			this._currentPlayerId = this._playerTwo.id;
		} else {
			this._currentPlayerId = this._playerOne.id;
		}
		this._onPlayerChangeHandler && this._onPlayerChangeHandler();
	};

	Board.prototype.isWon = function () {
		if (!this._isWonState) {
			this._isWonState = checkRowWin(this._memoryboard) ||
								checkColumnWin(this._memoryboard) ||
								checkDialogWin(this._memoryboard);
		}

		return this._isWonState;
	};

	Board.prototype.currentTurnsPlayerName = function () {
		if (this._currentPlayerId === this._playerOne.id) {
			return this._playerOne.name;
		} else {
			return this._playerTwo.name;
		}
	};

	Board.prototype.appendToNode = function (node) {
		node.appendChild(this._boardNode);
	};

	Board.prototype.onPlayerChangeEvent = function (callback) {
		this._onPlayerChangeHandler = callback;
	};

	Board.prototype.onWinEvent = function (callback) {
		this._winHandler = callback;
	};

	return Board;
});
