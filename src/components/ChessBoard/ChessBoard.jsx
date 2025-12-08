import React from 'react';
import styles from './ChessBoard.module.scss';
import Pieces from '../Pieces/Pieces';
    
const ChessBoard = () => {
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
    return (
        <article className={styles['wrapper']}>
            <h1>Chess Board</h1>
            <div className={styles['coordinates']}>
                <div className={styles.vertical}>
                    {verticalAxis.map(axis => <span key={axis}>{axis}</span>)}
                </div>
                <div className={styles['chess-board']}>
                    <Pieces />
                </div>
            </div>
            <div className={styles.horizontal}>
                {horizontalAxis.map(axis => <span key={axis}>{axis}</span>)}
            </div>
        </article>
    );
};

export default ChessBoard;