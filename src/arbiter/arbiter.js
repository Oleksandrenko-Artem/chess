import { getBishopMoves, getElephantMoves, getFerzMoves, getHorseMoves, getRookMoves } from "./getMoves"

const arbiter = {
    getRegularMoves: function ({ position, piece, rank, file }) {
        if (piece.endsWith('elephant')) {
            return getElephantMoves({ position, rank, file });
        }
        if (piece.endsWith('horse')) {
            return getHorseMoves({ position, rank, file });
        }
        if (piece.endsWith('bishop')) {
            return getBishopMoves({ position, piece, rank, file });
        }
        if (piece.endsWith('rook')) {
            return getRookMoves({ position, piece, rank, file });
        }
        if (piece.endsWith('ferz')) {
            return getFerzMoves({ position, piece, rank, file });
        }
    }
};

export default arbiter;