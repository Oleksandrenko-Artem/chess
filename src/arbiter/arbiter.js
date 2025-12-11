import { getBishopMoves, getElephantMoves, getFerzMoves, getFirzanMoves, getHorseMoves, getKingMoves, getPawnCaptures, getPawnMoves, getRookMoves, getSoldierCaptures, getSoldierMoves } from "./getMoves"

const arbiter = {
    getRegularMoves: function ({ position, prevPosition, piece, rank, file }) {
        if (piece.endsWith('pawn')) {
            return [
                ...getPawnMoves({ position, piece, rank, file }),
                ...getPawnCaptures({ position, prevPosition, piece, rank, file }),
            ];
        }
        if (piece.endsWith('soldier')) {
            return [
                ...getSoldierMoves({ position, piece, rank, file }),
                ...getSoldierCaptures({ position, piece, rank, file }),
            ];
        }
        if (piece.endsWith('firzan')) {
            return getFirzanMoves({ position, piece, rank, file });
        }
        if (piece.endsWith('elephant')) {
            return getElephantMoves({ position, rank, file });
        }
        if (piece.endsWith('horse')) {
            return getHorseMoves({ position, rank, file });
        }
        if (piece.endsWith('bishop')) {
            return getBishopMoves({ position, piece, rank, file });
        }
        if (piece.endsWith('king')) {
            return getKingMoves({ position, piece, rank, file });
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