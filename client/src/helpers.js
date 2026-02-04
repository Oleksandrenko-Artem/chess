export const getCharacter = file => String.fromCharCode(file + 97);
export const createPosition = () => {
    // eslint-disable-next-line no-unused-vars
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));
    for(let i = 0; i< 8; i++) {
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
export const createOldPosition = () => {
    // eslint-disable-next-line no-unused-vars
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));
    for(let i = 0; i< 8; i++) {
        position[6][i] = 'white_soldier';
        position[1][i] = 'black_soldier';
    }
    position[7][0] = 'white_rook';
    position[7][1] = 'white_horse';
    position[7][2] = 'white_elephant';
    position[7][3] = 'white_imperator';
    position[7][4] = 'white_firzan';
    position[7][5] = 'white_elephant';
    position[7][6] = 'white_horse';
    position[7][7] = 'white_rook';
    position[0][0] = 'black_rook';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_elephant';
    position[0][3] = 'black_imperator';
    position[0][4] = 'black_firzan';
    position[0][5] = 'black_elephant';
    position[0][6] = 'black_horse';
    position[0][7] = 'black_rook';
    return position;
}
export const createSpecialPosition = () => {
    // eslint-disable-next-line no-unused-vars
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));
    for(let i = 0; i< 8; i++) {
        position[6][i] = '';
        position[1][i] = '';
    }
    position[7][0] = '';
    position[7][1] = '';
    position[7][2] = '';
    position[7][3] = '';
    position[7][4] = '';
    position[7][5] = '';
    position[7][6] = '';
    position[7][7] = '';
    position[0][0] = '';
    position[0][1] = '';
    position[0][2] = '';
    position[0][3] = '';
    position[0][4] = '';
    position[0][5] = '';
    position[0][6] = '';
    position[0][7] = '';
    return position;
}
export const createOldVariantPosition = () => {
    // eslint-disable-next-line no-unused-vars
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));
    for (let i = 0; i < 8; i++) {
        position[6][i] = 'white_pawn';
        position[1][i] = 'black_pawn';
    }
    position[7][0] = 'white_tank';
    position[7][1] = 'white_horse';
    position[7][2] = 'white_elephant';
    position[7][3] = 'white_king';
    position[7][4] = 'white_firzan';
    position[7][5] = 'white_elephant';
    position[7][6] = 'white_horse';
    position[7][7] = 'white_tank';
    position[0][0] = 'black_tank';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_elephant';
    position[0][3] = 'black_king';
    position[0][4] = 'black_firzan';
    position[0][5] = 'black_elephant';
    position[0][6] = 'black_horse';
    position[0][7] = 'black_tank';
    return position;
}
export const createDinoPosition = () => {
    // eslint-disable-next-line no-unused-vars
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));
    for (let i = 0; i < 8; i++) {
        position[6][i] = 'white_pawn';
        position[1][i] = 'black_pawn';
    }
    position[7][0] = 'white_dinozavr';
    position[7][1] = 'white_dinozavr';
    position[7][2] = 'white_dinozavr';
    position[7][3] = 'white_dinozavr';
    position[7][4] = 'white_king';
    position[7][5] = 'white_dinozavr';
    position[7][6] = 'white_dinozavr';
    position[7][7] = 'white_dinozavr';
    position[0][0] = 'black_dinozavr';
    position[0][1] = 'black_dinozavr';
    position[0][2] = 'black_dinozavr';
    position[0][3] = 'black_dinozavr';
    position[0][4] = 'black_king';
    position[0][5] = 'black_dinozavr';
    position[0][6] = 'black_dinozavr';
    position[0][7] = 'black_dinozavr';
    return position;
}
export const createExtendedPosition = () => {
    // eslint-disable-next-line no-unused-vars
    const position = new Array(8).fill('').map(x => new Array(8).fill(''));
    for (let i = 0; i < 8; i++) {
        position[5][i] = 'white_pawn';
        position[2][i] = 'black_pawn';
    }
    position[7][0] = 'white_rook';
    position[7][1] = 'white_camel';
    position[7][2] = 'white_bishop';
    position[7][3] = 'white_king';
    position[7][4] = 'white_firzan';
    position[7][5] = 'white_bishop';
    position[7][6] = 'white_camel';
    position[7][7] = 'white_rook';
    position[6][0] = 'white_tank';
    position[6][1] = 'white_horse';
    position[6][2] = 'white_elephant';
    position[6][3] = 'white_giraffe';
    position[6][4] = 'white_giraffe';
    position[6][5] = 'white_elephant';
    position[6][6] = 'white_horse';
    position[6][7] = 'white_tank';
    position[1][0] = 'black_tank';
    position[1][1] = 'black_horse';
    position[1][2] = 'black_elephant';
    position[1][3] = 'black_giraffe';
    position[1][4] = 'black_giraffe';
    position[1][5] = 'black_elephant';
    position[1][6] = 'black_horse';
    position[1][7] = 'black_tank';
    position[0][0] = 'black_rook';
    position[0][1] = 'black_camel';
    position[0][2] = 'black_bishop';
    position[0][3] = 'black_king';
    position[0][4] = 'black_firzan';
    position[0][5] = 'black_bishop';
    position[0][6] = 'black_camel';
    position[0][7] = 'black_rook';
    return position;
}
export const getNewMoveNotation = ({ p, rank, file, targetRank, targetFile, isInCheck, isCheckmate, isStalemate, position, promotesTo }) => {
    if (p[6].toLowerCase() === 'k' && Math.abs(file - targetFile) === 2) {
        let castling = targetFile > file ? 'O-O' : 'O-O-O';
        if (isCheckmate) return castling + '#';
        if (isInCheck) return castling + '+';
        return castling;
    }
    let note = '';
    const pieceType = p[6].toLowerCase();
    const isCapture = !!position[targetRank][targetFile];
    const isSailboat = (pieceType === 's' && localStorage.getItem('replaceRook') === 'sailboat');
    const isPawnType = pieceType === 'p' || (pieceType === 's' && !isSailboat);
    if (!isPawnType) {
        if (pieceType === 'i') {
            note += 'K'
        } else if (isSailboat) {
            note += 'S';
        } else {
            note += pieceType.toUpperCase();
        }
        if (isCapture) note += 'x';
    } else {
        if (file !== targetFile) {
            note += getCharacter(file) + 'x';
        }
    }
    const displayRank = 8 - targetRank;
    note += getCharacter(targetFile) + displayRank;
    if (promotesTo) {
        note += '=' + promotesTo[0].toUpperCase();
    }
    if (isCheckmate) {
        note += '#';
    } else if (isInCheck) {
        note += '+';
    }
    if (isStalemate) {
        return note + '1/2-1/2';
    }
    return note;
};
export const copyPosition = position => {
    // eslint-disable-next-line no-unused-vars
    const newPosition = new Array(8).fill('').map(x => new Array(8).fill(''));
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            newPosition[rank][file] = position[rank][file]
        }
    }
    return newPosition;
}
export const areSameColorBishops = (coords1, coords2) => {
    if (!coords1 || !coords2) {
        return false;
    }
    return (coords1.x + coords1.y) % 2 === (coords2.x + coords2.y) % 2;
};
export const findPieceCoords = (position, pieceName) => {
    let results = [];
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            if (position[r][f] === pieceName) {
                results.push({ x: r, y: f });
            }
        }
    }
    return results;
};