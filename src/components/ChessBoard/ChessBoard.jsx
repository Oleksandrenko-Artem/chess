import React, { useState } from 'react';
import Pieces from '../Pieces/Pieces';
import Promotion from '../Promotion/Promotion';
import styles from './ChessBoard.module.scss';
import black_king from '../../assets/images/icons/black_king.png';
import white_king from '../../assets/images/icons/white_king.png';
import { useAppContext } from '../../contexts/Context';
import actionTypes from '../../reducers/actionTypes';
import { initialGameState, initialOldGameState } from '../../constants';
    
const ChessBoard = () => {
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const horizontalAxisSecond = ["h", "g", "f", "e", "d", "c", "b", "a"];
    const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const { dispatch } = useAppContext();
    const [verticalClass, setVerticalClass] = useState(styles['vertical']);
    const [horizontalClass, setHorizontalClass] = useState('white');
    const [start, setStart] = useState(false);
    const onClickWhite = () => {
        setVerticalClass(styles['vertical']);
        horizontalAxis.map(axis => <span key={axis}>{axis}</span>)
        setHorizontalClass('white');
    };
    const onClickBlack = () => {
        setVerticalClass(styles['vertical-second']);
        horizontalAxisSecond.map(axis => <span key={axis}>{axis}</span>);
        setHorizontalClass('black');
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
    };
    return (
        <article className={styles['wrapper']}>
            <div className={styles['choose-color']}>
                {start !== true && <div>
                    <div>
                        <span>Choose color</span>
                        <div>
                            <img src={black_king} alt="white" onClick={onClickBlack} />
                            <img src={white_king} alt="black" onClick={onClickWhite} />
                        </div>
                    </div>
                    <div>
                        <button onClick={onClickStart}>Start</button>
                    </div>
                </div>}
                {start !== false && <div>
                    <button onClick={onClickStartNew}>Start again</button>
                </div>}
            </div>
            <div className={styles['coordinates']}>
                <div className={verticalClass}>
                    {verticalAxis.map(axis => <span key={axis}>{axis}</span>)}
                </div>
                <div className={styles['chess-div']}>
                    <div className={styles['chess-board']}>
                        <Pieces flipped={horizontalClass === 'black'} />
                    </div>
                    <div className={styles.horizontal}>
                        {horizontalClass === 'white' ? (
                            horizontalAxis.map(axis => <span key={axis}>{axis}</span>)
                        ) : (
                            horizontalAxisSecond.map(axis => <span key={axis}>{axis}</span>)
                        )}
                    </div>
                </div>
                <div className={styles['promotion-div']}>
                    <Promotion />
                </div>
            </div>
        </article>
    );
};

export default ChessBoard;