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

  const [arrows, setArrows] = useState([]);
  const [startSquare, setStartSquare] = useState(null);

  const [highlightedSquares, setHighlightedSquares] = useState([]);

  const arrowColor =
    user?.arrowColor || localStorage.getItem("arrowColor") || "#ffaa00";
  useEffect(() => {
    if (status !== "Ongoing" && status !== "Promotion") {
      const timer = setTimeout(() => {
        setWindow(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setWindow(false);
    }
  }, [status]);

  const getSquareFromCoords = (clientX, clientY, boardElement) => {
    const rect = boardElement.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let colIdx = Math.floor((x / rect.width) * boardSize);
    let rowIdx = Math.floor((y / rect.height) * boardSize);

    colIdx = Math.max(0, Math.min(boardSize - 1, colIdx));
    rowIdx = Math.max(0, Math.min(boardSize - 1, rowIdx));

    if (orientation === "black") {
      colIdx = boardSize - 1 - colIdx;
      rowIdx = boardSize - 1 - rowIdx;
    }

    return `${colIdx},${rowIdx}`;
  };

  const getSquareCenter = (square) => {
    if (!square) return { x: 0, y: 0 };

    let [colIdx, rowIdx] = square.split(",").map(Number);

    if (orientation === "black") {
      colIdx = boardSize - 1 - colIdx;
      rowIdx = boardSize - 1 - rowIdx;
    }

    const cellSize = 100 / boardSize;
    const x = colIdx * cellSize + cellSize / 2;
    const y = rowIdx * cellSize + cellSize / 2;

    return { x: `${x}%`, y: `${y}%` };
  };

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      e.preventDefault();
      const boardElement = e.currentTarget;
      const square = getSquareFromCoords(e.clientX, e.clientY, boardElement);
      setStartSquare(square);
    } else if (e.button === 0) {
      setArrows([]);
      setHighlightedSquares([]);
    }
  };

  const handleMouseUp = (e) => {
    if (e.button === 2 && startSquare) {
      e.preventDefault();
      const boardElement = e.currentTarget;
      const endSquare = getSquareFromCoords(e.clientX, e.clientY, boardElement);

      if (startSquare !== endSquare) {
        const newArrow = { start: startSquare, end: endSquare };
        setArrows((prev) => {
          const exists = prev.some(
            (a) => a.start === newArrow.start && a.end === newArrow.end,
          );
          if (exists)
            return prev.filter(
              (a) => !(a.start === newArrow.start && a.end === newArrow.end),
            );
          return [...prev, newArrow];
        });
      } else {
        setHighlightedSquares((prev) => {
          if (prev.includes(endSquare)) {
            return prev.filter((sq) => sq !== endSquare);
          }
          return [...prev, endSquare];
        });
      }
      setStartSquare(null);
    }
  };

  const onClickStartNew = () => {
    setWindow(false);
  };
  const gameStatusMessage = () => {
    if (status === "White wins") return t("game_info_panel.white_wins");
    if (status === "Black wins") return t("game_info_panel.black_wins");
    if (status === "Draw") return t("game_info_panel.draw");
    if (
      (status === "Draw" &&
        localStorage.getItem("chess_variant") === "shatranj") ||
      localStorage.getItem("chess_variant") === "shatranj960"
    ) {
      return appState?.playerTurn === "white"
        ? t("game_info_panel.black_wins")
        : t("game_info_panel.white_wins");
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
    if (botSide === "white")
      whitePlayer = { ...whitePlayer, name: botName, avatar: computerIcon };
    else blackPlayer = { ...blackPlayer, name: botName, avatar: computerIcon };
  }

  let bottomPlayer = userSide === "white" ? whitePlayer : blackPlayer;
  let topPlayer = userSide === "white" ? blackPlayer : whitePlayer;

  const renderPlayerCard = (player) => (
    <div
      className={`${styles["player-card"]} ${player.color === "White" ? styles["white-player"] : styles["black-player"]}`}
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
      style={{ "--board-size": boardSize }}
    >
      <div className={styles["coordinates"]}>
        <div className={styles["players-container"]}>
          {renderPlayerCard(topPlayer)}
        </div>
        <div className={styles["chess-div"]}>
          <div
            className={styles["board-wrapper"]}
            style={{ position: "relative", width: "100%", height: "100%" }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
          >
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
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="6"
                  markerHeight="4"
                  refX="3.5"
                  refY="2"
                  orient="auto"
                >
                  <polygon points="0 0, 6 2, 0 4" fill={arrowColor} />
                </marker>
              </defs>
              {highlightedSquares.map((square, index) => {
                const pt = getSquareCenter(square);
                const cellSize = 100 / boardSize;

                const x = parseFloat(pt.x) - cellSize / 2;
                const y = parseFloat(pt.y) - cellSize / 2;

                return (
                  <rect
                    key={`square-${index}`}
                    x={`${x}%`}
                    y={`${y}%`}
                    width={`${cellSize}%`}
                    height={`${cellSize}%`}
                    fill={user?.squareColor}
                    fillOpacity="0.5"
                  />
                );
              })}
              {arrows.map((arrow, index) => {
                const startPt = getSquareCenter(arrow.start);
                const endPt = getSquareCenter(arrow.end);
                return (
                  <line
                    key={index}
                    x1={startPt.x}
                    y1={startPt.y}
                    x2={endPt.x}
                    y2={endPt.y}
                    stroke={arrowColor}
                    strokeWidth="6"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </svg>
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
