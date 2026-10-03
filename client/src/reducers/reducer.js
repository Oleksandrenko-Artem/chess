import arbiter from "../arbiter/arbiter";
import { FIFTY_MOVE_HALFMOVES, status } from "../constants";
import { createSpecialPosition } from "../helpers";
import { playMoveSound } from "../helpers/playMoveSound";
import actionTypes from "./actionTypes";
import {
    FOUR_PLAYER_COLORS,
    getFourPlayerGameStatus,
    getNextFourPlayerTurn,
} from "../helpers/fourPlayer";

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.NEW_MOVE:
        case actionTypes.PROMOTION_MOVE: {
            const isPromotion = action.type === actionTypes.PROMOTION_MOVE;
            let { playerTurn, position, movesList, castleDirection, status: gameStatus, captured, lastMove, timerActive, halfmoveClock = 0 } = state;
            const isFourPlayer = typeof localStorage !== 'undefined' && localStorage.getItem('chess_variant') === 'four_player';
            const previousPosition = position[position.length - 1];
            gameStatus = action.payload.gameStatus || status.ongoing;
            if (!action.payload.keepTurn) {
                playerTurn = action.payload.nextPlayer || (playerTurn === 'white' ? 'black' : 'white');
            }
            position = [
                ...position,
                action.payload.newPosition
            ];
            movesList = [
                ...movesList,
                action.payload.newMove
            ];
            const newCaptured = action.payload.captured || { white: [], black: [] };

            const oldCaptured = captured || {
                white: [],
                black: [],
            };

            const wasCapture = Object.keys(newCaptured).some(
                (color) => newCaptured[color].length > (oldCaptured[color]?.length || 0),
            );

            const movedPiece = action.payload.lastMove
                ? previousPosition?.[action.payload.lastMove.fromRank]?.[action.payload.lastMove.fromFile]
                : null;
            const isPawnMove = movedPiece?.endsWith('pawn') || movedPiece?.endsWith('soldier');
            const isCountableMove = Boolean(action.payload.lastMove);
            if (isCountableMove) {
                halfmoveClock = wasCapture || isPawnMove ? 0 : halfmoveClock + 1;
            }
            if (isCountableMove && gameStatus === status.ongoing && halfmoveClock >= FIFTY_MOVE_HALFMOVES) {
                gameStatus = status.draw;
            }

            const currentPosition = position[position.length - 1];

            const isCheck = isFourPlayer
                ? FOUR_PLAYER_COLORS.some((color) => {
                    const wasInCheck = arbiter.isKingInCheck({
                        position: previousPosition,
                        playerColor: color,
                        gameVariant: 'four_player',
                    });

                    const isNowInCheck = arbiter.isKingInCheck({
                        position: currentPosition,
                        playerColor: color,
                        gameVariant: 'four_player',
                    });

                    return !wasInCheck && isNowInCheck;
                })
                : arbiter.isKingInCheck({
                    position: currentPosition,
                    playerColor: playerTurn,
                    gameVariant: undefined,
                });


            if (action.payload.lastMove) {
                lastMove = action.payload.lastMove;
            }
            if (action.payload.castleDirection) {
                castleDirection = action.payload.castleDirection;
            }
            if (action.payload.captured) {
                captured = action.payload.captured;
            }
            playMoveSound({
                captured: wasCapture,
                isCheck: isCheck,
                gameStatus,
            });
            return {
                ...state,
                playerTurn,
                eliminatedColors: action.payload.eliminatedColors ?? state.eliminatedColors ?? [],
                position,
                movesList,
                status: gameStatus,
                validMoves: [],
                selected: null,
                promotionSquare: isPromotion ? null : state.promotionSquare,
                castleDirection,
                captured,
                halfmoveClock,
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
                halfmoveClock: 0,
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
            if (typeof localStorage !== 'undefined' && localStorage.getItem('chess_variant') === 'four_player') {
                const position = state.position[state.position.length - 1].map(row => [...row]);
                const loser = action.payload.player;
                if ((state.eliminatedColors || []).includes(loser)) return state;
                const eliminatedColors = [...(state.eliminatedColors || []), loser];
                const nextPlayer = state.playerTurn === loser
                    ? getNextFourPlayerTurn(position, loser, eliminatedColors)
                    : state.playerTurn;
                let gameStatus = getFourPlayerGameStatus(position, eliminatedColors);
                if (state.isVsBot && loser === localStorage.getItem('chess_side') && gameStatus === status.ongoing) {
                    gameStatus = `${nextPlayer} wins`;
                }
                return {
                    ...state,
                    position: [...state.position, position],
                    eliminatedColors,
                    playerTurn: nextPlayer,
                    status: gameStatus,
                    timerActive: gameStatus === status.ongoing,
                };
            }
            const winner =
                action.payload.player === 'white' ? 'black' : 'white';

            const newStatus = status[winner];

            playMoveSound({
                captured: null,
                gameStatus: newStatus,
            });

            return {
                ...state,
                status: newStatus,
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
        case actionTypes.UPDATE_OPPONENT_RATING:
            return {
                ...state,
                opponent: state.opponent
                    ? {
                        ...state.opponent,
                        rating: action.payload,
                    }
                    : null,
            };
        case actionTypes.SET_ROOM_PLAYERS:
            return {
                ...state,
                roomPlayers: action.payload,
            };
        default:
            return state;
    };
};