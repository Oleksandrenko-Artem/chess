import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useAppContext } from "../contexts/Context";
import actionTypes from "../reducers/actionTypes";
import {
  initialCheckersGameState,
  initialChess960State,
  initialGameState,
  initialNewVariantGameState,
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
  createCheckersPosition,
  createNewVariantPosition,
} from "../helpers";
import styles from "./Pages.module.scss";
import CapturedPieces from "../components/CapturedPieces/CapturedPieces";
import ChessBoard from "../components/ChessBoard/ChessBoard";
import GameInfoPanel from "../components/GameInfoPanel/GameInfoPanel";
import MovesList from "../components/MovesList/MovesList";
import Pagination from "./../components/Pagination/Pagination";
import FilterGameMode from "../components/FiltersPanel/FilterGameMode";
import { updateUserThunk } from "../store/usersSlice";
import CreateRoomWindow from "../components/CreateRoomWindow/CreateRoomWindow";

const MODE_LABELS = {
  chess: "Chess",
  shatranj: "Shatranj",
  chess960: "Chess960",
  shatranj960: "Shatranj960",
  checkers_v2: "Checkers v2",
  new_chess: "New Chess",
  custom: "Custom",
};
const MODE_ICONS = {
  chess: "/src/assets/icons/white_ferz.png",
  shatranj: "/src/assets/icons/white_elephant.png",
  chess960: "/src/assets/icons/chess_960.png",
  shatranj960: "/src/assets/icons/chess_960.png",
  checkers_v2: "/src/assets/icons/white_checkers.png",
  new_chess: "/src/assets/icons/white_knight.png",
  custom: "/src/assets/icons/custom.png",
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
  if (mode === "checkers_v2") {
    return {
      ...initialCheckersGameState,
      boardSize: 8,
      position: [createCheckersPosition(8)],
    };
  }
  if (mode === "new_chess") {
    return {
      ...initialNewVariantGameState,
      boardSize: 8,
      position: [createNewVariantPosition(8)],
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
  const reduxDispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.users.user);

  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState(5);
  const [filterMode, setFilterMode] = useState("all");
  const [gameMode, setGameMode] = useState(
    localStorage.getItem("game_mode") || "chess",
  );
  const [roomWindow, setRoomWindow] = useState(false);
  const [activeRooms, setActiveRooms] = useState([]);
  const [inputRoomId, setInputRoomId] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const [playerSide, setPlayerSide] = useState(null);
  const [playersCount, setPlayersCount] = useState(1);
  const [gameReady, setGameReady] = useState(false);

  const getEarlyExitLossUpdate = () => {
    if (!user?._id) return null;
    const mode =
      typeof window !== "undefined" ? localStorage.getItem("chess_mode") : null;
    const variant =
      typeof window !== "undefined"
        ? localStorage.getItem("chess_variant")
        : null;
    if (mode === "editor" || variant === "custom") return null;
    if (
      appState.status !== status.ongoing &&
      appState.status !== status.promotion
    ) {
      return null;
    }
    const updateValues = {
      loses: (user.loses || 0) + 1,
    };
    if (appState.isMultiplayer) {
      updateValues.multiLoses = (user.multiLoses || 0) + 1;
    }
    if (appState.isVsBot) {
      updateValues.botLoses = (user.botLoses || 0) + 1;
    }
    return updateValues;
  };

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
    if (!socket) return;

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
      if (info.roomName && info.roomName.trim()) {
        dispatch({
          type: actionTypes.SET_ROOM_NAME,
          payload: info.roomName,
        });
      }
      if (info.gameMode) {
        setGameMode(info.gameMode);
        localStorage.setItem("gameMode", info.gameMode);
        localStorage.setItem("chess_variant", info.gameMode);
        localStorage.setItem("chess_mode", "multiplayer");
      }

      if (info.playersCount === 2) {
        setGameReady(true);
      }
    };

    const onPlayersReady = (data) => {
      setPlayersCount(2);
      setGameReady(true);
      setTimeout(() => {
        setStart(true);
        dispatch({ type: actionTypes.START_TIMER });
      }, 2000);
      if (data.yourSide) {
        setPlayerSide(data.yourSide);
        localStorage.setItem("chess_side", data.yourSide);
        dispatch({ type: actionTypes.SET_ORIENTATION, payload: data.yourSide });
      }
      if (data.opponent) {
        dispatch({
          type: actionTypes.SET_OPPONENT,
          payload: { opponent: data.opponent },
        });
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

    const onPlayerTimedOut = (data) => {
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
          payload: {
            initialState: {
              ...data.initialState,
              isMultiplayer: true,
              roomId: appState?.roomId || localStorage.getItem("roomId"),
              roomName: appState?.roomName,
              isVsBot: false,
            },
          },
        });
        dispatch({
          type: actionTypes.SET_MULTIPLAYER,
          payload: {
            isMultiplayer: true,
            roomId:
              data.initialState?.roomId ||
              appState?.roomId ||
              localStorage.getItem("roomId"),
            whiteTime: data.initialState?.whiteTime,
            blackTime: data.initialState?.blackTime,
          },
        });
        if (data.initialState.gameMode) {
          localStorage.setItem("chess_variant", data.initialState.gameMode);
          localStorage.setItem("chess_mode", "multiplayer");
        }
        if (Array.isArray(data?.moves) && data.moves.length > 0) {
          data.moves.forEach((move) => {
            dispatch({ type: actionTypes.NEW_MOVE, payload: move });
          });
        }
      }
      dispatch({
        type: actionTypes.SET_ORIENTATION,
        payload: currentOrientation,
      });
      setGameReady(data?.playersCount === 2);
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
    socket.on("playerTimedOut", onPlayerTimedOut);
    socket.on("syncGameState", onSyncGameState);

    const savedRoom = localStorage.getItem("roomId");
    if (savedRoom && !appState?.isMultiplayer) {
      dispatch({
        type: actionTypes.SET_MULTIPLAYER,
        payload: {
          isMultiplayer: true,
          roomId: savedRoom,
          whiteTime: null,
          blackTime: null,
        },
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
      socket.off("playerTimedOut", onPlayerTimedOut);
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
    localStorage.setItem("chess_variant", mode);
    localStorage.setItem("chess_mode", "multiplayer");
  };

  const handleFindGame = () => {
    setRoomWindow(true);
  };
  const handleCloseRoom = () => {
    setRoomWindow(false);
  };
  const handleJoinRoomFromList = (room) => {
    if (!socket) return;
    setStart(false);
    let password =
      joinPassword && joinPassword.trim() ? joinPassword.trim() : null;
    if (room.hasPassword && !password) {
      const enteredPassword = window.prompt("Введите пароль комнаты");
      if (!enteredPassword) return;
      password = enteredPassword.trim();
    }
    const initialState = getInitialStateByMode(
      room.gameMode,
      appState?.boardSize || 8,
      room.whiteTime || null,
      room.blackTime || null,
    );
    console.log(room.whiteTime, room.blackTime);
    socket.emit(
      "joinGame",
      room.roomId,
      {
        gameMode: room.gameMode,
        password,
        initialState,
        userName: user?.name,
        userAvatar: user?.avatar,
        whiteTime: room.whiteTime ?? appState.whiteTime,
        blackTime: room.blackTime ?? appState.blackTime,
      },
      (response) => {
        if (!response?.success) {
          alert(response?.error || "Не удалось войти в комнату");
          return;
        }

        if (response?.initialState) {
          dispatch({
            type: actionTypes.RESET_GAME,
            payload: {
              initialState: {
                ...response.initialState,
                isMultiplayer: true,
                roomId: room.roomId,
                whiteTime:
                  response.initialState.whiteTime ??
                  room.whiteTime ??
                  appState.whiteTime,

                blackTime:
                  response.initialState.blackTime ??
                  room.blackTime ??
                  appState.blackTime,

                isVsBot: false,
              },
            },
          });
        } else {
          setGameState(room.gameMode);
        }
        if (Array.isArray(response?.moves) && response.moves.length > 0) {
          response.moves.forEach((move) => {
            dispatch({ type: actionTypes.NEW_MOVE, payload: move });
          });
        }

        setRoomWindow(false);
        dispatch({
          type: actionTypes.SET_MULTIPLAYER,
          payload: {
            isMultiplayer: true,
            roomId: room.roomId,

            whiteTime:
              response.initialState?.whiteTime ??
              room.whiteTime ??
              appState.whiteTime,

            blackTime:
              response.initialState?.blackTime ??
              room.blackTime ??
              appState.blackTime,
          },
        });
        localStorage.setItem("roomId", room.roomId);
        localStorage.setItem("chess_side", "black");
        localStorage.setItem("chess_variant", room.gameMode);
        localStorage.setItem("chess_mode", "multiplayer");
      },
    );
  };

  const handleExitGame = () => {
    const updateValues = getEarlyExitLossUpdate();
    if (updateValues) {
      reduxDispatch(updateUserThunk({ id: user._id, values: updateValues }));
    }
    if (socket && appState?.roomId) {
      socket.emit("leaveGame", { roomId: appState.roomId });
    }
    dispatch({
      type: actionTypes.SET_MULTIPLAYER,
      payload: {
        isMultiplayer: false,
        roomId: null,
        whiteTime: null,
        blackTime: null,
      },
    });
    localStorage.removeItem("roomId");
    localStorage.removeItem("gameMode");
    localStorage.removeItem("chess_side");
    setStart(false);
    setPlayersCount(1);
    setGameReady(false);
  };
  useEffect(() => {
    setPage(1);
  }, [activeRooms]);
  useEffect(() => {
    setPage(1);
  }, [filterMode]);
  useEffect(() => {
    setPage(1);
  }, [inputRoomId]);

  const filteredRooms = activeRooms
    .filter((room) => filterMode === "all" || room.gameMode === filterMode)
    .filter((room) => {
      if (!inputRoomId.trim()) return true;
      const searchTerm = inputRoomId.trim().toLowerCase();
      return (
        room.roomId.toLowerCase().includes(searchTerm) ||
        (room.roomName && room.roomName.toLowerCase().includes(searchTerm))
      );
    });
  const startIndex = (page - 1) * amount;
  const endIndex = startIndex + amount;

  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  return (
    <div className={styles["games-list-container"]}>
      {!start && !appState?.isMultiplayer && (
        <div className={styles["games-list-content"]}>
          <div className={styles["mode-selection"]}>
            <div>
              <input
                type="text"
                name="join-room-id"
                autoComplete="off"
                placeholder={` ${t("header.search-room")}`}
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
              />
              {!roomWindow && (
                <button onClick={handleFindGame}>
                  {t("header.create-game")}
                </button>
              )}
              {roomWindow && (
                <button onClick={handleCloseRoom}>
                  {t("header.close_room")}
                </button>
              )}
            </div>
            <div>
              <FilterGameMode mode={filterMode} setGameMode={setFilterMode} />
            </div>
          </div>
          {roomWindow ? (
            <div className={styles["create-room-window"]}>
              <CreateRoomWindow
                setRoomWindow={setRoomWindow}
                setStart={setStart}
              />
            </div>
          ) : currentRooms.length === 0 ? (
            <p className={styles["no-active-games"]}>
              {inputRoomId.trim()
                ? t("header.no-rooms-found")
                : t("header.no-active-rooms")}
            </p>
          ) : (
            <div className={styles["active-rooms-list"]}>
              {currentRooms.map((room) => (
                <div
                  key={room.roomId}
                  onClick={() => handleJoinRoomFromList(room)}
                  className={styles["room-card"]}
                >
                  <div className={styles["room-info"]}>
                    <div>
                      <img
                        src={MODE_ICONS[room.gameMode]}
                        alt={room.gameMode}
                      />
                      <h4>
                        {room.roomName && room.roomName.trim()
                          ? room.roomName
                          : `${t("header.game-room")} ${room.roomId}`}
                        {room.hasPassword ? " 🔒" : ""}
                      </h4>
                    </div>
                    <div>
                      <p>
                        {t("header.game-mode")}{" "}
                        {MODE_LABELS[room.gameMode] || room.gameMode}
                      </p>
                      <p>
                        {t("header.game-players")} {room.playersCount}/2
                      </p>
                      <p>
                        {t("header.game-created-at")}{" "}
                        {new Date(room.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {activeRooms.length > 0 && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  total={filteredRooms.length}
                  amount={amount}
                  setAmount={setAmount}
                />
              )}
            </div>
          )}
        </div>
      )}
      {!start && appState?.isMultiplayer && (
        <div className={styles["room-waiting"]}>
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
