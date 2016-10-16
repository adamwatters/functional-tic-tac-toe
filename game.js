var util = require('util');
var chalk = require('chalk');

var startState = {
	board: [['-','-','-'],['-','-','-'],['-','-','-']],
	turn: 'X',
	winner: 'none'
}

game(startState);

function game(state) {
	draw(state);
	if (state.winner === 'none'){
		takeInput(state, function(input){
			game(changeTurn(checkForGameEnd(runMove(state, input))));
		});
	};
};

function draw(state) {
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

function takeInput(state, gameCallBack) {
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

function makeNewBoard(board) {
	return board.map(function(c){
		return c.slice();
		});
}

function rotateBoard(board) {
	return [].concat.apply([], board).reduce(function(p, c, i){
		if (p[i % board.length]) {
			p[i % board.length].push(c);
			return p;
		}
		p[i % board.length] = [c];
		return p;
	}, []);
};

function getLeftDiagnol(board) {
		return board.reduce(function(p, c, i){
			p.push(c[i]);
			return p;
	}, []);
}

function getRightDiagnol(board) {
	return board.reduce(function(p, c, i){
			p.push(c[board.length - 1 - i]);
			return p;
	}, []);
};

function checkRowForWin(player, row) {
	return row.every(function(val){return val === player})
};

function checkRowsForWin(board, turn) {
	return (board.some(function(row){
		return checkRowForWin(turn, row);
	})) 
};

function checkRowForEmpties(row) {
	return row.some(function(val){return val === '-'})
};

function checkBoardForEmpties(board) {
	return (board.some(function(row){
		return checkRowForEmpties(row);
	}))
};

function handleWin(state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn,
		winner: state.turn
	};
};

function handleDraw (state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn,
		winner: 'draw'
	};	
};

function handleNoEnd (state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn,
		winner: 'none'
	};
};

function rowWin(state) {
	return checkRowsForWin(state.board, state.turn);
};
 
function columnWin(state) {
	return checkRowsForWin(rotateBoard(state.board), state.turn);
}

function diagonalWin(state) {
	return checkRowForWin(state.turn, getLeftDiagnol(state.board)) ||
	checkRowForWin(state.turn, getRightDiagnol(state.board));
};

function checkForGameEnd(state){
	if (rowWin(state) || (columnWin(state)) || (diagonalWin(state))){
		return handleWin(state);
	} else if (!checkBoardForEmpties(state.board)) {
		return handleDraw(state);
	}
	return handleNoEnd(state);
};

function genMove(state, input) {
	var newBoard = makeNewBoard(state.board);
	var x = input[0];
	var y = input[1];
	newBoard[x][y] = state.turn;
	return newBoard;
};

function runMove(state, input){
	return {
		board: genMove(state, input),
		turn: state.turn,
		winner: state.winner
	}
};

function changeTurn	(state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn === 'X' ? 'O' : 'X',
		winner: state.winner
	}
};

function parseInput(text) {
	return text.replace(/(\r\n|\n|\r)/gm,"").split(',').reverse();
}

function textIsValid(input, state) {
	return ((input.length === 2)
		&&(input[0] >= 0)
		&&(input[0] <= state.board.length - 1)
		&&(input[1] >= 0)
		&&(input[1] <= state.board.length - 1))
};

function noCollision(input, state) {
	return state.board[input[0]][input[1]] === '-';
}







