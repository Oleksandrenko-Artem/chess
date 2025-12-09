import { createOldPosition, createPosition } from "./helpers";

export const initialGameState = {
    position: [createPosition()],
    playerTurn: 'white'
};
export const initialOldGameState = {
    position: [createOldPosition()],
    playerTurn: 'white'
};