import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logoutUserThunk } from '../../store/usersSlice';
import styles from './Header.module.scss';

const Header = (props) => {
    const dispatch = useDispatch();
    const { onPlayChess, onPlayShatranj, onPlaySpecial } = props;
    const { user } = useSelector((state) => state.users);
    const logout = () => {
        dispatch(logoutUserThunk());
    };
    return (
        <header className={styles.header}>
            <div className={styles['header-logo']}>
                <div>
                    <NavLink to='/'><img src="/src/assets/icons/black_horse.png" alt="logo" /></NavLink>
                    <NavLink to='/'>Chess</NavLink>
                </div>
                <div className={styles.sign}>
                    {user ? (
                        <>
                            <Link to="/account">Hi, {user?.name}</Link>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                            <>
                                <Link to="/login">Sign in</Link>{' '}
                                <Link to="/register">Sign up</Link>
                            </>
                    )} 
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
                        {user && <li>
                            <NavLink to='/create-position' onClick={onPlaySpecial} className={({ isActive }) => (isActive ? styles['active-nav'] : undefined)}>Custom position</NavLink>
                        </li>}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;