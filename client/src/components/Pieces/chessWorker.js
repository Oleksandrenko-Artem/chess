import { PIECE_VALUES } from "../../constants";
import arbiter from "./../../arbiter/arbiter";

const evaluatePosition = (position, gameVariant = "") => {
    let totalScore = 0;

    const boardSize = position?.length || 8;
    const centerStart = Math.floor((boardSize - 2) / 2);
    const centerEnd = Math.ceil((boardSize + 2) / 2) - 1;

    const isShatranj = gameVariant && gameVariant.toLowerCase().includes("shatranj");

    let totalPieces = 0;
    let whiteKingPos = null;
    let blackKingPos = null;
    let whiteBacklinePieces = 0;
    let blackBacklinePieces = 0;

    for (let r = 0; r < boardSize; r++) {
        const row = position[r];
        for (let f = 0; f < boardSize; f++) {
            const p = row[f];
            if (!p) continue;
            totalPieces++;
            if (p === "white_king") whiteKingPos = { r, f };
            else if (p === "black_king") blackKingPos = { r, f };

            if (r === 7 && p.startsWith("white") && (p.includes("horse") || p.includes("elephant"))) whiteBacklinePieces++;
            if (r === 0 && p.startsWith("black") && (p.includes("horse") || p.includes("elephant"))) blackBacklinePieces++;
        }
    }

    const isEndgame = totalPieces <= 6;
    const isOpening = totalPieces >= 24;
    const isMiddlegame = totalPieces > 6 && totalPieces < 24;

    for (let r = 0; r < boardSize; r++) {
        const row = position[r];
        for (let f = 0; f < boardSize; f++) {
            const p = row[f];
            if (!p) continue;

            const isWhite = p.startsWith("white");
            const type = p.split('_').pop();

            let value = PIECE_VALUES[type] || 100;
            const isCenter = r >= centerStart && r <= centerEnd && f >= centerStart && f <= centerEnd;

            if (isShatranj) {
                if (isOpening || isMiddlegame) {
                    if (type === "horse") value += 40;
                    if (type === "elephant") value += 30;

                    if (type === "horse" || type === "elephant") {
                        if (isWhite && r < 7) value += 25;
                        if (!isWhite && r > 0) value += 25;
                    }
                }
            } else {
                if (isEndgame && (type === "rook" || type === "rook_960")) {
                    value += 40;
                }
            }

            if (isOpening) {
                if (type === "rook" || type === "rook_960") {
                    if (isWhite && r !== 7) value -= 60;
                    if (!isWhite && r !== 0) value -= 60;
                }

                if (isShatranj) {
                    if (type === "soldier") {
                        let advanceBonus = isWhite ? (boardSize - 1 - r) * 12 : r * 12;
                        if (f >= centerStart - 1 && f <= centerEnd + 1) {
                            advanceBonus += isWhite ? (boardSize - 1 - r) * 15 : r * 15;
                        }
                        if (isWhite && r <= 4 && whiteBacklinePieces >= 2) advanceBonus -= 30;
                        if (!isWhite && r >= 3 && blackBacklinePieces >= 2) advanceBonus -= 30;

                        value += advanceBonus;
                    }
                    if ((type === "elephant" || type === "horse") && isCenter) {
                        value += 35;
                    }
                    if (type === "elephant" || type === "horse") {
                        if (isWhite && r <= 5 && position[r + 1]?.[f] === "white_soldier") value -= 40;
                        if (!isWhite && r >= 2 && position[r - 1]?.[f] === "black_soldier") value -= 40;
                    }
                } else {
                    if (type === "pawn" && (f === 3 || f === 4)) {
                        value += isWhite ? (boardSize - 1 - r) * 20 : r * 20;
                    }
                    if (type === "ferz") {
                        if (isCenter) value -= 15;
                        if (isWhite && (r !== 7 || f !== 3)) value -= 60;
                        if (!isWhite && (r !== 0 || f !== 3)) value -= 60;
                    }
                    if (type === "horse" || type === "bishop") {
                        if (isWhite && r === 7) value -= 30;
                        if (!isWhite && r === 0) value -= 30;
                    }
                    if (type === "bishop" || type === "knight") {
                        if (isWhite && r === 5 && (f === 3 || f === 4) && position[f] === "white_pawn") value -= 45;
                        if (!isWhite && r === 2 && (f === 3 || f === 4) && position[f] === "black_pawn") value -= 45;
                    }
                }
            }

            if (!isOpening && (type === "pawn" || type === "soldier")) {
                const pawnBonus = isWhite ? (boardSize - 1 - r) * 25 : r * 25;
                value += pawnBonus;
            }

            if (type !== "king" && isCenter) {
                value += 25;
            }

            if (type === "king" || type === "imperator") {
                if (isEndgame) {
                    if (isCenter) value += 60;
                } else {
                    if (f <= 1 || f >= boardSize - 2) value += 45;
                }
            }

            totalScore += isWhite ? value : -value;
        }
    }

    if (isEndgame && whiteKingPos && blackKingPos) {
        const distance = Math.abs(whiteKingPos.r - blackKingPos.r) + Math.abs(whiteKingPos.f - blackKingPos.f);
        if (totalScore > 150) totalScore += (14 - distance) * 20;
        else if (totalScore < -150) totalScore -= (14 - distance) * 20;
    }

    if (arbiter.isKingInCheck({ position, playerColor: "white" })) totalScore -= 80;
    if (arbiter.isKingInCheck({ position, playerColor: "black" })) totalScore += 80;

    return totalScore;
};

const makeMoveOnBoard = (position, move) => {
    const piece = position[move.rank][move.file];
    const captured = position[move.targetRank][move.targetFile];
    position[move.targetRank][move.targetFile] = piece;
    position[move.rank][move.file] = "";
    return captured;
};

const unmakeMoveOnBoard = (position, move, piece, captured) => {
    position[move.rank][move.file] = piece;
    position[move.targetRank][move.targetFile] = captured;
};

const minimax = (
    position,
    depth,
    isMaximizing,
    alpha,
    beta,
    castleDirection,
    prevPosition,
    gameVariant,
) => {
    if (depth === 0) return evaluatePosition(position, gameVariant);

    const playerColor = isMaximizing ? "white" : "black";
    const rawMoves = arbiter.getBoardValidMoves({
        position,
        playerColor,
        castleDirection,
        prevPosition,
    });

    const moves = rawMoves.filter((move) => {
        const piece = position[move.rank][move.file];
        const captured = position[move.targetRank][move.targetFile];
        position[move.targetRank][move.targetFile] = piece;
        position[move.rank][move.file] = "";
        const isCheck = arbiter.isKingInCheck({ position, playerColor });
        position[move.rank][move.file] = piece;
        position[move.targetRank][move.targetFile] = captured;
        return !isCheck;
    });

    if (moves.length === 0) {
        if (arbiter.isKingInCheck({ position, playerColor })) {
            return isMaximizing ? -1000000 + (4 - depth) : 1000000 - (4 - depth);
        }
        const currentEval = evaluatePosition(position, gameVariant);
        if (isMaximizing && currentEval > 0) return -50000;
        if (!isMaximizing && currentEval < 0) return 50000;
        return 0;
    }

    moves.sort((a, b) => {
        const pA = position[a.targetRank][a.targetFile];
        const pB = position[b.targetRank][b.targetFile];

        const attackerA = position[a.rank][a.file]?.split("_").pop() || "";
        const attackerB = position[b.rank][b.file]?.split("_").pop() || "";

        const valA = pA ? PIECE_VALUES[pA.split("_").pop()] || 100 : 0;
        const valB = pB ? PIECE_VALUES[pB.split("_").pop()] || 100 : 0;

        const costAttackerA = PIECE_VALUES[attackerA] || 100;
        const costAttackerB = PIECE_VALUES[attackerB] || 100;

        const scoreA = valA > 0 ? (valA * 10 - costAttackerA) : 0;
        const scoreB = valB > 0 ? (valB * 10 - costAttackerB) : 0;

        return scoreB - scoreA;
    });

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const piece = position[move.rank][move.file];
            const captured = makeMoveOnBoard(position, move);
            const evalScore = minimax(position, depth - 1, false, alpha, beta, castleDirection, position, gameVariant);
            unmakeMoveOnBoard(position, move, piece, captured);

            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const piece = position[move.rank][move.file];
            const captured = makeMoveOnBoard(position, move);
            const evalScore = minimax(position, depth - 1, true, alpha, beta, castleDirection, position, gameVariant);
            unmakeMoveOnBoard(position, move, piece, captured);

            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

self.onmessage = (e) => {
    const { currentPosition, prevPosition, playerTurn, castleDirection, depth, gameVariant } = e.data;

    const moves = arbiter.getBoardValidMoves({
        position: currentPosition,
        prevPosition,
        playerColor: playerTurn,
        castleDirection,
        gameVariant: gameVariant
    });

    const legalMoves = moves.filter((move) => {
        const piece = currentPosition[move.rank][move.file];
        const captured = currentPosition[move.targetRank][move.targetFile];
        currentPosition[move.targetRank][move.targetFile] = piece;
        currentPosition[move.rank][move.file] = "";
        const isCheck = arbiter.isKingInCheck({ position: currentPosition, playerColor: playerTurn });
        currentPosition[move.rank][move.file] = piece;
        currentPosition[move.targetRank][move.targetFile] = captured;
        return !isCheck;
    });

    if (legalMoves.length === 0) {
        self.postMessage({ chosenMove: null });
        return;
    }

    const scoredMoves = legalMoves.map((move) => {
        const piece = currentPosition[move.rank][move.file];
        const captured = makeMoveOnBoard(currentPosition, move);

        const nextIsMaximizing = playerTurn === "white" ? false : true;
        const score = minimax(
            currentPosition,
            depth - 1,
            nextIsMaximizing,
            -Infinity,
            Infinity,
            castleDirection,
            currentPosition,
            gameVariant
        );

        unmakeMoveOnBoard(currentPosition, move, piece, captured);

        return { ...move, score, piece };
    });

    scoredMoves.sort((a, b) =>
        playerTurn === "white" ? b.score - a.score : a.score - b.score
    );

    const bestScore = scoredMoves[0].score;
    const topMoves = scoredMoves.filter(m => m.score === bestScore);
    const chosenMove = topMoves[Math.floor(Math.random() * topMoves.length)];

    self.postMessage({ chosenMove });
};
