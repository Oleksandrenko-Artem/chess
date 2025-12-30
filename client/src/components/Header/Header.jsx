import React from 'react';
import styles from './Header.module.scss';
import { Link, NavLink } from 'react-router-dom';

const Header = (props) => {
    const { onPlayChess, onPlayShatranj, onPlaySpecial } = props;
    return (
        <header className={styles.header}>
            <div className={styles['header-logo']}>
                <div>
                    <NavLink to='/'><img src="/src/assets/icons/black_horse.png" alt="logo" /></NavLink>
                    <NavLink to='/'>Chess</NavLink>
                </div>
                <div className={styles.sign}>
                    <NavLink to='/login' className={({ isActive }) => (isActive ? styles['active-link'] : undefined)}>Login</NavLink>{' '}
                    <NavLink to='/register' className={({ isActive }) => (isActive ? styles['active-link'] : undefined)}>Register</NavLink>
                </div>
            </div>
            <div className={styles['header-nav']}>
                <nav>
                    <ul>
                        <li>
                            <NavLink to='/play-chess' onClick={onPlayChess} className={({ isActive }) => (isActive ? styles['active-nav'] : undefined)}>Play chess</NavLink>
                        </li>
                        <li>
                            <NavLink to='/play-shatranj' onClick={onPlayShatranj} className={({ isActive }) => (isActive ? styles['active-nav'] : undefined)}>Play shatranj</NavLink>
                        </li>
                        <li>
                            <NavLink to='/create-position' onClick={onPlaySpecial}>Custom position</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;