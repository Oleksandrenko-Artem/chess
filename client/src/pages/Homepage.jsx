import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { findAllUsersThunk } from '../store/usersSlice';
import styles from './Pages.module.scss';

const Homepage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { users } = useSelector((state) => state.users);
    useEffect(() => {
        dispatch(findAllUsersThunk());  
    }, [dispatch]);
    return (
        <div className={styles.home}>
            <h2>{t('home.home_caption')}</h2>
            <marquee><h4>{t('home.welcome_message')}</h4></marquee>
            <table className={styles.users}>
                <thead>
                    <tr>
                       <th>Number</th>
                        <th>Name</th>
                        <th>Email</th> 
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Homepage;