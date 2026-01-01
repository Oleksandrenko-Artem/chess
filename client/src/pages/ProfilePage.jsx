import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { findUserAccountThunk } from '../store/usersSlice';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, error } = useSelector((state) => state.users);
    useEffect(() => {
        if (!user) {
            dispatch(findUserAccountThunk());  
        }
    }, [dispatch, user]);
    if (error) {
        navigate('/login');
    }
    return (
        <div>
            <p><b>Name:</b> {user?.name}</p>
            <p><b>Email:</b> {user?.email}</p>
        </div>
    );
}

export default ProfilePage;
