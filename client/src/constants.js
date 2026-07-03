import { createDinoPosition, createExtendedPosition, createFerzVsRukhPosition, createArenaPosition, createNewVariantPosition, createOldPosition, createOldVariantPosition, createPosition, createSpecialPosition, createWallsPosition, createGrandAceDrexPosition, createAmazonPosition, createGreatChessPosition, createGrandChessPosition, createChess960Position, createShatranj960Position } from "./helpers";

export const BOARD_STYLES = {
    standart: {
        light: "#F0D8B7",
        dark: "#7e5539",
    },
    classic: {
        light: "#FFFFFF",
        dark: "#000000",
    },
    shatranj: {
        light: "#ff5e00",
        dark: "#ff5e00",
    },
    violet: {
        light: "linear-gradient(160deg, #fa67ff 0%, #df00cc 25%, #800e8f 50%, #df00cc 75%, #fa67ff 100%)",
        dark: "linear-gradient(160deg, #1d001b 0%, #4b0e3c 25%, #97108c 50%, #4b0e3c 75%, #1d001b 100%)",
    },
    blue: {
        light: "linear-gradient(160deg, #7167ff 0%, #4234ff 25%, #0017c5 50%, #4234ff 75%, #7167ff 100%)",
        dark: "linear-gradient(160deg, #01001d 0%, #02007e 25%, #002c8b 50%, #02007e 75%, #01001d 100%)",
    },
    white: {
        light: "linear-gradient(160deg, #a2f9ff 0%, #51ceff 25%, #009ec5 50%, #51ceff 75%, #a2f9ff 100%)",
        dark: "linear-gradient(160deg, #00b5e2 0%, #005d9b 25%, #00415f 50%, #005d9b 75%, #00b5e2 100%)",
    },
    pale: {
        light: "linear-gradient(160deg, #fffc5f 0%, #ff6600 25%, #ddce00 50%, #ff6600 75%, #fffc5f 100%)",
        dark: "linear-gradient(160deg, #3d3c06 0%, #c0a610 25%, #944e0d 50%, #c0a610 75%, #3d3c06 100%)",
    },
    yellow: {
        light: "linear-gradient(160deg, #f0ec25 0%, #fffeba 25%, #ffee00 50%, #fffeba 75%, #f0ec25 100%)",
        dark: "linear-gradient(160deg, #a09e23 0%, #7f8d00 25%, #c5bf10 50%, #7f8d00 75%, #a09e23 100%)",
    },
    green: {
        light: "linear-gradient(160deg, #6cff5f 0%, #00ff0d 25%, #227700 50%, #00ff0d 75%, #6cff5f 100%)",
        dark: "linear-gradient(160deg, #002200 0%, #004400 25%, #128500 50%, #004400 75%, #002200 100%)",
    },
    orange: {
        light: "linear-gradient(160deg, #f07625 0%, #ffb056 25%, #ff7b00 50%, #ffb056 75%, #f07625 100%)",
        dark: "linear-gradient(160deg, #a05523 0%, #632700 25%, #c25e00 50%, #632700 75%, #a05523 100%)",
    },
    red: {
        light: "linear-gradient(160deg, #ff4646 0%, #ff1919 25%, #9b0000 50%, #ff1919 75%, #ff4646 100%)",
        dark: "linear-gradient(160deg, #b62525 0%, #6e0000 25%, #2c0000 50%, #6e0000 75%, #b62525 100%)",
    },
    alexandrite: {
        light: "linear-gradient(160deg, #19c203 0%, #59e459 25%, #a301a8 50%, #59e459 75%, #19c203 100%)",
        dark: "linear-gradient(160deg, #002200 0%, #005c00 25%, #260027 50%, #005c00 75%, #002200 100%)",
    },
    onix: {
        light: "linear-gradient(160deg, #b4b4b4 0%, #ffffff 25%, #8f8f8f 50%, #ffffff 75%, #b4b4b4 100%)",
        dark: "linear-gradient(160deg, #7a736f 0%, #414141 25%, #000000 50%, #414141 75%, #7a736f 100%)",
    }
};
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    isVsBot: false,
    botDifficulty: 'easy',
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
    'alibaba',
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
    'elephant_long_range',
    'knight',
    'dinozavr',
    'checker',
    'checker_long_range',
];
export const PIECE_VALUES = {
    pawn: 100, soldier: 80, firzan: 150, elephant: 160, horse: 300,
    bishop: 350, rook: 500, chariot: 500, sailboat: 500, ferz: 900, imperator: 20000, king: 20000,
    tank: 150, alibaba: 200, camel: 180, zebra: 150, amazon: 1300, dinozavr: 2200,
    lion: 310, giraffe: 550, rukh: 1000, wazir: 200, man: 300,
    knight: 800, checkers: 50, checker_long_range: 450, elephant_long_range: 600, rhino: 700,
    wildebeest: 550, marshal: 850, archbishop: 600,
};