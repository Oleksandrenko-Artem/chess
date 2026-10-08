import React, { useEffect, useCallback, useRef } from "react";
import { useAppContext } from "../../../contexts/Context";
import { copyPosition, getNewMoveNotation } from "../../../helpers";
import { promoteAndMove } from "../../../reducers/actions/promotion";
import { getPieceStyle } from "../../../helpers/getPieceImage";
import { useSelector } from "react-redux";
import arbiter from "../../../arbiter/arbiter";
import {
  FOUR_PLAYER_COLORS,
  getFourPlayerGameStatus,
  getNextFourPlayerTurn,
  hasFourPlayerKing,
} from "../../../helpers/fourPlayer";
import styles from "../../Pieces/Pieces.module.scss";

const PromotionBox = ({ onClosePromotion }) => {
  const user = useSelector((state) => state.users.user);
  const options =
    localStorage.getItem("chess_variant") === "special"
      ? JSON.parse(localStorage.getItem("promotion_options")) || [
          "ferz",
          "rook",
          "bishop",
          "horse",
        ]
      : localStorage.getItem("chess_variant") === "new_chess" ||
          localStorage.getItem("chess_variant") === "new_chess960"
        ? ["duke", "prince"]
        : ["ferz", "rook", "bishop", "horse"];
  const { appState, dispatch, socket } = useAppContext();
  const { promotionSquare } = appState;
  const variant =
    typeof window !== "undefined"
      ? window.localStorage.getItem("chess_variant")
      : "chess";
  const isFourPlayer = variant === "four_player";
  const promotionPosition = appState.position[appState.position.length - 1];
  const color = promotionSquare
    ? promotionPosition[promotionSquare.rank]?.[promotionSquare.file]?.split(
        "_",
      )[0]
    : "white";
  const replaceSetting =
    typeof window !== "undefined"
      ? localStorage.getItem("replaceRook")
      : typeof window !== "undefined"
        ? localStorage.getItem("replaceHorse")
        : null;
  const processedPromotionRef = useRef(null);
  const handlePromotion = useCallback(
    (pieceName) => {
      if (!promotionSquare) return;
      const currentPosition = appState.position[appState.position.length - 1];
      const newPosition = copyPosition(currentPosition);
      const newCaptured = JSON.parse(
        JSON.stringify(
          appState.captured || { yellow: [], blue: [], green: [], red: [] },
        ),
      );
      let eliminatedColors = appState.eliminatedColors || [];
      const capturedPiece =
        currentPosition[promotionSquare.targetRank]?.[
          promotionSquare.targetFile
        ];
      if (capturedPiece) {
        const capturedColor = capturedPiece.split("_")[0];
        newCaptured[capturedColor] ||= [];
        newCaptured[capturedColor].push(capturedPiece);
        if (
          isFourPlayer &&
          capturedPiece.endsWith("_king") &&
          !eliminatedColors.includes(capturedColor)
        ) {
          eliminatedColors = [...eliminatedColors, capturedColor];
        }
      }
      newPosition[promotionSquare.rank][promotionSquare.file] = "";
      let finalPieceName = pieceName;
      if (pieceName === "rook") {
        try {
          const rep =
            typeof window !== "undefined"
              ? localStorage.getItem("replaceRook")
              : null;
          if (rep === "sailboat") finalPieceName = "sailboat";
          else if (rep === "chariot") finalPieceName = "chariot";
        } catch (e) {}
      }
      newPosition[promotionSquare.targetRank][promotionSquare.targetFile] =
        `${color}_${finalPieceName}`;
      const newCastleDirection = { ...appState.castleDirection };
      const piece =
        currentPosition[promotionSquare.rank]?.[promotionSquare.file];
      if (!isFourPlayer && piece?.endsWith("rook")) {
        const playerColor = piece.startsWith("white") ? "white" : "black";
        const currentDir = newCastleDirection[playerColor];
        if (promotionSquare.targetFile === 0) {
          newCastleDirection[playerColor] =
            currentDir === "both" ? "right" : "none";
        } else if (promotionSquare.targetFile === 7) {
          newCastleDirection[playerColor] =
            currentDir === "both" ? "left" : "none";
        }
      }
      let wasCheckmate = false;
      if (isFourPlayer) {
        FOUR_PLAYER_COLORS.forEach((playerColor) => {
          if (
            eliminatedColors.includes(playerColor) ||
            !hasFourPlayerKing(newPosition, playerColor)
          )
            return;
          const isInCheck = arbiter.isKingInCheck({
            position: newPosition,
            playerColor,
            gameVariant: "four_player",
          });
          const legalMoves = arbiter.getBoardValidMoves({
            position: newPosition,
            playerColor,
            prevPosition: currentPosition,
            castleDirection: newCastleDirection,
            gameVariant: "four_player",
          });
          if (legalMoves.length === 0) {
            wasCheckmate ||= isInCheck;
            eliminatedColors = [...eliminatedColors, playerColor];
          }
        });
      }
      const nextPlayer = isFourPlayer
        ? getNextFourPlayerTurn(
            newPosition,
            appState.playerTurn,
            eliminatedColors,
          )
        : appState.playerTurn === "white"
          ? "black"
          : "white";
      let gameStatus = isFourPlayer
        ? getFourPlayerGameStatus(newPosition, eliminatedColors)
        : arbiter.getGameStatus({
            position: newPosition,
            playerColor: nextPlayer,
            castleDirection: newCastleDirection,
          });
      if (
        isFourPlayer &&
        appState.isVsBot &&
        eliminatedColors.includes(localStorage.getItem("chess_side")) &&
        gameStatus === "Ongoing"
      ) {
        gameStatus = `${nextPlayer} wins`;
      }
      const isInCheck =
        isFourPlayer && hasFourPlayerKing(newPosition, nextPlayer)
          ? arbiter.isKingInCheck({
              position: newPosition,
              playerColor: nextPlayer,
              gameVariant: "four_player",
            })
          : false;
      const newMove = getNewMoveNotation({
        ...promotionSquare,
        p: color + "_pawn",
        promotesTo: pieceName,
        position: currentPosition,
        isInCheck,
        isCheckmate: wasCheckmate || gameStatus.endsWith(" wins"),
      });
      dispatch(
        promoteAndMove({
          newPosition,
          newMove,
          castleDirection: newCastleDirection,
          gameStatus,
          nextPlayer,
          eliminatedColors,
          captured: newCaptured,
          lastMove: {
            fromRank: promotionSquare.rank,
            fromFile: promotionSquare.file,
            toRank: promotionSquare.targetRank,
            toFile: promotionSquare.targetFile,
          },
        }),
      );
      if (appState.isMultiplayer) {
        socket.emit("makeMove", {
          roomId: appState.roomId,
          move: {
            newPosition,
            newMove,
            castleDirection: newCastleDirection,
            gameStatus,
            nextPlayer,
            eliminatedColors,
            captured: newCaptured,
            lastMove: {
              fromRank: promotionSquare.rank,
              fromFile: promotionSquare.file,
              toRank: promotionSquare.targetRank,
              toFile: promotionSquare.targetFile,
            },
            isRemote: true,
          },
        });
      }
    },
    [
      promotionSquare,
      appState.position,
      appState.castleDirection,
      appState.playerTurn,
      appState.eliminatedColors,
      appState.isVsBot,
      variant,
      dispatch,
      color,
      socket,
      appState.isMultiplayer,
      appState.roomId,
    ],
  );
  useEffect(() => {
    if (
      promotionSquare &&
      (variant === "shatranj" || variant === "shatranj960")
    ) {
      const promotionKey = `${promotionSquare.rank}-${promotionSquare.file}-${promotionSquare.targetRank}-${promotionSquare.targetFile}`;
      if (processedPromotionRef.current === promotionKey) {
        return;
      }
      processedPromotionRef.current = promotionKey;
      handlePromotion("firzan");
    }
  }, [promotionSquare, variant, handlePromotion]);

  if (!promotionSquare) {
    processedPromotionRef.current = null;
    return null;
  }
  const onClick = (option) => {
    handlePromotion(option);
    onClosePromotion?.();
  };
  if (variant === "shatranj" || variant === "shatranj960") {
    return null;
  }
  return (
    <div className={styles["promotion"]}>
      {options.map((option) => {
        const displayOption =
          option === "rook"
            ? replaceSetting === "sailboat"
              ? "sailboat"
              : replaceSetting === "chariot"
                ? "chariot"
                : "rook"
              : option;
        const keyName = `${color}_${displayOption}`;
        const imageSrc = getPieceStyle(keyName, true, user);
        const style = {
          backgroundImage: `url(${imageSrc})`,
        };
        if (option === "pawn") {
          style.marginTop = "5px";
          style.width = "40px";
        }
        return (
          <div
            key={option}
            className={`${styles.piece} ${styles.selected}`}
            style={style}
            onClick={() => onClick(option)}
          ></div>
        );
      })}
    </div>
  );
};

export default PromotionBox;
