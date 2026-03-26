import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import actionTypes from "../../reducers/actionTypes";
import { openPromotion } from "../../reducers/actions/promotion";
import {
  copyPosition,
  generatePositionHash,
  getNewMoveNotation,
} from "../../helpers";
import { useAppContext } from "../../contexts/Context";
import { makeNewMove } from "../../reducers/actions/move";
import { status, PIECE_VALUES } from "../../constants";
import { getKingPosition } from "../../arbiter/getMoves";
import arbiter from "../../arbiter/arbiter";
import Piece from "./Piece";
import black_imperator from "../../assets/icons/black_king.png";
import black_king from "../../assets/icons/black_king.png";
import black_ferz from "../../assets/icons/black_ferz.png";
import black_rook from "../../assets/icons/black_rook.png";
import black_horse from "../../assets/icons/black_horse.png";
import black_bishop from "../../assets/icons/black_bishop.png";
import black_pawn from "../../assets/icons/black_soldier.png";
import black_soldier from "../../assets/icons/black_soldier.png";
import black_elephant from "../../assets/icons/black_elephant.png";
import black_firzan from "../../assets/icons/black_firzan.png";
import black_dinozavr from "../../assets/icons/black_dinozavr.png";
import black_tank from "../../assets/icons/black_tank.png";
import black_camel from "../../assets/icons/black_camel.png";
import black_giraffe from "../../assets/icons/black_giraffe.png";
import black_sailboat from "../../assets/icons/black_sailboat.png";
import black_rukh from "../../assets/icons/black_rukh.png";
import black_checkers from "../../assets/icons/black_checkers.png";
import black_chariot from "../../assets/icons/black_chariot.png";
import black_wazir from "../../assets/icons/black_wazir.png";
import black_zebra from "../../assets/icons/black_zebra.png";
import black_lion from "../../assets/icons/black_lion.png";
import black_archbishop from "../../assets/icons/black_archbishop.png";
import black_marshal from "../../assets/icons/black_marshal.png";
import black_amazon from "../../assets/icons/black_amazon.png";
import black_knight from "../../assets/icons/black_knight.png";
import black_elephant_long_range from "../../assets/icons/black_elephant_long_range.png";
import black_rhino from "../../assets/icons/black_rhino.png";
import black_wildebeest from "../../assets/icons/black_wildebeest.png";
import black_man from "../../assets/icons/black_man.png";
import white_imperator from "../../assets/icons/white_king.png";
import white_king from "../../assets/icons/white_king.png";
import white_ferz from "../../assets/icons/white_ferz.png";
import white_rook from "../../assets/icons/white_rook.png";
import white_horse from "../../assets/icons/white_horse.png";
import white_bishop from "../../assets/icons/white_bishop.png";
import white_pawn from "../../assets/icons/white_soldier.png";
import white_soldier from "../../assets/icons/white_soldier.png";
import white_elephant from "../../assets/icons/white_elephant.png";
import white_firzan from "../../assets/icons/white_firzan.png";
import white_dinozavr from "../../assets/icons/white_dinozavr.png";
import white_tank from "../../assets/icons/white_tank.png";
import white_camel from "../../assets/icons/white_camel.png";
import white_giraffe from "../../assets/icons/white_giraffe.png";
import white_sailboat from "../../assets/icons/white_sailboat.png";
import white_rukh from "../../assets/icons/white_rukh.png";
import white_checkers from "../../assets/icons/white_checkers.png";
import white_chariot from "../../assets/icons/white_chariot.png";
import white_wazir from "../../assets/icons/white_wazir.png";
import white_zebra from "../../assets/icons/white_zebra.png";
import white_lion from "../../assets/icons/white_lion.png";
import white_archbishop from "../../assets/icons/white_archbishop.png";
import white_marshal from "../../assets/icons/white_marshal.png";
import white_amazon from "../../assets/icons/white_amazon.png";
import white_knight from "../../assets/icons/white_knight.png";
import white_elephant_long_range from "../../assets/icons/white_elephant_long_range.png";
import white_rhino from "../../assets/icons/white_rhino.png";
import white_wildebeest from "../../assets/icons/white_wildebeest.png";
import white_man from "../../assets/icons/white_man.png";
import brick from "../../assets/icons/brick.png";
import styles from "./../ChessBoard/ChessBoard.module.scss";
import { useTranslation } from "react-i18next";

const imageMap = {
  black_imperator,
  black_king,
  black_ferz,
  black_rook,
  black_horse,
  black_bishop,
  black_soldier,
  black_pawn,
  black_elephant,
  black_firzan,
  black_dinozavr,
  black_tank,
  black_camel,
  black_giraffe,
  black_sailboat,
  black_rukh,
  black_checkers,
  black_chariot,
  black_wazir,
  black_zebra,
  black_lion,
  black_archbishop,
  black_marshal,
  black_amazon,
  black_knight,
  black_elephant_long_range,
  black_rhino,
  black_wildebeest,
  black_man,
  white_imperator,
  white_king,
  white_ferz,
  white_rook,
  white_horse,
  white_bishop,
  white_pawn,
  white_soldier,
  white_elephant,
  white_firzan,
  white_dinozavr,
  white_tank,
  white_camel,
  white_giraffe,
  white_sailboat,
  white_rukh,
  white_checkers,
  white_chariot,
  white_wazir,
  white_zebra,
  white_lion,
  white_archbishop,
  white_marshal,
  white_amazon,
  white_knight,
  white_elephant_long_range,
  white_rhino,
  white_wildebeest,
  white_man,
  brick,
};

const getPieceImageSrc = (pieceName) => {
  if (!pieceName) return "";
  try {
    if (pieceName.endsWith("_rook")) {
      const rep =
        typeof window !== "undefined"
          ? localStorage.getItem("replaceRook")
          : null;
      if (rep === "sailboat") {
        return (
          imageMap[pieceName.replace("rook", "sailboat")] ||
          imageMap[pieceName] ||
          ""
        );
      }
      if (rep === "chariot") {
        return (
          imageMap[pieceName.replace("rook", "chariot")] ||
          imageMap[pieceName] ||
          ""
        );
      }
    }
  } catch (e) {
    // ignore and fallback to regular mapping
  }
  return imageMap[pieceName] || "";
};
const getActualPiece = (piece) => {
  if (!piece) return piece;
  try {
    if (piece.endsWith("_rook")) {
      const rep =
        typeof window !== "undefined"
          ? localStorage.getItem("replaceRook")
          : null;
      if (rep === "sailboat") {
        return piece.replace("rook", "sailboat");
      }
      if (rep === "chariot") {
        return piece.replace("rook", "chariot");
      }
    }
  } catch (e) {
    // ignore and return original
  }
  return piece;
};

const Pieces = ({ flipped = false }) => {
  const ref = useRef(null);
  const { appState, dispatch } = useAppContext();
  const { t } = useTranslation();
  const user = useSelector((state) => state.users.user);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [positionHistory, setPositionHistory] = useState([]);

  useEffect(() => {
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject();
      });

    const loadAllImages = async () => {
      try {
        const promises = Object.values(imageMap).map(loadImage);
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error(error);
        setImagesLoaded(true);
      }
    };

    loadAllImages();
  }, []);
  const isBotThinking = useRef(false);
  const isBotMove = useRef(false);
  const statusRef = useRef(appState.status);

  useEffect(() => {
    statusRef.current = appState.status;
  }, [appState.status]);

  useEffect(() => {
    const {
      playerTurn,
      status: currentStatus,
      position,
      castleDirection,
    } = appState;
    const userSide = localStorage.getItem("chess_side");
    const mode = localStorage.getItem("chess_mode");
    const isGameMode = mode === "game";

    if (
      isGameMode &&
      currentStatus === status.ongoing &&
      playerTurn !== userSide &&
      !isBotThinking.current
    ) {
      const currentPosition = position[position.length - 1];
      const prevPosition =
        position.length > 1 ? position[position.length - 2] : null;

      isBotThinking.current = true;

      const worker = new Worker(new URL("./chessWorker.js", import.meta.url), {
        type: "module",
      });

      const gameVariant = localStorage.getItem("chess_variant");

      worker.postMessage({
        currentPosition,
        prevPosition,
        playerTurn,
        castleDirection,
        depth: gameVariant === "special" ? 3 : 4,
        gameVariant,
      });

      worker.onmessage = (e) => {
        const { chosenMove } = e.data;

        if (chosenMove && statusRef.current === status.ongoing) {
          makeMove({ ...chosenMove, isBot: true });
        }

        isBotThinking.current = false;
        worker.terminate();
      };

      worker.onerror = (err) => {
        console.error("Worker error:", err);
        isBotThinking.current = false;
        worker.terminate();
      };
    }
  }, [appState.playerTurn, appState.status]);

  if (!appState || !appState.position) {
    return null;
  }
  const currentPosition = appState.position[appState.position.length - 1];
  const calculateCoords = (e) => {
    if (!ref.current) return { x: -1, y: -1 };
    const { width, left, top } = ref.current.getBoundingClientRect();
    const size = width / 8;
    let dispFile = Math.floor((e.clientX - left) / size);
    let dispRank = Math.floor((e.clientY - top) / size);
    if (dispFile < 0 || dispFile > 7 || dispRank < 0 || dispRank > 7)
      return { x: -1, y: -1 };
    const realFile = flipped ? 7 - dispFile : dispFile;
    const realRank = flipped ? 7 - dispRank : dispRank;
    return { x: realRank, y: realFile };
  };
  const openPromotionBox = ({ rank, file, targetRank, targetFile }) => {
    dispatch(
      openPromotion({
        rank: Number(rank),
        file: Number(file),
        targetRank,
        targetFile,
      }),
    );
  };
  const makeMove = (moveData) => {
    if (appState.status !== status.ongoing) return;

    const {
      piece,
      rank,
      file,
      targetRank,
      targetFile,
      isNew = false,
    } = moveData;
    const p = piece;
    const userSide = localStorage.getItem("chess_side");
    const isHuman = appState.playerTurn === userSide;

    const { isBot = false } = moveData;

    if (!isHuman && !isBot && !isNew) {
      console.log("Зараз хід бота, зачекайте");
      return;
    }

    if (isHuman && !isNew) {
      const isValidMove = appState.validMoves?.find(
        (m) => m[0] === targetRank && m[1] === targetFile,
      );
      if (!isValidMove) {
        dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
        return;
      }

      if (
        (p.endsWith("pawn") || p.endsWith("soldier")) &&
        (targetRank === 0 || targetRank === 7)
      ) {
        openPromotionBox({ rank, file, targetRank, targetFile });
        return;
      }
    }

    const newPosition = copyPosition(currentPosition);
    const newCaptured = JSON.parse(
      JSON.stringify(appState.captured || { white: [], black: [] }),
    );

    if (!isNew && currentPosition[targetRank][targetFile]) {
      let capturedPiece = getActualPiece(
        currentPosition[targetRank][targetFile],
      );
      const opponentColor = capturedPiece.startsWith("white")
        ? "black"
        : "white";
      newCaptured[opponentColor].push(capturedPiece);
    }
    const mode = localStorage.getItem("chess_mode");
    const isEditorMode = mode === "editor";
    if (
      p.endsWith("pawn") &&
      file !== targetFile &&
      !currentPosition[targetRank][targetFile] &&
      !isEditorMode
    ) {
      newPosition[rank][targetFile] = "";
      const enemyColor = p.startsWith("white") ? "black" : "white";
      newCaptured[enemyColor].push(`${enemyColor}_pawn`);

      newPosition[targetRank][targetFile] = p;
    }

    if (!isNew && rank !== undefined && file !== undefined) {
      newPosition[rank][file] = "";
    }

    if (newPosition[targetRank] !== undefined) {
      newPosition[targetRank][targetFile] = piece;
    }
    const promotionOptions = JSON.parse(
      localStorage.getItem("promotion_options"),
    ) || ["ferz", "rook", "bishop", "horse"];
    const gameMode = localStorage.getItem("chess_variant");
    if (
      !isHuman &&
      (p.endsWith("pawn") || p.endsWith("soldier")) &&
      (targetRank === 0 || targetRank === 7)
    ) {
      let promotionPiece;

      if (gameMode === "chess") {
        promotionPiece = "ferz";
      } else if (gameMode === "shatranj") {
        promotionPiece = "firzan";
      } else {
        promotionPiece = promotionOptions
          .map((piece) => ({
            piece,
            value: PIECE_VALUES[piece] || 0,
          }))
          .sort((a, b) => b.value - a.value)[0].piece;
      }

      newPosition[targetRank][targetFile] =
        p.split("_")[0] + "_" + promotionPiece;
    } else {
      newPosition[targetRank][targetFile] = p;
    }

    if (p.endsWith("_king")) {
      if (Math.abs(targetFile - file) === 2) {
        const isShortCastle = targetFile > file;
        const rookFile = isShortCastle ? 7 : 0;
        const newRookFile = isShortCastle ? targetFile - 1 : targetFile + 1;
        const rook = newPosition[rank][rookFile];

        newPosition[rank][rookFile] = "";
        newPosition[rank][newRookFile] = rook;
      }
    }
    const nextPlayer = isEditorMode
      ? appState.playerTurn
      : appState.playerTurn === "white"
        ? "black"
        : "white";
    const newCastleDirection = { ...appState.castleDirection };
    let gameStatus;

    const newHash = generatePositionHash(
      newPosition,
      nextPlayer,
      newCastleDirection,
    );

    setPositionHistory((prev) => [...prev, newHash]);

    if (isEditorMode) {
      gameStatus = status.ongoing;
    } else {
      gameStatus = arbiter.getGameStatus({
        position: newPosition,
        playerColor: nextPlayer,
        castleDirection: newCastleDirection,
        prevPosition: currentPosition,
        positionHistory: [...positionHistory, newHash],
      });
    }
    const isInCheck = arbiter.isKingInCheck({
      position: newPosition,
      playerColor: nextPlayer,
    });
    let newMove = null;

    if (!isEditorMode) {
      newMove = getNewMoveNotation({
        p,
        rank,
        file,
        targetRank,
        targetFile,
        position: currentPosition,
        isInCheck,
        isCheckmate: gameStatus.includes("wins"),
        isStalemate: gameStatus === "Draw",
      });
    }

    dispatch(
      makeNewMove({
        newPosition,
        newMove,
        castleDirection: newCastleDirection,
        gameStatus,
        captured: isEditorMode ? appState.captured : newCaptured,
        lastMove: isEditorMode
          ? null
          : {
              fromRank: rank,
              fromFile: file,
              toRank: targetRank,
              toFile: targetFile,
            },
      }),
    );
    dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
  };
  const onDrop = (e) => {
    e.preventDefault();
    if (appState.status !== status.ongoing) return;

    const [p, rankStr, fileStr] = e.dataTransfer.getData("text").split(",");
    const isNew = rankStr === "isNew";

    if (isNew && (p.endsWith("king") || p.endsWith("imperator"))) {
      const color = p.startsWith("white") ? "white" : "black";

      const hasKingOfThisColor = currentPosition
        .flat()
        .some(
          (piece) =>
            piece &&
            piece.startsWith(color) &&
            (piece.endsWith("king") || piece.endsWith("imperator")),
        );

      if (hasKingOfThisColor) {
        alert(
          `${t("custom_panel.king_message")} ${color === "white" ? t("custom_panel.white") : t("custom_panel.black")} ${t("custom_panel.king")}!`,
        );
        return;
      }
    }

    const coords = calculateCoords(e);
    if (coords.x === -1 || coords.y === -1) return;

    makeMove({
      piece: p,
      rank: parseInt(rankStr, 10),
      file: parseInt(fileStr, 10),
      targetRank: coords.x,
      targetFile: coords.y,
      isNew: isNew,
    });
  };
  const onDragOver = (e) => e.preventDefault();
  if (!imagesLoaded) {
    return <div>Loading pieces...</div>;
  }
  const position = appState.position[appState.position.length - 1];
  const isChecked = (() => {
    const isInCheck = arbiter.isKingInCheck({
      position,
      playerColor: appState.playerTurn,
    });
    if (isInCheck) {
      return getKingPosition({ position, playerColor: appState.playerTurn });
    }
  })();
  return (
    <div
      ref={ref}
      className={styles["chess-board"]}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {[...Array(8)].map((_, dispRank) => {
        return (
          <React.Fragment key={dispRank}>
            {[...Array(8)].map((__, dispFile) => {
              const realRank = flipped ? 7 - dispRank : dispRank;
              const realFile = flipped ? 7 - dispFile : dispFile;
              const f = currentPosition[realRank][realFile];
              const number = dispRank + dispFile + 2;
              let tileClass =
                number % 2 === 0 ? styles["white-tile"] : styles["black-tile"];

              if (
                isChecked &&
                isChecked[0] === realRank &&
                isChecked[1] === realFile
              ) {
                tileClass += ` ${styles["check"]}`;
              } else {
                const lastMove = appState.lastMove;

                let isPrevious = false;
                if (lastMove) {
                  const isFromTile =
                    lastMove.fromRank === realRank &&
                    lastMove.fromFile === realFile;
                  const isToTile =
                    lastMove.toRank === realRank &&
                    lastMove.toFile === realFile;

                  isPrevious = isFromTile || isToTile;
                }

                let isAttack = false;
                let isValid = false;

                if (
                  appState.validMoves?.find(
                    (m) => m[0] === realRank && m[1] === realFile,
                  )
                ) {
                  isValid = true;

                  const selected = appState.selected;

                  isAttack = !!position[realRank][realFile];

                  if (!isAttack && selected?.piece?.endsWith("pawn")) {
                    const fromFile = selected.from?.[1];
                    if (fromFile !== undefined && fromFile !== realFile) {
                      isAttack = true;
                    }
                  }

                  if (!isAttack && selected?.piece?.endsWith("checkers")) {
                    const fromRank = selected.from?.[0];
                    const fromFile = selected.from?.[1];
                    if (
                      Math.abs(realRank - fromRank) === 2 &&
                      Math.abs(realFile - fromFile) === 2
                    ) {
                      isAttack = true;
                    }
                  }
                }

                if (isAttack) {
                  tileClass += ` ${styles["attacking"]}`;
                } else if (isValid) {
                  tileClass += ` ${styles["highlight"]}`;
                } else if (isPrevious) {
                  tileClass += ` ${styles["previous"]}`;
                }
              }
              return (
                <div key={realRank + "-" + realFile} className={tileClass}>
                  {f ? (
                    <Piece
                      rank={realRank}
                      file={realFile}
                      piece={f}
                      imageSrc={getPieceImageSrc(f)}
                    />
                  ) : null}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Pieces;
