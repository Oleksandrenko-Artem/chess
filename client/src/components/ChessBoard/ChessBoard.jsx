import React from "react";
import { useAppContext } from "../../contexts/Context";
import Pieces from "../Pieces/Pieces";
import Promotion from "../Promotion/Promotion";
import styles from "./ChessBoard.module.scss";

const ChessBoard = () => {
  const { appState } = useAppContext();
  const boardSize = appState.boardSize;

  const orientation = appState.orientation;
  return (
    <article
      className={styles["wrapper"]}
      style={{
        "--board-size": boardSize,
      }}
    >
      <div className={styles["coordinates"]}>
        <div className={styles["chess-div"]}>
          <div className={styles["chess-board"]}>
            <Pieces flipped={orientation === "black"} />
          </div>
        </div>
        <div className={styles["promotion-div"]}>
          <Promotion />
        </div>
      </div>
    </article>
  );
};

export default ChessBoard;
