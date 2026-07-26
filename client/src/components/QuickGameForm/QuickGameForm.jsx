import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "@mdi/react";
import { mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import styles from "./QuickGameForm.module.scss";
import actionTypes from "../../reducers/actionTypes";
import { useAppContext } from "../../contexts/Context";
import {
  initialCheckersGameState,
  initialChess960State,
  initialGameState,
  initialNewChess960State,
  initialNewVariantGameState,
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
  createCheckersPosition,
  createNewVariantPosition,
  createNewChess960Position,
} from "../../helpers";

const MODE_LABELS = {
  chess: "Chess",
  shatranj: "Shatranj",
  checkers_v2: "Checkers v2",
  new_chess: "New Chess",
  chess960: "Chess960",
  shatranj960: "Shatranj960",
  new_chess960: "New Chess960",
  custom: "Custom",
};

const QuickGameForm = ({ setWindowMode, setStart = () => { } }) => {
    const storedVariant = localStorage.getItem("chess_variant");
    const [gameMode, setGameMode] = useState(
        storedVariant === "special" ? "custom" : storedVariant || "chess",
    );
    const [type, setType] = useState("password");
    const [showPassword, setShowPassword] = useState(mdiEyeOutline);
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [timeType, setTimeType] = useState(1200);
    const navigate = useNavigate();
    const { appState, dispatch, socket } = useAppContext();
    const { t } = useTranslation();
    const user = useSelector((state) => state.users.user);
    const changeType = () => {
        if (type === "password") {
            setType("text");
            setShowPassword(mdiEyeOffOutline);
        } else {
            setType("password");
            setShowPassword(mdiEyeOutline);
        }
    };
    const getInitialStateByMode = (
        mode,
        boardSize = 8,
        whiteTime = timeType,
        blackTime = timeType,
    ) => {
        if (mode === "shatranj") {
            return {
                ...initialOldGameState,
                boardSize,
                position: [createOldPosition(boardSize)],
                whiteTime,
                blackTime,
            };
        }
        if (mode === "chess960") {
            return {
                ...initialChess960State,
                boardSize,
                position: [createChess960Position(boardSize)],
                whiteTime,
                blackTime,
            };
        }
        if (mode === "shatranj960") {
            return {
                ...initialShatranj960State,
                boardSize,
                position: [createShatranj960Position(boardSize)],
                whiteTime,
                blackTime,
            };
        }
        if (mode === "checkers_v2") {
            return {
                ...initialCheckersGameState,
                boardSize,
                position: [createCheckersPosition(boardSize)],
                whiteTime,
                blackTime,
            };
        }
        if (mode === "new_chess") {
            return {
                ...initialNewVariantGameState,
                boardSize,
                position: [createNewVariantPosition(boardSize)],
                whiteTime,
                blackTime,
            };
        }
        if (mode === "new_chess960") {
            return {
                ...initialNewChess960State,
                boardSize,
                position: [createNewChess960Position(boardSize)],
                whiteTime,
                blackTime,
            };
        }
        return {
            ...initialGameState,
            boardSize,
            position: [createPosition(boardSize)],
            whiteTime,
            blackTime,
        };
    };

    const getRoomInitialState = () => {
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
                        whiteTime: response.initialState?.whiteTime ?? timeType,
                        blackTime: response.initialState?.blackTime ?? timeType,
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

        socket.emit(
          "findQuickGame",
          {
            gameMode,
            whiteTime: timeType,
            blackTime: timeType,
            userRating: user.rating,
          },
          (response) => {
            if (!response.success) return;

            const roomId = response.create
              ? Math.random().toString(36).substring(7)
              : response.roomId;

            socket.emit(
              "joinGame",
              roomId,
              {
                gameMode,
                initialState: roomInitialState,
                userName: user.name,
                userAvatar: user.avatar,
                userId: user._id,
                userRating: user.rating,
                whiteTime: timeType,
                blackTime: timeType,
                isQuickGame: true,
              },
              (joinResponse) => {
                if (!joinResponse?.success) {
                  alert(
                    joinResponse?.error ||
                      "Не удалось присоединиться к комнате",
                  );
                  return;
                }

                applyRoomStateFromResponse(joinResponse, roomId, null);

                dispatch({
                  type: actionTypes.SET_ROOM_NAME,
                  payload: null,
                });
                setStart(false);
                setWindowMode(false);

                dispatch({
                  type: actionTypes.SET_ORIENTATION,
                  payload: joinResponse.side,
                });

                dispatch({
                  type: actionTypes.SET_MULTIPLAYER,
                  payload: {
                    isMultiplayer: true,
                    roomId,
                    whiteTime: timeType,
                    blackTime: timeType,
                  },
                });

                localStorage.setItem("chess_side", joinResponse.side);
                localStorage.setItem("chess_mode", "multiplayer");
                localStorage.setItem("chess_variant", gameMode);
                localStorage.setItem("gameMode", gameMode);
                localStorage.setItem("roomId", roomId);

                navigate("/games");
              },
            );
          },
        );
    }
  return (
    <div className={styles.wrapper}>
      <div>
        <h2>{t("header.find-room")}</h2>
        {localStorage.getItem("chess_variant") !== "special" && (
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
          >
            <option value="chess">{MODE_LABELS.chess}</option>
            <option value="shatranj">{MODE_LABELS.shatranj}</option>
            <option value="checkers_v2">{MODE_LABELS.checkers_v2}</option>
            <option value="new_chess">{MODE_LABELS.new_chess}</option>
            <option value="chess960">{MODE_LABELS.chess960}</option>
            <option value="shatranj960">{MODE_LABELS.shatranj960}</option>
            <option value="new_chess960">{MODE_LABELS.new_chess960}</option>
          </select>
        )}
        {localStorage.getItem("chess_variant") === "special" && (
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
          >
            <option value="custom">{MODE_LABELS.custom}</option>
          </select>
        )}
        <select
          value={timeType}
          onChange={(e) => setTimeType(Number(e.target.value))}
        >
          <option value={300}>5 min</option>
          <option value={600}>10 min</option>
          <option value={1200}>20 min</option>
          <option value={1800}>30 min</option>
        </select>
        <button onClick={handlePlayInRoom}>{t("header.find-game")}</button>
      </div>
    </div>
);
};
export default QuickGameForm;
