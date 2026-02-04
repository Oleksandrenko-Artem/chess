import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/Context";
import { initialGameState, initialOldGameState } from "../../constants";
import actionTypes from "../../reducers/actionTypes";
import black_king from "../../assets/icons/black_king.png";
import white_king from "../../assets/icons/white_king.png";
import styles from './GameInfoPanel.module.scss';

const GameInfoPanel = (props) => {
  const { status, turn, start, setStart } = props;
  const { dispatch, appState } = useAppContext();
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(null);
    const onClickWhite = () => {
      dispatch({ type: actionTypes.SET_ORIENTATION, payload: "white" });
    };
    const onClickBlack = () => {
      dispatch({ type: actionTypes.SET_ORIENTATION, payload: "black" });
    };
  const onClickStart = () => {
      setStart(true);
    };
    const onClickStartNew = () => {
      setStart(false);
      if (window.localStorage.getItem("chess_variant") === "chess") {
        window.localStorage.setItem("chess_variant", "chess");
        dispatch({
          type: actionTypes.RESET_GAME,
          payload: { initialState: initialGameState },
        });
      }
      if (window.localStorage.getItem("chess_variant") === "shatranj") {
        window.localStorage.setItem("chess_variant", "shatranj");
        dispatch({
          type: actionTypes.RESET_GAME,
          payload: { initialState: initialOldGameState },
        });
      }
  };
  const handleToggle = () => {
    dispatch({ type: actionTypes.TOGGLE_ORIENTATION });
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
      status === "Draw" &&
      localStorage.getItem("chess_variant") === "shatranj"
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
    return `${t("game_info_panel.turn")} ${appState?.playerTurn === "white" ? t("captured_pieces.white") : t("captured_pieces.black")}`;
  };
  console.log(status)
    return (
      <div className={styles.wrapper}>
        {!start && (
          <div className={styles["start-panel"]}>
            <h1>{t("game_info_panel.choose_color")}</h1>
            <div className={styles["img-div"]}>
              <img
                src={black_king}
                alt="black"
                className={`${styles["img-style"]} ${selectedColor === "black" ? styles["active"] : ""}`}
                onClick={() => {
                  setSelectedColor("black");
                  onClickBlack();
                }}
              />
              <img
                src={white_king}
                alt="white"
                className={`${styles["img-style"]} ${selectedColor === "white" ? styles["active"] : ""}`}
                onClick={() => {
                  setSelectedColor("white");
                  onClickWhite();
                }}
              />
            </div>
            <div>
              <button onClick={onClickStart} disabled={!selectedColor}>
                {t("game_info_panel.start")}
              </button>
            </div>
          </div>
        )}
        {localStorage.getItem("chess_variant") !== "special" &&
          status !== status.ongoing &&
          start && (
            <div className={styles["game-status"]}>
              <div className={styles["game-message"]}>
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
                ) : localStorage.getItem("chess_variant") ===
                    "shatranj" &&
                  status === "Draw" &&
                  turn === "black" ? (
                  <img src={white_king} alt="black" />
              ) : null}
                <button onClick={handleToggle}>
                  {t("custom_panel.rotate_board")}
                </button>
                <button onClick={onClickStartNew}>
                  {t("game_info_panel.start_again")}
                </button>
              </div>
            </div>
          )}
      </div>
    );
};

export default GameInfoPanel;