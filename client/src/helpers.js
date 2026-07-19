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
    position[7][2] = 'white_elephant';
    position[7][3] = 'white_imperator';
    position[7][4] = 'white_firzan';
    position[7][5] = 'white_elephant';
    position[7][6] = 'white_horse';
    position[7][7] = 'white_chariot';
    position[0][0] = 'black_chariot';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_elephant';
    position[0][3] = 'black_imperator';
    position[0][4] = 'black_firzan';
    position[0][5] = 'black_elephant';
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

    position[5][0] = 'white_checkers';
    position[5][1] = 'white_checkers';
    position[5][2] = 'white_checkers';
    position[5][3] = 'white_checkers';
    position[5][4] = 'white_checkers';
    position[5][5] = 'white_checkers';
    position[5][6] = 'white_checkers';
    position[5][7] = 'white_checkers';

    position[2][0] = 'black_checkers';
    position[2][1] = 'black_checkers';
    position[2][2] = 'black_checkers';
    position[2][3] = 'black_checkers';
    position[2][4] = 'black_checkers';
    position[2][5] = 'black_checkers';
    position[2][6] = 'black_checkers';
    position[2][7] = 'black_checkers';

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
export const createOldVariantPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
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
export const createDinoPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
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
export const createExtendedPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
        position[5][i] = 'white_pawn';
        position[2][i] = 'black_pawn';
    }
    position[7][0] = 'white_rook';
    position[7][1] = 'white_camel';
    position[7][2] = 'white_wildebeest';
    position[7][3] = 'white_king';
    position[7][4] = 'white_rukh';
    position[7][5] = 'white_wildebeest';
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
    position[0][2] = 'black_wildebeest';
    position[0][3] = 'black_king';
    position[0][4] = 'black_rukh';
    position[0][5] = 'black_wildebeest';
    position[0][6] = 'black_camel';
    position[0][7] = 'black_rook';

    return position;
}
export const createFerzVsRukhPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
        position[5][i] = 'white_ferz';
        position[6][i] = 'white_ferz';
        position[2][i] = 'black_rukh';
        position[1][i] = 'black_rukh';
    }
    position[7][0] = 'white_ferz';
    position[7][1] = 'white_ferz';
    position[7][2] = 'white_ferz';
    position[7][3] = 'white_king';
    position[7][4] = 'white_ferz';
    position[7][5] = 'white_ferz';
    position[7][6] = 'white_ferz';
    position[7][7] = 'white_ferz';

    position[0][0] = 'black_rukh';
    position[0][1] = 'black_rukh';
    position[0][2] = 'black_rukh';
    position[0][3] = 'black_king';
    position[0][4] = 'black_rukh';
    position[0][5] = 'black_rukh';
    position[0][6] = 'black_rukh';
    position[0][7] = 'black_rukh';

    return position;
}
export const createWallsPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
        position[1][i] = 'brick';
    }

    position[7][0] = 'white_king';
    position[7][1] = 'white_zebra';
    position[7][2] = 'brick';
    position[7][3] = 'white_camel';
    position[7][4] = 'white_rhino';
    position[7][5] = 'brick';
    position[7][6] = 'brick';
    position[7][7] = 'brick';

    position[6][0] = 'brick';
    position[6][1] = 'brick';
    position[6][2] = 'brick';
    position[6][3] = 'white_horse';
    position[6][4] = 'brick';
    position[6][5] = 'brick';
    position[6][6] = 'white_tank';
    position[6][7] = 'white_horse';

    position[5][2] = 'brick';
    position[5][4] = 'brick';
    position[5][5] = 'brick';
    position[5][6] = 'brick';
    position[5][7] = 'brick';

    position[4][5] = 'brick';
    position[4][7] = 'brick';

    position[3][0] = 'brick';
    position[3][1] = 'brick';
    position[3][2] = 'brick';
    position[3][3] = 'brick';
    position[3][5] = 'brick';

    position[2][0] = 'brick';
    position[2][5] = 'brick';

    position[0][0] = 'black_zebra';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_tank';
    position[0][3] = 'black_rhino';
    position[0][4] = 'black_king';
    position[0][5] = 'brick';
    position[0][6] = 'black_horse';
    position[0][7] = 'black_camel';

    return position;
}
export const createArenaPosition = (size = 8) => {
    const position = createEmptyPosition(size);

    position[7][0] = 'brick';
    position[7][1] = 'white_horse';
    position[7][2] = 'brick';
    position[7][3] = 'white_king';
    position[7][4] = 'white_man';
    position[7][5] = 'brick';
    position[7][6] = 'white_horse';
    position[7][7] = 'brick';

    position[6][0] = 'brick';
    position[6][1] = 'brick';
    position[6][2] = 'brick';
    position[6][3] = 'brick';
    position[6][5] = 'brick';
    position[6][6] = 'brick';
    position[6][7] = 'brick';

    position[5][0] = 'white_rook';
    position[5][7] = 'white_rook';

    position[4][0] = 'brick';
    position[4][1] = 'brick';
    position[4][6] = 'brick';
    position[4][7] = 'brick';

    position[3][0] = 'brick';
    position[3][1] = 'brick';
    position[3][6] = 'brick';
    position[3][7] = 'brick';

    position[2][0] = 'black_rook';
    position[2][7] = 'black_rook';

    position[1][0] = 'brick';
    position[1][1] = 'brick';
    position[1][2] = 'brick';
    position[1][4] = 'brick';
    position[1][5] = 'brick';
    position[1][6] = 'brick';
    position[1][7] = 'brick';

    position[0][0] = 'brick';
    position[0][1] = 'black_horse';
    position[0][2] = 'brick';
    position[0][3] = 'black_man';
    position[0][4] = 'black_king';
    position[0][5] = 'brick';
    position[0][6] = 'black_horse';
    position[0][7] = 'brick';
    return position;
}
export const createGrandAceDrexPosition = (size = 12) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 12);

    for (let i = 0; i < cols; i++) {
        position[3][i] = 'black_pawn';
        position[8][i] = 'white_pawn';
    }

    position[0][0] = 'black_rook';
    position[0][1] = 'black_lion';
    position[0][2] = 'black_rhino';
    position[0][3] = 'black_zebra';
    position[0][4] = 'black_bishop';
    position[0][5] = 'black_rukh';
    position[0][6] = 'black_king';
    position[0][7] = 'black_bishop';
    position[0][8] = 'black_zebra';
    position[0][9] = 'black_rhino';
    position[0][10] = 'black_lion';
    position[0][11] = 'black_rook';

    position[11][0] = 'white_rook';
    position[11][1] = 'white_lion';
    position[11][2] = 'white_rhino';
    position[11][3] = 'white_zebra';
    position[11][4] = 'white_bishop';
    position[11][5] = 'white_rukh';
    position[11][6] = 'white_king';
    position[11][7] = 'white_bishop';
    position[11][8] = 'white_zebra';
    position[11][9] = 'white_rhino';
    position[11][10] = 'white_lion';
    position[11][11] = 'white_rook';

    return position;
}
export const createAmazonPosition = (size = 8) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 8);

    for (let i = 0; i < cols; i++) {
        position[1][i] = 'black_pawn';
    }

    position[0][0] = 'black_rook';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_bishop';
    position[0][3] = 'black_ferz';
    position[0][4] = 'black_king';
    position[0][5] = 'black_bishop';
    position[0][6] = 'black_horse';
    position[0][7] = 'black_rook';

    position[7][3] = 'white_amazon';
    position[7][4] = 'white_king';

    return position;
}
export const createGreatChessPosition = (size = 10) => {
    const position = createEmptyPosition(size);

    position[9][0] = 'white_rook';
    position[9][1] = 'white_horse';
    position[9][2] = 'white_bishop';
    position[9][3] = 'white_archbishop';
    position[9][4] = 'white_amazon';
    position[9][5] = 'white_imperator';
    position[9][6] = 'white_ferz';
    position[9][7] = 'white_bishop';
    position[9][8] = 'white_horse';
    position[9][9] = 'white_rook';

    position[8][0] = 'white_soldier';
    position[8][1] = 'white_soldier';
    position[8][2] = 'white_soldier';
    position[8][3] = 'white_soldier';
    position[8][4] = 'white_marshal';
    position[8][5] = 'white_marshal';
    position[8][6] = 'white_soldier';
    position[8][7] = 'white_soldier';
    position[8][8] = 'white_soldier';
    position[8][9] = 'white_soldier';

    position[7][4] = 'white_soldier';
    position[7][5] = 'white_soldier';
    position[2][4] = 'black_soldier';
    position[2][5] = 'black_soldier';

    position[1][0] = 'black_soldier';
    position[1][1] = 'black_soldier';
    position[1][2] = 'black_soldier';
    position[1][3] = 'black_soldier';
    position[1][4] = 'black_marshal';
    position[1][5] = 'black_marshal';
    position[1][6] = 'black_soldier';
    position[1][7] = 'black_soldier';
    position[1][8] = 'black_soldier';
    position[1][9] = 'black_soldier';

    position[0][0] = 'black_rook';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_bishop';
    position[0][3] = 'black_ferz';
    position[0][4] = 'black_imperator';
    position[0][5] = 'black_amazon';
    position[0][6] = 'black_archbishop';
    position[0][7] = 'black_bishop';
    position[0][8] = 'black_horse';
    position[0][9] = 'black_rook';


    return position;
}
export const createGrandChessPosition = (size = 10) => {
    const position = createEmptyPosition(size);
    const cols = Math.min(size, 10);

    for (let i = 0; i < cols; i++) {
        position[2][i] = 'black_pawn';
        position[7][i] = 'white_pawn';
    }

    position[9][0] = 'white_rook';
    position[8][1] = 'white_horse';
    position[8][2] = 'white_bishop';
    position[8][3] = 'white_ferz';
    position[8][4] = 'white_imperator';
    position[8][5] = 'white_marshal';
    position[8][6] = 'white_archbishop';
    position[8][7] = 'white_bishop';
    position[8][8] = 'white_horse';
    position[9][9] = 'white_rook';

    position[0][0] = 'black_rook';
    position[1][1] = 'black_horse';
    position[1][2] = 'black_bishop';
    position[1][3] = 'black_ferz';
    position[1][4] = 'black_imperator';
    position[1][5] = 'black_marshal';
    position[1][6] = 'black_archbishop';
    position[1][7] = 'black_bishop';
    position[1][8] = 'black_horse';
    position[0][9] = 'black_rook';

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
    backRank[queen] = 'ferz';

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
export const getNewMoveNotation = ({ p, rank, file, targetRank, targetFile, isInCheck, isCheckmate, isStalemate, position, promotesTo, rookType, isCapture = null }) => {
    if (p[6].toLowerCase() === 'k' && p[7].toLowerCase() === 'i' && Math.abs(file - targetFile) === 2) {
        let castling = targetFile > file ? 'O-O' : 'O-O-O';
        if (isCheckmate) return castling + '#';
        if (isInCheck) return castling + '+';
        return castling;
    }
    let note = '';
    const princeType = p[6].toLowerCase() === 'p' && p[7].toLowerCase() === 'r';
    const pieceType = p[6].toLowerCase();
    const hasCapture = isCapture ?? !!position?.[targetRank]?.[targetFile];
    const isSailboat = (pieceType === 's' && rookType === 'sailboat');
    const isPawnType = pieceType === 'p' && !princeType || (pieceType === 's' && !isSailboat);
    if (!isPawnType) {
        if (pieceType === 'i') {
            note += 'K'
        } else if (isSailboat) {
            note += 'S';
        } else {
            note += pieceType.toUpperCase();
        }
        if (hasCapture) note += 'x';
    } else {
        if (file !== targetFile) {
            note += getCharacter(file) + 'x';
        }
    }
    const boardSize = position?.length || 8;
    const displayRank = boardSize - targetRank;
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
