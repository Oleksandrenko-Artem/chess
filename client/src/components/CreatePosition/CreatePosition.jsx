import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/Context";
import { useSelector, useDispatch } from "react-redux";
import { updateUserThunk } from "../../store/usersSlice";
import {
  BOARD_STYLES,
  initialAmazonState,
  initialArenaGameState,
  initialDinoGameState,
  initialExtendedGameState,
  initialFerzVsRukhGameState,
  initialGameState,
  initialGrandAceDrexState,
  initialGrandChessState,
  initialGreatChessState,
  initialNewVariantGameState,
  initialOldGameState,
  initialOldVariantGameState,
  initialSpecialGameState,
  initialWallsGameState,
  piecesArrayPromotion,
} from "../../constants";
import { Icon } from "@mdi/react";
import { mdiArrowRightThin } from "@mdi/js";
import { rgbStringToHex } from "../../utils/color";
import actionTypes from "../../reducers/actionTypes";
import white_pawn from "../../assets/icons/white_soldier.png";
import white_horse from "../../assets/icons/white_horse.png";
import white_bishop from "../../assets/icons/white_bishop.png";
import white_rook from "../../assets/icons/white_rook.png";
import white_ferz from "../../assets/icons/white_ferz.png";
import white_king from "../../assets/icons/white_king.png";
import white_firzan from "../../assets/icons/white_firzan.png";
import white_elephant from "../../assets/icons/white_elephant.png";
import white_tank from "../../assets/icons/white_tank.png";
import white_camel from "../../assets/icons/white_camel.png";
import white_dinozavr from "../../assets/icons/white_dinozavr.png";
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
import black_pawn from "../../assets/icons/black_soldier.png";
import black_horse from "../../assets/icons/black_horse.png";
import black_bishop from "../../assets/icons/black_bishop.png";
import black_rook from "../../assets/icons/black_rook.png";
import black_ferz from "../../assets/icons/black_ferz.png";
import black_king from "../../assets/icons/black_king.png";
import black_firzan from "../../assets/icons/black_firzan.png";
import black_elephant from "../../assets/icons/black_elephant.png";
import black_tank from "../../assets/icons/black_tank.png";
import black_camel from "../../assets/icons/black_camel.png";
import black_dinozavr from "../../assets/icons/black_dinozavr.png";
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
import brick from "../../assets/icons/brick.png";
import delete_icon from "../../assets/icons/delete.png";
import styles from "./CreatePosition.module.scss";
import { createSpecialPosition } from "../../helpers";

const CreatePosition = ({ roomWindow, setRoomWindow }) => {
  const { appState, dispatch, socket } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const dispatchRedux = useDispatch();
  const saveTimeoutRef = useRef();
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
  const [color, setColor] = useState("white");
  const [piecesStyle, setPiecesStyle] = useState("standart");
  const [preset, setPreset] = useState("custom");
  const [pieceSailBoat, setPieceSailBoat] = useState(() =>
    user ? user.rookType === "sailboat" : false,
  );
  const [pieceChariot, setPieceChariot] = useState(() =>
    user ? user.rookType === "chariot" : false,
  );
  const DEFAULT_LIGHT_COLOR = "#F0D8B7";
  const DEFAULT_DARK_COLOR = "#7e5539";
  const [lightSquareColor, setLightSquareColor] = useState(() =>
    user ? user.boardColor.light : DEFAULT_LIGHT_COLOR,
  );
  const [darkSquareColor, setDarkSquareColor] = useState(() =>
    user ? user.boardColor.dark : DEFAULT_DARK_COLOR,
  );
  const savedStyle = localStorage.getItem("board_style");
  const editorMode = localStorage.getItem("chess_mode") === "editor";
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
      }
      if ((user.rookType === "sailboat") !== pieceSailBoat) {
        setPieceSailBoat(user.rookType === "sailboat");
      }
      if ((user.rookType === "chariot") !== pieceChariot) {
        setPieceChariot(user.rookType === "chariot");
      }
      if (localStorage.getItem("chess_side") === appState.playerTurn) {
        const newSide = appState.playerTurn;
        localStorage.setItem("chess_side", newSide);
      }
    } else {
      setLightSquareColor(DEFAULT_LIGHT_COLOR);
      setDarkSquareColor(DEFAULT_DARK_COLOR);
      setPieceSailBoat(false);
      setPieceChariot(false);
      localStorage.setItem("lightSquareColor", DEFAULT_LIGHT_COLOR);
      localStorage.setItem("darkSquareColor", DEFAULT_DARK_COLOR);
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
      if (user) {
        dispatchRedux(
          updateUserThunk({
            id: user._id,
            values: { boardColor: { light: lightHex, dark: darkHex } },
          }),
        );
      } else {
        localStorage.setItem("lightSquareColor", lightHex);
        localStorage.setItem("darkSquareColor", darkHex);
      }
    }, 500);
  }, [lightSquareColor, darkSquareColor, user, dispatchRedux]);
  useEffect(() => {
    const initLight =
      lightSquareColor && lightSquareColor.trim().startsWith("rgb")
        ? rgbStringToHex(lightSquareColor)
        : lightSquareColor;
    const initDark =
      darkSquareColor && darkSquareColor.trim().startsWith("rgb")
        ? rgbStringToHex(darkSquareColor)
        : darkSquareColor;
    document.documentElement.style.setProperty(
      "--light-square-color",
      initLight,
    );
    document.documentElement.style.setProperty("--dark-square-color", initDark);
  }, []);
  const handleChangeColor = () => {
    if (color === "white") {
      setColor("black");
    } else {
      setColor("white");
    }
  };
  const handleResetPosition = () => {
    localStorage.setItem("chess_mode", "editor");
    setStart("no");
    const resetState = {
      ...initialSpecialGameState,
      position: [createSpecialPosition(appState.boardSize)],
      boardSize: appState.boardSize,
    };
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
  const handleReplacePieceSailBoat = () => {
    const newVal = !pieceSailBoat;
    setPieceSailBoat(newVal);
    setPieceChariot(false);
    const newReplacement = newVal ? "sailboat" : "rook";
    if (user) {
      dispatchRedux(
        updateUserThunk({ id: user._id, values: { rookType: newReplacement } }),
      );
    } else {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("replaceRook", newReplacement);
        }
      } catch (e) {}
    }
    window.dispatchEvent(
      new CustomEvent("rook-replacement-changed", {
        detail: { replacement: newReplacement },
      }),
    );
  };
  const handleReplacePieceChariot = () => {
    const newVal = !pieceChariot;
    setPieceChariot(newVal);
    setPieceSailBoat(false);
    const newReplacement = newVal ? "chariot" : "rook";
    if (user) {
      dispatchRedux(
        updateUserThunk({ id: user._id, values: { rookType: newReplacement } }),
      );
    } else {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("replaceRook", newReplacement);
        }
      } catch (e) {}
    }
    window.dispatchEvent(
      new CustomEvent("rook-replacement-changed", {
        detail: { replacement: newReplacement },
      }),
    );
  };
  const handlePiecesChange = (event) => {
    setPiecesStyle(event.target.value);
  };
  const presetsMap = {
    chess: initialGameState,
    shatranj: initialOldGameState,
    "new-chess": initialNewVariantGameState,
    "old-chess": initialOldVariantGameState,
    "extended-chess": initialExtendedGameState,
    "grand-ace-drex": initialGrandAceDrexState,
    "great-chess": initialGreatChessState,
    "grand-chess": initialGrandChessState,
    amazon: initialAmazonState,
    walls: initialWallsGameState,
    arena: initialArenaGameState,
    "ferz-vs-rukh": initialFerzVsRukhGameState,
    "dinozavr-chess": initialDinoGameState,
  };
  const handleChangePreset = (e) => {
    const val = e.target.value;
    setPreset(val);
    const initialState = presetsMap[val] || initialSpecialGameState;
    if (val !== "amazon") {
      localStorage.setItem("chess_side", "white");
      setSelectedColor("white");
    } else {
      localStorage.setItem("chess_side", "black");
      setSelectedColor("black");
    }
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

  const hasValidKingSetup = () => {
    const position = appState?.position || [];
    const flattened = position.flat(Infinity);
    const hasWhiteKing = flattened.some((piece) => isKingPiece(piece, "white"));
    const hasBlackKing = flattened.some((piece) => isKingPiece(piece, "black"));
    return hasWhiteKing && hasBlackKing;
  };

  const handleStartVariant = () => {
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
  const onClickWhite = () => {
    localStorage.setItem("chess_side", "white");
    setSelectedColor("white");
    dispatch({ type: actionTypes.SET_PLAYER_TURN, payload: "white" });
  };
  const onClickBlack = () => {
    localStorage.setItem("chess_side", "black");
    setSelectedColor("black");
    dispatch({ type: actionTypes.SET_PLAYER_TURN, payload: "black" });
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
            disabled={promotion || start === "yes"}
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
            <option value="chess">{t("header.chess")}</option>
            <option value="shatranj">{t("header.shatranj")}</option>
            <option value="new-chess">{t("header.new_chess")}</option>
            <option value="old-chess">{t("header.old_chess")}</option>
            <option value="extended-chess">{t("header.extended_chess")}</option>
            <option value="grand-ace-drex">{t("header.grand-ace-drex")}</option>
            <option value="great-chess">{t("header.great-chess")}</option>
            <option value="grand-chess">{t("header.grand-chess")}</option>
            <option value="amazon">{t("header.amazon")}</option>
            <option value="walls">{t("header.walls_chess")}</option>
            <option value="arena">{t("header.arena")}</option>
            <option value="ferz-vs-rukh">{t("header.ferz_vs_rukh")}</option>
            <option value="dinozavr-chess">{t("header.dinozavr_chess")}</option>
          </select>
          <select
            value={appState.boardSize}
            onChange={handleChangeBoardSize}
            className={styles["board-size-select"]}
            disabled={start === "yes"}
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
                disabled={!hasValidKingSetup()}
              >
                {t("custom_panel.play_vs_bot")}
              </button>
              {!roomWindow && (
                <button
                  onClick={handlePlayInRoom}
                  disabled={!hasValidKingSetup()}
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
            {t("custom_panel.reset_colors")}
          </button>
          <div>
            <div className={styles["img-div"]}>
              <img
                src={black_king}
                alt="black"
                className={`${styles["img-style"]} ${selectedColor === "black" ? styles["active"] : ""}`}
                onClick={() => {
                  setSelectedColor("black");
                  onClickBlack();
                }}
              />
              <img
                src={white_king}
                alt="white"
                className={`${styles["img-style"]} ${selectedColor === "white" ? styles["active"] : ""}`}
                onClick={() => {
                  setSelectedColor("white");
                  onClickWhite();
                }}
              />
              {color === "white" && (
                <img
                  src={white_ferz}
                  alt="white"
                  className={styles["img-style"]}
                  onClick={() => {
                    handleChangePromotion();
                  }}
                />
              )}
              {color === "black" && (
                <img
                  src={black_ferz}
                  alt="black"
                  className={styles["img-style"]}
                  onClick={() => {
                    handleChangePromotion();
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles["replace-pieces"]}>
          <div>
            <div
              onClick={handleReplacePieceSailBoat}
              className={`${styles["pieces-variants"]} ${pieceSailBoat ? styles["active"] : ""}`}
            >
              {color === "white" ? (
                <div className={styles["pieces-variants"]}>
                  <img src={white_rook} alt="white_rook" draggable={false} />
                  <Icon path={mdiArrowRightThin} size={1.5} />
                  <img
                    src={white_sailboat}
                    alt="white_sailboat"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className={styles["pieces-variants"]}>
                  <img src={black_rook} alt="black_rook" draggable={false} />
                  <Icon path={mdiArrowRightThin} size={1.5} />
                  <img
                    src={black_sailboat}
                    alt="black_sailboat"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <div
              onClick={handleReplacePieceChariot}
              className={`${styles["pieces-variants"]} ${pieceChariot ? styles["active"] : ""}`}
            >
              {color === "white" ? (
                <div className={styles["pieces-variants"]}>
                  <img src={white_rook} alt="white_rook" draggable={false} />
                  <Icon path={mdiArrowRightThin} size={1.5} />
                  <img
                    src={white_chariot}
                    alt="white_chariot"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className={styles["pieces-variants"]}>
                  <img src={black_rook} alt="black_rook" draggable={false} />
                  <Icon path={mdiArrowRightThin} size={1.5} />
                  <img
                    src={black_chariot}
                    alt="black_chariot"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {color === "white" && !promotion && (
        <div>
          {piecesStyle === "standart" && (
            <div>
              <img
                src={white_pawn}
                alt="white_pawn"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_pawn,isNew`)
                }
                className={styles.pawn}
              />
              <img
                src={white_horse}
                alt="white_horse"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_horse,isNew`)
                }
              />
              <img
                src={white_bishop}
                alt="white_bishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_bishop,isNew`)
                }
              />
              <img
                src={
                  (pieceSailBoat && white_sailboat) ||
                  (pieceChariot && white_chariot) ||
                  white_rook
                }
                alt="white_rook"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "text",
                    `${pieceSailBoat ? "white_sailboat" : pieceChariot ? "white_chariot" : "white_rook"},isNew`,
                  )
                }
              />
              <img
                src={white_ferz}
                alt="white_ferz"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_ferz,isNew`)
                }
              />
              <img
                src={white_king}
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
                src={white_firzan}
                alt="white_firzan"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_firzan,isNew`)
                }
              />
              <img
                src={white_wazir}
                alt="white_wazir"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_wazir,isNew`)
                }
              />
              <img
                src={white_man}
                alt="white_man"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_man,isNew`)
                }
              />
              <img
                src={white_elephant}
                alt="white_elephant"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_elephant,isNew`)
                }
              />
              <img
                src={white_tank}
                alt="white_tank"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_tank,isNew`)
                }
              />
              <img
                src={white_camel}
                alt="white_camel"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_camel,isNew`)
                }
              />
              <img
                src={white_zebra}
                alt="white_zebra"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_zebra,isNew`)
                }
              />
              <img
                src={white_lion}
                alt="white_lion"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_lion,isNew`)
                }
              />
              <img
                src={white_rhino}
                alt="white_rhino"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_rhino,isNew`)
                }
              />
              <img
                src={white_wildebeest}
                alt="white_wildebeest"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_wildebeest,isNew`)
                }
              />
              <img
                src={white_giraffe}
                alt="white_giraffe"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_giraffe,isNew`)
                }
              />
              <img
                src={white_rukh}
                alt="white_rukh"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_rukh,isNew`)
                }
              />
              <img
                src={white_archbishop}
                alt="white_archbishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_archbishop,isNew`)
                }
              />
              <img
                src={white_marshal}
                alt="white_marshal"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_marshal,isNew`)
                }
              />
              <img
                src={white_amazon}
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
                src={white_elephant_long_range}
                alt="white_elephant_long_range"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "text",
                    `white_elephant_long_range,isNew`,
                  )
                }
              />
              <img
                src={white_knight}
                alt="white_knight"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_knight,isNew`)
                }
              />
              <img
                src={white_dinozavr}
                alt="white_dinozavr"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_dinozavr,isNew`)
                }
              />
              <img
                src={white_checkers}
                alt="white_checkers"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_checkers,isNew`)
                }
              />
            </div>
          )}
        </div>
      )}
      {color === "black" && !promotion && (
        <div>
          {piecesStyle === "standart" && (
            <div>
              <img
                src={black_pawn}
                alt="black_pawn"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_pawn,isNew`)
                }
                className={styles.pawn}
              />
              <img
                src={black_horse}
                alt="black_horse"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_horse,isNew`)
                }
              />
              <img
                src={black_bishop}
                alt="black_bishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_bishop,isNew`)
                }
              />
              <img
                src={
                  (pieceSailBoat && black_sailboat) ||
                  (pieceChariot && black_chariot) ||
                  black_rook
                }
                alt="black_rook"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "text",
                    `${pieceSailBoat ? "black_sailboat" : pieceChariot ? "black_chariot" : "black_rook"},isNew`,
                  )
                }
              />
              <img
                src={black_ferz}
                alt="black_ferz"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_ferz,isNew`)
                }
              />
              <img
                src={black_king}
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
                src={black_firzan}
                alt="black_firzan"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_firzan,isNew`)
                }
              />
              <img
                src={black_wazir}
                alt="black_wazir"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_wazir,isNew`)
                }
              />
              <img
                src={black_man}
                alt="black_man"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_man,isNew`)
                }
              />
              <img
                src={black_elephant}
                alt="black_elephant"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_elephant,isNew`)
                }
              />
              <img
                src={black_tank}
                alt="black_tank"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_tank,isNew`)
                }
              />
              <img
                src={black_camel}
                alt="black_camel"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_camel,isNew`)
                }
              />
              <img
                src={black_zebra}
                alt="black_zebra"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_zebra,isNew`)
                }
              />
              <img
                src={black_lion}
                alt="black_lion"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_lion,isNew`)
                }
              />
              <img
                src={black_rhino}
                alt="black_rhino"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_rhino,isNew`)
                }
              />
              <img
                src={black_wildebeest}
                alt="black_wildebeest"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_wildebeest,isNew`)
                }
              />
              <img
                src={black_giraffe}
                alt="black_giraffe"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_giraffe,isNew`)
                }
              />
              <img
                src={black_rukh}
                alt="black_rukh"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_rukh,isNew`)
                }
              />
              <img
                src={black_archbishop}
                alt="black_archbishop"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_archbishop,isNew`)
                }
              />
              <img
                src={black_marshal}
                alt="black_marshal"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_marshal,isNew`)
                }
              />
              <img
                src={black_amazon}
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
                src={black_elephant_long_range}
                alt="black_elephant_long_range"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "text",
                    `black_elephant_long_range,isNew`,
                  )
                }
              />
              <img
                src={black_knight}
                alt="black_knight"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_knight,isNew`)
                }
              />
              <img
                src={black_dinozavr}
                alt="black_dinozavr"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_dinozavr,isNew`)
                }
              />
              <img
                src={black_checkers}
                alt="black_checkers"
                draggable={editorMode}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_checkers,isNew`)
                }
              />
            </div>
          )}
        </div>
      )}
      {piecesStyle === "other" && (
        <div>
          <img
            src={brick}
            alt="brick"
            draggable={editorMode}
            onDragStart={(e) => e.dataTransfer.setData("text", `brick,isNew`)}
          />
          <img
            src={delete_icon}
            alt="delete"
            draggable={editorMode}
            onDragStart={(e) => e.dataTransfer.setData("text", `,isNew`)}
          />
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
