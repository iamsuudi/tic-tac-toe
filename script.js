
function GameBoard() {

    // the cells array
    const board = [[], [], []];

    const getBoard = () => board;

    // drop token in a cell when called
    const dropToken = (row, col, token) => {
        if (board[row][col].getValue() === "-")
            board[row][col].addToken(token);
    };

    // print values in cells when called
    const printBoard = () => {
        const boardWithCells = board.map(row => row.map(cell => cell.getValue()));
        console.table(boardWithCells);
    }

    // resets cell values to default one
    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++)
                board[i][j] = cell();
        }
    }

    // fill each cell with an object which has addToken and getValue methods
    resetBoard();

    return { getBoard, dropToken, printBoard, resetBoard };
}

function GameController(player1 = "Player One", player2 = "Player Two") {

    const board = GameBoard();

    const players = [
        { name: player1, token: "X" },
        { name: player2, token: "O" }
    ]

    // default active player is player 1
    let activePlayer = players[0];

    // switchs active player when called
    const switchPlayerTurn = () => {
        activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        // print current board
        board.printBoard();

        console.log(`${getActivePlayer().name}'s turn`);
    }

    const winChecker = () => {
        const table = board.getBoard();

        // row checking
        for (let row = 0; row < table.length; row++) {
            state = rowChecker(table[row]);
            if (state === "X")
                return "X has won!";
            else if (state === "O")
                return "O has won!";

            // column checking
            state = columnChecker(row);
            if (state === "X")
                return "X has won!";
            else if (state === "O")
                return "O has won!";
        }

        // diagonals checking
        state = diagonalChecker();
        if (state === "X")
            return "X has won!";
        else if (state === "O")
            return "O has won!";

        // check if all cells are filled
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (table[i][j].getValue() === "-") return "yet";
            }
        }

        // return tie
        return "It's tie";

        function rowChecker(row) {
            if (row[0].getValue() === row[1].getValue() && row[1].getValue() !== "-"  && row[1].getValue() === row[2].getValue())
                return row[0].getValue();
        }

        function columnChecker(col) {
            if (table[0][col].getValue() === table[1][col].getValue() && table[1][col].getValue() !== "-"  && table[1][col].getValue() === table[2][col].getValue())
                return table[0][col].getValue();
        }

        function diagonalChecker() {
            if (table[0][0].getValue() === table[1][1].getValue() && table[1][1].getValue() !== "-" && table[2][2].getValue() === table[1][1].getValue())
                return table[1][1].getValue();
            if (table[2][0].getValue() === table[1][1].getValue() && table[1][1].getValue() !== "-"  && table[1][1].getValue() === table[0][2].getValue())
                return table[1][1].getValue();
        }
    }

    const playOneRound = (row, col) => {

        console.log(`Dropping ${getActivePlayer().name}'s token into row-${row} column-${col}`);

        board.dropToken(row, col, getActivePlayer().token);
      
        let state = winChecker();

        if (state == "yet") {
            // the board is not full and there is no winner
            switchPlayerTurn();
            printNewRound();
            console.log(state);
        }
        else {
            // there is a winner or it's a tie / board is full
            board.printBoard();
            console.log(state);
            board.clearBoard();
        }
    }

    printNewRound();

    return { playOneRound, getActivePlayer, winChecker };
}

function cell() {

    let value = "-";

    const addToken = (player = value) => value = player;

    const getValue = () => value;

    return { addToken, getValue };
}

function screenController() {
    const game = GameController();

    const p = document.querySelector('p.winner');

    const container = document.querySelector('div.container');
    
    container.addEventListener('click', updateScreen);

    function updateScreen(event) {
        let target = event.target;
        let activePlayer = game.getActivePlayer();
        game.playOneRound(target.dataset.row, target.dataset.col);
        
        if (game.winChecker() !== "yet") {
            p.textContent = game.winChecker();
            container.removeEventListener("click", updateScreen);
        }

        target.textContent = activePlayer.token;
    }
}

screenController();