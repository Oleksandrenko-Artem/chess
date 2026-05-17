import { status } from "../constants";
import { createSpecialPosition } from "../helpers";
import actionTypes from "./actionTypes";

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.NEW_MOVE:
        case actionTypes.PROMOTION_MOVE: {
            const isPromotion = action.type === actionTypes.PROMOTION_MOVE;
            let { playerTurn, position, movesList, castleDirection, status: gameStatus, captured, lastMove, timerActive } = state;
            playerTurn = playerTurn === 'white' ? 'black' : 'white';
            position = [
                ...position,
                action.payload.newPosition
            ];
            movesList = [
                ...movesList,
                action.payload.newMove
            ];
            if (action.payload.lastMove) {
                lastMove = action.payload.lastMove;
            }
            if (action.payload.castleDirection) {
                castleDirection = action.payload.castleDirection;
            }
            if (action.payload.captured) {
                captured = action.payload.captured;
            }
            gameStatus = action.payload.gameStatus || status.ongoing;
            return {
                ...state,
                playerTurn,
                position,
                movesList,
                status: gameStatus,
                validMoves: [],
                selected: null,
                promotionSquare: isPromotion ? null : state.promotionSquare,
                castleDirection,
                captured,
                lastMove,
                timerActive: gameStatus === status.ongoing ? true : false,
            };
        };
        case actionTypes.SET_PLAYER_TURN: {
            return {
                ...state,
                playerTurn: action.payload
            };
        }
        case actionTypes.GENERATE_VALID_MOVES: {
            return {
                ...state,
                validMoves: action.payload.validMoves,
                selected: action.payload.selected || null,
            };
        };
        case actionTypes.CLEAR_VALID_MOVES: {
            return {
                ...state,
                validMoves: [],
                selected: null,
            };
        };
        case actionTypes.PROMOTION_OPEN: {
            return {
                ...state,
                status: status.promotion,
                promotionSquare: { ...action.payload },
                selected: null,
            };
        };
        case actionTypes.PROMOTION_CLOSE: {
            return {
                ...state,
                status: status.ongoing,
                promotionSquare: null,
                selected: null,
            };
        };

        case actionTypes.SET_POSITION: {
            return {
                ...state,
                position: [
                    ...state.position.slice(0, -1),
                    action.payload.newPosition
                ]
            };
        };
        case actionTypes.SET_ORIENTATION:
            return {
                ...state,
                orientation: action.payload
            };
        case actionTypes.SET_STATUS:
            return {
                ...state,
                status: action.payload,
                timerActive: false,
            };
        case actionTypes.SET_BOARD_SIZE:
            return {
                ...state,
                boardSize: action.payload,
                position: [createSpecialPosition(action.payload)],
                validMoves: [],
                selected: null,
                promotionSquare: null,
                status: status.ongoing,
                playerTurn: 'white',
                movesList: [],
                castleDirection: {
                    white: 'both',
                    black: 'both',
                },
                captured: {
                    white: [],
                    black: [],
                },
            };
        case actionTypes.TOGGLE_ORIENTATION:
            return {
                ...state,
                orientation: state.orientation === 'white' ? 'black' : 'white'
            };
        case actionTypes.RESET_GAME: {
            return action.payload.initialState;
        };
        case actionTypes.START_TIMER: {
            return {
                ...state,
                timerActive: true,
            };
        };
        case actionTypes.STOP_TIMER: {
            return {
                ...state,
                timerActive: false,
            };
        };
        case actionTypes.UPDATE_TIME: {
            const { player, time } = action.payload;
            return {
                ...state,
                [player + 'Time']: time,
            };
        };
        case actionTypes.TIME_UP: {
            const winner = action.payload.player === 'white' ? 'black' : 'white';
            return {
                ...state,
                status: status[winner],
                timerActive: false,
            };
        };
        case actionTypes.SET_VS_BOT: {
            return {
                ...state,
                isVsBot: action.payload.isVsBot,
                botDifficulty: action.payload.botDifficulty || state.botDifficulty || 'easy',
            };
        };
        case actionTypes.SET_MULTIPLAYER: {
            return {
                ...state,
                isMultiplayer: action.payload.isMultiplayer,
                roomId: action.payload.roomId,
                whiteTime: action.payload.whiteTime ?? state.whiteTime,
                blackTime: action.payload.blackTime ?? state.blackTime,
            };
        };
        case actionTypes.SET_OPPONENT: {
            return {
                ...state,
                opponent: action.payload.opponent,
            };
        };
        case actionTypes.SET_ROOM_NAME:
            return {
                ...state,
                roomName: action.payload,
            };
        default:
            return state;
    };
};