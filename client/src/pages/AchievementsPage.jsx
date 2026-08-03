import React from "react";
import AchievementCard from "../components/AchievementCard/AchievementCard";
import { useDispatch, useSelector } from "react-redux";
import { updateUserThunk } from "../store/usersSlice";
import { useNavigate } from "react-router-dom";

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

const AchievementsPage = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const claimNextIcon = (piece) => {
    if (!user?._id) {
      return;
    }

    const pieceLevel = user?.achievements?.icons?.[piece] ?? 0;
    const styles = ["bronze", "silver", "gold", "platinum"];
    const unlocked = user?.achievements?.unlockedIcons?.[piece] || [];
    const nextStyle = styles.find((style, index) => {
      if (pieceLevel <= index) {
        return false;
      }
      return !unlocked.includes(style);
    });

    if (!nextStyle) {
      navigate("/collections");
      return;
    }

    const updatedUnlocked = {
      ...(user?.achievements?.unlockedIcons || {}),
      [piece]: Array.from(
        new Set([
          ...(user?.achievements?.unlockedIcons?.[piece] || []),
          nextStyle,
        ]),
      ),
    };

    dispatch(
      updateUserThunk({
        id: user._id,
        values: {
          achievements: {
            ...user.achievements,
            selectedIcon: `${nextStyle}_${piece}`,
            unlockedIcons: updatedUnlocked,
          },
        },
      }),
    );

    navigate("/collections");
  };

  return (
    <div>
      {PIECES.map((piece) => {
        const pieceLevel = user?.achievements?.icons?.[piece] ?? 0;
        const unlocked = user?.achievements?.unlockedIcons?.[piece] || [];
        const isUnlocked = unlocked.length > 0;
        const isAllUnlocked = pieceLevel >= 4 && isUnlocked;

        return (
          <AchievementCard
            key={piece}
            piece={piece}
            level={pieceLevel}
            count={user?.achievements?.stats[piece] ?? 0}
            onSelect={() => claimNextIcon(piece)}
            isUnlocked={isUnlocked}
            isAllUnlocked={isAllUnlocked}
          />
        );
      })}
    </div>
  );
};

export default AchievementsPage;
