import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logoutUserThunk } from '../../store/usersSlice';
import white_rook from '../../assets/icons/white_rook.png';
import white_sailboat from '../../assets/icons/white_sailboat.png';
import white_rukh from '../../assets/icons/white_rukh.png';
import styles from './Header.module.scss';

const RookIndicator = () => {
    const { user } = useSelector((state) => state.users);
    const [rookReplacement, setRookReplacement] = useState('rook');
    useEffect(() => {
        try {
            const rep = typeof window !== 'undefined' ? localStorage.getItem('replaceRook') : null;
            setRookReplacement(rep || 'rook');
        } catch (e) {
            setRookReplacement('rook');
        }
        const handleRookReplacementChange = (event) => {
            try {
                const rep = event.detail?.replacement || 'rook';
                setRookReplacement(rep);
            } catch (e) {
                setRookReplacement('rook');
            }
        };
        window.addEventListener('rook-replacement-changed', handleRookReplacementChange);
        return () => window.removeEventListener('rook-replacement-changed', handleRookReplacementChange);
    }, []);
    const getIndicatorContent = () => {
        switch (rookReplacement) {
            case 'sailboat':
                return { icon: white_sailboat, label: 'Sailboat' };
            case 'rukh':
                return { icon: white_rukh, label: 'Rukh' };
            default:
                return { icon: white_rook, label: 'Rook' };
        }
    };
    const { icon, label } = getIndicatorContent();
    return (
        <>
            {user && <div className={styles['rook-indicator']} title={`Rook replacement: ${label}`}>
                <img src={icon} alt={label} />
                <span>{label}</span>
            </div>}
        </>
    );
};

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
                <RookIndicator />
            </div>
        </header>
    );
};

export default Header;