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
        case actionTypes.RESET_GAME: {
            return action.payload.initialState;
        };
        default:
            return state;
    };
};