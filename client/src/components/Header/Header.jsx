import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { logoutUserThunk } from '../../store/usersSlice';
import styles from './Header.module.scss';

const Header = (props) => {
    const dispatch = useDispatch();
    const { onPlayChess, onPlayShatranj, onPlaySpecial } = props;
    const { user } = useSelector((state) => state.users);
    const initialTheme = localStorage.getItem('theme') || 'light';
    const initialStyle = localStorage.getItem('style') || 'new';
    const { t, i18n } = useTranslation();
    const [theme, setTheme] = useState(initialTheme);
    const [style, setStyle] = useState(initialStyle);
    const logout = () => {
        dispatch(logoutUserThunk());
    };
    const handleChangeTheme = () => {
        setTheme(theme => theme === 'light' ? 'dark' : 'light');
    };
    const handleChangeStyle = () => {
        setStyle(style => style === 'new' ? 'old' : 'new');
    };
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-style', style);
        localStorage.setItem('theme', theme);
        localStorage.setItem('style', style);
    }, [theme, style]);
    const langData = {
        ua: { icon: "/src/assets/icons/ukraine.png", next: "ru" },
        ru: { icon: "/src/assets/icons/russia.png", next: "en" },
        en: { icon: "/src/assets/icons/england.png", next: "ua" }
    };
    const currentLang = i18n.language.substring(0, 2);
    const handleChangeLang = () => {
        const nextLang = langData[currentLang]?.next || 'ua';
        i18n.changeLanguage(nextLang);
    };
    return (
        <header className={styles.header}>
            <div className={styles['header-logo']}>
                <div>
                    <NavLink to='/'><img src="/src/assets/icons/black_horse.png" alt="logo" /></NavLink>
                    <NavLink to='/'>{t('header.chess')}</NavLink>
                </div>
                <div className={styles.sign}>
                    {user ? (
                        <>
                            <Link to="/account" className={styles['user-image']}>
                                <img src={user.avatar || "/src/assets/icons/account.png"} alt="avatar" />
                            </Link>
                            <Link to="/account">{t('header.hi')} {user?.name}</Link>
                            <button onClick={logout}>{t('header.logout')}</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">{t('header.login')}</Link>{' '}
                            <Link to="/register">{t('header.register')}</Link>
                        </>
                    )}
                </div>
            </div>
            <div className={styles['header-nav']}>
                <nav>
                    <NavLink to='/play-chess' onClick={onPlayChess} className={({ isActive }) => (isActive ? styles['active-nav'] : undefined)}>{t('header.chess')}</NavLink>
                    <NavLink to='/play-shatranj' onClick={onPlayShatranj} className={({ isActive }) => (isActive ? styles['active-nav'] : undefined)}>{t('header.shatranj')}</NavLink>
                    {user && <NavLink to='/create-position' onClick={onPlaySpecial} className={({ isActive }) => (isActive ? styles['active-nav'] : undefined)}>{t('header.custom_position')}</NavLink>}
                    <NavLink to='/info' className={({ isActive }) => (isActive ? styles['active-nav'] : undefined)}>{t('header.info')}</NavLink>
                </nav>
                <div className={styles['style-panel']}>
                    <button className={styles['btn-second']} onClick={handleChangeStyle}>
                        {t('style_panel.change_style')}
                    </button>
                    <button className={styles.btn} onClick={handleChangeTheme}>
                    {theme === 'light' ? <img src="/src/assets/icons/light.png" alt="theme" /> : <img src="/src/assets/icons/dark.png" alt="theme" />}
                    </button>
                    <button className={styles.btn} onClick={handleChangeLang}>
                        <img src={langData[currentLang]?.icon || langData.ua.icon} alt={currentLang.toUpperCase()} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;