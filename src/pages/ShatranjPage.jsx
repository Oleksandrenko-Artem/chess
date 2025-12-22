import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/Context';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import { Navigate, useNavigate } from 'react-router-dom';
import { status } from '../constants';
import styles from './Pages.module.scss';

const ShatranjPage = () => {
    const navigate = useNavigate();
    const { appState } = useAppContext(); 
    useEffect(() => {
        if (!appState || !appState.position) {
            navigate('/');
        }
    }, [appState, navigate]);
    
    const gameStatusMessage = () => {
        if (appState?.status === status.white) {
            return 'White wins!';
        }
        if (appState?.status === status.black) {
            return 'Black wins!';
        }
        if (appState?.status === status.draw) {
            if (appState?.playerTurn === 'white') {
                return 'Black wins!';
            } else {
                return 'White wins!';
            }
        }
        if (appState.status === status.white && arbiter.isBareKing(appState.position, 'black')) {
            return 'White wins by Baring the King!';
        }
        return `Current turn: ${appState?.playerTurn === 'white' ? 'White' : 'Black'}`;
    };
    return (
        <div>
            <div className={styles['status-display']}>
                <h1>Shatranj</h1>
                <h2>{gameStatusMessage()}</h2>
            </div>
            <ChessBoard />
        </div>
    );
};

export default ShatranjPage;