import React, { useEffect, useRef } from "react";
import { useAppContext } from "../../contexts/Context";
import actionTypes from "../../reducers/actionTypes";
import styles from "./Timer.module.scss";
import { useTranslation } from "react-i18next";

const Timer = () => {
  const { appState, dispatch, socket } = useAppContext();
  const intervalRef = useRef(null);
  const moveTimeoutRef = useRef(null);
  const currentPlayerRef = useRef(appState.playerTurn);
  const timeRef = useRef({
    white: appState.whiteTime,
    black: appState.blackTime,
    yellow: appState.yellowTime,
    blue: appState.blueTime,
    green: appState.greenTime,
    red: appState.redTime,
  });
  const { t } = useTranslation();

  useEffect(() => {
    currentPlayerRef.current = appState.playerTurn;
  }, [appState.playerTurn]);

  useEffect(() => {
    timeRef.current = {
      white: appState.whiteTime,
      black: appState.blackTime,
      yellow: appState.yellowTime,
      blue: appState.blueTime,
      green: appState.greenTime,
      red: appState.redTime,
    };
  }, [
    appState.whiteTime,
    appState.blackTime,
    appState.yellowTime,
    appState.blueTime,
    appState.greenTime,
    appState.redTime,
  ]);

  useEffect(() => {
    if (appState.timerActive && appState.status === "Ongoing") {
      intervalRef.current = setInterval(() => {
        const currentPlayer = currentPlayerRef.current;
        const currentTime = timeRef.current[currentPlayer] ?? 0;
        const newTime = currentTime - 1;

        if (newTime < 0) {
          if (
            localStorage.getItem("chess_variant") === "four_player" &&
            appState.isMultiplayer
          ) {
            if (currentPlayer === localStorage.getItem("chess_side")) {
              socket.emit("playerTimedOut", {
                roomId: appState.roomId,
                loser: currentPlayer,
              });
            }
          } else {
            dispatch({
              type: actionTypes.TIME_UP,
              payload: { player: currentPlayer },
            });
          }
        } else {
          dispatch({
            type: actionTypes.UPDATE_TIME,
            payload: { player: currentPlayer, time: newTime },
          });
        }
      }, 1000);

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      if (localStorage.getItem("chess_variant") !== "four_player") {
        moveTimeoutRef.current = setTimeout(() => {
          const currentPlayer = currentPlayerRef.current;
          if (
            appState.isMultiplayer &&
            localStorage.getItem("chess_variant") === "four_player"
          ) {
            socket.emit("playerTimedOut", {
              roomId: appState.roomId,
              loser: currentPlayer,
            });
            return;
          }
          dispatch({
            type: actionTypes.TIME_UP,
            payload: { player: currentPlayer },
          });
          if (socket && appState?.isMultiplayer && appState?.roomId) {
            socket.emit("playerTimedOut", {
              roomId: appState.roomId,
              loser: currentPlayer,
            });
          }
        }, 300000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [
    appState.timerActive,
    appState.status,
    appState.playerTurn,
    appState.isMultiplayer,
    appState.roomId,
    dispatch,
    socket,
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (localStorage.getItem("chess_variant") === "four_player") {
    return (
      <div className={styles.timer}>
        {["yellow", "blue", "green", "red"].map((color) => (
          <div
            key={color}
            className={`${styles.time} ${appState.playerTurn === color ? styles.active : ""}`}
          >
            <div>{t(`captured_pieces.${color}`)}</div>
            <div>{formatTime(timeRef.current[color] ?? 0)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.timer}>
      <div
        className={`${styles.time} ${appState.playerTurn === "white" ? styles.active : ""}`}
      >
        <div>{t("captured_pieces.white")}: </div>
        <div>{formatTime(appState.whiteTime)}</div>
      </div>
      <div
        className={`${styles.time} ${appState.playerTurn === "black" ? styles.active : ""}`}
      >
        <div>{t("captured_pieces.black")}: </div>
        <div>{formatTime(appState.blackTime)}</div>
      </div>
    </div>
  );
};

export default Timer;
