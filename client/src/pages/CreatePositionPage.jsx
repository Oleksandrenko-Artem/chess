import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAppContext } from '../contexts/Context';
import { status } from '../constants';
import { findUserAccountThunk } from '../store/usersSlice';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import CreatePosition from "../components/CreatePosition/CreatePosition";
import CapturedPieces from "../components/CapturedPieces/CapturedPieces";
import MovesList from "../components/MovesList/MovesList";
import styles from './Pages.module.scss';

const CreatePositionPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { appState } = useAppContext();
    const { user, error } = useSelector((state) => state.users);
    useEffect(() => {
        if (!appState || !appState.position || error) {
            navigate('/');
        }
    }, [appState, error, navigate]);
    useEffect(() => {
        if (!user) {
            dispatch(findUserAccountThunk());  
        }
    }, [dispatch, user]);
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
        <CreatePosition />
        <div className={styles.wrapper}>
          <ChessBoard status={appState?.status} />
          <div className={styles.control}>
            <CapturedPieces
              whiteCaptures={appState?.captured?.white || []}
              blackCaptures={appState?.captured?.black || []}
            />
            <MovesList />
          </div>
        </div>
      </div>
    );
}

export default CreatePositionPage;