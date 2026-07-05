import React, { useEffect, useState } from "react";
import { useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { reducer } from "./reducers/reducer";
import {
  BOARD_STYLES,
  initialChess960State,
  initialGameState,
  initialOldGameState,
  initialShatranj960State,
  initialSpecialGameState,
  initialCheckersGameState,
  status,
  initialNewVariantGameState,
  initialNewChess960State,
} from "./constants";
import { findUserAccountThunk } from "./store/usersSlice";
import actionTypes from "./reducers/actionTypes";
import Header from "./components/Header/Header";
import Homepage from "./pages/Homepage";
import ChessPage from "./pages/ChessPage";
import ShatranjPage from "./pages/ShatranjPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer/Footer";
import AppContext from "./contexts/Context";
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from "./components/forms/LoginForm";
import CreatePositionPage from "./pages/CreatePositionPage";
import ProfilePage from "./pages/ProfilePage";
import { getStoredColor } from "./utils/color";
import GamesListPage from "./pages/GamesListPage";
import {
  createPosition,
  createSpecialPosition,
  createOldPosition,
  createChess960Position,
  createShatranj960Position,
  createCheckersPosition,
  createNewVariantPosition,
  createNewChess960Position,
} from "./helpers";
import SinglePlayerPage from "./pages/SinglePlayerPage";
import Chess960Page from "./pages/Chess960Page";
import Shatranj960Page from "./pages/Shatranj960Page";
import CheckersPage from "./pages/CheckersPage";
import NewVariantChessPage from "./pages/NewVariantChessPage";
import NewVariantChess960Page from "./pages/NewVariantChess960Page";

function App() {
  const dispathUser = useDispatch();
  const savedBotState =
    typeof window !== "undefined" ? localStorage.getItem("botGameState") : null;
  const [start, setStart] = useState(Boolean(savedBotState));
  const savedVariant =
    typeof window !== "undefined"
      ? localStorage.getItem("chess_variant")
      : null;
  const savedMode =
    typeof window !== "undefined" ? localStorage.getItem("chess_mode") : null;
  const savedBoardSize =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("boardSize") || "8", 10)
      : 8;
  let initialStateAtLoad =
    savedVariant === "shatranj"
      ? initialOldGameState
      : savedVariant === "special"
        ? initialSpecialGameState
        : savedVariant === "chess960"
          ? initialChess960State
          : savedVariant === "shatranj960"
            ? initialShatranj960State
            : savedVariant === "checkers_v2"
              ? initialCheckersGameState
              : savedVariant === "new_chess"
                ? initialNewVariantGameState
                : savedVariant === "new_chess960"
                  ? initialNewChess960State
                  : initialGameState;

  if (savedMode === "editor") {
    initialStateAtLoad = {
      ...initialStateAtLoad,
      boardSize: savedBoardSize,
      position: [createSpecialPosition(savedBoardSize)],
    };
  } else {
    initialStateAtLoad = {
      ...initialStateAtLoad,
      boardSize: 8,
      position:
        savedVariant === "shatranj"
          ? [createOldPosition(8)]
          : savedVariant === "special"
            ? [createSpecialPosition(8)]
            : savedVariant === "chess960"
              ? [createChess960Position(8)]
              : savedVariant === "shatranj960"
                ? [createShatranj960Position(8)]
                : savedVariant === "checkers_v2"
                  ? [createCheckersPosition()]
                  : savedVariant === "new_chess"
                    ? [createNewVariantPosition(8)]
                    : savedVariant === "new_chess960"
                      ? [createNewChess960Position(8)]
                      : [createPosition(8)],
    };
  }

  if (savedBotState) {
    try {
      const parsedBotState = JSON.parse(savedBotState);
      if (parsedBotState && parsedBotState.isVsBot) {
        initialStateAtLoad = parsedBotState;
      }
    } catch {
      // ignore invalid saved state
    }
  }

  const [appState, dispatch] = useReducer(reducer, initialStateAtLoad);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isActiveBotGame =
      appState?.isVsBot &&
      !appState?.isMultiplayer &&
      start &&
      (appState.status === status.ongoing ||
        appState.status === status.promotion);

    if (isActiveBotGame) {
      localStorage.setItem("botGameState", JSON.stringify(appState));
      localStorage.setItem("chess_mode", "game");
    } else {
      localStorage.removeItem("botGameState");
    }
  }, [appState, start]);

  useEffect(() => {
    const serverUrl =
      "https://2d9b12e66a94ec39-95-47-113-228.serveousercontent.com";
    const newSocket = io(serverUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const handlePlayChess = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "chess");
      localStorage.removeItem("chess_mode");
      localStorage.removeItem("botGameState");
    }
    const newInitialState = {
      ...initialGameState,
      boardSize: 8,
      position: [createPosition(8)],
      isVsBot: true,
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlayShatranj = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "shatranj");
      localStorage.removeItem("chess_mode");
      localStorage.removeItem("botGameState");
    }
    const newInitialState = {
      ...initialOldGameState,
      boardSize: 8,
      position: [createOldPosition(8)],
      isVsBot: true,
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlayChess960 = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "chess960");
      localStorage.removeItem("chess_mode");
      localStorage.removeItem("botGameState");
    }
    const newInitialState = {
      ...initialChess960State,
      boardSize: 8,
      position: [createChess960Position(8)],
      isVsBot: true,
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlayShatranj960 = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "shatranj960");
      localStorage.removeItem("chess_mode");
      localStorage.removeItem("botGameState");
    }
    const newInitialState = {
      ...initialShatranj960State,
      boardSize: 8,
      position: [createShatranj960Position(8)],
      isVsBot: true,
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlayCheckers = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "checkers_v2");
      localStorage.removeItem("chess_mode");
      localStorage.removeItem("botGameState");
    }
    const newInitialState = {
      ...initialOldGameState,
      boardSize: 8,
      position: [createCheckersPosition(8)],
      isVsBot: true,
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlayNewVariantChess = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "new_chess");
      localStorage.removeItem("chess_mode");
      localStorage.removeItem("botGameState");
    }
    const newInitialState = {
      ...initialNewVariantGameState,
      boardSize: 8,
      position: [createNewVariantPosition(8)],
      isVsBot: true,
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlayNewVariantChess960 = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "new_chess960");
      localStorage.removeItem("chess_mode");
      localStorage.removeItem("botGameState");
    }
    const newInitialState = {
      ...initialNewChess960State,
      boardSize: 8,
      position: [createNewChess960Position(8)],
      isVsBot: true,
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlaySpecial = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_variant", "special");
      localStorage.setItem("chess_mode", "editor");
    }
    const currentBoardSize = appState.boardSize;
    const newInitialState = {
      ...initialSpecialGameState,
      boardSize: currentBoardSize,
      position: [createSpecialPosition(currentBoardSize)],
    };
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: newInitialState },
    });
  };
  const handlePlayMultiplayer = () => {
    setStart(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("chess_mode", "multiplayer");
      localStorage.removeItem("botGameState");
    }
  };
  const providerState = {
    appState,
    dispatch,
    socket,
  };
  const user = useSelector((state) => state.users.user);
  useEffect(() => {
    dispathUser(findUserAccountThunk());
  }, [dispathUser]);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const DEFAULT_LIGHT_COLOR = "#F0D8B7";
    const DEFAULT_DARK_COLOR = "#7e5539";

    const savedStyle = localStorage.getItem("boardStyle");

    if (savedStyle === "custom") {
      if (user) {
        const light = user.boardColor?.light || DEFAULT_LIGHT_COLOR;
        const dark = user.boardColor?.dark || DEFAULT_DARK_COLOR;

        document.documentElement.style.setProperty(
          "--light-square-color",
          light,
        );
        document.documentElement.style.setProperty("--dark-square-color", dark);
      }
      return;
    }

    if (savedStyle && BOARD_STYLES[savedStyle]) {
      const selected = BOARD_STYLES[savedStyle];
      document.documentElement.style.setProperty(
        "--light-square-color",
        selected.light,
      );
      document.documentElement.style.setProperty(
        "--dark-square-color",
        selected.dark,
      );
      return;
    }

    try {
      const light = getStoredColor("lightSquareColor", DEFAULT_LIGHT_COLOR);
      const dark = getStoredColor("darkSquareColor", DEFAULT_DARK_COLOR);

      document.documentElement.style.setProperty("--light-square-color", light);
      document.documentElement.style.setProperty("--dark-square-color", dark);
    } catch {
      document.documentElement.style.setProperty(
        "--light-square-color",
        DEFAULT_LIGHT_COLOR,
      );
      document.documentElement.style.setProperty(
        "--dark-square-color",
        DEFAULT_DARK_COLOR,
      );
    }
  }, [user]);
  return (
    <AppContext.Provider value={providerState}>
      <BrowserRouter>
        <Header
          onPlaySpecial={handlePlaySpecial}
          onPlayMultiplayer={handlePlayMultiplayer}
        />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route
            path="/play"
            element={
              <SinglePlayerPage
                onPlayChess={handlePlayChess}
                onPlayShatranj={handlePlayShatranj}
                onPlayChess960={handlePlayChess960}
                onPlayShatranj960={handlePlayShatranj960}
                onPlayCheckers={handlePlayCheckers}
                onPlayNewVariantChess={handlePlayNewVariantChess}
                onPlayNewVariantChess960={handlePlayNewVariantChess960}
              />
            }
          />
          <Route
            path="/games"
            element={<GamesListPage start={start} setStart={setStart} />}
          />
          <Route
            path="/play-chess"
            element={<ChessPage start={start} setStart={setStart} />}
          />
          <Route
            path="/play-shatranj"
            element={<ShatranjPage start={start} setStart={setStart} />}
          />
          <Route
            path="/play-chess960"
            element={<Chess960Page start={start} setStart={setStart} />}
          />
          <Route
            path="/play-shatranj960"
            element={<Shatranj960Page start={start} setStart={setStart} />}
          />
          <Route
            path="/play-checkers"
            element={<CheckersPage start={start} setStart={setStart} />}
          />
          <Route
            path="/play-new-variant-chess"
            element={<NewVariantChessPage start={start} setStart={setStart} />}
          />
          <Route
            path="/play-new-variant-chess960"
            element={<NewVariantChess960Page start={start} setStart={setStart} />}
          />
          <Route path="/create-position" element={<CreatePositionPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
