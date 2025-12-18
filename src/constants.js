import { createOldPosition, createPosition } from "./helpers";

export const status = {
    'ongoing': 'Ongoing',
    'promotion': 'Promotion',
    'white': 'White wins',
    'black': 'Black wins',
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