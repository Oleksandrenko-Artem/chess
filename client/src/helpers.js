export const getCharacter = (file) => String.fromCharCode(file + 97);

export const createEmptyPosition = (size = 8) =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => ""));

export const createPosition = (size = 8) => {
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
}
export const createOldPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
        position[6][i] = 'white_soldier';
        position[1][i] = 'black_soldier';
    }

    position[7][0] = 'white_chariot';
    position[7][1] = 'white_horse';
    position[7][2] = 'white_alfil';
    position[7][3] = 'white_imperator';
    position[7][4] = 'white_firzan';
    position[7][5] = 'white_alfil';
    position[7][6] = 'white_horse';
    position[7][7] = 'white_chariot';
    position[0][0] = 'black_chariot';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_alfil';
    position[0][3] = 'black_imperator';
    position[0][4] = 'black_firzan';
    position[0][5] = 'black_alfil';
    position[0][6] = 'black_horse';
    position[0][7] = 'black_chariot';

    return position;
}
export const createCheckersPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    position[7][0] = 'white_checkers';
    position[7][1] = 'white_checkers';
    position[7][2] = 'white_checkers';
    position[7][3] = 'white_king';
    position[7][4] = 'white_checkers';
    position[7][5] = 'white_checkers';
    position[7][6] = 'white_checkers';
    position[7][7] = 'white_checkers';

    position[6][0] = 'white_checkers';
    position[6][1] = 'white_checkers';
    position[6][2] = 'white_checkers';
    position[6][3] = 'white_checkers';
    position[6][4] = 'white_checkers';
    position[6][5] = 'white_checkers';
    position[6][6] = 'white_checkers';
    position[6][7] = 'white_checkers';

    position[1][0] = 'black_checkers';
    position[1][1] = 'black_checkers';
    position[1][2] = 'black_checkers';
    position[1][3] = 'black_checkers';
    position[1][4] = 'black_checkers';
    position[1][5] = 'black_checkers';
    position[1][6] = 'black_checkers';
    position[1][7] = 'black_checkers';

    position[0][0] = 'black_checkers';
    position[0][1] = 'black_checkers';
    position[0][2] = 'black_checkers';
    position[0][3] = 'black_checkers';
    position[0][4] = 'black_king';
    position[0][5] = 'black_checkers';
    position[0][6] = 'black_checkers';
    position[0][7] = 'black_checkers';

    return position;
}
export const createSpecialPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    return position;
}
export const createNewVariantPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
        position[6][i] = 'white_pawn';
        position[1][i] = 'black_pawn';
    }
    position[7][0] = 'white_rook';
    position[7][1] = 'white_knight';
    position[7][2] = 'white_bishop';
    position[7][3] = 'white_prince';
    position[7][4] = 'white_king';
    position[7][5] = 'white_bishop';
    position[7][6] = 'white_knight';
    position[7][7] = 'white_rook';
    position[0][0] = 'black_rook';
    position[0][1] = 'black_knight';
    position[0][2] = 'black_bishop';
    position[0][3] = 'black_prince';
    position[0][4] = 'black_king';
    position[0][5] = 'black_bishop';
    position[0][6] = 'black_knight';
    position[0][7] = 'black_rook';

    return position;
}
export const createChess960Position = (size = 8) => {
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
export const createShatranj960Position = (size = 8) => {
    const position = createEmptyPosition(size);

    const backRank = Array(8).fill(null);

    const evenSquares = [0, 2, 4, 6];
    const oddSquares = [1, 3, 5, 7];

    const alfil1 = evenSquares[Math.floor(Math.random() * evenSquares.length)];
    const alfil2 = oddSquares[Math.floor(Math.random() * oddSquares.length)];

    backRank[alfil1] = 'alfil';
    backRank[alfil2] = 'alfil';

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
export const createNewChess960Position = (size = 8) => {
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
    backRank[queen] = 'prince';

    emptySquares = backRank.map((v, i) => v === null ? i : null).filter(v => v !== null);
    const knight1 = emptySquares.splice(Math.floor(Math.random() * emptySquares.length), 1)[0];
    const knight2 = emptySquares.splice(Math.floor(Math.random() * emptySquares.length), 1)[0];

    backRank[knight1] = 'knight';
    backRank[knight2] = 'knight';

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
export const getNewMoveNotation = ({ p, rank, file, targetRank, targetFile, isInCheck, isCheckmate, isStalemate, position, promotesTo, isCapture = null }) => {
    const color = p.match(/^(white|black|yellow|blue|green|red)_/)?.[1];
    const piece = p.replace(/^(white|black|yellow|blue|green|red)_/, '');
    const createMove = (text) => ({ text, piece, color });
    const boardSize = position?.length || 8;
    const getSquare = (squareRank, squareFile) => `${getCharacter(squareFile)}${boardSize - squareRank}`;
    const fromSquare = getSquare(rank, file);
    const toSquare = getSquare(targetRank, targetFile);
    if (p[6].toLowerCase() === 'k' && p[7].toLowerCase() === 'i' && Math.abs(file - targetFile) === 2) {
        let castling = `${fromSquare}-${toSquare}`;
        if (isCheckmate) return createMove(castling + '#');
        if (isInCheck) return createMove(castling + '+');
        return createMove(castling);
    }
    let note = `${fromSquare}${(isCapture ?? !!position?.[targetRank]?.[targetFile]) ? 'x' : '-'}${toSquare}`;
    if (promotesTo) {
        note += '=' + promotesTo[0].toUpperCase();
    }
    if (isCheckmate) {
        note += '#';
    } else if (isInCheck) {
        note += '+';
    }
    if (isStalemate) {
        return createMove(note + '1/2-1/2');
    }
    return createMove(note);
};
export const copyPosition = (position) => {
    const size = position?.length || 8;
    const newPosition = createEmptyPosition(size);
    for (let rank = 0; rank < size; rank++) {
        for (let file = 0; file < size; file++) {
            newPosition[rank][file] = position[rank][file];
        }
    }
    return newPosition;
};
export const areSameColorBishops = (coords1, coords2) => {
    if (!coords1 || !coords2) {
        return false;
    }
    return (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y) % 2;
};
export const findPieceCoords = (position, pieceName) => {
    const boardSize = position?.length || 8;
    let results = [];
    for (let r = 0; r < boardSize; r++) {
        for (let f = 0; f < boardSize; f++) {
            if (position[r][f] === pieceName) {
                results.push({ x: r, y: f });
            }
        }
    }
    return results;
};
export const generatePositionHash = (position, playerTurn, castleDirection) => {
    const boardString = position.map(row => row.join(',')).join('|');

    const turnString = playerTurn;

    const castleString = JSON.stringify(castleDirection);

    return `${boardString}_${turnString}_${castleString}`;
};
