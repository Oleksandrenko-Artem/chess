import { createOldPosition, createPosition } from "./helpers";

export const initialGameState = {
    position: [createPosition()],
    playerTurn: 'white',
    validMoves: [],
};
export const initialOldGameState = {
    position: [createOldPosition()],
    playerTurn: 'white',
    validMoves: [],
};