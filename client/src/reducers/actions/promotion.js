import actionTypes from "../actionTypes"

export const openPromotion = ({ rank, file, targetRank, targetFile }) => {
    return {
        type: actionTypes.PROMOTION_OPEN,
        payload: { rank, file, targetRank, targetFile },
    }
};
export const closePromotion = () => {
    return {
        type: actionTypes.PROMOTION_CLOSE,
    }
};
export const promoteAndMove = ({ newPosition, newMove, castleDirection, gameStatus = 'ongoing' }) => {
    return {
        type: actionTypes.PROMOTION_MOVE,
        payload: { newPosition, newMove, castleDirection, gameStatus }
    }
};