import actionTypes from "../actionTypes";

export const makeNewMove = ({ newPosition }) => {
    return {
        type: actionTypes.NEW_MOVE,
        payload: { newPosition }
    };
};

export const generateValidMoves = ({ validMoves }) => {
    return {
        type: actionTypes.GENERATE_VALID_MOVES,
        payload: { validMoves }
    };
};