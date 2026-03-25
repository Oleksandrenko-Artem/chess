import { createDinoPosition, createExtendedPosition, createFerzVsRukhPosition, createArenaPosition, createNewVariantPosition, createOldPosition, createOldVariantPosition, createPosition, createSpecialPosition, createWallsPosition } from "./helpers";

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
export const initialNewVariantGameState = {
    position: [createNewVariantPosition()],
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
export const initialFerzVsRukhGameState = {
    position: [createFerzVsRukhPosition()],
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
export const initialWallsGameState = {
    position: [createWallsPosition()],
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
export const initialArenaGameState = {
    position: [createArenaPosition()],
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
export const piecesArrayPromotion = [
    'horse (standart)',
    'bishop (standart)',
    'rook (standart)',
    'ferz (standart)',
    'elephant (old)',
    'firzan (old)',
    'wazir (old)',
    'man (old)',
    'tank (old)',
    'camel (old)',
    'zebra (old)',
    'lion (old)',
    'rhino (old)',
    'wildebeest (old)',
    'giraffe (old)',
    'rukh (old)',
    'archbishop (old)',
    'marshal (old)',
    'amazon (old)',
    'long-range elephant (special)',
    'knight (special)',
    'dinozavr (special)',
    'checker (special)',
];
export const PIECE_VALUES = {
    pawn: 100, soldier: 100, firzan: 200, elephant: 210, horse: 300,
    bishop: 350, rook: 500, ferz: 900, imperator: 20000, king: 20000,
    tank: 220, camel: 250, zebra: 150, amazon: 1200, dinozavr: 2200,
    lion: 310, giraffe: 190, rukh: 1050, wazir: 220, man: 310,
    knight: 700, checkers: 50, elephant_long_range: 600, rhino: 700,
    wildebeest: 550, marshal: 850, archbishop: 600,
};