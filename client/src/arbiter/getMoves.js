import arbiter from "./arbiter";

export const getRookMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const enemy = us === 'white' ? 'black' : 'white';
    const direction = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];
    direction.forEach(dir => {
        for (let i = 1; i < 8; i++) {
            const x = rank + (i * dir[0]);
            const y = file + (i * dir[1]);
            if (position?.[x]?.[y] === undefined) {
                break;
            }
            if (position[x][y].startsWith(enemy)) {
                moves.push([x, y]);
                break;
            }
            if (position[x][y].startsWith(us)) {
                break;
            }
            moves.push([x, y]);
        };
    });
    return moves;
};
export const getHorseMoves = ({ position, rank, file }) => {
    const moves = [];
    const enemy = position[rank][file].startsWith('white') ? 'black' : 'white';
    const valid = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
    ];
    valid.forEach(val => {
        const x = rank + val[0];
        const y = file + val[1];
        const cell = position?.[rank + val[0]]?.[file + val[1]];
        if (cell !== undefined && (cell.startsWith(enemy) || cell === '')) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getElephantMoves = ({ position, rank, file }) => {
    const moves = [];
    const enemy = position[rank][file].startsWith('white') ? 'black' : 'white';
    const valid = [
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2],
    ];
    valid.forEach(val => {
        const x = rank + val[0];
        const y = file + val[1];
        const cell = position?.[rank + val[0]]?.[file + val[1]];
        if (cell !== undefined && (cell.startsWith(enemy) || cell === '')) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getTankMoves = ({ position, rank, file }) => {
    const moves = [];
    const enemy = position[rank][file].startsWith('white') ? 'black' : 'white';
    const valid = [
        [-2, 0],
        [2, 0],
        [0, -2],
        [0, 2]
    ];
    valid.forEach(val => {
        const x = rank + val[0];
        const y = file + val[1];
        const cell = position?.[rank + val[0]]?.[file + val[1]];
        if (cell !== undefined && (cell.startsWith(enemy) || cell === '')) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getCamelMoves = ({ position, rank, file }) => {
    const moves = [];
    const enemy = position[rank][file].startsWith('white') ? 'black' : 'white';
    const valid = [
        [-3, -1],
        [-3, 1],
        [-1, -3],
        [-1, 3],
        [1, -3],
        [1, 3],
        [3, -1],
        [3, 1],
    ];
    valid.forEach(val => {
        const x = rank + val[0];
        const y = file + val[1];
        const cell = position?.[rank + val[0]]?.[file + val[1]];
        if (cell !== undefined && (cell.startsWith(enemy) || cell === '')) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getBishopMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const enemy = us === 'white' ? 'black' : 'white';
    const direction = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
    ];
    direction.forEach(dir => {
        for (let i = 1; i < 8; i++) {
            const x = rank + (i * dir[0]);
            const y = file + (i * dir[1]);
            if (position?.[x]?.[y] === undefined) {
                break;
            }
            if (position[x][y].startsWith(enemy)) {
                moves.push([x, y]);
                break;
            }
            if (position[x][y].startsWith(us)) {
                break;
            }
            moves.push([x, y]);
        };
    });
    return moves;
};
export const getFerzMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getRookMoves({ position, piece, rank, file }),
        ...getBishopMoves({ position, piece, rank, file }),
    ];
    return moves;
};
export const getKingPosition = ({ position, playerColor }) => {
    let kingPosition
    position.forEach((rank, x) => {
        rank.forEach((file, y) => {
            if (position[x][y].startsWith(playerColor) && position[x][y].endsWith('king') || position[x][y].startsWith(playerColor) && position[x][y].endsWith('imperator')) {
                kingPosition = [x, y];
            }
        })
    })
    return kingPosition;
};
export const getKingMoves = ({ position, piece, castleDirection, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const direction = [
        [1, -1],
        [1, 0],
        [1, 1],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
    ];
    direction.forEach(dir => {
        const x = rank + dir[0];
        const y = file + dir[1];
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us)) {
            moves.push([x, y]);
        }
    });
    if (file !== 4 || rank % 7 !== 0 || castleDirection === 'none') {
        return moves;
    }
    if (piece.startsWith('white')) {
        if (arbiter.isKingInCheck({position, playerColor: 'white'})) {
            return moves;
        }
        if (['left', 'both'].includes(castleDirection) && !position[7][3] && !position[7][2] && !position[7][1] && position[7][0] === 'white_rook' && !arbiter.wouldKingPassThroughCheck({
            position, playerColor: 'white',
            throughSquares: [[7, 3], [7, 2]]
        })) {
            moves.push([7, 2]);
        }
        if (['right', 'both'].includes(castleDirection) && !position[7][5] && !position[7][6] && position[7][7] === 'white_rook' && !arbiter.wouldKingPassThroughCheck({
            position, playerColor: 'white',
            throughSquares: [[7, 5], [7, 6]]
        })) {
            moves.push([7, 6]);
        }
    } else {
        if (arbiter.isKingInCheck({position, playerColor: 'black'})) {
            return moves;
        }
        if (['left', 'both'].includes(castleDirection) && !position[0][3] && !position[0][2] && !position[0][1] && position[0][0] === 'black_rook' && !arbiter.wouldKingPassThroughCheck({
            position, playerColor: 'black',
            throughSquares: [[0, 3], [0, 2]]
        })) {
            moves.push([0, 2]);
        }
        if (['right', 'both'].includes(castleDirection) && !position[0][5] && !position[0][6] && position[0][7] === 'black_rook' && !arbiter.wouldKingPassThroughCheck({
            position, playerColor: 'black',
            throughSquares: [[0, 5], [0, 6]]
        })) {
            moves.push([0, 6]);
        }
    }
    return moves;
};
export const getImperatorMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const direction = [
        [1, -1],
        [1, 0],
        [1, 1],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
    ];
    direction.forEach(dir => {
        const x = rank + dir[0];
        const y = file + dir[1];
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us)) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getFirzanMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const direction = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
    ];
    direction.forEach(dir => {
        const x = rank + dir[0];
        const y = file + dir[1];
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us)) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getPawnMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const direction = piece.startsWith('white') ? -1 : 1;
    const targetRank = rank + direction;
    if (targetRank >= 0 && targetRank <= 7 && !position[targetRank][file]) {
        moves.push([targetRank, file]);
    }
    if (rank % 5 === 1) {
        if (targetRank >= 0 && targetRank <= 7 && position?.[targetRank]?.[file] === '' && position?.[targetRank + direction]?.[file] === '') {
            moves.push([targetRank + direction, file]);
        }
    }
    return moves;
};
export const getSoldierMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const direction = piece.startsWith('white') ? -1 : 1;
    const targetRank = rank + direction;
    if (targetRank >= 0 && targetRank <= 7 && !position[targetRank][file]) {
        moves.push([targetRank, file]);
    }
    return moves;
};
export const getPawnCaptures = ({ position, prevPosition, piece, rank, file }) => {
    const moves = [];
    const direction = piece.startsWith('white') ? -1 : 1;
    const enemy = piece.startsWith('white') ? 'black' : 'white';
    const targetRank = rank + direction;
    if (targetRank >= 0 && targetRank <= 7) {
        if (position?.[targetRank]?.[file - 1] && position?.[targetRank]?.[file - 1].startsWith(enemy)) {
            moves.push([targetRank, file - 1]);
        }
        if (position?.[targetRank]?.[file + 1] && position?.[targetRank]?.[file + 1].startsWith(enemy)) {
            moves.push([targetRank, file + 1]);
        }
    }
    if (prevPosition) {
        let from = null;
        let to = null;
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const before = prevPosition[r][f];
                const after = position[r][f];
                if (before !== after) {
                    if (before && !after) from = [r, f];
                    if (!before && after) to = [r, f];
                }
            }
        }
        if (from && to) {
            const movedPiece = position[to[0]][to[1]] || prevPosition[from[0]][from[1]];
            if (movedPiece && movedPiece.endsWith('pawn') && position[to[0]][to[1]].startsWith(enemy)) {
                if (Math.abs(to[0] - from[0]) === 2) {
                    if (to[0] === rank && Math.abs(to[1] - file) === 1) {
                        if (targetRank >= 0 && targetRank <= 7) {
                            moves.push([targetRank, to[1]]);
                        }
                    }
                }
            }
        }
    }
    return moves;
};
export const getSoldierCaptures = ({ position, piece, rank, file }) => {
    const moves = [];
    const direction = piece.startsWith('white') ? -1 : 1;
    const enemy = piece.startsWith('white') ? 'black' : 'white';
    const targetRank = rank + direction;
    if (targetRank >= 0 && targetRank <= 7) {
        if (position?.[targetRank]?.[file - 1] && position?.[targetRank]?.[file - 1].startsWith(enemy)) {
            moves.push([targetRank, file - 1]);
        }
        if (position?.[targetRank]?.[file + 1] && position?.[targetRank]?.[file + 1].startsWith(enemy)) {
            moves.push([targetRank, file + 1]);
        }
    }
    return moves;
};
export const getDinozavrMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getFerzMoves({ position, piece, rank, file }),
    ];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const LShapedDirections = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1],
        [-3, -1], [-3, 1], [-1, -3], [-1, 3], [1, -3], [1, 3], [3, -1], [3, 1],
        [-4, -2], [-4, 2], [-2, -4], [-2, 4], [2, -4], [2, 4], [4, -2], [4, 2],
        [-5, -3], [-5, 3], [-3, -5], [-3, 5], [3, -5], [3, 5], [5, -3], [5, 3],
        [-6, -3], [-6, 3], [-3, -6], [-3, 6], [3, -6], [3, 6], [6, -3], [6, 3],
        [-7, -4], [-7, 4], [-4, -7], [-4, 7], [4, -7], [4, 7], [7, -4], [7, 4],
    ];
    LShapedDirections.forEach(dir => {
        const destX = rank + dir[0];
        const destY = file + dir[1];
        if (position?.[destX]?.[destY] === undefined || position[destX][destY].startsWith(us)) {
            return;
        }
        let blocked = false;
        for (let i = 1; i < Math.abs(dir[0]); i++) {
            const midX = rank + (i * Math.sign(dir[0]));
            if (position[midX][file] !== '') blocked = true;
        }
        for (let i = 1; i < Math.abs(dir[1]); i++) {
            const midY = file + (i * Math.sign(dir[1]));
            if (position[rank][midY] !== '') blocked = true;
        }
        if (!blocked) {
            moves.push([destX, destY]);
        }
    });
    return moves;
};
export const getGiraffeMoves = ({ position, rank, file }) => {
    const moves = [];
    const color = position[rank][file].startsWith('white') ? 'white' : 'black';
    const enemy = color === 'white' ? 'black' : 'white';
    const diagonalDirections = [
        { dr: 1, df: 1 }, { dr: 1, df: -1 }, { dr: -1, df: 1 }, { dr: -1, df: -1 }
    ];
    diagonalDirections.forEach(({ dr, df }) => {
        const intermediateRank = rank + dr;
        const intermediateFile = file + df;
        if (intermediateRank >= 0 && intermediateRank < 8 && intermediateFile >= 0 && intermediateFile < 8) {
            if (position[intermediateRank][intermediateFile] === '') {
                const straightDirections = [
                    { dr: 1, df: 0 }, { dr: -1, df: 0 }, { dr: 0, df: 1 }, { dr: 0, df: -1 }
                ];
                straightDirections.forEach(({ dr: sr, df: sf }) => {
                    for (let steps = 1; steps <= 7; steps++) {
                        const checkRank = intermediateRank + sr * steps;
                        const checkFile = intermediateFile + sf * steps;
                        if (checkRank >= 0 && checkRank < 8 && checkFile >= 0 && checkFile < 8) {
                            const distanceFromOrigin = Math.max(Math.abs(checkRank - rank), Math.abs(checkFile - file));
                            if (distanceFromOrigin < 2) {
                                break;
                            }
                            const checkPiece = position[checkRank][checkFile];
                            if (checkPiece === '') {
                                moves.push([checkRank, checkFile]);
                            } else if (checkPiece.startsWith(enemy)) {
                                moves.push([checkRank, checkFile]);
                                break;
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                });
            }
        }
    });
    return moves;
};
export const getCheckersMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const direction = piece.startsWith('white') ? -1 : 1;
    const targetRank = rank + direction;
    if (targetRank >= 0 && targetRank <= 7) {
        if (position?.[targetRank]?.[file - 1] !== undefined && position[targetRank][file - 1] === '') {
            moves.push([targetRank, file - 1]);
        }
        if (position?.[targetRank]?.[file + 1] !== undefined && position[targetRank][file + 1] === '') {
            moves.push([targetRank, file + 1]);
        }
    }
    return moves;
};
export const getCheckersCaptures = ({ position, piece, rank, file }) => {
    const moves = [];
    const direction = piece.startsWith('white') ? -1 : 1;
    const enemy = piece.startsWith('white') ? 'black' : 'white';
    const adjRankForward = rank + direction;
    const landRankForward = rank + 2 * direction;
    if (landRankForward >= 0 && landRankForward <= 7) {
        if (position?.[adjRankForward]?.[file - 1] && position[adjRankForward][file - 1].startsWith(enemy)
            && position?.[landRankForward]?.[file - 2] !== undefined && position[landRankForward][file - 2] === '') {
            moves.push([landRankForward, file - 2]);
        }
        if (position?.[adjRankForward]?.[file + 1] && position[adjRankForward][file + 1].startsWith(enemy)
            && position?.[landRankForward]?.[file + 2] !== undefined && position[landRankForward][file + 2] === '') {
            moves.push([landRankForward, file + 2]);
        }
    }
    const adjRankBackward = rank - direction;
    const landRankBackward = rank - 2 * direction;
    if (landRankBackward >= 0 && landRankBackward <= 7) {
        if (position?.[adjRankBackward]?.[file - 1] && position[adjRankBackward][file - 1].startsWith(enemy)
            && position?.[landRankBackward]?.[file - 2] !== undefined && position[landRankBackward][file - 2] === '') {
            moves.push([landRankBackward, file - 2]);
        }
        if (position?.[adjRankBackward]?.[file + 1] && position[adjRankBackward][file + 1].startsWith(enemy)
            && position?.[landRankBackward]?.[file + 2] !== undefined && position[landRankBackward][file + 2] === '') {
            moves.push([landRankBackward, file + 2]);
        }
    }
    
    return moves;
};