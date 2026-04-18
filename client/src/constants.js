import { createDinoPosition, createExtendedPosition, createFerzVsRukhPosition, createArenaPosition, createNewVariantPosition, createOldPosition, createOldVariantPosition, createPosition, createSpecialPosition, createWallsPosition, createGrandAceDrexPosition, createAmazonPosition, createGreatChessPosition, createGrandChessPosition, createChess960Position, createShatranj960Position } from "./helpers";

export const GAME_MODES = [
    "chess",
    "shatranj",
    "chess960",
    "shatranj960",
    "custom",
];
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
    whiteTime: 3600,
    blackTime: 3600,
    timerActive: false,
    boardSize: 8,
    isMultiplayer: false,
    roomId: null,
    isVsBot: false,
    botDifficulty: 'easy',
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
    whiteTime: 3600,
    blackTime: 3600,
    timerActive: false,
    boardSize: 8,
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
    whiteTime: 1200,
    blackTime: 1200,
    timerActive: false,
    boardSize: 8,
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
    whiteTime: 1200,
    blackTime: 1200,
    timerActive: false,
    boardSize: 8,
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
    whiteTime: 1200,
    blackTime: 1200,
    timerActive: false,
    boardSize: 8,
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
    boardSize: 8,
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
    boardSize: 8,
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
    boardSize: 8,
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
    boardSize: 8,
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
    boardSize: 8,
};
export const initialGrandAceDrexState = {
    position: [createGrandAceDrexPosition()],
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
    boardSize: 12,
};
export const initialAmazonState = {
    position: [createAmazonPosition()],
    playerTurn: 'black',
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
    orientation: 'black',
    whiteTime: 1200,
    blackTime: 1200,
    timerActive: false,
    boardSize: 8,
};
export const initialGreatChessState = {
    position: [createGreatChessPosition()],
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
    whiteTime: 1200,
    blackTime: 1200,
    timerActive: false,
    boardSize: 10,
};
export const initialGrandChessState = {
    position: [createGrandChessPosition()],
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
    whiteTime: 1200,
    blackTime: 1200,
    timerActive: false,
    boardSize: 10,
};
export const initialChess960State = {
    position: [createChess960Position()],
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
    whiteTime: 3600,
    blackTime: 3600,
    timerActive: false,
    boardSize: 8,
};
export const initialShatranj960State = {
    position: [createShatranj960Position()],
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
    whiteTime: 3600,
    blackTime: 3600,
    timerActive: false,
    boardSize: 8,
};
export const piecesArrayPromotion = [
    'horse',
    'bishop',
    'rook',
    'ferz',
    'elephant',
    'firzan',
    'wazir',
    'man',
    'tank',
    'camel',
    'zebra',
    'lion',
    'rhino',
    'wildebeest',
    'giraffe',
    'rukh',
    'archbishop',
    'marshal',
    'amazon',
    'long-range elephant',
    'knight',
    'dinozavr',
    'checker',
];
export const PIECE_VALUES = {
    pawn: 100, soldier: 100, firzan: 200, elephant: 210, horse: 300,
    bishop: 350, rook: 500, chariot: 500, sailboat: 500, ferz: 900, imperator: 20000, king: 20000,
    tank: 220, camel: 250, zebra: 150, amazon: 1200, dinozavr: 2200,
    lion: 310, giraffe: 190, rukh: 1050, wazir: 220, man: 310,
    knight: 700, checkers: 50, elephant_long_range: 600, rhino: 700,
    wildebeest: 550, marshal: 850, archbishop: 600,
};