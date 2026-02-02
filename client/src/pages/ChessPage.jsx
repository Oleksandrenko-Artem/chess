import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/Context';
import { useNavigate } from 'react-router-dom';
import { status } from '../constants';
import ChessBoard from '../components/ChessBoard/ChessBoard';
import CapturedPieces from '../components/CapturedPieces/CapturedPieces';
import styles from './Pages.module.scss';
import GameInfoPanel from './../components/GameInfoPanel/GameInfoPanel';

const ChessPage = (props) => {
  const { start, setStart } = props;
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
      <div className={styles.wrapper}>
        {
              <GameInfoPanel
                status={appState?.status}
                start={start}
                setStart={setStart}
                gameStatusMessage={gameStatusMessage}
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

export default ChessPage;