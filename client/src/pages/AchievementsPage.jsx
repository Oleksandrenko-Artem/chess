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
    const handleSelectIcon = async (piece) => {
      await fetch(`/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          achievements: {
            ...user.achievements,
            selectedIcon: piece,
          },
        }),
      });

      dispatch(
        updateUserThunk({
          id: user._id,
          values: {
            achievements: {
              ...user.achievements,
              selectedIcon: piece,
            },
          },
        }),
        );
        navigate('/account');
    };
  return (
    <div>
      {PIECES.map((piece) => (
        <AchievementCard
          key={piece}
          piece={piece}
          level={user?.achievements?.icons[piece] ?? 0}
          count={user?.achievements?.stats[piece] ?? 0}
          onSelect={() => handleSelectIcon(piece)}
        />
      ))}
    </div>
  );
};

export default AchievementsPage;
