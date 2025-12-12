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
    position[7][3] = 'white_king';
    position[7][4] = 'white_firzan';
    position[7][5] = 'white_elephant';
    position[7][6] = 'white_horse';
    position[7][7] = 'white_rook';
    position[0][0] = 'black_rook';
    position[0][1] = 'black_horse';
    position[0][2] = 'black_elephant';
    position[0][3] = 'black_king';
    position[0][4] = 'black_firzan';
    position[0][5] = 'black_elephant';
    position[0][6] = 'black_horse';
    position[0][7] = 'black_rook';
    return position;
}
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