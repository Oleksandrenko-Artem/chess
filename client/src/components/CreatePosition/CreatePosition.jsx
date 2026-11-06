import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/Context";
import { useSelector, useDispatch } from "react-redux";
import { updateUserThunk } from "../../store/usersSlice";
import {
  BOARD_STYLES,
  initialGameState,
  initialFourPlayerGameState,
  initialNewVariantGameState,
  initialOldGameState,
  initialModernShatranjGameState,
  initialSpecialGameState,
  piecesArrayPromotion,
} from "../../constants";
import { rgbStringToHex } from "../../utils/color";
import { createSpecialPosition } from "../../helpers";
import {
  FOUR_PLAYER_COLORS,
  FOUR_PLAYER_NATIVE_PIECES,
  PLAYER_COLORS,
  getPlayerColorsInPosition,
  hasFourPlayerKing,
} from "../../helpers/fourPlayer";
import { isSoundEnabled, setSoundEnabled } from "../../helpers/playMoveSound";
import { imageMap } from '../../utils/chessIcons';
import delete_icon from '../../assets/icons/other/delete.png';
import actionTypes from "../../reducers/actionTypes";
import styles from "./CreatePosition.module.scss";

const CreatePosition = ({ roomWindow, setRoomWindow, onSelectPiece }) => {
  const { appState, dispatch } = useAppContext();
  const { t } = useTranslation();
  const isFourPlayer =
    localStorage.getItem("chess_variant") === "four_player_chess";
  const editorPieceColors = ["white", "black", ...FOUR_PLAYER_COLORS];
  const user = useSelector((state) => state.users.user);
  const dispatchRedux = useDispatch();
  const saveTimeoutRef = useRef();
  const [soundEnabled, setSoundEnabledState] = useState(isSoundEnabled());
  const [start, setStart] = useState("no");
  const [promotion, setPromotion] = useState(false);
  const storedOptions = JSON.parse(
    localStorage.getItem("promotion_options"),
  ) || ["ferz", "rook", "bishop", "horse"];
  const [promotionPieceOne, setPromotionPieceOne] = useState(storedOptions[0]);
  const [promotionPieceTwo, setPromotionPieceTwo] = useState(storedOptions[1]);
  const [promotionPieceThree, setPromotionPieceThree] = useState(
    storedOptions[2],
  );
  const [promotionPieceFour, setPromotionPieceFour] = useState(
    storedOptions[3],
  );
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("chess_side") || null,
  );
  const [color, setColor] = useState(isFourPlayer ? "yellow" : "white");
  const [piecesStyle, setPiecesStyle] = useState("standart");
  const [preset, setPreset] = useState("custom");
  const [savedPresets, setSavedPresets] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const storedPresets = JSON.parse(
        localStorage.getItem("custom_position_presets") || "[]",
      );
      return Array.isArray(storedPresets) ? storedPresets : [];
    } catch (error) {
      return [];
    }
  });
  const DEFAULT_LIGHT_COLOR = "rgba(240, 216, 183, 1)";
  const DEFAULT_DARK_COLOR = "rgba(126, 85, 57, 1)";
  const DEFAULT_ARROW_COLOR = "rgba(255, 170, 0, 0.85)";
  const DEFAULT_SQUARE_COLOR = "rgba(0, 17, 255, 0.5)";
  const [lightSquareColor, setLightSquareColor] = useState(() =>
    user ? user.boardColor.light : DEFAULT_LIGHT_COLOR,
  );
  const [darkSquareColor, setDarkSquareColor] = useState(() =>
    user ? user.boardColor.dark : DEFAULT_DARK_COLOR,
  );
  const [arrowColor, setArrowColor] = useState(() =>
    user ? user.arrowColor : DEFAULT_ARROW_COLOR,
  );
  const [squareColor, setSquareColor] = useState(() =>
    user ? user.squareColor : DEFAULT_SQUARE_COLOR,
  );
  const savedStyle = localStorage.getItem("board_style");
  const arrowStyle = localStorage.getItem("arrowColor");
  const squareStyle = localStorage.getItem("squareColor");
  const editorMode = localStorage.getItem("chess_mode") === "editor";
  const newArrowColor = user?.arrowColor || DEFAULT_ARROW_COLOR;
  const newSquareColor = user?.squareColor || DEFAULT_SQUARE_COLOR;
  useEffect(() => {
    if (user) {
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
      } else if (arrowStyle) {
        document.documentElement.style.setProperty("--arrow-color", arrowStyle);
      } else if (squareStyle) {
        document.documentElement.style.setProperty(
          "--square-color",
          squareStyle,
        );
      } else {
        if (user.boardColor.light !== lightSquareColor) {
          const newLight = user.boardColor.light || DEFAULT_LIGHT_COLOR;
          setLightSquareColor(newLight);
          document.documentElement.style.setProperty(
            "--light-square-color",
            newLight,
          );
        }
        if (user.boardColor.dark !== darkSquareColor) {
          const newDark = user.boardColor.dark || DEFAULT_DARK_COLOR;
          setDarkSquareColor(newDark);
          document.documentElement.style.setProperty(
            "--dark-square-color",
            newDark,
          );
        }
        if (newArrowColor !== arrowColor) {
          setArrowColor(newArrowColor);
          document.documentElement.style.setProperty(
            "--arrow-color",
            newArrowColor,
          );
        }
        if (newSquareColor !== squareColor) {
          setSquareColor(newSquareColor);
          document.documentElement.style.setProperty(
            "--arrow-color",
            newSquareColor,
          );
        }
      }
      if (localStorage.getItem("chess_side") === appState.playerTurn) {
        const newSide = appState.playerTurn;
        localStorage.setItem("chess_side", newSide);
      }
    } else {
      setLightSquareColor(DEFAULT_LIGHT_COLOR);
      setDarkSquareColor(DEFAULT_DARK_COLOR);
      setArrowColor(DEFAULT_ARROW_COLOR);
      setSquareColor(DEFAULT_SQUARE_COLOR);
      localStorage.setItem("lightSquareColor", DEFAULT_LIGHT_COLOR);
      localStorage.setItem("darkSquareColor", DEFAULT_DARK_COLOR);
      localStorage.setItem("arrowColor", DEFAULT_ARROW_COLOR);
      localStorage.setItem("squareColor", DEFAULT_SQUARE_COLOR);
      localStorage.setItem("replaceRook", "rook");
      localStorage.setItem("chess_side", "white");
      document.documentElement.style.setProperty(
        "--light-square-color",
        DEFAULT_LIGHT_COLOR,
      );
      document.documentElement.style.setProperty(
        "--dark-square-color",
        DEFAULT_DARK_COLOR,
      );
      document.documentElement.style.setProperty(
        "--arrow-color",
        DEFAULT_ARROW_COLOR,
      );
      document.documentElement.style.setProperty(
        "--square-color",
        DEFAULT_SQUARE_COLOR,
      );
    }
  }, [user]);
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const lightHex =
        lightSquareColor && lightSquareColor.trim().startsWith("rgb")
          ? rgbStringToHex(lightSquareColor)
          : lightSquareColor;
      const darkHex =
        darkSquareColor && darkSquareColor.trim().startsWith("rgb")
          ? rgbStringToHex(darkSquareColor)
          : darkSquareColor;
      const arrowHex =
        arrowColor && arrowColor.trim().startsWith("rgb")
          ? rgbStringToHex(arrowColor)
          : arrowColor;
      const squareHex =
        squareColor && squareColor.trim().startsWith("rgb")
          ? rgbStringToHex(squareColor)
          : squareColor;
      if (user) {
        dispatchRedux(
          updateUserThunk({
            id: user._id,
            values: {
              boardColor: { light: lightHex, dark: darkHex },
              arrowColor: arrowHex,
              squareColor: squareHex,
            },
          }),
        );
      } else {
        localStorage.setItem("lightSquareColor", lightHex);
        localStorage.setItem("darkSquareColor", darkHex);
        localStorage.setItem("arrowColor", arrowHex);
        localStorage.setItem("squareColor", squareHex);
      }
    }, 500);
  }, [
    lightSquareColor,
    darkSquareColor,
    arrowColor,
    squareColor,
    user,
    dispatchRedux,
  ]);
  useEffect(() => {
    const initLight =
      lightSquareColor && lightSquareColor.trim().startsWith("rgb")
        ? rgbStringToHex(lightSquareColor)
        : lightSquareColor;
    const initDark =
      darkSquareColor && darkSquareColor.trim().startsWith("rgb")
        ? rgbStringToHex(darkSquareColor)
        : darkSquareColor;
    const initArrow =
      arrowColor && arrowColor.trim().startsWith("rgb")
        ? rgbStringToHex(arrowColor)
        : arrowColor;
    const initSquare =
      squareColor && squareColor.trim().startsWith("rgb")
        ? rgbStringToHex(squareColor)
        : squareColor;
    document.documentElement.style.setProperty(
      "--light-square-color",
      initLight,
    );
    document.documentElement.style.setProperty("--dark-square-color", initDark);
    document.documentElement.style.setProperty("--arrow-color", initArrow);
    document.documentElement.style.setProperty("--square-color", initSquare);
  }, []);
  const handleChangeColor = () => {
    const currentIndex = editorPieceColors.indexOf(color);
    setColor(
      editorPieceColors[
        (currentIndex + 1) % editorPieceColors.length
      ],
    );
  };
  const handleResetPosition = () => {
    localStorage.setItem("chess_mode", "editor");
    setStart("no");
    const resetState = isFourPlayer
      ? initialFourPlayerGameState
      : {
          ...initialSpecialGameState,
          position: [createSpecialPosition(appState.boardSize)],
          boardSize: appState.boardSize,
        };
    if (isFourPlayer) {
      localStorage.setItem("chess_side", resetState.playerTurn);
      setSelectedColor(resetState.playerTurn);
      setColor(resetState.playerTurn);
    }
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: resetState },
    });
  };
  const handleResetBoardColors = () => {
    setLightSquareColor(DEFAULT_LIGHT_COLOR);
    setDarkSquareColor(DEFAULT_DARK_COLOR);
    document.documentElement.style.setProperty(
      "--light-square-color",
      DEFAULT_LIGHT_COLOR,
    );
    document.documentElement.style.setProperty(
      "--dark-square-color",
      DEFAULT_DARK_COLOR,
    );
  };
  const handleResetArrowColors = () => {
    setArrowColor(DEFAULT_ARROW_COLOR);
    document.documentElement.style.setProperty(
      "--arrow-color",
      DEFAULT_ARROW_COLOR,
    );
  };
  const handleResetSquareColors = () => {
    setSquareColor(DEFAULT_SQUARE_COLOR);
    document.documentElement.style.setProperty(
      "--square-color",
      DEFAULT_SQUARE_COLOR,
    );
  };
  const handlePiecesChange = (event) => {
    setPiecesStyle(event.target.value);
  };
  const handlePieceClick = (event) => {
    const image = event.target.closest("img");
    if (!image) return;

    let piece = image.alt;
    if (!piece) return;

    onSelectPiece?.(piece);
  };
  const presetsMap = {
    chess: initialGameState,
    shatranj: initialOldGameState,
    new_chess: initialNewVariantGameState,
    shatranj_modern: initialModernShatranjGameState,
    four_player_chess: initialFourPlayerGameState,
  };
  const deletePreset = (id) => {
    if (!window.confirm(`${t("custom_panel.delete_preset")}`)) return;

    const presets = JSON.parse(
      localStorage.getItem("custom_position_presets") || "[]",
    );

    const newPresets = presets.filter((p) => p.id !== id);

    localStorage.setItem("custom_position_presets", JSON.stringify(newPresets));

    setSavedPresets(newPresets);

    dispatch({
      type: actionTypes.RESET_GAME,
      payload: {
        initialState: isFourPlayer
          ? initialFourPlayerGameState
          : {
              ...initialSpecialGameState,
              position: [createSpecialPosition(appState.boardSize)],
              boardSize: appState.boardSize,
            },
      },
    });
  };
  const handleSaveCustomPreset = () => {
    const name = prompt(t("custom_panel.enter_position"));

    if (!name) return;
    const currentPosition = JSON.parse(
      JSON.stringify(appState?.position || []),
    );
    const savedPresetList = JSON.parse(
      localStorage.getItem("custom_position_presets") || "[]",
    );
    const nextPreset = {
      id: `saved_custom_${Date.now()}`,
      label: name,
      boardSize: appState?.boardSize || 8,
      position: currentPosition,
      playerTurn: appState?.playerTurn || "white",
      orientation: appState?.orientation || "white",
      gameVariant: localStorage.getItem("chess_variant") || "special",
    };
    const updatedPresets = [...savedPresetList, nextPreset];
    localStorage.setItem(
      "custom_position_presets",
      JSON.stringify(updatedPresets),
    );
    setSavedPresets(updatedPresets);
    setPreset(nextPreset.id);
  };
  const handleChangePreset = (e) => {
    const val = e.target.value;
    setPreset(val);

    if (val.startsWith("saved_custom_")) {
      const savedPreset = savedPresets.find(
        (presetItem) => presetItem.id === val,
      );
      if (!savedPreset) return;

      const gameVariant = savedPreset.gameVariant || "special";
      const baseState =
        gameVariant === "four_player_chess"
          ? initialFourPlayerGameState
          : initialSpecialGameState;
      const restoredState = {
        ...baseState,
        boardSize: savedPreset.boardSize,
        position: JSON.parse(JSON.stringify(savedPreset.position || [])),
        playerTurn: savedPreset.playerTurn || baseState.playerTurn,
        orientation: savedPreset.orientation || baseState.orientation,
        validMoves: [],
        selected: null,
        promotionSquare: null,
        status: baseState.status,
        movesList: [],
        captured:
          gameVariant === "four_player_chess"
            ? { yellow: [], blue: [], green: [], red: [] }
            : { white: [], black: [] },
      };

      localStorage.setItem("chess_variant", gameVariant);
      localStorage.removeItem("chess_rules_variant");
      localStorage.removeItem("chess_player_colors");
      localStorage.setItem(
        "chess_side",
        savedPreset.playerTurn || baseState.playerTurn,
      );
      setSelectedColor(savedPreset.playerTurn || baseState.playerTurn);
      setColor(savedPreset.playerTurn || baseState.playerTurn);
      localStorage.setItem("chess_mode", "editor");
      setStart("no");
      dispatch({
        type: actionTypes.RESET_GAME,
        payload: { initialState: restoredState },
      });
      return;
    }

    const initialState = presetsMap[val] || initialSpecialGameState;
    const gameVariant = val === "custom" ? "special" : val;
    const selectedSide = initialState.playerTurn || "white";
    localStorage.setItem("chess_variant", gameVariant);
    localStorage.removeItem("chess_rules_variant");
    localStorage.removeItem("chess_player_colors");
    localStorage.setItem("chess_side", selectedSide);
    setSelectedColor(selectedSide);
    setColor(selectedSide);
    localStorage.setItem("chess_mode", "editor");
    setStart("no");
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState } });
  };
  const isKingPiece = (piece, color) => {
    if (typeof piece !== "string") return false;

    const cleanPiece = piece.split(",")[0];

    return (
      cleanPiece.startsWith(color) &&
      (cleanPiece.endsWith("king") || cleanPiece.endsWith("imperator"))
    );
  };
  const hasKingForColor = (playerColor) => {
    const position = appState?.position?.at(-1) || [];
    return position.flat(Infinity).some((piece) => isKingPiece(piece, playerColor));
  };
  const handleSelectPlayerColor = (playerColor) => {
    if (!hasKingForColor(playerColor)) return;

    setColor(playerColor);
    setSelectedColor(playerColor);
    localStorage.setItem("chess_side", playerColor);
    dispatch({
      type: actionTypes.SET_PLAYER_TURN,
      payload: playerColor,
    });
  };

  const hasValidKingSetup = () => {
    const position = appState?.position || [];
    const currentPosition = position.at(-1) || [];
    const activePlayers = getPlayerColorsInPosition(currentPosition);
    return activePlayers.length >= 2 && activePlayers.length <= 6;
  };
  const hasValidRoomSetup = () => {
    const currentPosition = appState?.position?.at(-1) || [];
    const playerCount = getPlayerColorsInPosition(currentPosition).length;
    return playerCount >= 2 && playerCount <= 6;
  };

  const handleStartVariant = () => {
    const position = appState?.position?.at(-1) || [];
    const playerColors = getPlayerColorsInPosition(position);
    const isClassicFourPlayerSetup =
      playerColors.length === FOUR_PLAYER_COLORS.length &&
      FOUR_PLAYER_COLORS.every((playerColor) =>
        playerColors.includes(playerColor),
      );
    const isStandardTwoPlayerSetup =
      playerColors.length === 2 &&
      playerColors.includes("white") &&
      playerColors.includes("black");
    const usesCustomPlayerRules =
      !isClassicFourPlayerSetup && !isStandardTwoPlayerSetup;
    const gameVariant = isClassicFourPlayerSetup
      ? "four_player_chess"
      : usesCustomPlayerRules
        ? "custom"
        : localStorage.getItem("chess_variant");
    const availableSides = isClassicFourPlayerSetup
      ? FOUR_PLAYER_COLORS
      : playerColors;
    const userSide = [
      selectedColor,
      localStorage.getItem("chess_side"),
      playerColors[0],
    ].find((candidate) => availableSides.includes(candidate));

    localStorage.setItem("chess_variant", gameVariant);
    localStorage.setItem("chess_side", userSide);
    if (usesCustomPlayerRules) {
      localStorage.setItem("chess_rules_variant", "custom_multiplayer");
      localStorage.setItem(
        "chess_player_colors",
        JSON.stringify(playerColors),
      );
    } else {
      localStorage.removeItem("chess_player_colors");
      if (isClassicFourPlayerSetup) {
        localStorage.setItem("chess_rules_variant", "four_player_chess");
      } else {
        localStorage.removeItem("chess_rules_variant");
      }
    }
    dispatch({ type: actionTypes.SET_PLAYER_TURN, payload: userSide });
    dispatch({ type: actionTypes.SET_ORIENTATION, payload: userSide });
    localStorage.setItem("chess_mode", "game");
    setStart("yes");
    dispatch({ type: actionTypes.SET_VS_BOT, payload: { isVsBot: true } });
  };
  const handlePlayInRoom = () => {
    setRoomWindow(true);
  };
  const handleCloseRoom = () => {
    setRoomWindow(false);
  };
  const handleToggle = () => {
    dispatch({ type: actionTypes.TOGGLE_ORIENTATION });
  };
  const handleChangePromotion = () => {
    setPromotion(!promotion);
    localStorage.setItem(
      "promotion_options",
      JSON.stringify([
        promotionPieceOne,
        promotionPieceTwo,
        promotionPieceThree,
        promotionPieceFour,
      ]),
    );
  };
  const handleChangeBoardSize = (e) => {
    if (isFourPlayer) return;
    const newSize = parseInt(e.target.value, 10);
    dispatch({ type: actionTypes.SET_BOARD_SIZE, payload: newSize });
    if (typeof window !== "undefined") {
      localStorage.setItem("boardSize", newSize.toString());
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles["btns-div"]}>
        <div>
          <select
            value={piecesStyle}
            onChange={handlePiecesChange}
            disabled={isFourPlayer || promotion || start === "yes"}
          >
            <option value="standart">
              {t("custom_panel.standart_pieces")}
            </option>
            <option value="old">{t("custom_panel.old_pieces")}</option>
            <option value="special">{t("custom_panel.special_pieces")}</option>
            <option value="other">{t("custom_panel.other")}</option>
          </select>
          <select
            value={preset}
            onChange={handleChangePreset}
            disabled={start === "yes"}
          >
            <option value="custom">{t("header.custom_position")}</option>
            {savedPresets.map((presetItem) => (
              <option key={presetItem.id} value={presetItem.id}>
                {presetItem.label}
              </option>
            ))}
            <option value="chess">{t("header.chess")}</option>
            <option value="shatranj">{t("header.shatranj")}</option>
            <option value="new_chess">{t("header.new_chess")}</option>
            <option value="shatranj_modern">
              {t("header.shatranj-modern")}
            </option>
            <option value="four_player_chess">
              {t("header.four-player-chess")}
            </option>
          </select>
          <button type="button" onClick={handleSaveCustomPreset}>
            {t("custom_panel.save_position")}
          </button>
          <button
            type="button"
            onClick={() => deletePreset(preset)}
            disabled={!preset.startsWith("saved_custom_")}
          >
            {t("custom_panel.delete_position")}
          </button>
          <select
            value={appState.boardSize}
            onChange={handleChangeBoardSize}
            className={styles["board-size-select"]}
            disabled={isFourPlayer || start === "yes"}
          >
            <option value={8}>8x8</option>
            <option value={10}>10x10</option>
            <option value={12}>12x12</option>
            <option value={14}>14x14</option>
          </select>
          <button onClick={handleChangeColor} disabled={start === "yes"}>
            {t("custom_panel.change_color")}
          </button>
          <button onClick={handleToggle}>
            {t("custom_panel.rotate_board")}
          </button>
          {start === "no" && (
            <>
              <button
                onClick={handleStartVariant}
                disabled={!hasValidKingSetup() || roomWindow}
              >
                {t("custom_panel.play_vs_bot")}
              </button>
              {!roomWindow && (
                <button
                  onClick={handlePlayInRoom}
                  disabled={!hasValidRoomSetup()}
                >
                  {t("custom_panel.play_in_room")}
                </button>
              )}
              {roomWindow && (
                <button onClick={handleCloseRoom}>
                  {t("header.close_room")}
                </button>
              )}
            </>
          )}
          {start === "yes" && (
            <button onClick={handleResetPosition}>
              {t("custom_panel.reset_position")}
            </button>
          )}
          <input
            type="color"
            value={lightSquareColor}
            onChange={(e) => {
              const val = e.target.value;
              setLightSquareColor(val);
              document.documentElement.style.setProperty(
                "--light-square-color",
                val,
              );
              localStorage.setItem("boardStyle", "custom");
            }}
          />
          <input
            type="color"
            value={darkSquareColor}
            onChange={(e) => {
              const val = e.target.value;
              setDarkSquareColor(val);
              document.documentElement.style.setProperty(
                "--dark-square-color",
                val,
              );
              localStorage.setItem("boardStyle", "custom");
            }}
          />
          <button
            onClick={handleResetBoardColors}
            className={styles["reset-colors-btn"]}
          >
            {t("custom_panel.reset_board_colors")}
          </button>
          <input
            type="color"
            value={arrowColor}
            onChange={(e) => {
              const val = e.target.value;
              setArrowColor(val);
              document.documentElement.style.setProperty("--arrow-color", val);
              localStorage.setItem("arrowColor", val);
            }}
          />
          <button
            onClick={handleResetArrowColors}
            className={styles["reset-colors-btn"]}
          >
            {t("custom_panel.reset_arrow_colors")}
          </button>
          <input
            type="color"
            value={squareColor}
            onChange={(e) => {
              const val = e.target.value;
              setSquareColor(val);
              document.documentElement.style.setProperty("--square-color", val);
              localStorage.setItem("squareColor", val);
            }}
          />
          <button
            onClick={handleResetSquareColors}
            className={styles["reset-colors-btn"]}
          >
            {t("custom_panel.reset_square_colors")}
          </button>
          <button
            onClick={() => {
              const newValue = !soundEnabled;

              setSoundEnabledState(newValue);
              setSoundEnabled(newValue);
            }}
          >
            {soundEnabled
              ? `${t("custom_panel.sounds_on")}`
              : `${t("custom_panel.sounds_off")}`}
          </button>
        </div>
        <div className={styles["img-div"]}>
          {PLAYER_COLORS.filter(
            (playerColor) =>
              !isFourPlayer ||
              FOUR_PLAYER_COLORS.includes(playerColor) ||
              hasKingForColor(playerColor),
          ).map((playerColor) => {
            const hasKing = hasKingForColor(playerColor);
            return (
                <img
                  key={playerColor}
                  src={imageMap[`${playerColor}_king`]}
                  alt={`${playerColor}_king`}
                  aria-disabled={!hasKing}
                  className={`${styles["img-style"]} ${appState.playerTurn === playerColor ? styles["active"] : ""} ${!hasKing ? styles["unavailable"] : ""}`}
                  onClick={() => handleSelectPlayerColor(playerColor)}
                />
            );
          })}
          {imageMap[`${color}_ferz`] && (
            <img
              src={imageMap[`${color}_ferz`]}
              alt={`${color}_ferz`}
              className={styles["img-style"]}
              onClick={handleChangePromotion}
            />
          )}
        </div>
      </div>
      {(isFourPlayer || !["white", "black"].includes(color)) &&
        !promotion && (
        <div className={styles["piece-list"]} onClick={handlePieceClick}>
          <div>
            {FOUR_PLAYER_NATIVE_PIECES.map((pieceType) => {
              const piece = `${color}_${pieceType}`;
              return (
                <img
                  key={piece}
                  src={imageMap[piece]}
                  alt={piece}
                  draggable={editorMode}
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text", `${piece},isNew`)
                  }
                  className={pieceType === "pawn" ? styles.pawn : undefined}
                />
              );
            })}
          </div>
        </div>
      )}
      {!isFourPlayer &&
        color === "white" &&
        !promotion && (
        <div className={styles["piece-list"]} onClick={handlePieceClick}>
          {piecesStyle === "standart" && (
            <div>
              <img
                src={imageMap.white_pawn}
                alt="white_pawn"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_pawn,isNew`)
                }
                className={styles.pawn}
              />
              <img
                src={imageMap.white_horse}
                alt="white_horse"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", "white_horse,isNew")
                }
              />
              <img
                src={imageMap.white_bishop}
                alt="white_bishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_bishop,isNew`)
                }
              />
              <img
                src={imageMap.white_rook}
                alt="white_rook"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_rook,isNew`)
                }
              />
              <img
                src={imageMap.white_ferz}
                alt="white_ferz"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_ferz,isNew`)
                }
              />
              <img
                src={imageMap.white_king}
                alt="white_king"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_king,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "old" && (
            <div>
              <img
                src={imageMap.white_firzan}
                alt="white_firzan"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_firzan,isNew`)
                }
              />
              <img
                src={imageMap.white_wazir}
                alt="white_wazir"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_wazir,isNew`)
                }
              />
              <img
                src={imageMap.white_man}
                alt="white_man"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_man,isNew`)
                }
              />
              <img
                src={imageMap.white_chariot}
                alt="white_chariot"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_chariot"},isNew`)
                }
              />
              <img
                src={imageMap.white_alfil}
                alt="white_alfil"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_alfil,isNew`)
                }
              />
              <img
                src={imageMap.white_tank}
                alt="white_tank"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_tank,isNew`)
                }
              />
              <img
                src={imageMap.white_alibaba}
                alt="white_alibaba"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_alibaba,isNew`)
                }
              />
              <img
                src={imageMap.white_camel}
                alt="white_camel"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_camel,isNew`)
                }
              />
              <img
                src={imageMap.white_zebra}
                alt="white_zebra"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_zebra,isNew`)
                }
              />
              <img
                src={imageMap.white_lion}
                alt="white_lion"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_lion,isNew`)
                }
              />
              <img
                src={imageMap.white_rhino}
                alt="white_rhino"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_rhino,isNew`)
                }
              />
              <img
                src={imageMap.white_wildebeest}
                alt="white_wildebeest"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_wildebeest,isNew`)
                }
              />
              <img
                src={imageMap.white_giraffe}
                alt="white_giraffe"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_giraffe,isNew`)
                }
              />
              <img
                src={imageMap.white_rukh}
                alt="white_rukh"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_rukh,isNew`)
                }
              />
              <img
                src={imageMap.white_archbishop}
                alt="white_archbishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_archbishop,isNew`)
                }
              />
              <img
                src={imageMap.white_marshal}
                alt="white_marshal"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_marshal,isNew`)
                }
              />
              <img
                src={imageMap.white_amazon}
                alt="white_amazon"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_amazon,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "special" && (
            <div>
              <img
                src={imageMap.white_elephant}
                alt="white_elephant"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_elephant,isNew`)
                }
              />
              <img
                src={imageMap.white_advisor}
                alt="white_advisor"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_advisor,isNew`)
                }
              />
              <img
                src={imageMap.white_knight}
                alt="white_knight"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_knight,isNew`)
                }
              />
              <img
                src={imageMap.white_prince}
                alt="white_prince"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_prince,isNew`)
                }
              />
              <img
                src={imageMap.white_duke}
                alt="white_duke"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_duke,isNew`)
                }
              />
              <img
                src={imageMap.white_dinozavr}
                alt="white_dinozavr"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_dinozavr,isNew`)
                }
              />
              <img
                src={imageMap.white_checkers}
                alt="white_checkers"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_checkers,isNew`)
                }
              />
              <img
                src={imageMap.white_crown}
                alt="white_crown"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_crown,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "other" && (
            <div>
              <img
                src={imageMap.brick}
                alt="brick"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `brick,isNew`)
                }
              />
              <img
                src={delete_icon}
                alt="delete"
                draggable={editorMode}
                onDragStart={(e) => e.dataTransfer.setData("text", `,isNew`)}
              />
            </div>
          )}
        </div>
      )}
      {!isFourPlayer &&
        color === "black" &&
        !promotion && (
        <div className={styles["piece-list"]} onClick={handlePieceClick}>
          {piecesStyle === "standart" && (
            <div>
              <img
                src={imageMap.black_pawn}
                alt="black_pawn"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_pawn,isNew`)
                }
                className={styles.pawn}
              />
              <img
                src={imageMap.black_horse}
                alt="black_horse"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", "black_horse,isNew")
                }
              />
              <img
                src={imageMap.black_bishop}
                alt="black_bishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_bishop,isNew`)
                }
              />
              <img
                src={imageMap.black_rook}
                alt="black_rook"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_rook"},isNew`)
                }
              />
              <img
                src={imageMap.black_ferz}
                alt="black_ferz"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_ferz,isNew`)
                }
              />
              <img
                src={imageMap.black_king}
                alt="black_king"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_king,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "old" && (
            <div>
              <img
                src={imageMap.black_firzan}
                alt="black_firzan"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_firzan,isNew`)
                }
              />
              <img
                src={imageMap.black_wazir}
                alt="black_wazir"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_wazir,isNew`)
                }
              />
              <img
                src={imageMap.black_man}
                alt="black_man"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_man,isNew`)
                }
              />
              <img
                src={imageMap.black_chariot}
                alt="black_chariot"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_chariot"},isNew`)
                }
              />
              <img
                src={imageMap.black_alfil}
                alt="black_alfil"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_alfil,isNew`)
                }
              />
              <img
                src={imageMap.black_tank}
                alt="black_tank"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_tank,isNew`)
                }
              />
              <img
                src={imageMap.black_alibaba}
                alt="black_alibaba"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_alibaba,isNew`)
                }
              />
              <img
                src={imageMap.black_camel}
                alt="black_camel"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_camel,isNew`)
                }
              />
              <img
                src={imageMap.black_zebra}
                alt="black_zebra"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_zebra,isNew`)
                }
              />
              <img
                src={imageMap.black_lion}
                alt="black_lion"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_lion,isNew`)
                }
              />
              <img
                src={imageMap.black_rhino}
                alt="black_rhino"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_rhino,isNew`)
                }
              />
              <img
                src={imageMap.black_wildebeest}
                alt="black_wildebeest"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_wildebeest,isNew`)
                }
              />
              <img
                src={imageMap.black_giraffe}
                alt="black_giraffe"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_giraffe,isNew`)
                }
              />
              <img
                src={imageMap.black_rukh}
                alt="black_rukh"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_rukh,isNew`)
                }
              />
              <img
                src={imageMap.black_archbishop}
                alt="black_archbishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_archbishop,isNew`)
                }
              />
              <img
                src={imageMap.black_marshal}
                alt="black_marshal"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_marshal,isNew`)
                }
              />
              <img
                src={imageMap.black_amazon}
                alt="black_amazon"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_amazon,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "special" && (
            <div>
              <img
                src={imageMap.black_elephant}
                alt="black_elephant"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_elephant,isNew`)
                }
              />
              <img
                src={imageMap.black_advisor}
                alt="black_advisor"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_advisor,isNew`)
                }
              />
              <img
                src={imageMap.black_knight}
                alt="black_knight"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_knight,isNew`)
                }
              />
              <img
                src={imageMap.black_prince}
                alt="black_prince"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_prince,isNew`)
                }
              />
              <img
                src={imageMap.black_duke}
                alt="black_duke"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_duke,isNew`)
                }
              />
              <img
                src={imageMap.black_dinozavr}
                alt="black_dinozavr"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_dinozavr,isNew`)
                }
              />
              <img
                src={imageMap.black_checkers}
                alt="black_checkers"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_checkers,isNew`)
                }
              />
              <img
                src={imageMap.black_crown}
                alt="black_crown"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_crown,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "other" && (
            <div>
              <img
                src={imageMap.brick}
                alt="brick"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `brick,isNew`)
                }
              />
              <img
                src={delete_icon}
                alt="delete"
                draggable={editorMode}
                onDragStart={(e) => e.dataTransfer.setData("text", `,isNew`)}
              />
            </div>
          )}
        </div>
      )}
      {promotion && (
        <div className={styles["promotion-options"]}>
          <select
            value={promotionPieceOne}
            onChange={(e) => setPromotionPieceOne(e.target.value)}
          >
            {piecesArrayPromotion.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={promotionPieceTwo}
            onChange={(e) => setPromotionPieceTwo(e.target.value)}
          >
            {piecesArrayPromotion.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={promotionPieceThree}
            onChange={(e) => setPromotionPieceThree(e.target.value)}
          >
            {piecesArrayPromotion.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={promotionPieceFour}
            onChange={(e) => setPromotionPieceFour(e.target.value)}
          >
            {piecesArrayPromotion.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button onClick={handleChangePromotion}>
            {t("custom_panel.change_promotion")}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePosition;
