import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/Context';
import { useNavigate } from 'react-router-dom';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import CapturedPieces from '../components/CapturedPieces/CapturedPieces';
import styles from './Pages.module.scss';
import GameInfoPanel from '../components/GameInfoPanel/GameInfoPanel';

const ShatranjPage = (props) => {
  const { start, setStart } = props;
    const navigate = useNavigate();
    const { appState } = useAppContext(); 
    useEffect(() => {
        if (!appState || !appState.position) {
            navigate('/');
        }
    }, [appState, navigate]);
    return (
      <div className={styles.wrapper}>
        {
          <GameInfoPanel
            status={appState?.status}
            start={start}
            setStart={setStart}
          />
        }
        {start && (
          <div className={styles["chess-wrapper"]}>
            <ChessBoard status={appState?.status} />
            <CapturedPieces
              whiteCaptures={appState?.captured?.white || []}
              blackCaptures={appState?.captured?.black || []}
            />
          </div>
        )}
      </div>
    );
};

export default ShatranjPage;