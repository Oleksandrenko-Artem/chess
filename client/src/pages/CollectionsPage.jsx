import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUserThunk } from "../store/usersSlice";
import styles from "./Pages.module.scss";

const PIECES = [
  "soldier",
  "horse",
  "bishop",
  "rook",
  "ferz",
  "king",
  "elephant",
  "firzan",
  "knight",
  "prince",
  "duke",
];

const LEVELS = ["bronze", "silver", "gold", "platinum"];

const CollectionsPage = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPiece = location.state?.selectedPiece;
  const isAdmin = user?.role === "admin";

  const getClaimedStyles = (piece) => {
    const claimed = user?.achievements?.unlockedIcons?.[piece] || [];
    const styles = Array.isArray(claimed) ? [...claimed] : [];

    if (isAdmin) {
      styles.push("iridium");
    }

    return Array.from(new Set(styles));
  };

  const visiblePieces = selectedPiece
    ? [selectedPiece]
    : PIECES.filter((piece) => {
        if (isAdmin) {
          return true;
        }
        return getClaimedStyles(piece).length > 0;
      });

  const handleSelectIcon = (piece, style) => {
    if (!user?._id) {
      return;
    }

    const claimed = getClaimedStyles(piece);
    if (!claimed.includes(style)) {
      return;
    }

    dispatch(
      updateUserThunk({
        id: user._id,
        values: {
          achievements: {
            ...user.achievements,
            selectedIcon: `${style}_${piece}`,
          },
        },
      }),
    );

    navigate("/account");
  };

  const isCollectionEmpty =
    !selectedPiece &&
    visiblePieces.every((piece) => getClaimedStyles(piece).length === 0);

  return (
    <div className={styles["collections-page"]}>
      <h2>Коллекция</h2>
      {isCollectionEmpty ? (
        <div className={styles["empty-state"]}>Коллекция отсутствует</div>
      ) : (
        <div className={styles["collections-grid"]}>
          {visiblePieces.flatMap((piece) => {
            const claimedStyles = getClaimedStyles(piece);
            const selectedValue = user?.achievements?.selectedIcon;

            return claimedStyles.map((style) => {
              if (style === "iridium" && !isAdmin) {
                return null;
              }

              const isSelected = selectedValue === `${style}_${piece}`;

              return (
                <div
                  key={`${piece}_${style}`}
                  className={`${styles["collection-card"]} ${isSelected ? styles.selected : ""}`}
                >
                  <img
                    src={`/src/assets/icons/${style}_${piece}.png`}
                    alt={`${style} ${piece}`}
                    width={64}
                    height={64}
                  />
                  <p>{style}</p>
                  <button onClick={() => handleSelectIcon(piece, style)}>
                    {isSelected ? "Выбран" : "Выбрать"}
                  </button>
                </div>
              );
            });
          })}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
