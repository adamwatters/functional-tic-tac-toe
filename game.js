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

var genCoord = function(state){
	return Math.floor(Math.random() * state.board.length);
};

var genMove = function(state) {
	var newBoard = makeNewBoard(state.board);
	var x = genCoord(state);
	var y = genCoord(state);
		if (newBoard[x][y] === '-'){
			newBoard[x][y] = state.turn;
			return newBoard;
		}
	return genMove(state);
};

var changeTurn = function	(state) {
	return {
		board: makeNewBoard(state.board),
		turn: state.turn === 'X' ? 'O' : 'X',
		winner: state.winner
	}
};

var runMove = function(state){
	return {
		board: genMove(state),
		turn: state.turn,
		winner: state.winner
	}
};

var draw = function(state){
	state.board.map(function(row){console.log(row)});
	console.log('');
	if (state.winner === 'X' || state.winner === 'O') {
		console.log(state.winner + " is the winner!");
	} 
	if (state.winner === 'draw') {
		console.log('bummer, its a draw');
	}
};

var game = function(state){
	draw(state);
	if (state.winner === 'none'){
		game(changeTurn(checkForGameEnd(runMove(state))));
	};
};

var startState = {
	board: [['-','-','-'],['-','-','-'],['-','-','-']],
	turn: 'X',
	winner: 'none'
}

game(startState);





