import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/Context";
import { status } from "../../constants";
import styles from "./Pieces.module.scss";
import arbiter from "../../arbiter/arbiter";
import { generateValidMoves } from "../../reducers/actions/move";

const MOVE_DELAY_MS = 260;

const Piece = ({ rank, file, piece, imageSrc }) => {
  const baseClass = piece !== "brick" ? styles.piece : styles["piece-any"];
  const pieceClass =
    piece && (piece.endsWith("pawn") || piece.endsWith("soldier"))
      ? styles["piece-pawn"]
      : piece && piece.endsWith("brick")
        ? styles["piece-brick"]
        : "";
  const { appState, dispatch } = useAppContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPiece, setShowPiece] = useState(true);
  const isMoveTarget =
    appState.lastMove &&
    appState.lastMove.toRank === rank &&
    appState.lastMove.toFile === file;
  const isMoveSource =
    appState.lastMove &&
    appState.lastMove.fromRank === rank &&
    appState.lastMove.fromFile === file;

  useEffect(() => {
    if (isMoveTarget) {
      setShowPiece(false);
      const timer = setTimeout(() => {
        setShowPiece(true);
      }, MOVE_DELAY_MS);
      return () => clearTimeout(timer);
    }
    if (isMoveSource) {
      setShowPiece(false);
      const timer = setTimeout(() => {
        setShowPiece(true);
      }, MOVE_DELAY_MS);
      return () => clearTimeout(timer);
    }

    setShowPiece(true);
  }, [isMoveTarget, isMoveSource, appState.lastMove]);

  if (!showPiece) {
    return null;
  }

  const classNames = [
    baseClass,
    pieceClass,
    isMoveTarget && showPiece ? styles["piece-move"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  const style = imageSrc ? { backgroundImage: `url(${imageSrc})` } : {};

  const { playerTurn, castleDirection, position } = appState;
  const currentPosition = position[position.length - 1];

  const prevBoard = position.length > 1 ? position[position.length - 2] : null;
  const onDragStart = (e) => {
    const userSide = localStorage.getItem("chess_side");
    const isHuman = appState.playerTurn === userSide;
    const mode = localStorage.getItem("chess_mode");
    const isEditorMode = mode === "editor";
    if (
      appState.status !== status.ongoing ||
      !isHuman ||
      isEditorMode ||
      piece === "brick"
    ) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      e.dataTransfer.setDragImage(img, 25, 25);
    };
    setTimeout(() => {
      e.target.classList.add(styles.dragging);
    }, 0);
    if (piece.startsWith(playerTurn)) {
      const validMoves = arbiter.getRegularMoves({
        position: currentPosition,
        prevPosition: prevBoard,
        castleDirection: castleDirection[playerTurn],
        piece,
        rank,
        file,
      });
      dispatch(
        generateValidMoves({
          validMoves,
          selected: { from: [rank, file], piece },
        }),
      );
    }
  };
  const onDragEnd = (e) => e.target.classList.remove(styles.dragging);
  const onClick = (e) => {
    const userSide = localStorage.getItem("chess_side");
    const isHuman = appState.playerTurn === userSide;

    if (appState.status !== status.ongoing || !isHuman || piece === "brick")
      return;

    if (piece.startsWith(playerTurn)) {
      const validMoves = arbiter.getRegularMoves({
        position: currentPosition,
        prevPosition: prevBoard,
        castleDirection: castleDirection[playerTurn],
        piece,
        rank,
        file,
      });

      dispatch(
        generateValidMoves({
          validMoves,
          selected: { from: [rank, file], piece },
        }),
      );
    }
  };
  return (
    <div
      className={classNames}
      style={style}
      draggable={piece !== "brick"}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    ></div>
  );
};

export default Piece;
