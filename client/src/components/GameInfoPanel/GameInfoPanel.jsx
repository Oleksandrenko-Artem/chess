import React, { useState } from 'react';
import { useAppContext } from "../../contexts/Context";
import { initialGameState, initialOldGameState } from "../../constants";
import actionTypes from "../../reducers/actionTypes";
import black_king from "../../assets/icons/black_king.png";
import white_king from "../../assets/icons/white_king.png";
import styles from './GameInfoPanel.module.scss';

const GameInfoPanel = (props) => {
  const { status, turn, start, setStart, gameStatusMessage } = props;
  const { dispatch } = useAppContext();
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
    return (
      <div className={styles.wrapper}>
        {!start && (
          <div className={styles["start-panel"]}>
            <h1>Choose color</h1>
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
                Start
              </button>
            </div>
          </div>
        )}
        {window.localStorage.getItem("chess_variant") !== "special" &&
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
                {window.localStorage.getItem("chess_variant") === "shatranj" &&
                status === "Draw" &&
                turn === "white" ? (
                  <img src={black_king} alt="white" />
                ) : window.localStorage.getItem("chess_variant") ===
                    "shatranj" &&
                  status === "Draw" &&
                  turn === "black" ? (
                  <img src={white_king} alt="black" />
                ) : null}
                <button onClick={onClickStartNew}>Start again</button>
              </div>
            </div>
          )}
      </div>
    );
};

export default GameInfoPanel;