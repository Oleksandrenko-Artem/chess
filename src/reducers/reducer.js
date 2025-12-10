import actionTypes from "./actionTypes";

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.NEW_MOVE: {
            let { playerTurn, position } = state;
            playerTurn = playerTurn === 'white' ? 'black' : 'white';
            position = [
                ...position,
                action.payload.newPosition
            ];
            return {
                ...state,
                playerTurn,
                position
            };
        };
        case actionTypes.GENERATE_VALID_MOVES: {
            return {
                ...state,
                validMoves: action.payload.validMoves,
            };
        };
        case actionTypes.CLEAR_VALID_MOVES: {
            return {
                ...state,
                validMoves: [],
            };
        }
        case actionTypes.RESET_GAME: {
            return action.payload.initialState;
        };
        default:
            return state;
    };
};