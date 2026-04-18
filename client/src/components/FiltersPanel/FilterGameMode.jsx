import React from "react";
import { useTranslation } from "react-i18next";
import { GAME_MODES } from "./../../constants";
import styles from "./filter.module.scss";

const FilterGameMode = ({ mode, setGameMode }) => {
  const { t } = useTranslation();
  const handleChangeGameMode = (event) => {
    setGameMode(event.target.value);
  };
  return (
    <div className={styles["filter-form"]}>
      <span>{t("header.select-mode")}</span>
      <select value={mode} onChange={handleChangeGameMode}>
        <option value="all">All</option>
        {GAME_MODES.map((gameMode) => (
          <option key={gameMode} value={gameMode}>
            {gameMode}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterGameMode;
