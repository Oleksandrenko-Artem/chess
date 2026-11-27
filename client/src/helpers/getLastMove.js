const getPieceColor = (piece) => piece?.split("_")[0];
const getPieceType = (piece) => piece?.split("_").slice(1).join("_");

export const getLastMove = (previousPosition, nextPosition, playerColor) => {
  if (!previousPosition || !nextPosition) return null;

  const sources = [];
  const targets = [];

  for (let rank = 0; rank < previousPosition.length; rank += 1) {
    for (let file = 0; file < previousPosition[rank].length; file += 1) {
      const previousPiece = previousPosition[rank][file];
      const nextPiece = nextPosition[rank]?.[file];

      if (
        previousPiece &&
        previousPiece !== nextPiece &&
        (!playerColor || getPieceColor(previousPiece) === playerColor)
      ) {
        sources.push({
          fromRank: rank,
          fromFile: file,
          piece: previousPiece,
        });
      }

      if (
        nextPiece &&
        previousPiece !== nextPiece &&
        (!playerColor || getPieceColor(nextPiece) === playerColor)
      ) {
        targets.push({
          toRank: rank,
          toFile: file,
          piece: nextPiece,
        });
      }
    }
  }

  const kingSource = sources.find((source) =>
    getPieceType(source.piece).endsWith("king"),
  );
  const kingTarget = targets.find((target) =>
    getPieceType(target.piece).endsWith("king"),
  );
  if (kingSource && kingTarget) {
    return {
      fromRank: kingSource.fromRank,
      fromFile: kingSource.fromFile,
      toRank: kingTarget.toRank,
      toFile: kingTarget.toFile,
    };
  }

  const source = sources.find((candidate) =>
    targets.some(
      (target) =>
        getPieceType(candidate.piece) === getPieceType(target.piece),
    ),
  ) || sources[0];
  if (!source) return null;

  const target =
    targets.find(
      (candidate) =>
        getPieceType(candidate.piece) === getPieceType(source.piece),
    ) ||
    (getPieceType(source.piece).endsWith("pawn") ||
    getPieceType(source.piece).endsWith("soldier")
      ? targets[0]
      : null);

  if (!target) return null;

  return {
    fromRank: source.fromRank,
    fromFile: source.fromFile,
    toRank: target.toRank,
    toFile: target.toFile,
  };
};
