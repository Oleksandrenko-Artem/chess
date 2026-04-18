import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/Context";
import { initialChess960State, initialGameState, initialOldGameState, initialShatranj960State } from "../../constants";
import actionTypes from "../../reducers/actionTypes";
import black_king from "../../assets/icons/black_king.png";
import white_king from "../../assets/icons/white_king.png";
import styles from "./GameInfoPanel.module.scss";
import arbiter from "../../arbiter/arbiter";
import Timer from "../Timer/Timer";

const GameInfoPanel = (props) => {
  const { status, turn, start, setStart } = props;
  const { dispatch, appState, socket } = useAppContext();
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(null);
  const onClickWhite = () => {
    localStorage.setItem("chess_side", "white");
    dispatch({ type: actionTypes.SET_ORIENTATION, payload: "white" });
  };
  const onClickBlack = () => {
    localStorage.setItem("chess_side", "black");
    dispatch({ type: actionTypes.SET_ORIENTATION, payload: "black" });
  };
  const onClickStart = () => {
    localStorage.setItem("chess_mode", "game");
    setStart(true);
    dispatch({ type: actionTypes.START_TIMER });
  };
  const onClickExit = () => {
    if (appState?.isMultiplayer && socket && appState?.roomId) {
      dispatch({
        type: actionTypes.SET_MULTIPLAYER,
        payload: { isMultiplayer: false, roomId: null },
      });
      localStorage.removeItem("roomId");
    }
    localStorage.setItem("chess_mode", "game");
    setStart(false);
    if (window.localStorage.getItem("chess_variant") === "multiplayer") {
      window.localStorage.setItem("chess_variant", "multiplayer");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: { initialState: initialGameState },
      });
    }
  }
  const onClickStartNew = () => {
    if (appState?.isMultiplayer && socket && appState?.roomId) {
      dispatch({
        type: actionTypes.SET_MULTIPLAYER,
        payload: { isMultiplayer: false, roomId: null },
      });
      socket.emit("leaveGame", { roomId: appState.roomId });
      localStorage.removeItem("roomId");
    }

    localStorage.setItem("chess_mode", "game");
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
    if (window.localStorage.getItem("chess_variant") === "chess960") {
      window.localStorage.setItem("chess_variant", "chess960");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: { initialState: initialChess960State },
      });
    }
    if (window.localStorage.getItem("chess_variant") === "shatranj960") {
      window.localStorage.setItem("chess_variant", "shatranj960");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: { initialState: initialShatranj960State },
      });
    }
    if (window.localStorage.getItem("chess_variant") === "multiplayer") {
      window.localStorage.setItem("chess_variant", "multiplayer");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: { initialState: initialGameState },
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
      localStorage.getItem("chess_variant") === "shatranj" || localStorage.getItem("chess_variant") === "shatranj960"
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
  return (
    <div className={styles.wrapper}>
      {!start && localStorage.getItem("chess_variant") !== "multiplayer" && (
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
        status !== status?.ongoing &&
        start && (
          <div className={styles["game-status"]}>
            <div className={styles["game-message"]}>
              <div className={styles["game-message-text"]}>
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
              </div>
              <Timer />
              <div className={styles["buttons-div"]}>
                <button onClick={handleToggle}>
                  {t("custom_panel.rotate_board")}
                </button>
                {status === "Ongoing" ||
                (localStorage.getItem("chess_variant") !== "multiplayer" &&
                  status !== "Ongoing") ? (
                  <button onClick={onClickStartNew}>
                    {t("game_info_panel.start_again")}
                  </button>
                ) : null}
                {localStorage.getItem("chess_variant") === "multiplayer" &&
                  status !== "Ongoing" && (
                    <button onClick={onClickExit}>Выйти</button>
                  )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default GameInfoPanel;
