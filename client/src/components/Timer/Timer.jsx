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
  const whiteTimeRef = useRef(appState.whiteTime);
  const blackTimeRef = useRef(appState.blackTime);
  const { t } = useTranslation();

  useEffect(() => {
    currentPlayerRef.current = appState.playerTurn;
  }, [appState.playerTurn]);

  useEffect(() => {
    whiteTimeRef.current = appState.whiteTime;
  }, [appState.whiteTime]);

  useEffect(() => {
    blackTimeRef.current = appState.blackTime;
  }, [appState.blackTime]);

  useEffect(() => {
    if (appState.timerActive && appState.status === "Ongoing") {
      intervalRef.current = setInterval(() => {
        const currentPlayer = currentPlayerRef.current;
        const currentTime =
          currentPlayer === "white"
            ? whiteTimeRef.current
            : blackTimeRef.current;
        const newTime = currentTime - 1;

        if (newTime < 0) {
          dispatch({
            type: actionTypes.TIME_UP,
            payload: { player: currentPlayer },
          });
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
      moveTimeoutRef.current = setTimeout(() => {
        const currentPlayer = currentPlayerRef.current;
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
