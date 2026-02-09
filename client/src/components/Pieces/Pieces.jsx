import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import actionTypes from "../../reducers/actionTypes";
import { openPromotion } from "../../reducers/actions/promotion";
import { copyPosition, getNewMoveNotation } from "../../helpers";
import { useAppContext } from "../../contexts/Context";
import { makeNewMove } from "../../reducers/actions/move";
import { status } from "../../constants";
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
import styles from "./../ChessBoard/ChessBoard.module.scss";

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
  const user = useSelector((state) => state.users.user);
  const [imagesLoaded, setImagesLoaded] = useState(false);
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
  const onDrop = (e) => {
    e.preventDefault();
    if (appState.status !== status.ongoing) {
      return;
    }
    const coords = calculateCoords(e);
    if (coords.x === -1 || coords.y === -1) return;

    const [p, rankStr, fileStr] = e.dataTransfer.getData("text").split(",");
    const rank = parseInt(rankStr, 10);
    const file = parseInt(fileStr, 10);
    const targetRank = coords.x;
    const targetFile = coords.y;
    if (rankStr === "isNew") {
      const newPosition = copyPosition(currentPosition);
      if (p.endsWith("king")) {
        const kingExists = currentPosition.some((row) => row.includes(p));
        if (kingExists) {
          alert(
            "On chessboard can be only one " +
              (p.startsWith("white") ? "white" : "black") +
              " king!",
          );
          return;
        }
      }
      newPosition[targetRank][targetFile] = p;
      dispatch({
        type: actionTypes.SET_POSITION,
        payload: { newPosition },
      });
      return;
    }
    const isValidMove = appState.validMoves?.find(
      (move) => move[0] === targetRank && move[1] === targetFile,
    );
    if (isValidMove) {
      if (
        (p === "white_pawn" && targetRank === 0) ||
        (p === "black_pawn" && targetRank === 7)
      ) {
        openPromotionBox({ rank, file, targetRank, targetFile });
        return;
      }
      if (
        (p === "white_soldier" && targetRank === 0) ||
        (p === "black_soldier" && targetRank === 7)
      ) {
        openPromotionBox({ rank, file, targetRank, targetFile });
        return;
      }
    }
    if (!isValidMove) {
      dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
      return;
    }
    const newPosition = copyPosition(currentPosition);
    const newCaptured = JSON.parse(
      JSON.stringify(appState.captured || { white: [], black: [] }),
    );
    if (
      currentPosition[targetRank][targetFile] &&
      currentPosition[targetRank][targetFile] !== ""
    ) {
      let capturedPiece = currentPosition[targetRank][targetFile];
      capturedPiece = getActualPiece(capturedPiece);
      const captureColor = capturedPiece.startsWith("white")
        ? "white"
        : "black";
      const opponentColor = captureColor === "white" ? "black" : "white";
      newCaptured[opponentColor].push(capturedPiece);
    }
    if (
      p.endsWith("pawn") &&
      !newPosition[targetRank][targetFile] &&
      targetFile !== file
    ) {
      newPosition[rank][targetFile] = "";
    }
    if (
      p.endsWith("checkers") &&
      Math.abs(targetRank - rank) === 2 &&
      Math.abs(targetFile - file) === 2
    ) {
      const capRank = (rank + targetRank) / 2;
      const capFile = (file + targetFile) / 2;
      if (
        newPosition[capRank][capFile] &&
        newPosition[capRank][capFile] !== ""
      ) {
        let capturedPiece = newPosition[capRank][capFile];
        capturedPiece = getActualPiece(capturedPiece);
        const captureColor = capturedPiece.startsWith("white")
          ? "white"
          : "black";
        const opponentColor = captureColor === "white" ? "black" : "white";
        newCaptured[opponentColor].push(capturedPiece);
      }
      newPosition[capRank][capFile] = "";
    }
    newPosition[rank][file] = "";
    newPosition[targetRank][targetFile] = p;
    const isCastling = p.endsWith("king") && Math.abs(targetFile - file) === 2;
    if (isCastling) {
      if (targetFile === 2) {
        newPosition[rank][0] = "";
        newPosition[rank][3] = p.replace("king", "rook");
      } else if (targetFile === 6) {
        newPosition[rank][7] = "";
        newPosition[rank][5] = p.replace("king", "rook");
      }
    }
    const newCastleDirection = { ...appState.castleDirection };
    if (p.endsWith("king")) {
      newCastleDirection[p.startsWith("white") ? "white" : "black"] = "none";
    }
    if (p.endsWith("rook")) {
      const playerColor = p.startsWith("white") ? "white" : "black";
      const currentDir = newCastleDirection[playerColor];
      if (file === 0) {
        newCastleDirection[playerColor] =
          currentDir === "both" ? "right" : "none";
      } else if (file === 7) {
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
    const isWinStatus = gameStatus.includes("wins");
    const isInCheck = arbiter.isKingInCheck({
      position: newPosition,
      playerColor: nextPlayer,
    });
    const isCheckmate = isWinStatus && isInCheck;
    const isStalemate = gameStatus === "Draw";
    const newMove = getNewMoveNotation({
      p,
      rank,
      file,
      targetRank,
      targetFile,
      position: currentPosition,
      isInCheck: isInCheck && !isCheckmate,
      isCheckmate,
      isStalemate,
      rookType: user
        ? user.rookType
        : typeof window !== "undefined"
          ? localStorage.getItem("replaceRook") || "rook"
          : "rook",
    });
    dispatch(
      makeNewMove({
        newPosition,
        newMove,
        castleDirection: newCastleDirection,
        gameStatus,
        captured: newCaptured,
      }),
    );
    dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
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
              }
              if (
                appState.validMoves?.find(
                  (m) => m[0] === realRank && m[1] === realFile,
                )
              ) {
                const selected = appState.selected;
                let isAttack = !!position[realRank][realFile];
                if (
                  !isAttack &&
                  selected &&
                  selected.piece &&
                  selected.piece.endsWith("pawn")
                ) {
                  const fromFile = selected.from?.[1];
                  if (fromFile !== undefined && fromFile !== realFile) {
                    isAttack = true;
                  }
                }
                if (
                  !isAttack &&
                  selected &&
                  selected.piece &&
                  selected.piece.endsWith("checkers")
                ) {
                  const fromRank = selected.from?.[0];
                  const fromFile = selected.from?.[1];
                  if (
                    fromRank !== undefined &&
                    fromFile !== undefined &&
                    Math.abs(realRank - fromRank) === 2 &&
                    Math.abs(realFile - fromFile) === 2
                  ) {
                    isAttack = true;
                  }
                }
                if (isAttack) {
                  tileClass += ` ${styles["attacking"]}`;
                } else {
                  tileClass += ` ${styles["highlight"]}`;
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
