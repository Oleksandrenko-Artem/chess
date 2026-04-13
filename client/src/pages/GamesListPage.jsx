import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../contexts/Context";
import actionTypes from "../reducers/actionTypes";
import {
  initialChess960State,
  initialGameState,
  initialOldGameState,
  initialShatranj960State,
  initialSpecialGameState,
  status,
} from "../constants";
import {
  createPosition,
  createOldPosition,
  createSpecialPosition,
  createChess960Position,
  createShatranj960Position,
} from "../helpers";
import styles from "./Pages.module.scss";
import CapturedPieces from "../components/CapturedPieces/CapturedPieces";
import ChessBoard from "../components/ChessBoard/ChessBoard";
import GameInfoPanel from "../components/GameInfoPanel/GameInfoPanel";
import MovesList from "../components/MovesList/MovesList";

const MODE_LABELS = {
  chess: "Chess",
  shatranj: "Shatranj",
  chess960: "Chess960",
  shatranj960: "Shatranj960",
};

const getInitialStateByMode = (mode, boardSize = 8) => {
  if (mode === "shatranj") {
    return {
      ...initialOldGameState,
      boardSize: 8,
      position: [createOldPosition(8)],
    };
  }
  if (mode === "chess960") {
    return {
      ...initialChess960State,
      boardSize: 8,
      position: [createChess960Position(8)],
    };
  }
  if (mode === "shatranj960") {
    return {
      ...initialShatranj960State,
      boardSize: 8,
      position: [createShatranj960Position(8)],
    };
  }
  if (mode === "custom") {
    return {
      ...initialSpecialGameState,
      boardSize,
      position: [createSpecialPosition(boardSize)],
    };
  }
  return {
    ...initialGameState,
    boardSize: 8,
    position: [createPosition(8)],
  };
};

const GamesListPage = ({ start, setStart }) => {
  const { appState, dispatch, socket } = useAppContext();
  const { t } = useTranslation();

  const [gameMode, setGameMode] = useState("chess");
  const [activeRooms, setActiveRooms] = useState([]);
  const [inputRoomId, setInputRoomId] = useState("");
  const [playerSide, setPlayerSide] = useState(null);
  const [playersCount, setPlayersCount] = useState(1);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const onMoveMade = (movePayload) => {
      if (
        appState.position.some(
          (pos) =>
            JSON.stringify(pos) === JSON.stringify(movePayload.newPosition),
        )
      ) {
        return;
      }
      dispatch({ type: actionTypes.NEW_MOVE, payload: movePayload });
    };

    socket.on("moveMade", onMoveMade);
    return () => {
      socket.off("moveMade", onMoveMade);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!socket || appState?.isMultiplayer) return;

    const onActiveRooms = (rooms) => {
      setActiveRooms(rooms);
    };

    socket.on("activeRooms", onActiveRooms);
    socket.emit("getActiveRooms");

    const interval = setInterval(() => {
      socket.emit("getActiveRooms");
    }, 5000);

    return () => {
      clearInterval(interval);
      socket.off("activeRooms", onActiveRooms);
    };
  }, [socket, appState?.isMultiplayer]);

  useEffect(() => {
    if (!socket) return;

    const onGameInfo = (info) => {
      setPlayerSide(info.side || null);
      setPlayersCount(info.playersCount || 1);

      if (info.gameMode) {
        setGameMode(info.gameMode);
        localStorage.setItem("gameMode", info.gameMode);

        if (info.gameMode !== "custom") {
          const state = getInitialStateByMode(
            info.gameMode,
            appState?.boardSize || 8,
          );
          dispatch({
            type: actionTypes.RESET_GAME,
            payload: { initialState: state },
          });
        }
      }

      if (info.playersCount === 2) {
        setGameReady(true);
      }
    };

    const onPlayersReady = (data) => {
      setPlayersCount(2);
      setGameReady(true);
      setTimeout(() => setStart(true), 2000);
      if (data.yourSide) {
        setPlayerSide(data.yourSide);
        localStorage.setItem("chess_side", data.yourSide);
        dispatch({ type: actionTypes.SET_ORIENTATION, payload: data.yourSide });
      }
    };

    const onPlayerWaiting = (data) => {
      setPlayersCount(data.playersCount || 1);
      setGameReady(false);
    };

    const onPlayerDisconnected = () => {
      setGameReady(false);
      setPlayersCount(1);
    };

    const onOpponentDisconnected = () => {
      if (playerSide && appState?.status === status.ongoing) {
        dispatch({ type: actionTypes.SET_STATUS, payload: status[playerSide] });
      }
      setPlayersCount(1);
      setGameReady(false);
    };

    const onPlayerReconnected = (data) => {
      setPlayersCount(data?.playersCount || 1);
      if (data?.playersCount === 2) {
        setGameReady(true);
      } else {
        setGameReady(false);
      }
    };

    const onOpponentLeft = (data) => {
      if (data?.winner && appState?.status === status.ongoing) {
        dispatch({
          type: actionTypes.SET_STATUS,
          payload: status[data.winner],
        });
      }
      setGameReady(false);
      setPlayersCount(1);
    };

    const onSyncGameState = (data) => {
      const currentOrientation = localStorage.getItem("chess_side") || "white";
      if (data?.initialState) {
        dispatch({
          type: actionTypes.RESET_GAME,
          payload: { initialState: data.initialState },
        });
      }
      dispatch({
        type: actionTypes.SET_ORIENTATION,
        payload: currentOrientation,
      });
      if (Array.isArray(data?.moves) && data.moves.length > 0) {
        data.moves.forEach((move) => {
          dispatch({ type: actionTypes.NEW_MOVE, payload: move });
        });
        setGameReady(true);
      }
      else {
        setGameReady(false);
      }
    };

    socket.on("gameInfo", onGameInfo);
    socket.on("playersReady", onPlayersReady);
    socket.on("playerWaiting", onPlayerWaiting);
    socket.on("playerJoined", (data) =>
      setPlayersCount(data.playersCount || 1),
    );
    socket.on("playerDisconnected", onPlayerDisconnected);
    socket.on("opponentDisconnected", onOpponentDisconnected);
    socket.on("playerReconnected", onPlayerReconnected);
    socket.on("opponentLeft", onOpponentLeft);
    socket.on("syncGameState", onSyncGameState);

    const savedRoom = localStorage.getItem("roomId");
    if (savedRoom && !appState?.isMultiplayer) {
      dispatch({
        type: actionTypes.SET_MULTIPLAYER,
        payload: { isMultiplayer: true, roomId: savedRoom },
      });
      socket.emit("reconnectGame", { roomId: savedRoom });
    }

    return () => {
      socket.off("gameInfo", onGameInfo);
      socket.off("playersReady", onPlayersReady);
      socket.off("playerWaiting", onPlayerWaiting);
      socket.off("playerJoined");
      socket.off("playerDisconnected", onPlayerDisconnected);
      socket.off("opponentDisconnected", onOpponentDisconnected);
      socket.off("playerReconnected", onPlayerReconnected);
      socket.off("opponentLeft", onOpponentLeft);
      socket.off("syncGameState", onSyncGameState);
    };
  }, [
    socket,
    dispatch,
    appState?.isMultiplayer,
    appState?.boardSize,
    setStart,
  ]);

  const setGameState = (mode) => {
    const state = getInitialStateByMode(mode, appState?.boardSize || 8);
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: { ...state, isVsBot: false } },
    });
    localStorage.setItem("gameMode", mode);
    localStorage.setItem("chess_variant", "multiplayer");
    localStorage.removeItem("chess_mode");
  };

  const handleFindGame = () => {
    const roomId = Math.random().toString(36).substring(7);
    const initialState = getInitialStateByMode(
      gameMode,
      appState?.boardSize || 8,
    );
    setGameState(gameMode);
    dispatch({
      type: actionTypes.SET_MULTIPLAYER,
      payload: { isMultiplayer: true, roomId },
    });
    dispatch({
      type: actionTypes.SET_VS_BOT,
      payload: false,
    });
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("gameMode", gameMode);
    localStorage.setItem("chess_side", "white");
    socket.emit("joinGame", roomId, { gameMode, initialState });
  };

  const handleJoinGame = () => {
    const roomId = inputRoomId.trim();
    if (!roomId || !socket) return;
    const initialState = getInitialStateByMode(
      gameMode,
      appState?.boardSize || 8,
    );
    setGameState(gameMode);
    dispatch({
      type: actionTypes.SET_MULTIPLAYER,
      payload: { isMultiplayer: true, roomId },
    });
    dispatch({
      type: actionTypes.SET_VS_BOT,
      payload: false,
    });
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("gameMode", gameMode);
    localStorage.setItem("chess_side", "black");
    socket.emit("joinGame", roomId, { gameMode, initialState });
    setInputRoomId("");
  };

  const handleJoinRoomFromList = (roomId) => {
    if (!socket) return;
    const initialState = getInitialStateByMode(
      gameMode,
      appState?.boardSize || 8,
    );
    setGameState(gameMode);
    dispatch({
      type: actionTypes.SET_MULTIPLAYER,
      payload: { isMultiplayer: true, roomId },
    });
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("chess_side", "black");
    socket.emit("joinGame", roomId, { gameMode, initialState });
  };

  const handleExitGame = () => {
    if (socket && appState?.roomId) {
      socket.emit("leaveGame", { roomId: appState.roomId });
    }
    dispatch({
      type: actionTypes.SET_MULTIPLAYER,
      payload: { isMultiplayer: false, roomId: null },
    });
    localStorage.removeItem("roomId");
    localStorage.removeItem("gameMode");
    localStorage.removeItem("chess_side");
    setStart(false);
    setPlayersCount(1);
    setGameReady(false);
  };

  return (
    <div className={styles["games-list-container"]}>
      {!start && !appState?.isMultiplayer && (
        <div className={styles["games-list-content"]}>
          <div className={styles["mode-selection"]}>
            <h3>{t("header.choose-mode")}</h3>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
            >
              <option value="chess">{MODE_LABELS.chess}</option>
              <option value="shatranj">{MODE_LABELS.shatranj}</option>
              <option value="chess960">{MODE_LABELS.chess960}</option>
              <option value="shatranj960">{MODE_LABELS.shatranj960}</option>
            </select>
            <button onClick={handleFindGame}>{t("header.create-game")}</button>
            <input
              type="text"
              placeholder={` ${t("header.enter-room-id")}`}
              value={inputRoomId}
              onChange={(e) => setInputRoomId(e.target.value)}
            />
            <button onClick={handleJoinGame}>{t("header.join-game")}</button>
          </div>
          {activeRooms.length === 0 ? (
            <p className={styles["no-active-games"]}>
              {t("header.no-active-rooms")}
            </p>
          ) : (
            <div className={styles["active-rooms-list"]}>
              {activeRooms.map((room) => (
                <div key={room.roomId} className={styles["room-card"]}>
                  <div className={styles["room-info"]}>
                    <h4>
                      {t("header.game-room")} {room.roomId}
                    </h4>
                    <p>
                      {t("header.game-mode")}{" "}
                      {MODE_LABELS[room.gameMode] || MODE_LABELS.chess}
                    </p>
                    <p>
                      {t("header.game-players")} {room.playersCount}/2
                    </p>
                    <p>
                      {t("header.game-created-at")}{" "}
                      {new Date(room.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinRoomFromList(room.roomId)}
                    className={styles["join-room-button"]}
                  >
                    {t("header.join-game")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!start && appState?.isMultiplayer && (
        <div className={styles["room-waiting"]}>
          <h2>
            {t("header.game-room")} {appState.roomId}
          </h2>
          <p>ID: {appState.roomId}</p>
          <p>
            {t("header.game-player-count")} {playersCount}/2
          </p>
          <p>
            {t("header.game-player-side")}{" "}
            {playerSide === "white"
              ? `${t("header.game-player-white")}`
              : playerSide === "black"
                ? `${t("header.game-player-black")}`
                : "-"}
          </p>
          <p>
            {playersCount === 2
              ? `${t("header.game-player-ready")}`
              : `${t("header.game-player-waiting")}`}
          </p>
          <button onClick={handleExitGame}>{t("header.game-exit")}</button>
        </div>
      )}

      <div className={styles.wrapper}>
        <GameInfoPanel
          status={appState?.status}
          start={start}
          setStart={setStart}
        />
        {start && (
          <div className={styles["chess-wrapper"]}>
            <ChessBoard status={appState?.status} />
            <div className={styles.control}>
              <CapturedPieces
                whiteCaptures={appState?.captured?.white || []}
                blackCaptures={appState?.captured?.black || []}
              />
              <MovesList />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesListPage;
