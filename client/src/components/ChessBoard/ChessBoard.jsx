import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/Context";
import Pieces from "../Pieces/Pieces";
import Promotion from "../Promotion/Promotion";
import black_king from "../../assets/icons/black_king.png";
import white_king from "../../assets/icons/white_king.png";
import styles from "./ChessBoard.module.scss";
import { useTranslation } from "react-i18next";

const ChessBoard = (props) => {
  const { status } = props;
  const { t } = useTranslation();
  const { appState } = useAppContext();
  const boardSize = appState.boardSize;
  const [window, setWindow] = useState(false);

  const orientation = appState.orientation;
  useEffect(() => {
    if (status !== "Ongoing") {
      const timer = setTimeout(() => {
        setWindow(true);
      }, 1000);
    } else {
      setWindow(false);
    }
  }, [status]);

  const onClickStartNew = () => {
    setWindow(false);
  };
  const gameStatusMessage = () => {
    if (status === "White wins") {
      return t("game_info_panel.white_wins");
    }
    if (status === "Black wins") {
      return t("game_info_panel.black_wins");
    }
    if (status === "Draw") {
      return t("game_info_panel.draw");
    }
    if (
      (status === "Draw" &&
        localStorage.getItem("chess_variant") === "shatranj") ||
      localStorage.getItem("chess_variant") === "shatranj960"
    ) {
      if (appState?.playerTurn === "white") {
        return t("game_info_panel.black_wins");
      } else {
        return t("game_info_panel.white_wins");
      }
    }
    if (
      status === "White wins" &&
      arbiter.isBareKing(appState.position, "black")
    ) {
      return t("game_info_panel.white_baring_king");
    }
    if (
      status === "Black wins" &&
      arbiter.isBareKing(appState.position, "white")
    ) {
      return t("game_info_panel.black_baring_king");
    }
  };
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
            {localStorage.getItem("chess_variant") !== "special" &&
              (status !== "Ongoing" && status !== "Promotion") &&
              window && (
                <div className={styles["game-status-text"]}>
                  <h2>{gameStatusMessage()}</h2>
                  {status === "White wins" ? (
                    <img src={white_king} alt="white" />
                  ) : status === "Black wins" ? (
                    <img src={black_king} alt="black" />
                  ) : null}
                  {localStorage.getItem("chess_variant") === "shatranj" &&
                  status === "Draw" &&
                  turn === "white" ? (
                    <img src={black_king} alt="white" />
                  ) : localStorage.getItem("chess_variant") === "shatranj" &&
                    status === "Draw" &&
                    turn === "black" ? (
                    <img src={white_king} alt="black" />
                  ) : null}
                  <button onClick={onClickStartNew}>
                    {t("game_info_panel.close")}
                  </button>
                </div>
              )}
            <Pieces flipped={orientation === "black"} />
          </div>
          <div className={styles["promotion-div"]}>
            <Promotion />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ChessBoard;
