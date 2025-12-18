import { status } from "../constants";
import actionTypes from "./actionTypes";

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.NEW_MOVE: {
            let { playerTurn, position, castleDirection } = state;
            playerTurn = playerTurn === 'white' ? 'black' : 'white';
            position = [
                ...position,
                action.payload.newPosition
            ];
            if (action.payload.castleDirection) {
                castleDirection = action.payload.castleDirection;
            }
            return {
                ...state,
                playerTurn,
                position,
                castleDirection
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
            let { playerTurn, position, castleDirection } = state;
            playerTurn = playerTurn === 'white' ? 'black' : 'white';
            position = [
                ...position,
                action.payload.newPosition
            ];
            if (action.payload.castleDirection) {
                castleDirection = action.payload.castleDirection;
            }
            return {
                ...state,
                playerTurn,
                position,
                status: 'Ongoing',
                validMoves: [],
                selected: null,
                promotionSquare: null,
                castleDirection
            };
        }
        case actionTypes.RESET_GAME: {
            return action.payload.initialState;
        };
        default:
            return state;
    };
};