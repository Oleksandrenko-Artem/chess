import arbiter from "./arbiter";

const getBoardSize = (position) => (position?.length || 8);
const isInBounds = (position, x, y) => x >= 0 && y >= 0 && x < getBoardSize(position) && y < getBoardSize(position);

export const getRookMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const boardSize = getBoardSize(position);
    const us = piece.startsWith('white') ? 'white' : 'black';
    const enemy = us === 'white' ? 'black' : 'white';
    const direction = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];
    direction.forEach(dir => {
        for (let i = 1; i < boardSize; i++) {
            const x = rank + (i * dir[0]);
            const y = file + (i * dir[1]);
            if (!isInBounds(position, x, y)) {
                break;
            }
            if (position[x][y].startsWith(enemy)) {
                moves.push([x, y]);
                break;
            }
            if (position[x][y].startsWith(us)) {
                break;
            }
            if (position[x][y].endsWith('brick')) {
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
    const boardSize = getBoardSize(position);
    const us = piece.startsWith('white') ? 'white' : 'black';
    const enemy = us === 'white' ? 'black' : 'white';
    const direction = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
    ];
    direction.forEach(dir => {
        for (let i = 1; i < boardSize; i++) {
            const x = rank + (i * dir[0]);
            const y = file + (i * dir[1]);
            if (!isInBounds(position, x, y)) {
                break;
            }
            if (position[x][y].startsWith(enemy)) {
                moves.push([x, y]);
                break;
            }
            if (position[x][y].startsWith(us)) {
                break;
            }
            if (position[x][y].endsWith('brick')) {
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
    const boardSize = getBoardSize(position);
    const us = piece.startsWith('white') ? 'white' : 'black';
    const opponentColor = us === 'white' ? 'black' : 'white';
    const directions = [
        [1, -1],
        [1, 0],
        [1, 1],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
    ];

    directions.forEach(dir => {
        const x = rank + dir[0];
        const y = file + dir[1];
        if (isInBounds(position, x, y) && !position[x][y].startsWith(us) && !position[x][y].endsWith('brick')) {
            moves.push([x, y]);
        }
    });

    const homeRank = us === 'white' ? boardSize - 1 : 0;
    const kingStartFile = Math.floor(boardSize / 2);
    if (file !== kingStartFile || rank !== homeRank || castleDirection === 'none') {
        return moves;
    }
    if (arbiter.isKingInCheck({ position, playerColor: us })) {
        return moves;
    }

    const canCastleLeft = ['left', 'both'].includes(castleDirection);
    const canCastleRight = ['right', 'both'].includes(castleDirection);
    const row = position[homeRank];

    if (canCastleLeft) {
        const leftRookFile = 0;
        if (position[homeRank][leftRookFile] === `${us}_rook`) {
            const pathSquares = [];
            for (let f = kingStartFile - 1; f > leftRookFile; f--) {
                pathSquares.push([homeRank, f]);
            }
            if (pathSquares.every(([r, f]) => position[r][f] === '')) {
                const throughSquares = [
                    [homeRank, kingStartFile - 1],
                    [homeRank, kingStartFile - 2],
                ];
                if (throughSquares.every(([r, f]) => !arbiter.isSquareAttacked({ position, rank: r, file: f, byPlayer: opponentColor }))) {
                    moves.push([homeRank, kingStartFile - 2]);
                }
            }
        }
    }

    if (canCastleRight) {
        const rightRookFile = boardSize - 1;
        if (position[homeRank][rightRookFile] === `${us}_rook`) {
            const pathSquares = [];
            for (let f = kingStartFile + 1; f < rightRookFile; f++) {
                pathSquares.push([homeRank, f]);
            }
            if (pathSquares.every(([r, f]) => position[r][f] === '')) {
                const throughSquares = [
                    [homeRank, kingStartFile + 1],
                    [homeRank, kingStartFile + 2],
                ];
                if (throughSquares.every(([r, f]) => !arbiter.isSquareAttacked({ position, rank: r, file: f, byPlayer: opponentColor }))) {
                    moves.push([homeRank, kingStartFile + 2]);
                }
            }
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
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us) && !position[x][y].endsWith('brick')) {
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
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us) && !position[x][y].endsWith('brick')) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getPawnMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const boardSize = getBoardSize(position);
    const direction = piece.startsWith('white') ? -1 : 1;
    const targetRank = rank + direction;
    const startRank = piece.startsWith('white') ? boardSize - 2 : 1;

    if (isInBounds(position, targetRank, file) && !position[targetRank][file]) {
        moves.push([targetRank, file]);
    }
    if (rank === startRank) {
        const twoStepRank = rank + 2 * direction;
        if (
            isInBounds(position, targetRank, file) &&
            isInBounds(position, twoStepRank, file) &&
            position[targetRank][file] === '' &&
            position[twoStepRank][file] === ''
        ) {
            moves.push([twoStepRank, file]);
        }
    }
    return moves;
};
export const getSoldierMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const direction = piece.startsWith('white') ? -1 : 1;
    const targetRank = rank + direction;
    if (isInBounds(position, targetRank, file) && !position[targetRank][file]) {
        moves.push([targetRank, file]);
    }
    return moves;
};
export const getPawnCaptures = ({ position, prevPosition, piece, rank, file }) => {
    const moves = [];
    const boardSize = getBoardSize(position);
    const direction = piece.startsWith('white') ? -1 : 1;
    const enemy = piece.startsWith('white') ? 'black' : 'white';
    const targetRank = rank + direction;
    if (isInBounds(position, targetRank, file - 1) && position[targetRank][file - 1].startsWith(enemy)) {
        moves.push([targetRank, file - 1]);
    }
    if (isInBounds(position, targetRank, file + 1) && position[targetRank][file + 1].startsWith(enemy)) {
        moves.push([targetRank, file + 1]);
    }
    if (prevPosition) {
        let from = null;
        let to = null;
        const boardSize = getBoardSize(position);

        for (let r = 0; r < boardSize; r++) {
            for (let f = 0; f < boardSize; f++) {
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
                        if (isInBounds(position, targetRank, to[1])) {
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
    if (isInBounds(position, targetRank, file)) {
        if (isInBounds(position, targetRank, file - 1) && position[targetRank][file - 1].startsWith(enemy)) {
            moves.push([targetRank, file - 1]);
        }
        if (isInBounds(position, targetRank, file + 1) && position[targetRank][file + 1].startsWith(enemy)) {
            moves.push([targetRank, file + 1]);
        }
    }
    return moves;
};
export const getKnightMoves = ({ position, piece, rank, file }) => {
    const us = piece.startsWith('white') ? 'white' : 'black';
    const boardSize = getBoardSize(position);
    const finalMoves = [];
    const knightPaths = [
        { step1: [1, 0], step2: [1, 1] },
        { step1: [1, 0], step2: [1, -1] },
        { step1: [-1, 0], step2: [-1, 1] },
        { step1: [-1, 0], step2: [-1, -1] },
        { step1: [0, 1], step2: [1, 1] },
        { step1: [0, 1], step2: [-1, 1] },
        { step1: [0, -1], step2: [1, -1] },
        { step1: [0, -1], step2: [-1, -1] },
        { step1: [1, 1], step2: [1, 0] },
        { step1: [1, -1], step2: [1, 0] },
        { step1: [-1, 1], step2: [-1, 0] },
        { step1: [-1, -1], step2: [-1, 0] },
        { step1: [1, 1], step2: [0, 1] },
        { step1: [-1, 1], step2: [0, 1] },
        { step1: [1, -1], step2: [0, -1] },
        { step1: [-1, -1], step2: [0, -1] },
    ];
    knightPaths.forEach(path => {
        let currentX = rank;
        let currentY = file;
        while (true) {
            currentX += path.step1[0];
            currentY += path.step1[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece1 = position[currentX][currentY];
            if (piece1.startsWith(us) || piece1.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece1 !== '') break;
            currentX += path.step2[0];
            currentY += path.step2[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece2 = position[currentX][currentY];
            if (piece2.startsWith(us) || piece2.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece2 !== '') break;
        }
    });
    return finalMoves;
};
export const getGiraffeMoves = ({ position, rank, file }) => {
    const moves = [];
    const color = position[rank][file].startsWith('white') ? 'white' : 'black';
    const enemy = color === 'white' ? 'black' : 'white';
    const diagonalDirections = [
        { dr: 1, df: 1 }, { dr: 1, df: -1 }, { dr: -1, df: 1 }, { dr: -1, df: -1 }
    ];
    const boardSize = getBoardSize(position);
    diagonalDirections.forEach(({ dr, df }) => {
        const intermediateRank = rank + dr;
        const intermediateFile = file + df;
        if (isInBounds(position, intermediateRank, intermediateFile)) {
            if (position[intermediateRank][intermediateFile] === '') {
                const straightDirections = [
                    { dr: dr, df: 0 }, { dr: 0, df: df }
                ];
                straightDirections.forEach(({ dr: sr, df: sf }) => {
                    for (let steps = 3; steps < boardSize; steps++) {
                        const checkRank = intermediateRank + sr * steps;
                        const checkFile = intermediateFile + sf * steps;
                        if (isInBounds(position, checkRank, checkFile)) {
                            let canMove = true;
                            for (let s = 1; s <= steps; s++) {
                                const pathRank = intermediateRank + sr * s;
                                const pathFile = intermediateFile + sf * s;
                                const piece = position[pathRank][pathFile];
                                if (s < steps) {
                                    if (piece !== '') {
                                        canMove = false;
                                        break;
                                    }
                                } else {
                                    if (piece !== '' && !piece.startsWith(enemy)) {
                                        canMove = false;
                                        break;
                                    }
                                }
                            }
                            if (canMove) {
                                moves.push([checkRank, checkFile]);
                            }
                            if (!canMove) {
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

    if (piece.endsWith('checker_long_range')) {
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        directions.forEach(([dr, df]) => {
            let nextRank = rank + dr;
            let nextFile = file + df;
            while (isInBounds(position, nextRank, nextFile) && position[nextRank][nextFile] === '') {
                moves.push([nextRank, nextFile]);
                nextRank += dr;
                nextFile += df;
            }
        });
        return moves;
    }

    const direction = piece.startsWith('white') ? -1 : 1;
    const targetRank = rank + direction;

    if (isInBounds(position, targetRank, file - 1) && position[targetRank][file - 1] === '') {
        moves.push([targetRank, file - 1]);
    }
    if (isInBounds(position, targetRank, file + 1) && position[targetRank][file + 1] === '') {
        moves.push([targetRank, file + 1]);
    }

    return moves;
};
export const getCheckersCaptures = ({ position, piece, rank, file }) => {
    const moves = [];
    const enemy = piece.startsWith('white') ? 'black' : 'white';

    if (piece.endsWith('checker_long_range')) {
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        directions.forEach(([dr, df]) => {
            let currentRank = rank + dr;
            let currentFile = file + df;
            let jumped = false;
            while (isInBounds(position, currentRank, currentFile)) {
                const target = position[currentRank][currentFile];
                if (target === '') {
                    if (jumped) {
                        moves.push([currentRank, currentFile]);
                    }
                    currentRank += dr;
                    currentFile += df;
                    continue;
                }
                if (!jumped && target.startsWith(enemy)) {
                    jumped = true;
                    currentRank += dr;
                    currentFile += df;
                    continue;
                }
                break;
            }
        });
        return moves;
    }

    const directions = piece.startsWith('white') ? [-1, 1] : [1, -1];
    directions.forEach((direction) => {
        const adjRank = rank + direction;
        const landRank = rank + 2 * direction;

        if (isInBounds(position, landRank, file - 2)) {
            if (
                isInBounds(position, adjRank, file - 1) &&
                position[adjRank][file - 1].startsWith(enemy) &&
                position[landRank][file - 2] === ''
            ) {
                moves.push([landRank, file - 2]);
            }
        }
        if (isInBounds(position, landRank, file + 2)) {
            if (
                isInBounds(position, adjRank, file + 1) &&
                position[adjRank][file + 1].startsWith(enemy) &&
                position[landRank][file + 2] === ''
            ) {
                moves.push([landRank, file + 2]);
            }
        }
    });

    return moves;
};
export const getRukhMoves = ({ position, rank, file }) => {
    const moves = [];
    const color = position[rank][file].startsWith('white') ? 'white' : 'black';
    const enemy = color === 'white' ? 'black' : 'white';
    const diagonalDirections = [
        { dr: 1, df: 1 }, { dr: 1, df: -1 }, { dr: -1, df: 1 }, { dr: -1, df: -1 }
    ];
    const boardSize = getBoardSize(position);
    diagonalDirections.forEach(({ dr, df }) => {
        const intermediateRank = rank + dr;
        const intermediateFile = file + df;
        if (isInBounds(position, intermediateRank, intermediateFile)) {
            if (position[intermediateRank][intermediateFile] === '') {
                const straightDirections = [
                    { dr: dr, df: 0 }, { dr: 0, df: df }
                ];
                straightDirections.forEach(({ dr: sr, df: sf }) => {
                    for (let steps = 1; steps < boardSize; steps++) {
                        const checkRank = intermediateRank + sr * steps;
                        const checkFile = intermediateFile + sf * steps;
                        if (isInBounds(position, checkRank, checkFile)) {
                            let canMove = true;
                            for (let s = 1; s <= steps; s++) {
                                const pathRank = intermediateRank + sr * s;
                                const pathFile = intermediateFile + sf * s;
                                const piece = position[pathRank][pathFile];
                                if (s < steps) {
                                    if (piece !== '') {
                                        canMove = false;
                                        break;
                                    }
                                } else {
                                    if (piece !== '' && !piece.startsWith(enemy)) {
                                        canMove = false;
                                        break;
                                    }
                                }
                            }
                            if (canMove) {
                                moves.push([checkRank, checkFile]);
                            }
                            if (!canMove) {
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
    const diagonalMoves = [
        [rank + 1, file + 1],
        [rank + 1, file - 1],
        [rank - 1, file + 1],
        [rank - 1, file - 1]
    ];
    diagonalMoves.forEach(([r, f]) => {
        if (isInBounds(position, r, f)) {
            const piece = position[r][f];
            if (piece === '' || piece.startsWith(enemy)) {
                moves.push([r, f]);
            }
        }
    });
    return moves;
};
export const getWazirMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const direction = [
        [1, 0],
        [-1, 0],
        [0, -1],
        [0, 1],
    ];
    direction.forEach(dir => {
        const x = rank + dir[0];
        const y = file + dir[1];
        if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us) && !position[x][y].endsWith('brick')) {
            moves.push([x, y]);
        }
    });
    return moves;
};
export const getZebraMoves = ({ position, rank, file }) => {
    const moves = [];
    const enemy = position[rank][file].startsWith('white') ? 'black' : 'white';
    const valid = [
        [-3, -2],
        [-3, 2],
        [-2, -3],
        [-2, 3],
        [2, -3],
        [2, 3],
        [3, -2],
        [3, 2],
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
export const getLionMoves = ({ position, rank, file }) => {
    const moves = getCamelMoves({ position, rank, file });
    const enemy = position[rank][file].startsWith('white') ? 'black' : 'white';
    const valid = [
        [0, -3],
        [0, 3],
        [3, 0],
        [-3, 0],
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
export const getArchbishopMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getBishopMoves({ position, piece, rank, file }),
        ...getHorseMoves({ position, rank, file }),
    ];
    return moves;
};
export const getMarshalMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getRookMoves({ position, piece, rank, file }),
        ...getHorseMoves({ position, rank, file }),
    ];
    return moves;
};
export const getAmazonMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getFerzMoves({ position, piece, rank, file }),
        ...getHorseMoves({ position, rank, file }),
    ];
    return moves;
};
export const getDinozavrMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getFerzMoves({ position, piece, rank, file }),
        ...getKnightMoves({ position, piece, rank, file }),
    ];
    return moves;
};
export const getElephantLongRangeMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const enemy = us === 'white' ? 'black' : 'white';
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    const boardSize = getBoardSize(position);

    directions.forEach(([dr, df]) => {
        let hasJumped = false;

        for (let i = 1; i < boardSize; i++) {
            const r = rank + i * dr;
            const f = file + i * df;

            if (!isInBounds(position, r, f)) break;
            const target = position[r][f];

            if (target === '') {
                moves.push([r, f]);
            } else {
                if (!hasJumped) {
                    if (target.startsWith(enemy)) {
                        moves.push([r, f]);
                    }
                    hasJumped = true;
                    continue;
                } else {
                    if (target.startsWith(enemy)) {
                        moves.push([r, f]);
                    }
                    break;
                }
            }
        }
    });
    return moves;
};
export const getRhinoMoves = ({ position, piece, rank, file }) => {
    const moves = [];
    const us = piece.startsWith('white') ? 'white' : 'black';
    const enemy = us === 'white' ? 'black' : 'white';

    const knightLeaps = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
    ];

    knightLeaps.forEach(([kx, ky]) => {
        let x = rank + kx;
        let y = file + ky;

        if (!isInBounds(position, x, y)) return;

        const firstCell = position[x][y];

        if (firstCell === '' || firstCell.startsWith(enemy)) {
            moves.push([x, y]);
        }

        if (firstCell === '') {
            const dx = Math.sign(kx);
            const dy = Math.sign(ky);

            let sx = x + dx;
            let sy = y + dy;

            while (isInBounds(position, sx, sy)) {
                const cell = position[sx][sy];

                if (cell === '') {
                    moves.push([sx, sy]);
                } else {
                    if (cell.startsWith(enemy)) {
                        moves.push([sx, sy]);
                    }
                    break;
                }
                sx += dx;
                sy += dy;
            }
        }
    });

    return moves;
};
export const getWildebeestMoves = ({ position, rank, file }) => {
    const moves = [
        ...getHorseMoves({ position, rank, file }),
        ...getCamelMoves({ position, rank, file }),
    ];
    return moves;
};
export const getManMoves = ({ position, piece, rank, file }) => {
    const moves = [
        ...getImperatorMoves({ position, piece, rank, file }),
    ];
    return moves;
};
export const getAlibabaMoves = ({ position, rank, file }) => {
    const moves = [
        ...getElephantMoves({ position, rank, file }),
        ...getTankMoves({ position, rank, file }),
    ];
    return moves;
};
export const getPrinceMoves = ({ position, piece, rank, file }) => {
    const us = piece.startsWith('white') ? 'white' : 'black';
    const boardSize = getBoardSize(position);
    const finalMoves = [];
    const princePaths = [
        { step1: [1, 1], step2: [1, 1], step3: [1, 0] },
        { step1: [1, -1], step2: [1, -1], step3: [1, 0] },
        { step1: [-1, 1], step2: [-1, 1], step3: [-1, 0] },
        { step1: [-1, -1], step2: [-1, -1], step3: [-1, 0] },
        { step1: [1, 1], step2: [1, 1], step3: [0, 1] },
        { step1: [-1, 1], step2: [-1, 1], step3: [0, 1] },
        { step1: [1, -1], step2: [1, -1], step3: [0, -1] },
        { step1: [-1, -1], step2: [-1, -1], step3: [0, -1] },
    ];
    princePaths.forEach(path => {
        let currentX = rank;
        let currentY = file;
        while (true) {
            currentX += path.step1[0];
            currentY += path.step1[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece1 = position[currentX][currentY];
            if (piece1.startsWith(us) || piece1.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece1 !== '') break;
            currentX += path.step2[0];
            currentY += path.step2[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece2 = position[currentX][currentY];
            if (piece2.startsWith(us) || piece2.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece2 !== '') break;
            currentX += path.step3[0];
            currentY += path.step3[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece3 = position[currentX][currentY];
            if (piece3.startsWith(us) || piece3.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece3 !== '') break;
        }
    });
    return finalMoves;
};
export const getDukeMoves = ({ position, piece, rank, file }) => {
    const us = piece.startsWith('white') ? 'white' : 'black';
    const boardSize = getBoardSize(position);
    const finalMoves = [];
    const dukePaths = [
        { step1: [1, 0], step2: [1, 0], step3: [1, 1] },
        { step1: [1, 0], step2: [1, 0], step3: [1, -1] },
        { step1: [-1, 0], step2: [-1, 0], step3: [-1, 1] },
        { step1: [-1, 0], step2: [-1, 0], step3: [-1, -1] },
        { step1: [0, 1], step2: [0, 1], step3: [1, 1] },
        { step1: [0, 1], step2: [0, 1], step3: [-1, 1] },
        { step1: [0, -1], step2: [0, -1], step3: [1, -1] },
        { step1: [0, -1], step2: [0, -1], step3: [-1, -1] },
    ];
    dukePaths.forEach(path => {
        let currentX = rank;
        let currentY = file;
        while (true) {
            currentX += path.step1[0];
            currentY += path.step1[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece1 = position[currentX][currentY];
            if (piece1.startsWith(us) || piece1.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece1 !== '') break;
            currentX += path.step2[0];
            currentY += path.step2[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece2 = position[currentX][currentY];
            if (piece2.startsWith(us) || piece2.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece2 !== '') break;
            currentX += path.step3[0];
            currentY += path.step3[1];
            if (!isInBounds(position, currentX, currentY)) break;
            let piece3 = position[currentX][currentY];
            if (piece3.startsWith(us) || piece3.endsWith('brick')) break;
            finalMoves.push([currentX, currentY]);
            if (piece3 !== '') break;
        }
    });
    return finalMoves;
};