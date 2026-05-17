import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/Context";
import {
  BOARD_STYLES,
  initialChess960State,
  initialGameState,
  initialOldGameState,
  initialShatranj960State,
  status as statusMap,
} from "../../constants";
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
  const [boardStyle, setBoardStyle] = useState(
    localStorage.getItem("boardStyle") || "standart",
  );
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
      if (socket && appState?.roomId) {
        socket.emit("leaveGame", {
          roomId: appState.roomId,
        });
      }
      dispatch({
        type: actionTypes.SET_MULTIPLAYER,
        payload: { isMultiplayer: false, roomId: null, whiteTime: null, blackTime: null },
      });
      localStorage.removeItem("roomId");
    }
    localStorage.setItem("chess_mode", "multiplayer");
    setStart(false);
    if (
      appState?.isMultiplayer ||
      window.localStorage.getItem("chess_mode") === "multiplayer"
    ) {
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: { initialState: initialGameState },
      });
    }
  };
  const onClickStartNew = () => {
    if (appState?.isMultiplayer && socket && appState?.roomId) {
      dispatch({
        type: actionTypes.SET_MULTIPLAYER,
        payload: { isMultiplayer: false, roomId: null, whiteTime: null, blackTime: null },
      });
      socket.emit("leaveGame", { roomId: appState.roomId });
      localStorage.removeItem("roomId");
    }

    localStorage.setItem("chess_mode", "game");
    setStart(false);
    setSelectedColor(null);
    if (window.localStorage.getItem("chess_variant") === "chess") {
      window.localStorage.setItem("chess_variant", "chess");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: {
          initialState: {
            ...initialGameState,
            isVsBot: appState.isVsBot,
            opponent: appState.opponent,
          },
        },
      });
    }
    if (window.localStorage.getItem("chess_variant") === "shatranj") {
      window.localStorage.setItem("chess_variant", "shatranj");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: {
          initialState: {
            ...initialOldGameState,
            isVsBot: appState.isVsBot,
            opponent: appState.opponent,
          },
        },
      });
    }
    if (window.localStorage.getItem("chess_variant") === "chess960") {
      window.localStorage.setItem("chess_variant", "chess960");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: {
          initialState: {
            ...initialChess960State,
            isVsBot: appState.isVsBot,
            opponent: appState.opponent,
          },
        },
      });
    }
    if (window.localStorage.getItem("chess_variant") === "shatranj960") {
      window.localStorage.setItem("chess_variant", "shatranj960");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: {
          initialState: {
            ...initialShatranj960State,
            isVsBot: appState.isVsBot,
          },
        },
      });
    }
    if (
      appState?.isMultiplayer ||
      window.localStorage.getItem("chess_mode") === "multiplayer"
    ) {
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: {
          initialState: {
            ...initialGameState,
            isVsBot: appState.isVsBot,
            opponent: appState.opponent,
          },
        },
      });
    }
  };
  const handleToggle = () => {
    dispatch({ type: actionTypes.TOGGLE_ORIENTATION });
  };
  const gameStatusMessage = () => {
    if (status === statusMap.white) {
      return t("game_info_panel.white_wins");
    }
    if (status === statusMap.black) {
      return t("game_info_panel.black_wins");
    }
    if (status === statusMap.draw) {
      return t("game_info_panel.draw");
    }
    if (status !== statusMap.ongoing && status !== statusMap.promotion) {
      return t("game_info_panel.game_over");
    }
    return `${t("game_info_panel.turn")} ${appState?.playerTurn === "white" ? t("captured_pieces.white") : t("captured_pieces.black")}`;
  };
  console.log(status)
  const handleBoardStyleChange = (event) => {
    const style = event.target.value;
    setBoardStyle(style);

    const selected = BOARD_STYLES[style];

    if (selected) {
      document.documentElement.style.setProperty(
        "--light-square-color",
        selected.light,
      );
      document.documentElement.style.setProperty(
        "--dark-square-color",
        selected.dark,
      );

      localStorage.setItem("boardStyle", style);
    }
  };
  return (
    <div className={styles.wrapper}>
      {!start &&
        !appState?.isMultiplayer &&
        window.localStorage.getItem("chess_mode") !== "multiplayer" && (
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
        start && (
          <div className={styles["game-status"]}>
            <div className={styles["game-message"]}>
              <div className={styles["game-message-text"]}>
                <h2>{gameStatusMessage()}</h2>
              </div>
              <Timer />
              <div className={styles["buttons-div"]}>
                <select value={boardStyle} onChange={handleBoardStyleChange}>
                  <option value="standart">{t("style_panel.standart")}</option>
                  <option value="classic">{t("style_panel.classic")}</option>
                  <option value="shatranj">{t("header.shatranj")}</option>
                  <option value="violet">{t("style_panel.violet")}</option>
                  <option value="blue">{t("style_panel.blue")}</option>
                  <option value="white">{t("style_panel.white")}</option>
                  <option value="green">{t("style_panel.green")}</option>
                  <option value="pale">{t("style_panel.pale")}</option>
                  <option value="yellow">{t("style_panel.yellow")}</option>
                  <option value="orange">{t("style_panel.orange")}</option>
                  <option value="red">{t("style_panel.red")}</option>
                  <option value="alexandrite">
                    {t("style_panel.alexandrite")}
                  </option>
                  <option value="onix">{t("style_panel.onix")}</option>
                </select>
                <button onClick={handleToggle}>
                  {t("custom_panel.rotate_board")}
                </button>
                {!appState?.isMultiplayer ? (
                  <button onClick={onClickStartNew}>
                    {t("game_info_panel.start_again")}
                  </button>
                ) : (
                  <button onClick={onClickExit}>
                    {t("game_info_panel.exit")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default GameInfoPanel;
