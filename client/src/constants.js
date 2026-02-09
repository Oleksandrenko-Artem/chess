import { createDinoPosition, createExtendedPosition, createOldPosition, createOldVariantPosition, createPosition, createSpecialPosition } from "./helpers";

export const status = {
    'ongoing': 'Ongoing',
    'promotion': 'Promotion',
    'white': 'White wins',
    'black': 'Black wins',
    'draw': 'Draw',
};
export const pieces = {
    pawn: 'pawn',
    horse: 'horse',
    bishop: 'bishop',
};
export const baseUrl = {
    BASE_URL: 'http://localhost:3000',
};
export const initialGameState = {
    position: [createPosition()],
    playerTurn: 'white',
    movesList: [],
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
    captured: {
        white: [],
        black: [],
    },
    orientation: 'white',
};
export const initialOldGameState = {
    position: [createOldPosition()],
    playerTurn: 'white',
    movesList: [],
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
    captured: {
        white: [],
        black: [],
    },
    orientation: 'white',
};
export const initialSpecialGameState = {
    position: [createSpecialPosition()],
    playerTurn: 'white',
    movesList: [],
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
    captured: {
        white: [],
        black: [],
    },
    orientation: 'white',
};
export const initialOldVariantGameState = {
    position: [createOldVariantPosition()],
    playerTurn: 'white',
    movesList: [],
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
    captured: {
        white: [],
        black: [],
    },
    orientation: 'white',
};
export const initialDinoGameState = {
    position: [createDinoPosition()],
    playerTurn: 'white',
    movesList: [],
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
    captured: {
        white: [],
        black: [],
    },
    orientation: 'white',
};
export const initialExtendedGameState = {
    position: [createExtendedPosition()],
    playerTurn: 'white',
    movesList: [],
    validMoves: [],
    status: status.ongoing,
    promotionSquare: null,
    castleDirection: {
        white: 'both',
        black: 'both',
    },
    captured: {
        white: [],
        black: [],
    },
    orientation: 'white',
};