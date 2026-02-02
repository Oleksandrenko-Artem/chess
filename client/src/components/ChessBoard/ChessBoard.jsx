import React from 'react';
import { useAppContext } from '../../contexts/Context';
import Pieces from '../Pieces/Pieces';
import Promotion from '../Promotion/Promotion';
import styles from './ChessBoard.module.scss';
import CapturedPieces from '../CapturedPieces/CapturedPieces';
    
const ChessBoard = () => {
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const horizontalAxisSecond = ["h", "g", "f", "e", "d", "c", "b", "a"];
    const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const { appState } = useAppContext();
    const orientation = appState.orientation;
    const verticalClass = orientation === 'white' 
        ? styles['vertical'] 
        : styles['vertical-second'];
    return (
        <article className={styles['wrapper']}>
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
            </div>
        </article>
    );
};

export default ChessBoard;