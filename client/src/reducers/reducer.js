import { status } from "../constants";
import actionTypes from "./actionTypes";

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.NEW_MOVE: {
            let { playerTurn, position, movesList, castleDirection, status: gameStatus, captured } = state;
            playerTurn = playerTurn === 'white' ? 'black' : 'white';
            position = [
                ...position,
                action.payload.newPosition
            ];
            movesList = [
                ...movesList,
                action.payload.newMove
            ];
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
                castleDirection,
                status: gameStatus,
                captured
            };
        };
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
        case actionTypes.PROMOTION_MOVE: {
            let { playerTurn, position, movesList, castleDirection, status: gameStatus, captured } = state;
            playerTurn = playerTurn === 'white' ? 'black' : 'white';
            position = [
                ...position,
                action.payload.newPosition
            ];
            movesList = [
                ...movesList,
                action.payload.newMove
            ];
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
                promotionSquare: null,
                castleDirection,
                captured
            };
        }
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
        case actionTypes.TOGGLE_ORIENTATION:
            return {
                ...state,
                orientation: state.orientation === 'white' ? 'black' : 'white'
            };
        case actionTypes.RESET_GAME: {
            return action.payload.initialState;
        };
        default:
            return state;
    };
};