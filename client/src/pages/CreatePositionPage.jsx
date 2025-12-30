import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/Context';
import { status } from '../constants';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import styles from './Pages.module.scss';
import CreatePosition from '../components/CreatePosition/CreatePosition';

const CreatePositionPage = () => {
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
            return 'The game is a draw!';
        }
        return `Current turn: ${appState?.playerTurn === 'white' ? 'White' : 'Black'}`;
    };
    return (
        <div>
            <div className={styles['status-display']}>
                <h1>Custom Position</h1>
                <h2>{gameStatusMessage()}</h2>
            </div>
            <ChessBoard status={appState?.status} turn={appState?.playerTurn} />
        </div>
    );
}

export default CreatePositionPage;