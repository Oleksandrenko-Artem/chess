import { PIECE_VALUES } from "../../constants";
import arbiter from "./../../arbiter/arbiter";

const evaluatePosition = (position) => {
    let totalScore = 0;

    const boardSize = position?.length || 8;
    const centerStart = Math.floor((boardSize - 2) / 2);
    const centerEnd = Math.ceil((boardSize + 2) / 2) - 1;

    for (let r = 0; r < boardSize; r++) {
        for (let f = 0; f < boardSize; f++) {
            const p = position[r][f];
            if (!p) continue;

            const isWhite = p.startsWith("white");
            const type = p.split('_').pop();
            let value = PIECE_VALUES[type] || 100;

            if (r >= centerStart && r <= centerEnd && f >= centerStart && f <= centerEnd) value += 20;

            if (type === "king" && (f <= 1 || f >= boardSize - 2)) {
                value += 80;
            }

            totalScore += isWhite ? value : -value;
        }
    }

    if (arbiter.isKingInCheck({ position, playerColor: "white" })) totalScore -= 70;
    if (arbiter.isKingInCheck({ position, playerColor: "black" })) totalScore += 70;

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
) => {
    if (depth === 0) return evaluatePosition(position);

    const playerColor = isMaximizing ? "white" : "black";
    const moves = arbiter.getBoardValidMoves({
        position,
        playerColor,
        castleDirection,
        prevPosition,
    });

    if (moves.length === 0) {
        if (arbiter.isKingInCheck({ position, playerColor })) {
            return isMaximizing ? -1000000 : 1000000;
        }
        const currentEval = evaluatePosition(position);
        const isWhiteAhead = currentEval > 0;
        const isBlackAhead = currentEval < 0;
        if (isMaximizing && isWhiteAhead) {
            return -50000;
        }
        if (!isMaximizing && isBlackAhead) {
            return 50000;
        }
        return 0;
    }

    moves.sort((a, b) => {
        const scoreA = position[a.targetRank][a.targetFile]
            ? PIECE_VALUES[position[a.targetRank][a.targetFile].split("_")[1]]
            : 0;
        const scoreB = position[b.targetRank][b.targetFile]
            ? PIECE_VALUES[position[b.targetRank][b.targetFile].split("_")[1]]
            : 0;
        return scoreB - scoreA;
    });

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const piece = position[move.rank][move.file];
            const captured = makeMoveOnBoard(position, move);

            const evalScore = minimax(
                position,
                depth - 1,
                false,
                alpha,
                beta,
                castleDirection,
                position,
            );

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

            const evalScore = minimax(
                position,
                depth - 1,
                true,
                alpha,
                beta,
                castleDirection,
                position,
            );

            unmakeMoveOnBoard(position, move, piece, captured);

            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

self.onmessage = (e) => {
    const { currentPosition, prevPosition, playerTurn, castleDirection, depth } = e.data;

    const moves = arbiter.getBoardValidMoves({
        position: currentPosition,
        prevPosition,
        playerColor: playerTurn,
        castleDirection,
        gameVariant: e.data.gameVariant
    });

    const legalMoves = moves.filter((move) => {
        const temp = JSON.parse(JSON.stringify(currentPosition));
        const piece = temp[move.rank][move.file];
        temp[move.rank][move.file] = "";
        temp[move.targetRank][move.targetFile] = piece;
        return !arbiter.isKingInCheck({ position: temp, playerColor: playerTurn });
    });

    if (legalMoves.length === 0) {
        self.postMessage({ chosenMove: null });
        return;
    }

    const scoredMoves = legalMoves.map((move) => {
        const tempPos = JSON.parse(JSON.stringify(currentPosition));
        const piece = tempPos[move.rank][move.file];

        tempPos[move.targetRank][move.targetFile] = piece;
        tempPos[move.rank][move.file] = "";

        const nextIsMaximizing = playerTurn === "white" ? false : true;
        const score = minimax(
            tempPos,
            depth - 1,
            nextIsMaximizing,
            -Infinity,
            Infinity,
            castleDirection,
            currentPosition
        );

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
