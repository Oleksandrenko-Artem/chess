import { getBishopMoves, getCamelMoves, getCheckersCaptures, getCheckersMoves, getDinozavrMoves, getElephantMoves, getFerzMoves, getFirzanMoves, getGiraffeMoves, getHorseMoves, getImperatorMoves, getKingMoves, getLionMoves, getPawnCaptures, getPawnMoves, getRookMoves, getRukhMoves, getSoldierCaptures, getSoldierMoves, getTankMoves, getWazirMoves, getZebraMoves, getArchbishopMoves, getMarshalMoves, getAmazonMoves, getKnightMoves, getElephantLongRangeMoves, getRhinoMoves, getWildebeestMoves, getManMoves, getAlibabaMoves } from "./getMoves"
import { status } from "../constants";
import { areSameColorBishops, findPieceCoords, generatePositionHash } from "../helpers";

const getBoardSize = (position) => position?.length || 8;
const isInBounds = (position, x, y) => x >= 0 && y >= 0 && x < getBoardSize(position) && y < getBoardSize(position);

const arbiter = {
    getBoardValidMoves: function ({ position, playerColor, prevPosition, castleDirection, gameVariant }) {
        const allMoves = [];
        const boardSize = position?.length || 8;
        const currentCastleDir = castleDirection?.[playerColor] || 'both';
        for (let r = 0; r < boardSize; r++) {
            for (let f = 0; f < boardSize; f++) {
                const piece = position[r][f];
                if (piece && piece.startsWith(playerColor)) {
                    const isPawn = piece.endsWith('pawn') || piece.endsWith('soldier');

                    if (piece.endsWith('king')) {
                        const kingMoves = getKingMoves({ position, piece, castleDirection: currentCastleDir, rank: r, file: f });
                        kingMoves.forEach(([tr, tf]) => {
                            allMoves.push({ piece, rank: r, file: f, targetRank: tr, targetFile: tf, isCastle: Math.abs(tf - f) === 2 });
                        });
                    } else if (piece.endsWith('checkers') || piece.endsWith('checker_long_range')) {
                        const simpleMoves = getCheckersMoves({ position, piece, rank: r, file: f });
                        const captureMoves = getCheckersCaptures({ position, piece, rank: r, file: f });
                        const checkerMoves = captureMoves.length > 0 ? captureMoves : simpleMoves;
                        checkerMoves.forEach(([tr, tf]) => {
                            allMoves.push({ piece, rank: r, file: f, targetRank: tr, targetFile: tf });
                        });
                    } else if (isPawn) {
                        const direction = playerColor === 'white' ? -1 : 1;
                        const boardSize = getBoardSize(position);
                        const pawnStartRank = playerColor === 'white' ? boardSize - 2 : 1;

                        const nextR = r + direction;
                        if (isInBounds(position, nextR, f) && position[nextR][f] === '') {
                            allMoves.push({ piece, rank: r, file: f, targetRank: nextR, targetFile: f });
                            const variant = gameVariant || (typeof localStorage !== 'undefined' ? localStorage.getItem('chess_variant') : 'chess');
                            if (variant === "chess") {
                                const doubleNextR = r + 2 * direction;
                                if (r === pawnStartRank && isInBounds(position, doubleNextR, f) && position[doubleNextR][f] === '') {
                                    allMoves.push({ piece, rank: r, file: f, targetRank: doubleNextR, targetFile: f });
                                }
                            }
                        }

                        const attacks = this.getAttackSquares({ position, piece, rank: r, file: f });
                        attacks.forEach(([tr, tf]) => {
                            const targetPiece = position[tr][tf];
                            if (targetPiece !== '' && !targetPiece.startsWith(playerColor) && !targetPiece.endsWith('brick')) {
                                allMoves.push({ piece, rank: r, file: f, targetRank: tr, targetFile: tf });
                            }
                        });
                        if (prevPosition) {
                            const direction = playerColor === 'white' ? -1 : 1;

                            [1, -1].forEach(fOffset => {
                                const targetF = f + fOffset;
                                const targetR = r + direction;

                                const whitePawnStart = boardSize - 2;
                                const whitePawnEnd = boardSize - 4;
                                const blackPawnStart = 1;
                                const blackPawnEnd = 3;

                                if (playerColor === 'black' && r === whitePawnEnd) {
                                    if (position[whitePawnEnd][targetF] === 'white_pawn' &&
                                        prevPosition[whitePawnStart][targetF] === 'white_pawn' &&
                                        prevPosition[whitePawnEnd][targetF] === '' &&
                                        (!position[targetR] || position[targetR][targetF] === '')) {

                                        allMoves.push({
                                            piece, rank: r, file: f,
                                            targetRank: targetR, targetFile: targetF,
                                            isEnPassant: true
                                        });
                                    }
                                }

                                if (playerColor === 'white' && r === blackPawnEnd) {
                                    const blackPawnStart = 1;
                                    const blackPawnEnd = 3;

                                    if (position[blackPawnEnd][targetF] === 'black_pawn' &&
                                        prevPosition[blackPawnStart][targetF] === 'black_pawn' &&
                                        prevPosition[blackPawnEnd][targetF] === '' &&
                                        (!position[targetR] || position[targetR][targetF] === '')) {

                                        allMoves.push({
                                            piece, rank: r, file: f,
                                            targetRank: targetR, targetFile: targetF,
                                            isEnPassant: true
                                        });
                                    }
                                }
                            });
                        }
                    } else {
                        const attacks = this.getAttackSquares({ position, piece, rank: r, file: f });
                        attacks.forEach(([tr, tf]) => {
                            const targetPiece = position[tr][tf];
                            if (!targetPiece || !targetPiece.startsWith(playerColor) && !targetPiece.endsWith('brick')) {
                                allMoves.push({ piece, rank: r, file: f, targetRank: tr, targetFile: tf });
                            }
                        });
                    }
                }
            }
        }
        return allMoves;
    },
    isSquareAttacked: function ({ position, rank, file, byPlayer }) {
        try {
            const boardSize = getBoardSize(position);
            for (let r = 0; r < boardSize; r++) {
                for (let f = 0; f < boardSize; f++) {
                    const piece = position[r][f];
                    if (!piece || piece === '' || !piece.startsWith(byPlayer) && !piece.endsWith('brick')) continue;

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
        const boardSize = getBoardSize(position);
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
        } else if (piece.endsWith('man')) {
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
        } else if (piece.endsWith('rook') || piece.endsWith('sailboat') || piece.endsWith('chariot')) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < boardSize; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (!isInBounds(position, r, f)) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
        } else if (piece.endsWith('archbishop')) {
            const directionsR = [[-1, 1], [1, 1], [-1, -1], [1, -1]];
            directionsR.forEach(([dr, df]) => {
                for (let i = 1; i < boardSize; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (!isInBounds(position, r, f)) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
            const jumpsA = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1],
            ];
            jumpsA.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) attacks.push([r, f]);
            });
        } else if (piece.endsWith('bishop')) {
            const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < boardSize; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (!isInBounds(position, r, f)) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
        } else if (piece.endsWith('elephant_long_range')) {
            const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

            directions.forEach(([dr, df]) => {
                let hasJumped = false;

                for (let i = 1; i < boardSize; i++) {
                    const r = rank + i * dr;
                    const f = file + i * df;

                    if (position?.[r]?.[f] === undefined) break;

                    const target = position[r][f];

                    attacks.push([r, f]);

                    if (target !== '') {
                        if (!hasJumped) {
                            hasJumped = true;
                            continue;
                        } else {
                            break;
                        }
                    }
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
        } else if (piece.endsWith('marshal')) {
            const directionsR = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            directionsR.forEach(([dr, df]) => {
                for (let i = 1; i < boardSize; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (!isInBounds(position, r, f)) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
            const jumpsM = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1],
            ];
            jumpsM.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) attacks.push([r, f]);
            });
        } else if (piece.endsWith('amazon')) {
            const directionsF = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
            directionsF.forEach(([dr, df]) => {
                for (let i = 1; i < boardSize; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (!isInBounds(position, r, f)) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
            const jumpsAM = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1],
            ];
            jumpsAM.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) attacks.push([r, f]);
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
        } else if (piece.endsWith('wildebeest')) {
            const jumps = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1], [-3, -1], [-3, 1], [-1, -3], [-1, 3], [1, -3], [1, 3], [3, -1], [3, 1]];
            jumps.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('zebra')) {
            const jumps = [[-3, -2], [-3, 2], [-2, -3], [-2, 3], [2, -3], [2, 3], [3, -2], [3, 2]];
            jumps.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('lion')) {
            const jumps = [[-3, -1], [-3, 1], [-1, -3], [-1, 3], [1, -3], [1, 3], [3, -1], [3, 1], [-3, 0], [3, 0], [0, -3], [0, 3]];
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
        } else if (piece.endsWith('alibaba')) {
            const jumps = [[2, 2], [2, -2], [-2, 2], [-2, -2], [0, 2], [2, 0], [0, -2], [-2, 0]];
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
        } else if (piece.endsWith('wazir')) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            directions.forEach(([dr, df]) => {
                const [r, f] = [rank + dr, file + df];
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('ferz')) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < boardSize; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (!isInBounds(position, r, f)) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
        } else if (piece.endsWith('knight')) {
            const knightPaths = [
                { step1: [1, 0], step2: [1, 1] }, { step1: [1, 0], step2: [1, -1] },
                { step1: [-1, 0], step2: [-1, 1] }, { step1: [-1, 0], step2: [-1, -1] },
                { step1: [0, 1], step2: [1, 1] }, { step1: [0, 1], step2: [-1, 1] },
                { step1: [0, -1], step2: [1, -1] }, { step1: [0, -1], step2: [-1, -1] },
            ];
            knightPaths.forEach(path => {
                let currentX = rank;
                let currentY = file;
                while (true) {
                    currentX += path.step1[0];
                    currentY += path.step1[1];
                    if (!isInBounds(position, currentX, currentY)) break;
                    attacks.push([currentX, currentY]);
                    if (position[currentX][currentY] !== '') break;
                    currentX += path.step2[0];
                    currentY += path.step2[1];
                    if (!isInBounds(position, currentX, currentY)) break;
                    attacks.push([currentX, currentY]);
                    if (position[currentX][currentY] !== '') break;
                }
            });
        } else if (piece.endsWith('giraffe')) {
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
                const straightDirections = [[dr1, 0], [0, df1]];
                straightDirections.forEach(([sr, sf]) => {
                    for (let i = 3; i <= 7; i++) {
                        const finalRank = intermediateRank + i * sr;
                        const finalFile = intermediateFile + i * sf;
                        if (position?.[finalRank]?.[finalFile] === undefined) {
                            break;
                        }
                        let pathBlocked = false;
                        for (let s = 1; s <= i; s++) {
                            const pathRank = intermediateRank + s * sr;
                            const pathFile = intermediateFile + s * sf;
                            const pieceOnPath = position[pathRank][pathFile];
                            if (s < i) {
                                if (pieceOnPath !== '') {
                                    pathBlocked = true;
                                    break;
                                }
                            } else {
                                if (pieceOnPath !== '' && pieceOnPath.startsWith(us)) {
                                    pathBlocked = true;
                                    break;
                                }
                            }
                        }
                        if (pathBlocked) {
                            break;
                        }
                        attacks.push([finalRank, finalFile]);
                        if (position[finalRank][finalFile] !== '') {
                            break;
                        }
                    }
                });
            });
        } else if (piece.endsWith('dinozavr')) {
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
            directions.forEach(([dr, df]) => {
                for (let i = 1; i < boardSize; i++) {
                    const [r, f] = [rank + i * dr, file + i * df];
                    if (!isInBounds(position, r, f)) break;
                    attacks.push([r, f]);
                    if (position[r][f] !== '') break;
                }
            });
            const knightPaths = [
                { step1: [1, 0], step2: [1, 1] }, { step1: [1, 0], step2: [1, -1] },
                { step1: [-1, 0], step2: [-1, 1] }, { step1: [-1, 0], step2: [-1, -1] },
                { step1: [0, 1], step2: [1, 1] }, { step1: [0, 1], step2: [-1, 1] },
                { step1: [0, -1], step2: [1, -1] }, { step1: [0, -1], step2: [-1, -1] },
            ];
            knightPaths.forEach(path => {
                let currentX = rank;
                let currentY = file;
                while (true) {
                    currentX += path.step1[0];
                    currentY += path.step1[1];
                    if (!isInBounds(position, currentX, currentY)) break;
                    attacks.push([currentX, currentY]);
                    if (position[currentX][currentY] !== '') break;
                    currentX += path.step2[0];
                    currentY += path.step2[1];
                    if (!isInBounds(position, currentX, currentY)) break;
                    attacks.push([currentX, currentY]);
                    if (position[currentX][currentY] !== '') break;
                }
            });
        } else if (piece.endsWith('giraffe')) {
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
                const straightDirections = [[dr1, 0], [0, df1]];
                straightDirections.forEach(([sr, sf]) => {
                    for (let i = 3; i <= 7; i++) {
                        const finalRank = intermediateRank + i * sr;
                        const finalFile = intermediateFile + i * sf;
                        if (position?.[finalRank]?.[finalFile] === undefined) {
                            break;
                        }
                        let pathBlocked = false;
                        for (let s = 1; s <= i; s++) {
                            const pathRank = intermediateRank + s * sr;
                            const pathFile = intermediateFile + s * sf;
                            const pieceOnPath = position[pathRank][pathFile];
                            if (s < i) {
                                if (pieceOnPath !== '') {
                                    pathBlocked = true;
                                    break;
                                }
                            }
                        }
                        if (pathBlocked) {
                            break;
                        }
                        attacks.push([finalRank, finalFile]);
                        if (position[finalRank][finalFile] !== '') {
                            break;
                        }
                    }
                });
            });
        } else if (piece.endsWith('rhino')) {
            const knightLeaps = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1],
            ];

            knightLeaps.forEach(([kx, ky]) => {
                let x = rank + kx;
                let y = file + ky;

                if (position?.[x]?.[y] === undefined) return;

                const firstCell = position[x][y];

                if (firstCell === '' || firstCell.startsWith(enemy)) {
                    attacks.push([x, y]);
                }

                if (firstCell === '') {
                    const dx = Math.sign(kx);
                    const dy = Math.sign(ky);

                    let sx = x + dx;
                    let sy = y + dy;

                    while (position?.[sx]?.[sy] !== undefined) {
                        const cell = position[sx][sy];

                        if (cell === '') {
                            attacks.push([sx, sy]);
                        } else {
                            if (cell.startsWith(enemy)) {
                                attacks.push([sx, sy]);
                            }
                            break;
                        }
                        sx += dx;
                        sy += dy;
                    }
                }
            });
        } else if (piece.endsWith('rukh')) {
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
                const straightDirections = [[dr1, 0], [0, df1]];
                straightDirections.forEach(([sr, sf]) => {
                    for (let i = 1; i <= 7; i++) {
                        const finalRank = intermediateRank + i * sr;
                        const finalFile = intermediateFile + i * sf;
                        if (position?.[finalRank]?.[finalFile] === undefined) {
                            break;
                        }
                        let pathBlocked = false;
                        for (let s = 1; s <= i; s++) {
                            const pathRank = intermediateRank + s * sr;
                            const pathFile = intermediateFile + s * sf;
                            const pieceOnPath = position[pathRank][pathFile];
                            if (s < i) {
                                if (pieceOnPath !== '') {
                                    pathBlocked = true;
                                    break;
                                }
                            }
                        }
                        if (pathBlocked) {
                            break;
                        }
                        attacks.push([finalRank, finalFile]);
                        if (position[finalRank][finalFile] !== '') {
                            break;
                        }
                    }
                });
            });
            const diagonalAttacks = [
                [rank + 1, file + 1],
                [rank + 1, file - 1],
                [rank - 1, file + 1],
                [rank - 1, file - 1]
            ];
            diagonalAttacks.forEach(([r, f]) => {
                if (position?.[r]?.[f] !== undefined) {
                    attacks.push([r, f]);
                }
            });
        } else if (piece.endsWith('checkers') || piece.endsWith('checker_long_range')) {
            const us = piece.startsWith('white') ? 'white' : 'black';
            const enemy = us === 'white' ? 'black' : 'white';
            const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

            if (piece.endsWith('checker_long_range')) {
                directions.forEach(([dr, df]) => {
                    for (let i = 1; i < boardSize; i++) {
                        const [r, f] = [rank + i * dr, file + i * df];
                        if (!isInBounds(position, r, f)) break;
                        const target = position[r][f];
                        attacks.push([r, f]);
                        if (target !== '') break;
                    }
                });
            } else {
                const direction = us === 'white' ? -1 : 1;
                const diagonalSquares = [
                    [rank - 1, file - 1],
                    [rank - 1, file + 1],
                    [rank + 1, file - 1],
                    [rank + 1, file + 1],
                ];
                diagonalSquares.forEach(([r, f]) => {
                    if (position?.[r]?.[f] !== undefined) {
                        attacks.push([r, f]);
                    }
                });
                for (let df of [-1, 1]) {
                    const adjRank = rank + direction;
                    const adjFile = file + df;
                    const landRank = rank + 2 * direction;
                    const landFile = file + 2 * df;
                    if (position?.[adjRank]?.[adjFile] && position[adjRank][adjFile].startsWith(enemy) &&
                        position?.[landRank]?.[landFile] !== undefined && position[landRank][landFile] === '') {
                        attacks.push([landRank, landFile]);
                    }
                }
                for (let df of [-1, 1]) {
                    const adjRank = rank - direction;
                    const adjFile = file + df;
                    const landRank = rank - 2 * direction;
                    const landFile = file + 2 * df;
                    if (position?.[adjRank]?.[adjFile] && position[adjRank][adjFile].startsWith(enemy) &&
                        position?.[landRank]?.[landFile] !== undefined && position[landRank][landFile] === '') {
                        attacks.push([landRank, landFile]);
                    }
                }
            }
        }
        return attacks;
    },
    isKingInCheck: function ({ position, playerColor }) {
        const enemy = playerColor === 'white' ? 'black' : 'white';
        const boardSize = getBoardSize(position);
        for (let r = 0; r < boardSize; r++) {
            for (let f = 0; f < boardSize; f++) {
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
    isMoveLegal: function ({ position, piece, fromRank, fromFile, toRank, toFile, playerColor }) {
        const newPosition = position.map(row => [...row]);

        newPosition[fromRank][fromFile] = '';
        newPosition[toRank][toFile] = piece;

        if (piece.endsWith('pawn') && fromFile !== toFile && position[toRank][toFile] === '') {
            newPosition[fromRank][toFile] = '';
        }

        if ((piece.endsWith('checkers') || piece.endsWith('checker_long_range')) && Math.abs(toRank - fromRank) === Math.abs(toFile - fromFile)) {
            const stepRank = toRank > fromRank ? 1 : toRank < fromRank ? -1 : 0;
            const stepFile = toFile > fromFile ? 1 : toFile < fromFile ? -1 : 0;
            let currentRank = fromRank + stepRank;
            let currentFile = fromFile + stepFile;

            while (currentRank !== toRank || currentFile !== toFile) {
                const square = position[currentRank]?.[currentFile];
                if (square && square !== '') {
                    newPosition[currentRank][currentFile] = '';
                    break;
                }
                currentRank += stepRank;
                currentFile += stepFile;
            }
        }

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
        } else if (piece.endsWith('elephant_long_range')) {
            moves = getElephantLongRangeMoves({ position, piece, rank, file });
        } else if (piece.endsWith('firzan')) {
            moves = getFirzanMoves({ position, piece, rank, file });
        } else if (piece.endsWith('elephant')) {
            moves = getElephantMoves({ position, rank, file });
        } else if (piece.endsWith('tank')) {
            moves = getTankMoves({ position, rank, file });
        } else if (piece.endsWith('camel')) {
            moves = getCamelMoves({ position, rank, file });
        } else if (piece.endsWith('zebra')) {
            moves = getZebraMoves({ position, piece, rank, file });
        } else if (piece.endsWith('lion')) {
            moves = getLionMoves({ position, piece, rank, file });
        } else if (piece.endsWith('horse')) {
            moves = getHorseMoves({ position, rank, file });
        } else if (piece.endsWith('archbishop')) {
            moves = getArchbishopMoves({ position, piece, rank, file });
        } else if (piece.endsWith('bishop')) {
            moves = getBishopMoves({ position, piece, rank, file });
        } else if (piece.endsWith('marshal')) {
            moves = getMarshalMoves({ position, piece, rank, file });
        } else if (piece.endsWith('amazon')) {
            moves = getAmazonMoves({ position, piece, rank, file });
        } else if (piece.endsWith('alibaba')) {
            moves = getAlibabaMoves({ position, rank, file });
        } else if (piece.endsWith('imperator')) {
            moves = getImperatorMoves({ position, piece, rank, file });
        } else if (piece.endsWith('king')) {
            moves = getKingMoves({ position, piece, castleDirection, rank, file });
        } else if (piece.endsWith('rook') || piece.endsWith('sailboat') || piece.endsWith('chariot')) {
            moves = getRookMoves({ position, piece, rank, file });
        } else if (piece.endsWith('ferz')) {
            moves = getFerzMoves({ position, piece, rank, file });
        } else if (piece.endsWith('man')) {
            moves = getManMoves({ position, piece, rank, file });
        } else if (piece.endsWith('knight')) {
            moves = getKnightMoves({ position, piece, rank, file });
        } else if (piece.endsWith('rukh')) {
            moves = getRukhMoves({ position, piece, rank, file });
        } else if (piece.endsWith('dinozavr')) {
            moves = getDinozavrMoves({ position, piece, rank, file });
        } else if (piece.endsWith('giraffe')) {
            moves = getGiraffeMoves({ position, piece, rank, file });
        } else if (piece.endsWith('rhino')) {
            moves = getRhinoMoves({ position, piece, rank, file });
        } else if (piece.endsWith('wildebeest')) {
            moves = getWildebeestMoves({ position, rank, file });
        } else if (piece.endsWith('wazir')) {
            moves = getWazirMoves({ position, piece, rank, file });
        } else if (piece.endsWith('checkers') || piece.endsWith('checker_long_range')) {
            const simpleMoves = getCheckersMoves({ position, piece, rank, file });
            const captureMoves = getCheckersCaptures({ position, piece, rank, file });
            moves = captureMoves.length > 0 ? captureMoves : simpleMoves;
        }
        const playerColor = piece.startsWith('white') ? 'white' : 'black';
        const filteredMoves = moves.filter(([toRank, toFile]) =>
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
        return filteredMoves;
    },
    getGameStatus: function ({ position, playerColor, castleDirection, prevPosition, positionHistory = [] }) {
        try {
            const currentHash = generatePositionHash(position, playerColor, castleDirection);

            const repetitions = positionHistory.filter(hash => hash === currentHash).length;

            if (repetitions >= 3) {
                return status.draw;
            }

            if (!this.hasKing({ position, playerColor })) {
                return playerColor === 'white' ? status.black : status.white;
            }

            const isInCheck = this.isKingInCheck({ position, playerColor });
            let hasLegalMove = false;
            const boardSize = getBoardSize(position);
            for (let r = 0; r < boardSize; r++) {
                for (let f = 0; f < boardSize; f++) {
                    const piece = position[r][f];
                    if (!piece || piece === '' || !piece.startsWith(playerColor)) continue;
                    try {
                        const safeCastleDir = castleDirection && typeof castleDirection === 'object'
                            ? castleDirection[playerColor]
                            : 'both';
                        const validMoves = this.getRegularMoves({
                            position,
                            prevPosition,
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
            const isShatranj = localStorage.getItem('chess_variant') === 'shatranj' || localStorage.getItem('chess_variant') === 'shatranj960';

            if (isInCheck && !hasLegalMove) {
                return playerColor === 'white' ? status.black : status.white;
            }

            else if (!isInCheck && !hasLegalMove) {
                if (isShatranj) {
                    return playerColor === 'white' ? status.black : status.white;
                }
                return status.draw;
            }

            if (isShatranj) {
                const opponentColor = playerColor === 'white' ? 'black' : 'white';
                const isPlayerBare = this.isBareKing({ position, playerColor });
                const isOpponentBare = this.isBareKing({ position, playerColor: opponentColor });

                if (isPlayerBare && isOpponentBare) {
                    return status.draw;
                } else if (isOpponentBare) {
                    return playerColor === 'black' ? status.black : status.white;
                }
            }

            if (this.insufficientMaterial({ position })) {
                return status.draw;
            }
        } catch (error) {
            console.error(error);
        }
        return status.ongoing;
    },
    hasKing: function ({ position, playerColor }) {
        const boardSize = getBoardSize(position);
        for (let r = 0; r < boardSize; r++) {
            for (let f = 0; f < boardSize; f++) {
                const piece = position[r][f];
                if (piece && piece !== '' && piece.startsWith(playerColor) && (piece.endsWith('king') || piece.endsWith('imperator'))) {
                    return true;
                }
            }
        }
        return false;
    },
    isBareKing: function ({ position, playerColor }) {
        const boardSize = getBoardSize(position);
        for (let r = 0; r < boardSize; r++) {
            for (let f = 0; f < boardSize; f++) {
                const piece = position[r][f];
                if (piece && piece !== '' && piece.startsWith(playerColor) && !piece.endsWith('imperator')) {
                    return false;
                }
            }
        }
        return true;
    },
    insufficientMaterial: function ({ position }) {
        const pieces = [];
        const pieceCounts = {};
        const boardSize = getBoardSize(position);
        for (let r = 0; r < boardSize; r++) {
            for (let f = 0; f < boardSize; f++) {
                const piece = position[r][f];
                if (piece && piece !== '') {
                    pieces.push(piece);
                    pieceCounts[piece] = (pieceCounts[piece] || 0) + 1;
                }
            }
        }
        if (localStorage.getItem('chess_variant') !== 'shatranj') {
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
                } else if (whiteHorse === 2 && blackHorse === 0) {
                    return true;
                } else if (whiteHorse === 0 && blackHorse === 2) {
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
        }
        return false;
    }
};

export default arbiter;