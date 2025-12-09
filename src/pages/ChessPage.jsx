import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/Context';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import { useNavigate } from 'react-router-dom';

const ChessPage = () => {
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

export default ChessPage;