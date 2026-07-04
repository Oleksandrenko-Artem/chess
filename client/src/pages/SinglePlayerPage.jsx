import React from "react";
import styles from "./Pages.module.scss";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const SinglePlayerPage = (props) => {
    const {
      onPlayChess,
      onPlayShatranj,
      onPlayChess960,
      onPlayShatranj960,
      onPlayCheckers,
    } = props;
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
          <h2>{t("header.chess")}</h2>
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
          <h2>{t("header.shatranj")}</h2>
          <p>{t("header.single-player-shatranj")}</p>
          <NavLink
            to="/play-shatranj"
            onClick={() => handleNavigation(onPlayShatranj)}
          >
            {t("game_info_panel.start")}
          </NavLink>
        </div>
        <div>
          <img src="/src/assets/icons/chess_960.png" alt="chess_960" />
          <h2>{t("header.chess960")}</h2>
          <p>{t("header.single-player-chess960")}</p>
          <NavLink
            to="/play-chess960"
            onClick={() => handleNavigation(onPlayChess960)}
          >
            {t("game_info_panel.start")}
          </NavLink>
        </div>
        <div>
          <img src="/src/assets/icons/chess_960.png" alt="shatranj_960" />
          <h2>{t("header.shatranj960")}</h2>
          <p>{t("header.single-player-shatranj960")}</p>
          <NavLink
            to="/play-shatranj960"
            onClick={() => handleNavigation(onPlayShatranj960)}
          >
            {t("game_info_panel.start")}
          </NavLink>
        </div>
        <div>
          <img
            src="/src/assets/icons/white_checkers.png"
            alt="white_checkers"
          />
          <h2>{t("header.checkers")}</h2>
          <p>{t("header.single-player-checkers")}</p>
          <NavLink
            to="/play-checkers"
            onClick={() => handleNavigation(onPlayCheckers)}
          >
            {t("game_info_panel.start")}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerPage;
