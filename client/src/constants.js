import { createOldPosition, createPosition, createSpecialPosition } from "./helpers";

export const status = {
    'ongoing': 'Ongoing',
    'promotion': 'Promotion',
    'white': 'White wins',
    'black': 'Black wins',
    'draw': 'Draw',
};
export const pieceValues = {
    pawn: 1,
    soldier: 1,
    checkers: 1,
    horse: 3,
    elephant: 2,
    firzan: 2,
    tank: 2,
    camel: 4,
    giraffe: 5,
    bishop: 3,
    rook: 5,
    sailboat: 5,
    rukh: 6,
    ferz: 9,
    dinozavr: 17,
    imperator: 20,
    king: 20,
};
export const pieces = {
    pawn: 'pawn',
    horse: 'horse',
    bishop: 'hishop',
};
export const baseUrl = {
    BASE_URL: 'http://localhost:3000',
}
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