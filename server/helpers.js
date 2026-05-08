const getCharacter = (file) => String.fromCharCode(file + 97);

const createEmptyPosition = (size = 8) =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => ""));

const createPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);
    for (let i = 0; i < cols; i++) {
        position[6][i] = 'white_pawn';
        position[1][i] = 'black_pawn';
    }
    position[7][0] = 'white_rook';
    position[7][1] = 'white_horse';
    position[7][2] = 'white_bishop';
    position[7][3] = 'white_ferz';
    position[7][4] = 'white_king';
    position[7][5] = 'white_bishop';
    position[7][6] = 'white_horse';
    position[7][7] = 'white_rook';
    position[0][0] = 'black_rook';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_bishop';
    position[0][3] = 'black_ferz';
    position[0][4] = 'black_king';
    position[0][5] = 'black_bishop';
    position[0][6] = 'black_horse';
    position[0][7] = 'black_rook';

    return position;
};

const createChess960Position = (size = 8) => {
    const position = createEmptyPosition(size);

    const backRank = Array(8).fill(null);

    const evenSquares = [0, 2, 4, 6];
    const oddSquares = [1, 3, 5, 7];

    const bishop1 = evenSquares[Math.floor(Math.random() * evenSquares.length)];
    const bishop2 = oddSquares[Math.floor(Math.random() * oddSquares.length)];

    backRank[bishop1] = 'bishop';
    backRank[bishop2] = 'bishop';

    let emptySquares = backRank.map((v, i) => v === null ? i : null).filter(v => v !== null);
    const queen = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    backRank[queen] = 'ferz';

    emptySquares = backRank.map((v, i) => v === null ? i : null).filter(v => v !== null);
    const knight1 = emptySquares.splice(Math.floor(Math.random() * emptySquares.length), 1)[0];
    const knight2 = emptySquares.splice(Math.floor(Math.random() * emptySquares.length), 1)[0];

    backRank[knight1] = 'horse';
    backRank[knight2] = 'horse';

    emptySquares = backRank.map((v, i) => v === null ? i : null).filter(v => v !== null);

    emptySquares.sort((a, b) => a - b);
    const [rook1, king, rook2] = emptySquares;

    backRank[rook1] = 'rook';
    backRank[king] = 'king';
    backRank[rook2] = 'rook';

    for (let i = 0; i < 8; i++) {
        position[7][i] = 'white_' + backRank[i];
        position[6][i] = 'white_pawn';

        position[0][i] = 'black_' + backRank[i];
        position[1][i] = 'black_pawn';
    }

    return position;
};

const createShatranj960Position = (size = 8) => {
    const position = createEmptyPosition(size);

    const backRank = Array(8).fill(null);

    const evenSquares = [0, 2, 4, 6];
    const oddSquares = [1, 3, 5, 7];

    const bishop1 = evenSquares[Math.floor(Math.random() * evenSquares.length)];
    const bishop2 = oddSquares[Math.floor(Math.random() * oddSquares.length)];

    backRank[bishop1] = 'elephant';
    backRank[bishop2] = 'elephant';

    let emptySquares = backRank.map((v, i) => v === null ? i : null).filter(v => v !== null);
    const queen = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    backRank[queen] = 'firzan';

    emptySquares = backRank.map((v, i) => v === null ? i : null).filter(v => v !== null);
    const knight1 = emptySquares.splice(Math.floor(Math.random() * emptySquares.length), 1)[0];
    const knight2 = emptySquares.splice(Math.floor(Math.random() * emptySquares.length), 1)[0];

    backRank[knight1] = 'horse';
    backRank[knight2] = 'horse';

    emptySquares = backRank.map((v, i) => v === null ? i : null).filter(v => v !== null);

    emptySquares.sort((a, b) => a - b);
    const [rook1, king, rook2] = emptySquares;

    backRank[rook1] = 'chariot';
    backRank[king] = 'imperator';
    backRank[rook2] = 'chariot';

    for (let i = 0; i < 8; i++) {
        position[7][i] = 'white_' + backRank[i];
        position[6][i] = 'white_soldier';

        position[0][i] = 'black_' + backRank[i];
        position[1][i] = 'black_soldier';
    }

    return position;
};

const getInitialStateByMode = (mode, boardSize = 8) => {
    const baseState = {
        position: [],
        playerTurn: 'white',
        movesList: [],
        validMoves: [],
        status: 'ongoing',
        promotionSquare: null,
        castleDirection: {
            white: 'both',
            black: 'both',
        },
        captured: {
            white: [],
            black: [],
        },
        orientation: 'white',
        whiteTime: 3600,
        blackTime: 3600,
        timerActive: false,
        boardSize,
        isMultiplayer: true,
        roomId: null,
        roomName: null,
        isVsBot: false,
    };

    if (mode === "shatranj") {
        baseState.position = [createEmptyPosition(boardSize)];
    } else if (mode === "chess960") {
        baseState.position = [createChess960Position(boardSize)];
    } else if (mode === "shatranj960") {
        baseState.position = [createShatranj960Position(boardSize)];
    } else if (mode === "custom") {
        baseState.position = [createEmptyPosition(boardSize)];
    } else {
        baseState.position = [createPosition(boardSize)];
    }

    return baseState;
};

module.exports = {
    createChess960Position,
    createShatranj960Position,
    getInitialStateByMode,
};