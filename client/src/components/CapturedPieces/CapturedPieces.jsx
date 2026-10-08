import React from "react";
import { getPieceStyle } from "../../helpers/getPieceImage";
import {
  hasFourPlayerNativeIcon,
  normalizeFourPlayerPiece,
} from "../../helpers/fourPlayer";
import { useSelector } from "react-redux";
import styles from "./CapturedPieces.module.scss";

const CapturedPieces = ({
  whiteCaptures = [],
  yellowCaptures = [],
  blueCaptures = [],
  blackCaptures = [],
  greenCaptures = [],
  redCaptures = [],
}) => {
  const user = useSelector((state) => state.users.user);
  const myColor = localStorage.getItem("chess_side");
  return (
    <div className={styles["captured-container"]}>
      <div className={styles["side"]}>
        <div className={styles["captures"]}>
          {[
            ...whiteCaptures,
            ...yellowCaptures,
            ...blueCaptures,
            ...blackCaptures,
            ...greenCaptures,
            ...redCaptures,
          ].map((piece, idx) => {
            const needsColorFilter =
              localStorage.getItem("chess_variant") === "four_player" &&
              !hasFourPlayerNativeIcon(normalizeFourPlayerPiece(piece));
            return (
              <div key={idx} className={styles["captured-piece"]}>
                <img
                  className={
                    needsColorFilter
                      ? styles[`piece-${piece.split("_")[0]}`]
                      : ""
                  }
                  src={getPieceStyle(piece, piece.startsWith(myColor), user)}
                  alt={
                    localStorage.getItem("chess_variant") === "four_player"
                      ? normalizeFourPlayerPiece(piece)
                      : piece
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CapturedPieces;
