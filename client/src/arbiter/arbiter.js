import { getBishopMoves, getCamelMoves, getDinozavrMoves, getElephantMoves, getFerzMoves, getFirzanMoves, getGiraffeMoves, getHorseMoves, getImperatorMoves, getKingMoves, getPawnCaptures, getPawnMoves, getRookMoves, getSoldierCaptures, getSoldierMoves, getTankMoves } from "./getMoves"
import { status } from "../constants";
import { areSameColorBishops, findPieceCoords } from "../helpers";

const arbiter = {
    isSquareAttacked: function ({ position, rank, file, byPlayer }) {
        try {
            for (let r = 0; r < 8; r++) {
                for (let f = 0; f < 8; f++) {
                    const piece = position[r][f];
                    if (!piece || piece === '' || !piece.startsWith(byPlayer)) continue;

                    const attacks = this.getAttackSquares({ position, piece, rank: r, file: f });
                    if (attacks && attacks.some(([ar, af]) => ar === rank && af === file)) {
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('Error in isSquareAttacked:', error);
        }
        return false;
    },
    getAttackSquares: function ({ position, piece, rank, file }) {
        const us = piece.startsWith('white') ? 'white' : 'black';
        const enemy = us === 'white' ? 'black' : 'white';
        const attacks = [];

        if (piece.endsWith('pawn')) {
            const direction = us === 'white' ? -1 : 1;
            const captureSquares = [
                [rank + direction, file - 1],
                [rank + direction, file + 1],
            ];
            captureSquares.forEach(([r, f]) => {
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('soldier')) {
            const direction = us === 'white' ? -1 : 1;
            const captureSquares = [
                [rank + direction, file - 1],
                [rank + direction, file + 1],
            ];
            captureSquares.forEach(([r, f]) => {
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('king') || piece.endsWith('imperator')) {
            const directions = [
                [1, -1], [1, 0], [1, 1],
                [0, -1], [0, 1],
                [-1, -1], [-1, 0], [-1, 1],
            ];
            directions.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('rook')) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < 8; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (position?.[r]?.[f] === undefined) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
        } else if (piece.endsWith('bishop')) {
            const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < 8; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (position?.[r]?.[f] === undefined) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
        } else if (piece.endsWith('horse')) {
            const jumps = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1],
            ];
            jumps.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('tank')) {
            const jumps = [[-2, 0], [2, 0], [0, -2], [0, 2]];
            jumps.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('camel')) {
            const jumps = [[-3, -1], [-3, 1], [-1, -3], [-1, 3], [1, -3], [1, 3], [3, -1], [3, 1]];
            jumps.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('elephant')) {
            const jumps = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
            jumps.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('firzan')) {
            const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            directions.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('ferz')) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < 8; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (position?.[r]?.[f] === undefined) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
        } else if (piece.endsWith('dinozavr')) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < 8; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (position?.[r]?.[f] === undefined) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
            const LShapedDirections = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1],
                [-3, -1], [-3, 1], [-1, -3], [-1, 3], [1, -3], [1, 3], [3, -1], [3, 1],
                [-3, -2], [-3, 2], [-2, -3], [-2, 3], [2, -3], [2, 3], [3, -2], [3, 2],
                [-4, -2], [-4, 2], [-2, -4], [-2, 4], [2, -4], [2, 4], [4, -2], [4, 2],
                [-5, -3], [-5, 3], [-3, -5], [-3, 5], [3, -5], [3, 5], [5, -3], [5, 3],
                [-6, -3], [-6, 3], [-3, -6], [-3, 6], [3, -6], [3, 6], [6, -3], [6, 3],
                [-7, -4], [-7, 4], [-4, -7], [-4, 7], [4, -7], [4, 7], [7, -4], [7, 4],
            ];
            LShapedDirections.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] === undefined) return;
                let blocked = false;
                for (let i = 1; i < Math.abs(dr); i++) {
                    const midX = rank + (i * Math.sign(dr));
                    if (position[midX] && position[midX][file] !== '') blocked = true;
                }
                for (let i = 1; i < Math.abs(df); i++) {
                    const midY = file + (i * Math.sign(df));
                    if (position[rank] && position[rank][midY] !== '') blocked = true;
                }
                if (!blocked) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('giraffe')) {
            const color = piece.startsWith('white') ? 'white' : 'black';
            const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            diagonalDirections.forEach(([dr1, df1]) => {
                const intermediateRank = rank + dr1;
                const intermediateFile = file + df1;
                if (position?.[intermediateRank]?.[intermediateFile] === undefined) {
                    return;
                }
                if (position[intermediateRank][intermediateFile] !== '') {
                    return;
                }
                const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                straightDirections.forEach(([sr, sf]) => {
                    for (let i = 1; i <= 7; i++) {
                        const finalRank = intermediateRank + i * sr;
                        const finalFile = intermediateFile + i * sf;
                        if (position?.[finalRank]?.[finalFile] === undefined) {
                            break;
                        }
                        const destinationPiece = position[finalRank][finalFile];
                        const destinationColor = destinationPiece.startsWith('white') ? 'white' : 'black';
                        if (destinationPiece !== '' && i < 3) {
                           break;
                        }
                        if (i >= 3) {
                            if (destinationPiece === '' || destinationColor !== color) {
                                attacks.push([finalRank, finalFile]);
                            }
                        }
                        if (destinationPiece !== '') {
                            break;
                        }
                    }
                });
            });
        }
        return attacks;
    },
    isKingInCheck: function ({ position, playerColor }) {
        const enemy = playerColor === 'white' ? 'black' : 'white';
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const piece = position[r][f];
                if (piece && piece !== '' && piece.startsWith(playerColor)) {
                    if (piece.endsWith('king') || piece.endsWith('imperator')) {
                        const attacked = this.isSquareAttacked({ position, rank: r, file: f, byPlayer: enemy });
                        if (attacked) return true;
                    }
                }
            }
        }
        return false;
    },
    wouldKingPassThroughCheck: function ({ position, playerColor, throughSquares }) {
        const enemy = playerColor === 'white' ? 'black' : 'white';
        for (const [rank, file] of throughSquares) {
            if (this.isSquareAttacked({ position, rank, file, byPlayer: enemy })) {
                return true;
            }
        }
    },
    isMoveLegal: function ({ position, piece, fromRank, fromFile, toRank, toFile, castleDirection, playerColor }) {
        const newPosition = position.map(row => [...row]);

        newPosition[fromRank][fromFile] = '';
        newPosition[toRank][toFile] = piece;

        if (piece.endsWith('king') && !piece.endsWith('imperator') && Math.abs(toFile - fromFile) === 2) {
            if (toFile === 2) {
                newPosition[fromRank][0] = '';
                newPosition[fromRank][3] = piece.replace('king', 'rook');
            } else if (toFile === 6) {
                newPosition[fromRank][7] = '';
                newPosition[fromRank][5] = piece.replace('king', 'rook');
            }
        }
        if (piece.endsWith('king') || piece.endsWith('imperator')) {
            const enemy = playerColor === 'white' ? 'black' : 'white';
            if (this.isSquareAttacked({ position: newPosition, rank: toRank, file: toFile, byPlayer: enemy })) {
                return false;
            }
        }
        return !this.isKingInCheck({ position: newPosition, playerColor });
    },
    getRegularMoves: function ({ position, prevPosition, castleDirection, piece, rank, file }) {
        let moves = [];
        if (piece.endsWith('pawn')) {
            moves = [
                ...getPawnMoves({ position, piece, rank, file }),
                ...getPawnCaptures({ position, prevPosition, piece, rank, file }),
            ];
        } else if (piece.endsWith('soldier')) {
            moves = [
                ...getSoldierMoves({ position, piece, rank, file }),
                ...getSoldierCaptures({ position, piece, rank, file }),
            ];
        } else if (piece.endsWith('firzan')) {
            moves = getFirzanMoves({ position, piece, rank, file });
        } else if (piece.endsWith('elephant')) {
            moves = getElephantMoves({ position, rank, file });
        } else if (piece.endsWith('tank')) {
            moves = getTankMoves({ position, rank, file });
        } else if (piece.endsWith('camel')) {
            moves = getCamelMoves({ position, rank, file });
        } else if (piece.endsWith('horse')) {
            moves = getHorseMoves({ position, rank, file });
        } else if (piece.endsWith('bishop')) {
            moves = getBishopMoves({ position, piece, rank, file });
        } else if (piece.endsWith('imperator')) {
            moves = getImperatorMoves({ position, piece, rank, file });
        } else if (piece.endsWith('king')) {
            moves = getKingMoves({ position, piece, castleDirection, rank, file });
        } else if (piece.endsWith('rook')) {
            moves = getRookMoves({ position, piece, rank, file });
        } else if (piece.endsWith('ferz')) {
            moves = getFerzMoves({ position, piece, rank, file });
        } else if (piece.endsWith('dinozavr')) {
            moves = getDinozavrMoves({ position, piece, rank, file });
        } else if (piece.endsWith('giraffe')) {
            moves = getGiraffeMoves({ position, piece, rank, file });
        }
        const playerColor = piece.startsWith('white') ? 'white' : 'black';
        return moves.filter(([toRank, toFile]) =>
            this.isMoveLegal({
                position,
                piece,
                fromRank: rank,
                fromFile: file,
                toRank,
                toFile,
                castleDirection: castleDirection,
                playerColor
            })
        );
    },
    getGameStatus: function ({ position, playerColor, castleDirection }) {
        try {
            const isInCheck = this.isKingInCheck({ position, playerColor });
            let hasLegalMove = false;
            for (let r = 0; r < 8; r++) {
                for (let f = 0; f < 8; f++) {
                    const piece = position[r][f];
                    if (!piece || piece === '' || !piece.startsWith(playerColor)) continue;
                    try {
                        const safeCastleDir = castleDirection && typeof castleDirection === 'object'
                            ? castleDirection[playerColor]
                            : 'both';
                        const validMoves = this.getRegularMoves({
                            position,
                            prevPosition: null,
                            castleDirection: safeCastleDir,
                            piece,
                            rank: r,
                            file: f
                        });
                        if (validMoves && validMoves.length > 0) {
                            hasLegalMove = true;
                            break;
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
                if (hasLegalMove) break;
            }
            if (isInCheck && !hasLegalMove) {
                return playerColor === 'white' ? status.black : status.white;
            } else if ((!isInCheck && !hasLegalMove) || (this.insufficientMaterial({ position }))) {
                return status.draw;
            }
        } catch (error) {
            console.error(error);
        }
        return status.ongoing;
    },
    insufficientMaterial: function ({ position }) {
        const pieces = [];
        const pieceCounts = {};
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                const piece = position[r][f];
                if (piece && piece !== '') {
                    pieces.push(piece);
                    pieceCounts[piece] = (pieceCounts[piece] || 0) + 1;
                }
            }
        }
        if (pieces.length === 2) {
            return true;
        }
        if (pieces.length === 3) {
            return pieces.some(p => p.endsWith('bishop') || p.endsWith('horse'));
        }
        if (pieces.length === 4) {
            const whiteHorse = pieceCounts['white_horse'] || 0;
            const blackHorse = pieceCounts['black_horse'] || 0;
            if (whiteHorse === 1 && blackHorse === 1) {
                return true;
            }
            const whiteBishop = findPieceCoords(position, 'white_bishop');
            const blackBishop = findPieceCoords(position, 'black_bishop');
            if (whiteBishop.length === 1 && blackBishop.length === 1) {
                if (areSameColorBishops(whiteBishop[0], blackBishop[0])) {
                    return true;
                }
            }
        }
        return false;
    }
};

export default arbiter;