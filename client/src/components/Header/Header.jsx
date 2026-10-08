import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUserThunk } from "../../store/usersSlice";
import { IMAGE_SRC } from "../../constants";
import styles from "./Header.module.scss";

const Header = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onPlaySpecial, onPlayMultiplayer, start, setStart } = props;
  const { user } = useSelector((state) => state.users);
  const initialTheme = localStorage.getItem("theme") || "light";
  const initialStyle = localStorage.getItem("style") || "new";
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(initialTheme);
  const [style, setStyle] = useState(initialStyle);
  const logout = () => {
    dispatch(logoutUserThunk())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        navigate("/");
      });
  };
  const handleChangeTheme = () => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  };
  const handleChangeStyle = () => {
    setStyle((style) => (style === "new" ? "old" : "new"));
  };
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-style", style);
    localStorage.setItem("theme", theme);
    localStorage.setItem("style", style);
  }, [theme, style]);
  const langData = {
    ua: { icon: `${IMAGE_SRC.SRC_OTHER}/ukraine.png`, next: "ru" },
    ru: { icon: `${IMAGE_SRC.SRC_OTHER}/russia.png`, next: "en" },
    en: { icon: `${IMAGE_SRC.SRC_OTHER}/england.png`, next: "ua" },
  };
  const currentLang = i18n.language.substring(0, 2);
  const handleChangeLang = () => {
    const nextLang = langData[currentLang]?.next || "ua";
    i18n.changeLanguage(nextLang);
  };
  const token = localStorage.getItem("token");
  return (
    <header className={styles.header}>
      <div className={styles["header-logo"]}>
        <div className={styles.logo} onClick={() => setStart(false)}>
          {theme === "light" ? (
            <NavLink to="/">
              <img src={`${IMAGE_SRC.SRC_PIECES}/black_horse.png`} alt="logo" />
            </NavLink>
          ) : (
            <NavLink to="/">
              <img src={`${IMAGE_SRC.SRC_PIECES}/white_horse.png`} alt="logo" />
            </NavLink>
          )}
          <NavLink to="/">{t("header.chess")}</NavLink>
        </div>
        <div className={styles.sign} onClick={() => setStart(false)}>
          {user && token ? (
            <>
              <Link to="/account" className={styles["user-image"]}>
                <img
                  src={user.avatar || `${IMAGE_SRC.SRC_OTHER}/account.png`}
                  alt="avatar"
                />
              </Link>
              <Link to="/account">
                {t("header.hi")} {user?.name}
              </Link>
              <button onClick={logout}>{t("header.logout")}</button>
            </>
          ) : (
            <>
              <Link to="/login">{t("header.login")}</Link>{" "}
              <Link to="/register">{t("header.register")}</Link>
            </>
          )}
        </div>
      </div>
      {!start && (
        <div className={styles["header-nav"]}>
          <nav>
            <NavLink
              to="/play"
              className={({ isActive }) =>
                isActive ? styles["active-nav"] : undefined
              }
            >
              {t("header.single-player")}
            </NavLink>
            <NavLink
              to={user ? "/games" : "#"}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  return;
                }
                onPlayMultiplayer?.();
              }}
              className={({ isActive }) =>
                `${isActive ? styles["active-nav"] : ""} ${
                  !user ? styles.disabledLink : ""
                }`
              }
            >
              {t("header.games_list")}
            </NavLink>
            <NavLink
              to={user ? "/create-position" : "#"}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  return;
                }
                onPlaySpecial?.();
              }}
              className={({ isActive }) =>
                `${isActive ? styles["active-nav"] : ""} ${
                  !user ? styles.disabledLink : ""
                }`
              }
            >
              {t("header.custom_position")}
            </NavLink>
          </nav>
          <div className={styles["style-panel"]}>
            <button
              className={styles["btn-second"]}
              onClick={handleChangeStyle}
            >
              {t("style_panel.change_style")}
            </button>
            <button className={styles.btn} onClick={handleChangeTheme}>
              {theme === "light" ? (
                <img src={`${IMAGE_SRC.SRC_OTHER}/light.png`} alt="theme" />
              ) : (
                <img src={`${IMAGE_SRC.SRC_OTHER}/dark.png`} alt="theme" />
              )}
            </button>
            <button className={styles.btn} onClick={handleChangeLang}>
              <img
                src={langData[currentLang]?.icon || langData.ua.icon}
                alt={currentLang.toUpperCase()}
              />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
