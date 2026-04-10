import React from "react";
import styles from "./Pages.module.scss";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const SinglePlayerPage = (props) => {
    const { onPlayChess, onPlayShatranj } =
      props;
    const { t } = useTranslation();
    const handleNavigation = (callback) => {
      if (callback) callback();
    };
  return (
    <div className={styles["single-wrapper"]}>
      <h1>{t("header.single-player")}</h1>
      <div className={styles["single-player-options"]}>
        <div>
          <img src="/src/assets/icons/white_ferz.png" alt="white_ferz" />
          <p>{t("header.single-player-chess")}</p>
          <NavLink
            to="/play-chess"
            onClick={() => handleNavigation(onPlayChess)}
          >
            {t("game_info_panel.start")}
          </NavLink>
        </div>
        <div>
          <img
            src="/src/assets/icons/white_elephant.png"
            alt="white_elephant"
          />
          <p>{t("header.single-player-shatranj")}</p>
          <NavLink
            to="/play-shatranj"
            onClick={() => handleNavigation(onPlayShatranj)}
          >
            {t("game_info_panel.start")}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerPage;
