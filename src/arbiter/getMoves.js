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
    ]
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
    ]
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
        ...getBishopMoves({ position, piece, rank, file })
    ];
    return moves;
};
export const getKingMoves = ({ position, piece, rank, file }) => {
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