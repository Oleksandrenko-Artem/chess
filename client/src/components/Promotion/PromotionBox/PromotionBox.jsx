import React, { useEffect, useCallback, useRef } from "react";
import { useAppContext } from "../../../contexts/Context";
import { copyPosition, getNewMoveNotation } from "../../../helpers";
import { promoteAndMove } from "../../../reducers/actions/promotion";
import arbiter from "../../../arbiter/arbiter";
import black_ferz from "../../../assets/icons/black_ferz.png";
import black_rook from "../../../assets/icons/black_rook.png";
import black_bishop from "../../../assets/icons/black_bishop.png";
import black_horse from "../../../assets/icons/black_horse.png";
import black_elephant from "../../../assets/icons/black_elephant.png";
import black_firzan from "../../../assets/icons/black_firzan.png";
import black_wazir from "../../../assets/icons/black_wazir.png";
import black_tank from "../../../assets/icons/black_tank.png";
import black_camel from "../../../assets/icons/black_camel.png";
import black_zebra from "../../../assets/icons/black_zebra.png";
import black_lion from "../../../assets/icons/black_lion.png";
import black_giraffe from "../../../assets/icons/black_giraffe.png";
import black_rukh from "../../../assets/icons/black_rukh.png";
import black_archbishop from "../../../assets/icons/black_archbishop.png";
import black_marshal from "../../../assets/icons/black_marshal.png";
import black_amazon from "../../../assets/icons/black_amazon.png";
import black_elephant_long_range from "../../../assets/icons/black_elephant_long_range.png";
import black_rhino from "../../../assets/icons/black_rhino.png";
import black_wildebeest from "../../../assets/icons/black_wildebeest.png";
import black_man from "../../../assets/icons/black_man.png";
import black_alibaba from "../../../assets/icons/black_alibaba.png";
import black_checker_long_range from "../../../assets/icons/black_checker_long_range.png";
import black_knight from "../../../assets/icons/black_knight.png";
import black_dinozavr from "../../../assets/icons/black_dinozavr.png";
import black_checkers from "../../../assets/icons/black_checkers.png";
import black_sailboat from "../../../assets/icons/black_sailboat.png";
import black_chariot from "../../../assets/icons/black_rukh.png";
import white_ferz from "../../../assets/icons/white_ferz.png";
import white_rook from "../../../assets/icons/white_rook.png";
import white_bishop from "../../../assets/icons/white_bishop.png";
import white_horse from "../../../assets/icons/white_horse.png";
import white_sailboat from "../../../assets/icons/white_sailboat.png";
import white_chariot from "../../../assets/icons/white_rukh.png";
import white_elephant from "../../../assets/icons/white_elephant.png";
import white_firzan from "../../../assets/icons/white_firzan.png";
import white_wazir from "../../../assets/icons/white_wazir.png";
import white_tank from "../../../assets/icons/white_tank.png";
import white_camel from "../../../assets/icons/white_camel.png";
import white_zebra from "../../../assets/icons/white_zebra.png";
import white_lion from "../../../assets/icons/white_lion.png";
import white_giraffe from "../../../assets/icons/white_giraffe.png";
import white_rukh from "../../../assets/icons/white_rukh.png";
import white_archbishop from "../../../assets/icons/white_archbishop.png";
import white_marshal from "../../../assets/icons/white_marshal.png";
import white_amazon from "../../../assets/icons/white_amazon.png";
import white_elephant_long_range from "../../../assets/icons/white_elephant_long_range.png";
import white_rhino from "../../../assets/icons/white_rhino.png";
import white_wildebeest from "../../../assets/icons/white_wildebeest.png";
import white_man from "../../../assets/icons/white_man.png";
import white_alibaba from "../../../assets/icons/white_alibaba.png";
import white_checker_long_range from "../../../assets/icons/white_checker_long_range.png";
import white_knight from "../../../assets/icons/white_knight.png";
import white_dinozavr from "../../../assets/icons/white_dinozavr.png";
import white_checkers from "../../../assets/icons/white_checkers.png";
import styles from "../../Pieces/Pieces.module.scss";

const promoImageMap = {
  black_ferz,
  black_rook,
  black_bishop,
  black_horse,
  black_elephant,
  black_firzan,
  black_wazir,
  black_tank,
  black_camel,
  black_zebra,
  black_lion,
  black_giraffe,
  black_rukh,
  black_archbishop,
  black_marshal,
  black_amazon,
  black_elephant_long_range,
  black_rhino,
  black_wildebeest,
  black_man,
  black_alibaba,
  black_knight,
  black_dinozavr,
  black_checkers,
  black_sailboat,
  black_chariot,
  black_checker_long_range,
  white_ferz,
  white_rook,
  white_bishop,
  white_horse,
  white_sailboat,
  white_chariot,
  white_elephant,
  white_firzan,
  white_wazir,
  white_tank,
  white_camel,
  white_zebra,
  white_lion,
  white_giraffe,
  white_rukh,
  white_archbishop,
  white_marshal,
  white_amazon,
  white_elephant_long_range,
  white_rhino,
  white_wildebeest,
  white_man,
  white_alibaba,
  white_checker_long_range,
  white_knight,
  white_dinozavr,
  white_checkers,
};

const PromotionBox = ({ onClosePromotion }) => {
  const options =
    localStorage.getItem("chess_variant") === "special"
      ? JSON.parse(localStorage.getItem("promotion_options")) || [
          "ferz",
          "rook",
          "bishop",
          "horse",
        ]
      : ["ferz", "rook", "bishop", "horse"];
  const { appState, dispatch, socket } = useAppContext();
  const { promotionSquare } = appState;
  const variant =
    typeof window !== "undefined"
      ? window.localStorage.getItem("chess_variant")
      : "chess";
  const color = promotionSquare?.targetRank === 0 ? "white" : "black";
  const replaceSetting =
    typeof window !== "undefined" ? localStorage.getItem("replaceRook") : null;
  const processedPromotionRef = useRef(null);
  const handlePromotion = useCallback(
    (pieceName) => {
      if (!promotionSquare) return;
      const newPosition = copyPosition(
        appState.position[appState.position.length - 1],
      );
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
        appState.position[appState.position.length - 1][
          promotionSquare.targetRank
        ]?.[promotionSquare.targetFile];
      if (piece && piece.endsWith("rook")) {
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
      const nextPlayer = appState.playerTurn === "white" ? "black" : "white";
      const gameStatus = arbiter.getGameStatus({
        position: newPosition,
        playerColor: nextPlayer,
        castleDirection: newCastleDirection,
      });
      const newMove = getNewMoveNotation({
        ...promotionSquare,
        p: color + "_pawn",
        promotesTo: pieceName,
        position: appState.position[appState.position.length - 1],
      });
      dispatch(
        promoteAndMove({
          newPosition,
          newMove,
          castleDirection: newCastleDirection,
          gameStatus,
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
      dispatch,
      color,
      socket,
      appState.isMultiplayer,
      appState.roomId,
    ],
  );
  useEffect(() => {
    if (promotionSquare && (variant === "shatranj" || variant === "shatranj960")) {
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
              : replaceSetting === "rukh"
                ? "rukh"
                : "rook"
            : option;
        const keyName = `${color}_${displayOption}`;
        const imageSrc = promoImageMap[keyName];
        const style = imageSrc ? { backgroundImage: `url(${imageSrc})` } : {};
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
