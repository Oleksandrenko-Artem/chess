import actionTypes from "../actionTypes";

export const makeNewMove = ({ newPosition, castleDirection, gameStatus = 'ongoing' }) => {
    return {
        type: actionTypes.NEW_MOVE,
        payload: { newPosition, castleDirection, gameStatus }
    };
};

export const generateValidMoves = ({ validMoves, selected }) => {
    return {
        type: actionTypes.GENERATE_VALID_MOVES,
        payload: { validMoves, selected }
    };
};