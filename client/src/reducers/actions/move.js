import actionTypes from "../actionTypes";

export const makeNewMove = ({ newPosition, newMove, castleDirection, gameStatus = 'ongoing', captured, lastMove, isRemote = false, keepTurn = false }) => {
    return {
        type: actionTypes.NEW_MOVE,
        payload: { newPosition, newMove, castleDirection, gameStatus, captured, lastMove, isRemote, keepTurn }
    };
};

export const generateValidMoves = ({ validMoves, selected }) => {
    return {
        type: actionTypes.GENERATE_VALID_MOVES,
        payload: { validMoves, selected }
    };
};