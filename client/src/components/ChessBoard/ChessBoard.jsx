import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppContext } from "../../contexts/Context";
import Pieces from "../Pieces/Pieces";
import Promotion from "../Promotion/Promotion";
import black_king from "../../assets/icons/black_king.png";
import white_king from "../../assets/icons/white_king.png";
import accountIcon from "../../assets/icons/account.png";
import computerIcon from "../../assets/icons/computer.png";
import styles from "./ChessBoard.module.scss";
import { useTranslation } from "react-i18next";

const ChessBoard = (props) => {
  const { status } = props;
  const { t } = useTranslation();
  const { appState } = useAppContext();
  const user = useSelector((state) => state.users.user);
  const boardSize = appState.boardSize;
  const [window, setWindow] = useState(false);

  const orientation = appState.orientation;
  useEffect(() => {
    if (status !== "Ongoing" && status !== "Promotion") {
      const timer = setTimeout(() => {
        setWindow(true);
      }, 3000);
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

  const userSide =
    typeof window !== "undefined"
      ? localStorage.getItem("chess_side") || orientation
      : orientation;

  let whitePlayer = appState.isMultiplayer
    ? {
        color: "White",
        name:
          userSide === "white"
            ? user?.name || "White player"
            : appState.opponent?.name || "White player",
        avatar:
          userSide === "white"
            ? user?.avatar || accountIcon
            : appState.opponent?.avatar || accountIcon,
      }
    : {
        color: "White",
        name:
          userSide === "white" && user
            ? user.name || "White player"
            : "White player",
        avatar:
          userSide === "white" && user
            ? user.avatar || accountIcon
            : accountIcon,
      };

  let blackPlayer = appState.isMultiplayer
    ? {
        color: "Black",
        name:
          userSide === "black"
            ? user?.name || "Black player"
            : appState.opponent?.name || "Black player",
        avatar:
          userSide === "black"
            ? user?.avatar || accountIcon
            : appState.opponent?.avatar || accountIcon,
      }
    : {
        color: "Black",
        name:
          userSide === "black" && user
            ? user.name || "Black player"
            : "Black player",
        avatar:
          userSide === "black" && user
            ? user.avatar || accountIcon
            : accountIcon,
      };

  const isVsBot = !!appState.isVsBot;
  const botSide = userSide === "white" ? "black" : "white";
  const botLevel = Number(localStorage.getItem("bot_level")) || 1;
  const botName = `Computer (lvl ${botLevel})`;

  if (isVsBot) {
    if (botSide === "white") {
      whitePlayer = {
        ...whitePlayer,
        name: botName,
        avatar: computerIcon,
      };
    } else {
      blackPlayer = {
        ...blackPlayer,
        name: botName,
        avatar: computerIcon,
      };
    }
  }

  let bottomPlayer = userSide === "white" ? whitePlayer : blackPlayer;
  let topPlayer = userSide === "white" ? blackPlayer : whitePlayer;

  const renderPlayerCard = (player) => (
    <div
      className={`${styles["player-card"]} ${
        player.color === "White"
          ? styles["white-player"]
          : styles["black-player"]
      }`}
    >
      <img
        className={styles["player-avatar"]}
        src={player.avatar}
        alt={`${player.color} player`}
      />
      <div className={styles["player-info"]}>
        <span className={styles["player-color"]}>{player.color}</span>
        <span className={styles["player-name"]}>{player.name}</span>
      </div>
    </div>
  );

  return (
    <article
      className={styles["wrapper"]}
      style={{
        "--board-size": boardSize,
      }}
    >
      <div className={styles["coordinates"]}>
        <div className={styles["players-container"]}>
          {renderPlayerCard(topPlayer)}
        </div>
        <div className={styles["chess-div"]}>
          <div className={styles["chess-board"]}>
            {localStorage.getItem("chess_variant") !== "special" &&
              status !== "Ongoing" &&
              status !== "Promotion" &&
              window && (
                <div className={styles["game-status-text"]}>
                  <h2>{gameStatusMessage()}</h2>
                  {status === "White wins" ? (
                    <img src={white_king} alt="white" />
                  ) : status === "Black wins" ? (
                    <img src={black_king} alt="black" />
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
        <div className={styles["players-container"]}>
          {renderPlayerCard(bottomPlayer)}
        </div>
      </div>
    </article>
  );
};

export default ChessBoard;
