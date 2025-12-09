import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/Context';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import { Navigate, useNavigate } from 'react-router-dom';

const ShatranjPage = () => {
    const navigate = useNavigate();
    const { appState } = useAppContext(); 
    useEffect(() => {
        if (!appState || !appState.position) {
            navigate('/');
        }
    }, [appState, navigate]);
    return (
        <div>
            <ChessBoard />
        </div>
    );
};

export default ShatranjPage;