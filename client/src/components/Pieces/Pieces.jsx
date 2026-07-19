import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { updateUserThunk } from "../../store/usersSlice";
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
import black_duke from "../../assets/icons/black_duke.png";
import black_prince from "../../assets/icons/black_prince.png";
import black_alibaba from "../../assets/icons/black_alibaba.png";
import black_checker_long_range from "../../assets/icons/black_checker_long_range.png";
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
import white_duke from "../../assets/icons/white_duke.png";
import white_prince from "../../assets/icons/white_prince.png";
import white_alibaba from "../../assets/icons/white_alibaba.png";
import white_checker_long_range from "../../assets/icons/white_checker_long_range.png";
import brick from "../../assets/icons/brick.png";
import boardStyles from "./../ChessBoard/ChessBoard.module.scss";
import pieceStyles from "./Pieces.module.scss";
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
  black_duke,
  black_prince,
  black_alibaba,
  black_checker_long_range,
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
  white_duke,
  white_prince,
  white_alibaba,
  white_checker_long_range,
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
  const { appState, dispatch, socket } = useAppContext();
  const { t } = useTranslation();
  const user = useSelector((state) => state.users.user);
  const dispatchRedux = useDispatch();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [positionHistory, setPositionHistory] = useState([]);
  const [movingPiece, setMovingPiece] = useState(null);
  const prevPositionRef = useRef(null);
  const lastResultStatusRef = useRef(null);

  const getUserResultUpdate = (gameStatus) => {
    const userSide = localStorage.getItem("chess_side");
    if (!userSide) return null;

    const chessMode =
      typeof window !== "undefined" ? localStorage.getItem("chess_mode") : null;
    const chessVariant =
      typeof window !== "undefined"
        ? localStorage.getItem("chess_variant")
        : null;
    if (
      (chessVariant === "special" && chessMode === "editor") ||
      (chessVariant === "custom" && chessMode === "multiplayer")
    )
      return null;

    const isMultiplayerGame = appState.isMultiplayer;
    const isBotGame = appState.isVsBot;
    if (!isMultiplayerGame && !isBotGame) return null;

    const result = {
      wins: user?.wins || 0,
      draws: user?.draws || 0,
      loses: user?.loses || 0,
    };

    if (isMultiplayerGame) {
      result.multiWins = user?.multiWins || 0;
      result.multiDraws = user?.multiDraws || 0;
      result.multiLoses = user?.multiLoses || 0;
    }
    if (isBotGame) {
      result.botWins = user?.botWins || 0;
      result.botDraws = user?.botDraws || 0;
      result.botLoses = user?.botLoses || 0;
    }

    if (gameStatus === status.draw) {
      result.draws += 1;
      if (isMultiplayerGame) result.multiDraws += 1;
      if (isBotGame) result.botDraws += 1;
      return result;
    }

    const winnerColor =
      gameStatus === status.white
        ? "white"
        : gameStatus === status.black
          ? "black"
          : null;

    if (!winnerColor) return null;

    const isUserWin = winnerColor === userSide;
    if (isUserWin) {
      result.wins += 1;
      if (isMultiplayerGame) result.multiWins += 1;
      if (isBotGame) result.botWins += 1;
    } else {
      result.loses += 1;
      if (isMultiplayerGame) result.multiLoses += 1;
      if (isBotGame) result.botLoses += 1;
    }

    return result;
  };

  useEffect(() => {
    const previousStatus = lastResultStatusRef.current;
    const currentStatus = appState.status;
    const chessMode =
      typeof window !== "undefined" ? localStorage.getItem("chess_mode") : null;

    const isTerminalStatus =
      currentStatus !== status.ongoing && currentStatus !== status.promotion;
    const wasActiveGame =
      previousStatus === status.ongoing || previousStatus === status.promotion;

    if (chessMode === "editor") {
      lastResultStatusRef.current = currentStatus;
      return;
    }

    if (wasActiveGame && isTerminalStatus && user?._id) {
      const updateValues = getUserResultUpdate(currentStatus);
      if (updateValues) {
        dispatchRedux(updateUserThunk({ id: user._id, values: updateValues }));
      }
    }

    lastResultStatusRef.current = currentStatus;
  }, [appState.status, user, dispatchRedux]);

  useEffect(() => {
    if (appState.position && appState.position.length > 1) {
      prevPositionRef.current = appState.position[appState.position.length - 2];
    } else {
      prevPositionRef.current = null;
    }
  }, [appState.position]);
  useEffect(() => {
    if (!appState || !appState.position) return;
    if (appState.position.length === 1) {
      const initialHash = generatePositionHash(
        appState.position[0],
        appState.playerTurn,
        appState.castleDirection,
      );
      setPositionHistory([initialHash]);
    }
  }, [appState.position, appState.playerTurn, appState.castleDirection]);
  useEffect(() => {
    if (
      !appState.lastMove ||
      !appState.position ||
      appState.position.length < 2
    ) {
      setMovingPiece(null);
      return;
    }

    const prevBoard = appState.position[appState.position.length - 2];
    const pieceAtStart =
      prevBoard?.[appState.lastMove.fromRank]?.[appState.lastMove.fromFile];

    if (!pieceAtStart) {
      setMovingPiece(null);
      return;
    }

    const pieceImage = getPieceImageSrc(pieceAtStart);
    setMovingPiece({
      piece: pieceAtStart,
      imageSrc: pieceImage,
      fromRank: appState.lastMove.fromRank,
      fromFile: appState.lastMove.fromFile,
      toRank: appState.lastMove.toRank,
      toFile: appState.lastMove.toFile,
    });

    const timer = setTimeout(() => setMovingPiece(null), 260);
    return () => clearTimeout(timer);
  }, [appState.lastMove, appState.position]);

  useEffect(() => {
    const mode = localStorage.getItem("chess_mode");
    if (
      !appState.isVsBot ||
      appState.status !== status.ongoing ||
      mode === "game"
    ) {
      return;
    }

    const userSide = localStorage.getItem("chess_side");
    if (appState.playerTurn !== userSide) {
      makeBotMove();
    }
  }, [appState.playerTurn, appState.isVsBot, appState.status]);

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
      const botLevel = parseInt(localStorage.getItem("bot_level") || "1", 10);

      worker.postMessage({
        currentPosition,
        prevPosition,
        playerTurn,
        castleDirection,
        depth: gameVariant === "special" ? 2 : botLevel,
        gameVariant,
        positionHistory,
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
    if (!ref.current || !appState || !appState.boardSize)
      return { x: -1, y: -1 };
    const { width, left, top } = ref.current.getBoundingClientRect();
    const size = width / appState.boardSize;
    let dispFile = Math.floor((e.clientX - left) / size);
    let dispRank = Math.floor((e.clientY - top) / size);
    if (
      dispFile < 0 ||
      dispFile >= appState.boardSize ||
      dispRank < 0 ||
      dispRank >= appState.boardSize
    )
      return { x: -1, y: -1 };

    const realFile = flipped ? appState.boardSize - 1 - dispFile : dispFile;
    const realRank = flipped ? appState.boardSize - 1 - dispRank : dispRank;
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

  const getCheckerCaptureInfo = ({
    piece,
    rank,
    file,
    targetRank,
    targetFile,
    position,
  }) => {
    if (
      !piece?.endsWith("checkers") &&
      !piece?.endsWith("checker_long_range")
    ) {
      return null;
    }

    const stepRank = targetRank > rank ? 1 : targetRank < rank ? -1 : 0;
    const stepFile = targetFile > file ? 1 : targetFile < file ? -1 : 0;

    if (
      stepRank === 0 ||
      stepFile === 0 ||
      Math.abs(targetRank - rank) !== Math.abs(targetFile - file)
    ) {
      return null;
    }

    let currentRank = rank + stepRank;
    let currentFile = file + stepFile;

    while (currentRank !== targetRank || currentFile !== targetFile) {
      const square = position?.[currentRank]?.[currentFile];
      if (square && square !== "") {
        return {
          captureRank: currentRank,
          captureFile: currentFile,
        };
      }

      currentRank += stepRank;
      currentFile += stepFile;
    }

    return null;
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

    if (appState.isMultiplayer && !isNew) {
      if (appState.playerTurn !== userSide) {
        console.log("Не ваш ход в multiplayer режиме");
        return;
      }
    } else if (!isHuman && !isBot && !isNew) {
      console.log("Зараз хід бота, зачекайте");
      return;
    }

    if (isHuman && !isNew) {
      const isValidMove = appState.validMoves?.find(
        (m) => m[0] === targetRank && m[1] === targetFile,
      );
      if (!isValidMove) {
        return;
      }

      if (
        (p.endsWith("pawn") || p.endsWith("soldier")) &&
        (targetRank === 0 || targetRank === appState.boardSize - 1)
      ) {
        openPromotionBox({ rank, file, targetRank, targetFile });
        return;
      }
    }

    const newPosition = copyPosition(currentPosition);
    const newCaptured = JSON.parse(
      JSON.stringify(appState.captured || { white: [], black: [] }),
    );
    const checkerCaptureInfo = getCheckerCaptureInfo({
      piece: p,
      rank,
      file,
      targetRank,
      targetFile,
      position: currentPosition,
    });
    const isCheckerCapture = Boolean(checkerCaptureInfo);
    const isCaptureMove =
      !isNew &&
      (isCheckerCapture ||
        Boolean(currentPosition?.[targetRank]?.[targetFile]));
    const captureRank = isCheckerCapture
      ? checkerCaptureInfo.captureRank
      : targetRank;
    const captureFile = isCheckerCapture
      ? checkerCaptureInfo.captureFile
      : targetFile;

    if (!isNew && currentPosition[captureRank][captureFile]) {
      let capturedPiece = getActualPiece(
        currentPosition[captureRank][captureFile],
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

    if (isCheckerCapture) {
      newPosition[captureRank][captureFile] = "";
    }

    if (newPosition[targetRank] !== undefined) {
      newPosition[targetRank][targetFile] = piece;
    }
    const promotionOptions = JSON.parse(
      localStorage.getItem("promotion_options"),
    ) || ["ferz", "rook", "bishop", "horse"];
    const gameMode = localStorage.getItem("chess_variant");
    const shouldPromoteChecker =
      p.endsWith("checkers") &&
      ((p.startsWith("white") && targetRank === 0) ||
        (p.startsWith("black") && targetRank === appState.boardSize - 1));
    if (shouldPromoteChecker) {
      newPosition[targetRank][targetFile] =
        p.split("_")[0] + "_checker_long_range";
    } else if (
      (p.endsWith("pawn") || p.endsWith("soldier")) &&
      (targetRank === 0 || targetRank === appState.boardSize - 1)
    ) {
      if (!isHuman) {
        let promotionPiece;

        if (gameMode === "chess" || gameMode === "chess960") {
          promotionPiece = "ferz";
        } else if (gameMode === "shatranj" || gameMode === "shatranj960") {
          promotionPiece = "firzan";
        } else if (gameMode === "new_chess" || gameMode === "new_chess960") {
          promotionPiece = "prince";
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
    const currentPlayer = appState.playerTurn;
    const boardSize = appState.boardSize;
    const homeRank = currentPlayer === "white" ? boardSize - 1 : 0;

    const removeCastleSide = (direction, side) => {
      if (direction === "none") return "none";
      if (direction === "both") return side === "left" ? "right" : "left";
      if (direction === side) return "none";
      return direction;
    };

    if (!isEditorMode) {
      if (p.endsWith("_king")) {
        newCastleDirection[currentPlayer] = "none";
      }

      if (p.endsWith("_rook")) {
        if (rank === homeRank && file === 0) {
          newCastleDirection[currentPlayer] = removeCastleSide(
            newCastleDirection[currentPlayer],
            "left",
          );
        }
        if (rank === homeRank && file === boardSize - 1) {
          newCastleDirection[currentPlayer] = removeCastleSide(
            newCastleDirection[currentPlayer],
            "right",
          );
        }
      }

      const capturedPiece = currentPosition[targetRank]?.[targetFile];
      if (capturedPiece?.endsWith("_rook")) {
        const capturedColor = capturedPiece.startsWith("white")
          ? "white"
          : "black";
        const capturedHomeRank = capturedColor === "white" ? boardSize - 1 : 0;

        if (targetRank === capturedHomeRank && targetFile === 0) {
          newCastleDirection[capturedColor] = removeCastleSide(
            newCastleDirection[capturedColor],
            "left",
          );
        }
        if (targetRank === capturedHomeRank && targetFile === boardSize - 1) {
          newCastleDirection[capturedColor] = removeCastleSide(
            newCastleDirection[capturedColor],
            "right",
          );
        }
      }
    }

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
        isCapture: isCaptureMove,
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
    if (appState.isMultiplayer) {
      socket.emit("makeMove", {
        roomId: appState.roomId,
        move: {
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
          isRemote: true,
        },
      });
    }
    dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
  };

  const makeBotMove = () => {
    if (appState.status !== status.ongoing || !appState.isVsBot) return;

    const botColor = appState.playerTurn;
    const gameVariant = localStorage.getItem("chess_variant") || "chess";

    const allMoves = arbiter.getBoardValidMoves({
      position: currentPosition,
      playerColor: botColor,
      prevPosition: prevPositionRef.current,
      castleDirection: appState.castleDirection,
      gameVariant,
    });

    if (allMoves.length === 0) return;

    const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];

    setTimeout(
      () => {
        makeMove({
          piece: randomMove.piece,
          rank: randomMove.rank,
          file: randomMove.file,
          targetRank: randomMove.targetRank,
          targetFile: randomMove.targetFile,
          isBot: true,
        });
      },
      500 + Math.random() * 1000,
    );
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
  const position =
    appState.position && appState.position.length > 0
      ? appState.position[appState.position.length - 1]
      : Array.from({ length: appState.boardSize }, () =>
          Array.from({ length: appState.boardSize }, () => null),
        );

  const numberFileByRank = [...Array(appState.boardSize)].map((_, r) => {
    const direction = appState.orientation === "white" ? 1 : -1;
    const start = appState.orientation === "white" ? 0 : appState.boardSize - 1;
    for (let offset = 0; offset < appState.boardSize; offset++) {
      const file = start + offset * direction;
      if (
        file >= 0 &&
        file < appState.boardSize &&
        position[r] &&
        position[r][file] !== "brick"
      ) {
        return file;
      }
    }
    return null;
  });

  const letterRankByFile = [...Array(appState.boardSize)].map((_, f) => {
    const direction = appState.orientation === "white" ? -1 : 1;
    const start = appState.orientation === "white" ? appState.boardSize - 1 : 0;
    for (let offset = 0; offset < appState.boardSize; offset++) {
      const rank = start + offset * direction;
      if (
        rank >= 0 &&
        rank < appState.boardSize &&
        position[rank] &&
        position[rank][f] !== "brick"
      ) {
        return rank;
      }
    }
    return null;
  });

  const isChecked = (() => {
    const isInCheck = arbiter.isKingInCheck({
      position,
      playerColor: appState.playerTurn,
    });
    if (isInCheck) {
      return getKingPosition({ position, playerColor: appState.playerTurn });
    }
  })();
  const handleSquareClick = (targetRank, targetFile) => {
    if (appState.selected) {
      const isValidMove = appState.validMoves?.find(
        (m) => m[0] === targetRank && m[1] === targetFile,
      );

      if (isValidMove) {
        makeMove({
          piece: appState.selected.piece,
          rank: appState.selected.from[0],
          file: appState.selected.from[1],
          targetRank,
          targetFile,
        });
      } else {
        dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
      }
    }
  };
  const movingPieceStyle =
    movingPiece && ref.current
      ? (() => {
          const cellSize =
            ref.current.getBoundingClientRect().width / appState.boardSize;

          const isPawnOrSoldier =
            movingPiece.piece.endsWith("soldier") ||
            movingPiece.piece.endsWith("pawn");
          const sizeMultiplier = isPawnOrSoldier ? 0.55 : 0.75;

          const pieceWidth = cellSize * sizeMultiplier;
          const pieceHeight = cellSize * sizeMultiplier;

          const offsetX = (cellSize - pieceWidth) / 2;
          const offsetY = isPawnOrSoldier
            ? cellSize * 0.3
            : (cellSize - pieceHeight) / 2;

          const displayFromFile = flipped
            ? appState.boardSize - 1 - movingPiece.fromFile
            : movingPiece.fromFile;
          const displayFromRank = flipped
            ? appState.boardSize - 1 - movingPiece.fromRank
            : movingPiece.fromRank;

          const displayToFile = flipped
            ? appState.boardSize - 1 - movingPiece.toFile
            : movingPiece.toFile;
          const displayToRank = flipped
            ? appState.boardSize - 1 - movingPiece.toRank
            : movingPiece.toRank;

          const left = displayFromFile * cellSize + offsetX;
          const top = displayFromRank * cellSize + offsetY;

          const translateX = (displayToFile - displayFromFile) * cellSize;
          const translateY = (displayToRank - displayFromRank) * cellSize;

          return {
            width: `${pieceWidth}px`,
            height: `${pieceHeight}px`,
            left: `${left}px`,
            top: `${top}px`,
            "--move-x": `${translateX}px`,
            "--move-y": `${translateY}px`,
            backgroundImage: `url(${movingPiece.imageSrc})`,
          };
        })()
      : null;

  return (
    <div
      ref={ref}
      className={boardStyles["chess-board"]}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {movingPiece && (
        <div
          className={pieceStyles["piece-travel"]}
          style={movingPieceStyle}
          aria-hidden="true"
        />
      )}
      {[...Array(appState.boardSize)].map((_, dispRank) => {
        return (
          <React.Fragment key={dispRank}>
            {[...Array(appState.boardSize)].map((__, dispFile) => {
              const realRank = flipped
                ? appState.boardSize - 1 - dispRank
                : dispRank;
              const realFile = flipped
                ? appState.boardSize - 1 - dispFile
                : dispFile;
              const f = currentPosition?.[realRank]?.[realFile];
              const tileColor = (realRank + realFile) % 2;
              let tileClass =
                tileColor === 0
                  ? boardStyles["white-tile"]
                  : boardStyles["black-tile"];

              const showNumber =
                numberFileByRank[realRank] === realFile &&
                numberFileByRank[realRank] !== null;
              const showLetter =
                letterRankByFile[realFile] === realRank &&
                letterRankByFile[realFile] !== null;

              if (
                isChecked &&
                isChecked[0] === realRank &&
                isChecked[1] === realFile
              ) {
                tileClass += ` ${boardStyles["check"]}`;
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

                  if (
                    !isAttack &&
                    (selected?.piece?.endsWith("checkers") ||
                      selected?.piece?.endsWith("checker_long_range"))
                  ) {
                    const fromRank = selected.from?.[0];
                    const fromFile = selected.from?.[1];
                    const captureInfo = getCheckerCaptureInfo({
                      piece: selected.piece,
                      rank: fromRank,
                      file: fromFile,
                      targetRank: realRank,
                      targetFile: realFile,
                      position: currentPosition,
                    });
                    isAttack = Boolean(captureInfo);
                  }
                }

                if (isAttack) {
                  tileClass += ` ${boardStyles["attacking"]}`;
                } else if (isValid) {
                  tileClass += ` ${boardStyles["highlight"]}`;
                } else if (isPrevious) {
                  tileClass += ` ${boardStyles["previous"]}`;
                }
              }
              return (
                <div
                  key={realRank + "-" + realFile}
                  className={tileClass}
                  onClick={() => handleSquareClick(realRank, realFile)}
                >
                  {showNumber && (
                    <span
                      className={`${boardStyles["coordinate-number"]} ${
                        flipped
                          ? boardStyles["black-orientation"]
                          : boardStyles["white-orientation"]
                      } ${
                        tileColor === 0
                          ? boardStyles["light-text"]
                          : boardStyles["dark-text"]
                      }`}
                    >
                      {appState.boardSize - realRank}
                    </span>
                  )}
                  {showLetter && (
                    <span
                      className={`${boardStyles["coordinate-letter"]} ${
                        flipped
                          ? boardStyles["black-orientation"]
                          : boardStyles["white-orientation"]
                      } ${
                        tileColor === 0
                          ? boardStyles["light-text"]
                          : boardStyles["dark-text"]
                      }`}
                    >
                      {String.fromCharCode(97 + realFile)}
                    </span>
                  )}
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
