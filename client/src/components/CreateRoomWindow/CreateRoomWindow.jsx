import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./CreateRoomWindow.module.scss";
import actionTypes from "../../reducers/actionTypes";
import { useAppContext } from "../../contexts/Context";
import {
  initialChess960State,
  initialGameState,
  initialOldGameState,
  initialShatranj960State,
  initialSpecialGameState,
} from "../../constants";
import {
  createPosition,
  createOldPosition,
  createSpecialPosition,
  createChess960Position,
  createShatranj960Position,
} from "../../helpers";

const MODE_LABELS = {
  chess: "Chess",
  shatranj: "Shatranj",
  chess960: "Chess960",
  shatranj960: "Shatranj960",
  custom: "Custom",
};

const CreateRoomWindow = ({ setRoomWindow }) => {
  const [gameMode, setGameMode] = useState(
    localStorage.getItem("chess_variant") === "special" ? "custom" : "chess",
  );
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const navigate = useNavigate();
  const { appState, dispatch, socket } = useAppContext();
  const { t } = useTranslation();
  const user = useSelector((state) => state.users.user);

  const getInitialStateByMode = (mode, boardSize = 8) => {
    if (mode === "shatranj") {
      return {
        ...initialOldGameState,
        boardSize,
        position: [createOldPosition(boardSize)],
      };
    }
    if (mode === "chess960") {
      return {
        ...initialChess960State,
        boardSize,
        position: [createChess960Position(boardSize)],
      };
    }
    if (mode === "shatranj960") {
      return {
        ...initialShatranj960State,
        boardSize,
        position: [createShatranj960Position(boardSize)],
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
      boardSize,
      position: [createPosition(boardSize)],
    };
  };

  const getRoomInitialState = () => {
    if (gameMode === "custom" && appState?.position?.length) {
      return appState;
    }
    return getInitialStateByMode(gameMode, appState?.boardSize || 8);
  };

  const applyRoomStateFromResponse = (response, roomId, roomName) => {
    if (response?.initialState) {
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: {
          initialState: {
            ...response.initialState,
            isMultiplayer: true,
            roomId,
            roomName,
            isVsBot: false,
          },
        },
      });
    }
    if (Array.isArray(response?.moves) && response.moves.length > 0) {
      response.moves.forEach((move) => {
        dispatch({ type: actionTypes.NEW_MOVE, payload: move });
      });
    }
  };

  const handlePlayInRoom = () => {
    const roomInitialState = getRoomInitialState();

    if (!socket) return;

    const trimmedRoomName =
      roomName && roomName.trim() ? roomName.trim() : null;
    const trimmedPassword =
      roomPassword && roomPassword.trim() ? roomPassword.trim() : null;

    if (trimmedRoomName) {
      const searchPromise = new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve({ success: false });
        }, 5000);

        socket.once("findRoomByNameResponse", (response) => {
          clearTimeout(timeout);
          resolve(response);
        });

        socket.emit("findRoomByName", trimmedRoomName);
      });

      searchPromise.then((response) => {
        if (response?.success) {
          const foundRoomId = response.roomId;
          socket.emit(
            "joinGame",
            foundRoomId,
            {
              gameMode,
              roomName: trimmedRoomName,
              password: trimmedPassword,
              initialState: null,
              userName: user?.name,
              userAvatar: user?.avatar,
            },
            (joinResponse) => {
              if (!joinResponse?.success) {
                alert(
                  joinResponse?.error || "Не удалось присоединиться к комнате",
                );
                return;
              }

              applyRoomStateFromResponse(
                joinResponse,
                foundRoomId,
                trimmedRoomName,
              );

              dispatch({
                type: actionTypes.SET_ROOM_NAME,
                payload: trimmedRoomName,
              });
              setRoomWindow(false);
              dispatch({ type: actionTypes.SET_ORIENTATION, payload: "white" });
              dispatch({
                type: actionTypes.SET_MULTIPLAYER,
                payload: { isMultiplayer: true, roomId: foundRoomId },
              });

              localStorage.setItem("chess_mode", "game");
              localStorage.setItem("chess_variant", "multiplayer");
              localStorage.setItem("gameMode", gameMode);
              localStorage.setItem("roomId", foundRoomId);

              navigate("/games");
            },
          );
        } else {
          const roomId = Math.random().toString(36).substring(7);
          socket.emit(
            "joinGame",
            roomId,
            {
              gameMode,
              roomName: trimmedRoomName,
              password: trimmedPassword,
              initialState: {
                ...roomInitialState,
                roomName: trimmedRoomName,
                isMultiplayer: true,
                roomId,
              },
              userName: user?.name,
              userAvatar: user?.avatar,
            },
            (createResponse) => {
              if (!createResponse?.success) {
                alert(createResponse?.error || "Не удалось создать комнату");
                return;
              }

              applyRoomStateFromResponse(
                createResponse,
                roomId,
                trimmedRoomName,
              );

              dispatch({
                type: actionTypes.SET_ROOM_NAME,
                payload: trimmedRoomName,
              });
              setRoomWindow(false);
              dispatch({ type: actionTypes.SET_ORIENTATION, payload: "white" });
              dispatch({
                type: actionTypes.SET_MULTIPLAYER,
                payload: { isMultiplayer: true, roomId },
              });

              localStorage.setItem("chess_mode", "game");
              localStorage.setItem("chess_variant", "multiplayer");
              localStorage.setItem("gameMode", gameMode);
              localStorage.setItem("roomId", roomId);

              navigate("/games");
            },
          );
        }
      });
    } else {
      const roomId = Math.random().toString(36).substring(7);
      socket.emit(
        "joinGame",
        roomId,
        {
          gameMode,
          roomName: null,
          password: trimmedPassword,
          initialState: {
            ...roomInitialState,
            roomName: null,
            isMultiplayer: true,
            roomId,
          },
          userName: user?.name,
          userAvatar: user?.avatar,
        },
        (response) => {
          if (!response?.success) {
            alert(response?.error || "Не удалось создать комнату");
            return;
          }

          applyRoomStateFromResponse(response, roomId, null);

          setRoomWindow(false);
          dispatch({ type: actionTypes.SET_ORIENTATION, payload: "white" });
          dispatch({
            type: actionTypes.SET_MULTIPLAYER,
            payload: { isMultiplayer: true, roomId },
          });

          localStorage.setItem("chess_mode", "game");
          localStorage.setItem("chess_variant", "multiplayer");
          localStorage.setItem("gameMode", gameMode);
          localStorage.setItem("roomId", roomId);

          navigate("/games");
        },
      );
    }
  };
  return (
    <div className={styles.wrapper}>
      <h2>{t("header.creating-room")}</h2>
      {localStorage.getItem("chess_variant") !== "special" && (
        <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
          <option value="chess">{MODE_LABELS.chess}</option>
          <option value="shatranj">{MODE_LABELS.shatranj}</option>
          <option value="chess960">{MODE_LABELS.chess960}</option>
          <option value="shatranj960">{MODE_LABELS.shatranj960}</option>
        </select>
      )}
      {localStorage.getItem("chess_variant") === "special" && (
        <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
          <option value="custom">{MODE_LABELS.custom}</option>
        </select>
      )}
      <input
        type="text"
        name="room-name"
        autoComplete="off"
        placeholder={` ${t("header.room-name")}`}
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="password"
        name="room-password"
        autoComplete="new-password"
        placeholder={` ${t("header.room-password")}`}
        value={roomPassword}
        onChange={(e) => setRoomPassword(e.target.value)}
      />
      <button onClick={handlePlayInRoom}>{t("header.create-game")}</button>
    </div>
  );
};

export default CreateRoomWindow;
