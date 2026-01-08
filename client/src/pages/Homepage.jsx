import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findAllUsersThunk } from '../store/usersSlice';
import styles from './Pages.module.scss';

const Homepage = () => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    useEffect(() => {
        dispatch(findAllUsersThunk());  
    }, [dispatch]);
    return (
        <div className={styles.home}>
            <h1>Home</h1>
            <h2>Users List</h2>
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