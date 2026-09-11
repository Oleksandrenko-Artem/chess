import React from "react";
import { useAppContext } from "../../contexts/Context";
import styles from "./MovesList.module.scss";

const notationPieceImages = {
  K: "king",
  H: "horse",
  B: "bishop",
  R: "rook",
  F: "ferz",
  E: "elephant",
  C: "chariot",
  S: "sailboat",
};

const renderMove = (move, isWhiteMove) => {
  const text = typeof move === "string" ? move : move.text;
  const pieceImage =
    typeof move === "string" ? notationPieceImages[text[0]] : move.piece;

  if (!pieceImage || !text) return text || move;

  return (
    <>
      <img
        className={styles["piece-icon"]}
        src={`/src/assets/icons/${isWhiteMove ? "white" : "black"}_${pieceImage}.png`}
        alt=""
        aria-hidden="true"
      />
      {typeof move === "string" ? text.slice(1) : text}
    </>
  );
};

const MovesList = () => {
  const {
    appState: { movesList },
  } = useAppContext();
  let moveCount = 0;
  let realIndex = 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles["moves-list"]}>
        {movesList.map((move, i) => {
          if (move === null) return null;

          const isWhiteMove = realIndex % 2 === 0;
          if (isWhiteMove) moveCount++;
          realIndex++;

          return (
            <div key={i} data-number={isWhiteMove ? moveCount : undefined}>
              {renderMove(move, isWhiteMove)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovesList;
