import React from 'react';
import styles from './Header.module.scss';
import { Link, NavLink } from 'react-router-dom';

const Header = (props) => {
    const { handlePlayChess, handlePlayShatranj } = props;
    return (
        <header className={styles.header}>
            <div className={styles['header-logo']}>
                <NavLink to='/'><img src="/src/assets/images/icons/black_horse.png" alt="logo" /></NavLink>
                <NavLink to='/'>Chess</NavLink>
            </div>
            <div className={styles['header-nav']}>
                <nav>
                    <ul>
                        <li>
                            <NavLink to='/play-chess' onClick={handlePlayChess} className={({ isActive }) => (isActive ? styles.active : undefined)}>Play chess</NavLink>
                        </li>
                        <li>
                            <NavLink to='/play-shatranj' onClick={handlePlayShatranj} className={({ isActive }) => (isActive ? styles.active : undefined)}>Play shatranj</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;