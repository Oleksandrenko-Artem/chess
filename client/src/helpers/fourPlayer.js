export const FOUR_PLAYER_COLORS = ["yellow", "blue", "green", "red"];
export const FOUR_PLAYER_BOARD_SIZE = 14;

export const getFourPlayerDisplaySquare = (
  rank,
  file,
  orientation,
  size = FOUR_PLAYER_BOARD_SIZE,
) => {
  if (orientation === "blue") return [file, size - 1 - rank];
  if (orientation === "green") return [size - 1 - rank, size - 1 - file];
  if (orientation === "red") return [size - 1 - file, rank];
  return [rank, file];
};

export const getFourPlayerRealSquare = (
  displayRank,
  displayFile,
  orientation,
  size = FOUR_PLAYER_BOARD_SIZE,
) => {
  if (orientation === "blue") return [size - 1 - displayFile, displayRank];
  if (orientation === "green") {
    return [size - 1 - displayRank, size - 1 - displayFile];
  }
  if (orientation === "red") return [displayFile, size - 1 - displayRank];
  return [displayRank, displayFile];
};

export const getFourPlayerPawnDoubleMove = (position, color, rank, file) => {
  const size = position.length;
  const directions = {
    yellow: [-1, 0],
    blue: [0, -1],
    green: [1, 0],
    red: [0, 1],
  };
  const direction = directions[color];
  if (!direction) return null;

  const isStartSquare =
    (color === "yellow" && rank === size - 2) ||
    (color === "blue" && file === size - 2) ||
    (color === "green" && rank === 1) ||
    (color === "red" && file === 1);
  if (!isStartSquare) return null;

  const [rankStep, fileStep] = direction;
  const middleRank = rank + rankStep;
  const middleFile = file + fileStep;
  const targetRank = rank + 2 * rankStep;
  const targetFile = file + 2 * fileStep;
  if (
    position[middleRank]?.[middleFile] !== "" ||
    position[targetRank]?.[targetFile] !== ""
  ) {
    return null;
  }

  return [targetRank, targetFile];
};

export const isFourPlayerPromotionSquare = (
  color,
  targetRank,
  targetFile,
  size = FOUR_PLAYER_BOARD_SIZE,
) => {
  const lowerCenter = Math.floor(size / 2) - 1;
  const upperCenter = Math.floor(size / 2);
  if (color === "yellow") return targetRank === lowerCenter;
  if (color === "green") return targetRank === upperCenter;
  if (color === "blue") return targetFile === lowerCenter;
  if (color === "red") return targetFile === upperCenter;
  return false;
};

export const FOUR_PLAYER_NATIVE_PIECES = [
  "pawn",
  "rook",
  "horse",
  "bishop",
  "ferz",
  "king",
];

export const normalizeFourPlayerPiece = (piece) =>
  piece.replace(/^white_/, "yellow_").replace(/^black_/, "green_");

export const hasFourPlayerNativeIcon = (piece) => {
  const [color, type] = piece.split("_");
  return FOUR_PLAYER_COLORS.includes(color) && FOUR_PLAYER_NATIVE_PIECES.includes(type);
};

const BACK_RANK = [
  "rook",
  "horse",
  "bishop",
  "ferz",
  "king",
  "bishop",
  "horse",
  "rook",
];

export const createFourPlayerPosition = () => {
  const position = Array.from({ length: FOUR_PLAYER_BOARD_SIZE }, (_, rank) =>
    Array.from({ length: FOUR_PLAYER_BOARD_SIZE }, (_, file) =>
      (rank < 3 || rank > 10) && (file < 3 || file > 10) ? "brick" : "",
    ),
  );

  const placeSide = (color, squares, pawnSquares) => {
    squares.forEach(([rank, file], index) => {
      position[rank][file] = `${color}_${BACK_RANK[index]}`;
    });
    pawnSquares.forEach(([rank, file]) => {
      position[rank][file] = `${color}_pawn`;
    });
  };

  placeSide(
    "yellow",
    Array.from({ length: 8 }, (_, index) => [13, index + 3]),
    Array.from({ length: 8 }, (_, index) => [12, index + 3]),
  );
  placeSide(
    "blue",
    Array.from({ length: 8 }, (_, index) => [index + 3, 13]),
    Array.from({ length: 8 }, (_, index) => [index + 3, 12]),
  );
  placeSide(
    "green",
    Array.from({ length: 8 }, (_, index) => [0, 10 - index]),
    Array.from({ length: 8 }, (_, index) => [1, 10 - index]),
  );
  placeSide(
    "red",
    Array.from({ length: 8 }, (_, index) => [10 - index, 0]),
    Array.from({ length: 8 }, (_, index) => [10 - index, 1]),
  );

  return position;
};

export const hasFourPlayerKing = (position, color) =>
  position.some((rank) => rank.some((piece) => piece === `${color}_king`));

export const getNextFourPlayerTurn = (
  position,
  currentColor,
  eliminatedColors = [],
) => {
  const currentIndex = FOUR_PLAYER_COLORS.indexOf(currentColor);
  for (let offset = 1; offset <= FOUR_PLAYER_COLORS.length; offset += 1) {
    const color =
      FOUR_PLAYER_COLORS[(currentIndex + offset) % FOUR_PLAYER_COLORS.length];
    if (!eliminatedColors.includes(color) && hasFourPlayerKing(position, color)) {
      return color;
    }
  }
  return currentColor;
};

export const getFourPlayerGameStatus = (position, eliminatedColors = []) => {
  const remainingColors = FOUR_PLAYER_COLORS.filter((color) =>
    hasFourPlayerKing(position, color) && !eliminatedColors.includes(color),
  );
  return remainingColors.length === 1
    ? `${remainingColors[0]} wins`
    : "Ongoing";
};

export const normalizeFourPlayerColor = (color) =>
  color === "white" ? "yellow" : color === "black" ? "green" : color;

export const migrateFourPlayerState = (state) => {
  if (!state) return state;
  const { whiteTime, blackTime, ...stateWithoutLegacyTimes } = state;
  const renameKeyedColors = (value = {}) =>
    Object.fromEntries(
      Object.entries(value).map(([color, entries]) => [
        normalizeFourPlayerColor(color),
        entries,
      ]),
    );

  return {
    ...stateWithoutLegacyTimes,
    position: state.position?.map((position) =>
      position.map((rank) =>
        rank.map((piece) => normalizeFourPlayerPiece(piece)),
      ),
    ),
    playerTurn: normalizeFourPlayerColor(state.playerTurn),
    orientation: normalizeFourPlayerColor(state.orientation),
    castleDirection: renameKeyedColors(state.castleDirection),
    captured: Object.fromEntries(
      Object.entries(renameKeyedColors(state.captured)).map(([color, pieces]) => [
        color,
        pieces.map(normalizeFourPlayerPiece),
      ]),
    ),
    eliminatedColors: state.eliminatedColors || FOUR_PLAYER_COLORS.filter(
      (color) => !hasFourPlayerKing(state.position?.at(-1) || [], color),
    ),
    yellowTime: state.yellowTime ?? whiteTime,
    greenTime: state.greenTime ?? blackTime,
    roomPlayers: state.roomPlayers?.map((player) => ({
      ...player,
      side: normalizeFourPlayerColor(player.side),
    })),
    status: state.status
      ?.replace(/^White wins$/, "Yellow wins")
      .replace(/^Black wins$/, "Green wins"),
  };
};

export const isPawnCaptureSquare = (
  piece,
  fromRank,
  fromFile,
  targetRank,
  targetFile,
  gameVariant,
) => {
  if (!piece?.endsWith("pawn") && !piece?.endsWith("soldier")) return false;
  if (
    gameVariant === "four_player" &&
    (piece.startsWith("blue_") || piece.startsWith("red_"))
  ) {
    return fromRank !== targetRank;
  }
  return fromFile !== targetFile;
};