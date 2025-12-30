import { createOldPosition, createPosition, createSpecialPosition } from "./helpers";

export const status = {
    'ongoing': 'Ongoing',
    'promotion': 'Promotion',
    'white': 'White wins',
    'black': 'Black wins',
    'draw': 'Draw',
};
export const initialGameState = {
    position: [createPosition()],
    playerTurn: 'white',
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
};
export const initialOldGameState = {
    position: [createOldPosition()],
    playerTurn: 'white',
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
};
export const initialSpecialGameState = {
    position: [createSpecialPosition()],
    playerTurn: 'white',
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
};