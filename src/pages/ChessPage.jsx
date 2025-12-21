import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/Context';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import { useNavigate } from 'react-router-dom';
import { status } from '../constants';
import styles from './Pages.module.scss';

const ChessPage = () => {
    const navigate = useNavigate();
    const { appState } = useAppContext();
    useEffect(() => {
        if (!appState || !appState.position) {
            navigate('/');
        }
    }, [appState, navigate]);
    
    const gameStatusMessage = appState?.status !== status.ongoing 
        ? (appState?.status === status.white ? 'White wins!' : 'Black wins!')
        : `Current turn: ${appState?.playerTurn === 'white' ? 'White' : 'Black'}`;
    const drawMessage = appState?.status === status.draw ? 'The game is a draw' : null;
    return (
        <div>
            <div className={styles['status-display']}>
                <h1>Chess</h1>
                <h2>{gameStatusMessage}{drawMessage && <span>{drawMessage}</span>}</h2>
            </div>
            <ChessBoard />
        </div>
    );
};

export default ChessPage;