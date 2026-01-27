import React, { useState } from 'react';
import { initialGameState, initialOldGameState, initialSpecialGameState } from '../../constants';
import { useAppContext } from '../../contexts/Context';
import Pieces from '../Pieces/Pieces';
import Promotion from '../Promotion/Promotion';
import styles from './ChessBoard.module.scss';
import black_king from '../../assets/icons/black_king.png';
import white_king from '../../assets/icons/white_king.png';
import actionTypes from '../../reducers/actionTypes';
import CapturedPieces from '../CapturedPieces/CapturedPieces';
    
const ChessBoard = (props) => {
    const { status, turn } = props;
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const horizontalAxisSecond = ["h", "g", "f", "e", "d", "c", "b", "a"];
    const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const { dispatch, appState } = useAppContext();
    const orientation = appState.orientation;
    const verticalClass = orientation === 'white' 
        ? styles['vertical'] 
        : styles['vertical-second'];
    const [start, setStart] = useState(false);
    const [customPanel, setCustomPanel] = useState(true);
    const [materialPanel, setMaterialPanel] = useState(false);
    const onClickWhite = () => {
        dispatch({ type: actionTypes.SET_ORIENTATION, payload: 'white' });
    };
    const onClickBlack = () => {
        dispatch({ type: actionTypes.SET_ORIENTATION, payload: 'black' });
    };
    const onClickStart = () => {
        setStart(true);
    };
    const onClickStartNew = () => {
        setStart(false);
        if (window.localStorage.getItem('chess_variant') === 'chess') {
            window.localStorage.setItem('chess_variant', 'chess');
            dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialGameState } });
        }
        if (window.localStorage.getItem('chess_variant') === 'shatranj') {
            window.localStorage.setItem('chess_variant', 'shatranj');
            dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialOldGameState } });
        }
        if (window.localStorage.getItem('chess_variant') === 'special') {
            window.localStorage.setItem('chess_variant', 'special');
            dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialSpecialGameState } });
        }
    };
    const gameStatusStyle = () => {
        if (start === false) {
            return styles['game-status'];
        } else if (status === 'White wins' || status === 'Black wins' || status === 'Draw') {
            return styles['game-status'];
        } else {
            return styles['hide-game-status'];
        }
    }
    const gameStatusMessage = () => {
        if (status === 'White wins') {
            return 'White wins!';
        }
        if (status === 'Black wins') {
            return 'Black wins!';
        }
        if (status === 'Draw') {
            if (window.localStorage.getItem('chess_variant') === 'shatranj') {
                if (turn === 'white') {
                    return 'Black wins!';
                } else {
                    return 'White wins!';
                }
            }
            return 'The game is a draw!';
        }
    };
    const handleHideCustomPanel = () => {
        setCustomPanel(!customPanel);
        setMaterialPanel(!materialPanel);
    }
    return (
        <article className={styles['wrapper']}>
            {window.localStorage.getItem('chess_variant') !== 'special' && <div className={gameStatusStyle()}>
                {start !== true && <div>
                    <div>
                        <span>Choose color</span>
                        <h2>{gameStatusMessage()}</h2>
                        <div>
                            <img src={black_king} alt="white" onClick={onClickBlack} />
                            <img src={white_king} alt="black" onClick={onClickWhite} />
                        </div>
                    </div>
                    <div>
                        <button onClick={onClickStart}>Start</button>
                    </div>
                </div>}
                {status !== status.ongoing && start === true &&
                    <div className={styles['game-message']}>
                        <h2>{gameStatusMessage()}</h2>
                        {status === 'White wins' ?
                            (<img src={white_king} alt="white" />) :
                            status === 'Black wins' ?
                                (<img src={black_king} alt="black" />) : null}
                        {window.localStorage.getItem('chess_variant') === 'shatranj' && status === 'Draw' && turn === 'white' ? (
                            <img src={black_king} alt="white" />
                        ) : window.localStorage.getItem('chess_variant') === 'shatranj' && status === 'Draw' && turn === 'black' ? (
                            <img src={white_king} alt="black" />
                        ) : null}
                        <button onClick={onClickStartNew}>Start again</button>
                    </div>
                }
            </div>}
            <div className={styles['coordinates']}>
                <div className={verticalClass}>
                    {verticalAxis.map(axis => <span key={axis}>{axis}</span>)}
                </div>
                <div className={styles['chess-div']}>
                    <div className={styles['chess-board']}>
                        <Pieces flipped={orientation === 'black'} />
                    </div>
                    <div className={styles.horizontal}>
                        {orientation === 'white' ? (
                            horizontalAxis.map(axis => <span key={axis}>{axis}</span>)
                        ) : (
                            horizontalAxisSecond.map(axis => <span key={axis}>{axis}</span>)
                        )}
                    </div>
                </div>
                <div className={styles['promotion-div']}>
                    <Promotion />
                </div>
                {materialPanel && <div>
                    <CapturedPieces 
                        whiteCaptures={appState?.captured?.white || []}
                        blackCaptures={appState?.captured?.black || []}
                        handleHideCustomPanel={handleHideCustomPanel}
                    />
                </div>}
            </div>
        </article>
    );
};

export default ChessBoard;