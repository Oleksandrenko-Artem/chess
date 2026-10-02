import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createFourPlayerPosition,
  FOUR_PLAYER_BOARD_SIZE,
  FOUR_PLAYER_COLORS,
  FOUR_PLAYER_NATIVE_PIECES,
  getFourPlayerDisplaySquare,
  getFourPlayerGameStatus,
  getFourPlayerPawnDoubleMove,
  isFourPlayerPromotionSquare,
  getFourPlayerRealSquare,
  hasFourPlayerNativeIcon,
  isPawnCaptureSquare,
  getNextFourPlayerTurn,
  migrateFourPlayerState,
} from "./fourPlayer.js";

describe("four-player chess setup", () => {
  it("puts each player's home edge at the bottom and reverses board coordinates", () => {
    const homeSquares = {
      yellow: [13, 6],
      blue: [6, 13],
      green: [0, 7],
      red: [7, 0],
    };

    for (const [color, [rank, file]] of Object.entries(homeSquares)) {
      const [displayRank, displayFile] = getFourPlayerDisplaySquare(
        rank,
        file,
        color,
      );
      assert.equal(displayRank, FOUR_PLAYER_BOARD_SIZE - 1);
      assert.deepEqual(
        getFourPlayerRealSquare(displayRank, displayFile, color),
        [rank, file],
      );
    }
  });

  it("creates a 14 by 14 cross with four kings and 32 pawns", () => {
    const position = createFourPlayerPosition();
    const pieces = position.flat();

    assert.equal(position.length, FOUR_PLAYER_BOARD_SIZE);
    assert.ok(position.every((rank) => rank.length === FOUR_PLAYER_BOARD_SIZE));
    assert.equal(pieces.filter((piece) => piece.endsWith("_king")).length, 4);
    assert.equal(pieces.filter((piece) => piece.endsWith("_pawn")).length, 32);
    for (const color of FOUR_PLAYER_COLORS) {
      assert.ok(pieces.includes(`${color}_king`));
      for (const type of FOUR_PLAYER_NATIVE_PIECES) {
        assert.equal(hasFourPlayerNativeIcon(`${color}_${type}`), true);
      }
    }
    assert.equal(position[0][0], "brick");
    assert.equal(position[6][6], "");
  });

  it("allows each pawn one clear two-square move from its home edge", () => {
    const position = createFourPlayerPosition();
    const starts = [
      ["yellow", 12, 3, [10, 3]],
      ["blue", 3, 12, [3, 10]],
      ["green", 1, 10, [3, 10]],
      ["red", 10, 1, [10, 3]],
    ];

    for (const [color, rank, file, target] of starts) {
      assert.deepEqual(
        getFourPlayerPawnDoubleMove(position, color, rank, file),
        target,
      );
      assert.equal(
        getFourPlayerPawnDoubleMove(position, color, target[0], target[1]),
        null,
      );
    }

    const blockedPosition = createFourPlayerPosition();
    blockedPosition[11][3] = "yellow_rook";
    assert.equal(
      getFourPlayerPawnDoubleMove(blockedPosition, "yellow", 12, 3),
      null,
    );
  });

  it("promotes each side on its central file or rank", () => {
    assert.equal(isFourPlayerPromotionSquare("yellow", 6, 4), true);
    assert.equal(isFourPlayerPromotionSquare("green", 7, 4), true);
    assert.equal(isFourPlayerPromotionSquare("blue", 4, 6), true);
    assert.equal(isFourPlayerPromotionSquare("red", 4, 7), true);
    assert.equal(isFourPlayerPromotionSquare("yellow", 5, 4), false);
    assert.equal(isFourPlayerPromotionSquare("red", 4, 6), false);
  });

  it("cycles clockwise and skips eliminated players", () => {
    const position = createFourPlayerPosition();
    position[0][6] = "";

    assert.deepEqual(FOUR_PLAYER_COLORS, ["yellow", "blue", "green", "red"]);
    assert.equal(getNextFourPlayerTurn(position, "yellow"), "blue");
    assert.equal(getNextFourPlayerTurn(position, "blue"), "red");
  });

  it("ends when only one king remains", () => {
    const position = createFourPlayerPosition();
    for (const color of FOUR_PLAYER_COLORS.slice(1)) {
      const kingIndex = position.flat().indexOf(`${color}_king`);
      position[Math.floor(kingIndex / FOUR_PLAYER_BOARD_SIZE)][
        kingIndex % FOUR_PLAYER_BOARD_SIZE
      ] = "";
    }

    assert.equal(getFourPlayerGameStatus(position), "yellow wins");
  });

  it("keeps eliminated pieces on the board and skips their turn", () => {
    const position = createFourPlayerPosition();

    assert.ok(position.flat().some((piece) => piece.startsWith("blue_")));
    assert.equal(
      getNextFourPlayerTurn(position, "yellow", ["blue"]),
      "green",
    );
    assert.equal(getFourPlayerGameStatus(position, ["yellow"]), "Ongoing");
  });

  it("distinguishes horizontal pawn moves from captures", () => {
    assert.equal(isPawnCaptureSquare("red_pawn", 5, 3, 5, 4, "four_player"), false);
    assert.equal(isPawnCaptureSquare("red_pawn", 5, 3, 4, 4, "four_player"), true);
    assert.equal(isPawnCaptureSquare("blue_pawn", 5, 3, 5, 2, "four_player"), false);
    assert.equal(isPawnCaptureSquare("blue_pawn", 5, 3, 4, 2, "four_player"), true);
    assert.equal(isPawnCaptureSquare("yellow_pawn", 8, 3, 7, 3, "four_player"), false);
    assert.equal(isPawnCaptureSquare("green_pawn", 4, 3, 5, 4, "four_player"), true);
    assert.equal(isPawnCaptureSquare("white_pawn", 6, 3, 5, 3, "chess"), false);
    assert.equal(isPawnCaptureSquare("white_pawn", 6, 3, 5, 4, "chess"), true);
  });

  it("migrates saved white and black sides to yellow and green", () => {
    const state = migrateFourPlayerState({
      position: [[["white_king", "black_king"]]],
      playerTurn: "white",
      orientation: "black",
      castleDirection: { white: "none", blue: "none", black: "none", red: "none" },
      captured: { white: ["white_pawn"], blue: [], black: ["black_rook"], red: [] },
      whiteTime: 300,
      blackTime: 240,
      status: "White wins",
    });

    assert.deepEqual(state.position[0][0], ["yellow_king", "green_king"]);
    assert.equal(state.playerTurn, "yellow");
    assert.equal(state.orientation, "green");
    assert.equal(state.yellowTime, 300);
    assert.equal(state.greenTime, 240);
    assert.deepEqual(state.captured.yellow, ["yellow_pawn"]);
    assert.deepEqual(state.captured.green, ["green_rook"]);
    assert.equal(state.status, "Yellow wins");
  });
});