import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/Context";
import { useSelector, useDispatch } from "react-redux";
import { updateUserThunk } from "../../store/usersSlice";
import {
  initialDinoGameState,
  initialExtendedGameState,
  initialGameState,
  initialOldGameState,
  initialOldVariantGameState,
  initialSpecialGameState,
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
import styles from "./CreatePosition.module.scss";

const CreatePosition = () => {
  const { dispatch } = useAppContext();
  const { t } = useTranslation();
  const user = useSelector((state) => state.users.user);
  const dispatchRedux = useDispatch();
  const saveTimeoutRef = useRef();
  const [color, setColor] = useState("white");
  const [piecesStyle, setPiecesStyle] = useState("standart");
  const [preset, setPreset] = useState("custom");
  const [pieceSailBoat, setPieceSailBoat] = useState(() =>
    user ? user.rookType === "sailboat" : false,
  );
  const [pieceChariot, setPieceChariot] = useState(() =>
    user ? user.rookType === "chariot" : false,
  );
  const DEFAULT_LIGHT_COLOR = "#ffdabb";
  const DEFAULT_DARK_COLOR = "#7e5e2e";
  const [lightSquareColor, setLightSquareColor] = useState(() =>
    user ? user.boardColor.light : DEFAULT_LIGHT_COLOR,
  );
  const [darkSquareColor, setDarkSquareColor] = useState(() =>
    user ? user.boardColor.dark : DEFAULT_DARK_COLOR,
  );
  useEffect(() => {
    if (user) {
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
      if ((user.rookType === "sailboat") !== pieceSailBoat) {
        setPieceSailBoat(user.rookType === "sailboat");
      }
      if ((user.rookType === "chariot") !== pieceChariot) {
        setPieceChariot(user.rookType === "chariot");
      }
    } else {
      setLightSquareColor(DEFAULT_LIGHT_COLOR);
      setDarkSquareColor(DEFAULT_DARK_COLOR);
      setPieceSailBoat(false);
      setPieceChariot(false);
      localStorage.setItem("lightSquareColor", DEFAULT_LIGHT_COLOR);
      localStorage.setItem("darkSquareColor", DEFAULT_DARK_COLOR);
      localStorage.setItem("replaceRook", "rook");
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
    dispatch({
      type: actionTypes.RESET_GAME,
      payload: { initialState: initialSpecialGameState },
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
    "old-chess": initialOldVariantGameState,
    "extended-chess": initialExtendedGameState,
    "dinozavr-chess": initialDinoGameState,
  };
  const handleChangePreset = (e) => {
    const val = e.target.value;
    setPreset(val);
    const initialState = presetsMap[val] || initialSpecialGameState;
    dispatch({ type: actionTypes.RESET_GAME, payload: { initialState } });
  };

  const handleToggle = () => {
    dispatch({ type: actionTypes.TOGGLE_ORIENTATION });
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles["btns-div"]}>
        <div>
          <select value={piecesStyle} onChange={handlePiecesChange}>
            <option value="standart">
              {t("custom_panel.standart_pieces")}
            </option>
            <option value="old">{t("custom_panel.old_pieces")}</option>
            <option value="special">{t("custom_panel.special_pieces")}</option>
          </select>
          <select value={preset} onChange={handleChangePreset}>
            <option value="custom">{t("header.custom_position")}</option>
            <option value="chess">{t("header.chess")}</option>
            <option value="shatranj">{t("header.shatranj")}</option>
            <option value="old-chess">{t("header.old_chess")}</option>
            <option value="extended-chess">{t("header.extended_chess")}</option>
            <option value="dinozavr-chess">{t("header.dinozavr_chess")}</option>
          </select>
          <button onClick={handleChangeColor}>
            {t("custom_panel.change_color")}
          </button>
          <button onClick={handleToggle}>
            {t("custom_panel.rotate_board")}
          </button>
          <button onClick={handleResetPosition}>
            {t("custom_panel.reset_position")}
          </button>
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
            }}
          />
          <button
            onClick={handleResetBoardColors}
            className={styles["reset-colors-btn"]}
          >
            {t("custom_panel.reset_colors")}
          </button>
        </div>
        <div className={styles["replace-pieces"]}>
          <div>
            <div
              onClick={handleReplacePieceSailBoat}
              className={`${styles["pieces-variants"]} ${pieceSailBoat ? styles["selected"] : ""}`}
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
              className={`${styles["pieces-variants"]} ${pieceChariot ? styles["selected"] : ""}`}
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
      {color === "white" && (
        <div>
          {piecesStyle === "standart" && (
            <div>
              <img
                src={white_pawn}
                alt="white_pawn"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_pawn,isNew`)
                }
                className={styles.pawn}
              />
              <img
                src={white_horse}
                alt="white_horse"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_horse,isNew`)
                }
              />
              <img
                src={white_bishop}
                alt="white_bishop"
                draggable="true"
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
                draggable="true"
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
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_ferz,isNew`)
                }
              />
              <img
                src={white_king}
                alt="white_king"
                draggable="true"
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
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_firzan,isNew`)
                }
              />
              <img
                src={white_wazir}
                alt="white_wazir"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_wazir,isNew`)
                }
              />
              <img
                src={white_elephant}
                alt="white_elephant"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_elephant,isNew`)
                }
              />
              <img
                src={white_tank}
                alt="white_tank"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_tank,isNew`)
                }
              />
              <img
                src={white_camel}
                alt="white_camel"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_camel,isNew`)
                }
              />
              <img
                src={white_giraffe}
                alt="white_giraffe"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_giraffe,isNew`)
                }
              />
              <img
                src={white_rukh}
                alt="white_rukh"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_rukh,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "special" && (
            <div>
              <img
                src={white_dinozavr}
                alt="white_dinozavr"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_dinozavr,isNew`)
                }
              />
              <img
                src={white_checkers}
                alt="white_checkers"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `white_checkers,isNew`)
                }
              />
            </div>
          )}
        </div>
      )}
      {color === "black" && (
        <div>
          {piecesStyle === "standart" && (
            <div>
              <img
                src={black_pawn}
                alt="black_pawn"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_pawn,isNew`)
                }
                className={styles.pawn}
              />
              <img
                src={black_horse}
                alt="black_horse"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_horse,isNew`)
                }
              />
              <img
                src={black_bishop}
                alt="black_bishop"
                draggable="true"
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
                draggable="true"
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
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_ferz,isNew`)
                }
              />
              <img
                src={black_king}
                alt="black_king"
                draggable="true"
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
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_firzan,isNew`)
                }
              />
              <img
                src={black_wazir}
                alt="black_wazir"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_wazir,isNew`)
                }
              />
              <img
                src={black_elephant}
                alt="black_elephant"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_elephant,isNew`)
                }
              />
              <img
                src={black_tank}
                alt="black_tank"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_tank,isNew`)
                }
              />
              <img
                src={black_camel}
                alt="black_camel"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_camel,isNew`)
                }
              />
              <img
                src={black_giraffe}
                alt="black_giraffe"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_giraffe,isNew`)
                }
              />
              <img
                src={black_rukh}
                alt="black_rukh"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_rukh,isNew`)
                }
              />
            </div>
          )}
          {piecesStyle === "special" && (
            <div>
              <img
                src={black_dinozavr}
                alt="black_dinozavr"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_dinozavr,isNew`)
                }
              />
              <img
                src={black_checkers}
                alt="black_checkers"
                draggable="true"
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", `black_checkers,isNew`)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePosition;
