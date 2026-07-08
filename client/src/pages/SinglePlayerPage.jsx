import React, { useEffect, useState } from "react";
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
    onPlayNewVariantChess,
    onPlayNewVariantChess960,
  } = props;

  const { t } = useTranslation();
  const handleNavigation = (callback) => {
    if (callback) callback();
  };

  const games = [
    {
      id: "chess",
      img: "/src/assets/icons/white_ferz.png",
      title: "header.chess",
      desc: "header.single-player-chess",
      link: "/play-chess",
      action: onPlayChess,
    },
    {
      id: "shatranj",
      img: "/src/assets/icons/white_elephant.png",
      title: "header.shatranj",
      desc: "header.single-player-shatranj",
      link: "/play-shatranj",
      action: onPlayShatranj,
    },
    {
      id: "new_chess",
      img: "/src/assets/icons/white_knight.png",
      title: "header.new_chess",
      desc: "header.single-player-new-chess",
      link: "/play-new-variant-chess",
      action: onPlayNewVariantChess,
    },
    {
      id: "checkers",
      img: "/src/assets/icons/white_checkers.png",
      title: "header.checkers",
      desc: "header.single-player-checkers",
      link: "/play-checkers",
      action: onPlayCheckers,
    },
    {
      id: "chess960",
      img: "/src/assets/icons/chess_960.png",
      title: "header.chess960",
      desc: "header.single-player-chess960",
      link: "/play-chess960",
      action: onPlayChess960,
    },
    {
      id: "shatranj960",
      img: "/src/assets/icons/chess_960.png",
      title: "header.shatranj960",
      desc: "header.single-player-shatranj960",
      link: "/play-shatranj960",
      action: onPlayShatranj960,
    },
    {
      id: "new_chess960",
      img: "/src/assets/icons/chess_960.png",
      title: "header.new_chess960",
      desc: "header.single-player-new-chess960",
      link: "/play-new-variant-chess960",
      action: onPlayNewVariantChess960,
    },
  ];

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCount = windowWidth <= 768 ? 1 : windowWidth <= 1070 ? 2 : 3;

  useEffect(() => {
    if (startIndex + visibleCount > games.length) {
      setStartIndex(Math.max(0, games.length - visibleCount));
    }
  }, [visibleCount, games.length, startIndex]);

  const nextSlide = () => {
    if (startIndex + visibleCount < games.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleGames = games.slice(startIndex, startIndex + visibleCount);

  return (
    <div className={styles["single-wrapper"]}>
      <h1>{t("header.single-player")}</h1>
      <h3>{t("header.choose-mode")}</h3>
      <div className={styles["slider-container"]}>
        <button
          onClick={prevSlide}
          disabled={startIndex === 0}
          className={styles["nav-button"]}
        >
          ❮
        </button>

        <div className={styles["single-player-options"]}>
          {visibleGames.map((game) => (
            <div key={game.id}>
              <img src={game.img} alt={game.id} />
              <h2>{t(game.title)}</h2>
              <p>{t(game.desc)}</p>
              <NavLink
                to={game.link}
                onClick={() => handleNavigation(game.action)}
              >
                {t("game_info_panel.start")}
              </NavLink>
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={startIndex + visibleCount >= games.length}
          className={styles["nav-button"]}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default SinglePlayerPage;