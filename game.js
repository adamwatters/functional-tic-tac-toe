var util = require('util');
var chalk = require('chalk');

var makeNewBoard = function(board) {
	return board.map(function(c){
		return c.slice();
		});
}

var rotateBoard = function(board) {
	return [].concat.apply([], board).reduce(function(p, c, i){
		if (p[i % board.length]) {
			p[i % board.length].push(c);
			return p;
		}
		p[i % board.length] = [c];
		return p;
	}, []);
};

var getLeftDiagnol = function(board) {
		return board.reduce(function(p, c, i){
			p.push(c[i]);
			return p;
	}, []);
}

var getRightDiagnol = function(board) {
	return board.reduce(function(p, c, i){
			p.push(c[board.length - 1 - i]);
			return p;
	}, []);
};

var checkRowForWin = function(player, row) {
	return row.every(function(val){return val === player})
};

var checkRowsForWin = function(board, turn) {
	return (board.some(function(row){
		return checkRowForWin(turn, row);
	})) 
};

var checkRowForEmpties = function(row) {
	return row.some(function(val){return val === '-'})
};

var checkBoardForEmpties = function(board) {
	return (board.some(function(row){
		return checkRowForEmpties(row);
	}))
};

var handleWin = function(state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn,
		winner: state.turn
	};
};

var handleDraw = function (state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn,
		winner: 'draw'
	};	
};

var handleNoEnd = function (state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn,
		winner: 'none'
	};
};

var rowWin = function(state) {
	return checkRowsForWin(state.board, state.turn);
};
 
var columnWin = function(state) {
	return checkRowsForWin(rotateBoard(state.board), state.turn);
}

var diagonalWin = function(state) {
	return checkRowForWin(state.turn, getLeftDiagnol(state.board)) ||
	checkRowForWin(state.turn, getRightDiagnol(state.board));
};

var checkForGameEnd = function(state){
	if (rowWin(state) || (columnWin(state)) || (diagonalWin(state))){
		return handleWin(state);
	} else if (!checkBoardForEmpties(state.board)) {
		return handleDraw(state);
	}
	return handleNoEnd(state);
};

var genMove = function(state, input) {
	var newBoard = makeNewBoard(state.board);
	var x = input[0];
	var y = input[1];
	newBoard[x][y] = state.turn;
	return newBoard;
};

var runMove = function(state, input){
	return {
		board: genMove(state, input),
		turn: state.turn,
		winner: state.winner
	}
};

var changeTurn = function	(state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn === 'X' ? 'O' : 'X',
		winner: state.winner
	}
};

var draw = function(state){
	state.board.map(function(row){console.log(chalk.bold.yellow(row))});
	console.log('');
	if (state.winner === 'X' || state.winner === 'O') {
		console.log(chalk.bold.cyan(state.winner + " is the winner!"));
		process.exit();
	} 
	if (state.winner === 'draw') {
		console.log(chalk.bold.cyan('bummer, its a draw'));
		process.exit();
	}
};

var parseInput = function(text) {
	return text.replace(/(\r\n|\n|\r)/gm,"").split(',').reverse();
}

var textIsValid = function(input, state) {
	return ((input.length === 2)
		&&(input[0] >= 0)
		&&(input[0] <= state.board.length - 1)
		&&(input[1] >= 0)
		&&(input[1] <= state.board.length - 1))
};

var noCollision = function(input, state) {
	return state.board[input[0]][input[1]] === '-';
}

var takeInput = function(state, gameCallBack) {
	console.log(chalk.bold.white(state.turn + "'s turn\n"));
	process.stdin.resume();
  	process.stdin.setEncoding('utf8');
  	process.stdin.once('data', function (text) {
  		var input = parseInput(text);
    	if (textIsValid(input, state) && noCollision(input, state)) {
      		gameCallBack(input);
   		} else  {
    		console.log(chalk.red("not a valid move, try again\n"));
    		takeInput(state, gameCallBack);
   		}
  	});
};

var game = function(state){
	draw(state);
	if (state.winner === 'none'){
		takeInput(state, function(input){
			game(changeTurn(checkForGameEnd(runMove(state, input))));
		});
	};
};

var startState = {
	board: [['-','-','-'],['-','-','-'],['-','-','-']],
	turn: 'X',
	winner: 'none'
}

game(startState);





