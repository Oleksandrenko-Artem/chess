import React from 'react';
import { pieceValues } from '../../constants';
import styles from './CapturedPieces.module.scss';
import black_pawn from '../../assets/icons/black_soldier.png';
import black_soldier from '../../assets/icons/black_soldier.png';
import black_horse from '../../assets/icons/black_horse.png';
import black_bishop from '../../assets/icons/black_bishop.png';
import black_firzan from '../../assets/icons/black_firzan.png';
import black_tank from '../../assets/icons/black_tank.png';
import black_camel from '../../assets/icons/black_camel.png';
import black_elephant from '../../assets/icons/black_elephant.png';
import black_rook from '../../assets/icons/black_rook.png';
import black_sailboat from '../../assets/icons/black_sailboat.png';
import black_rukh from '../../assets/icons/black_rukh.png';
import black_ferz from '../../assets/icons/black_ferz.png';
import black_king from '../../assets/icons/black_king.png';
import black_checkers from '../../assets/icons/black_checkers.png';
import black_giraffe from '../../assets/icons/black_giraffe.png';
import black_dinozavr from '../../assets/icons/black_dinozavr.png';
import white_pawn from '../../assets/icons/white_soldier.png';
import white_soldier from '../../assets/icons/white_soldier.png';
import white_horse from '../../assets/icons/white_horse.png';
import white_bishop from '../../assets/icons/white_bishop.png';
import white_firzan from '../../assets/icons/white_firzan.png';
import white_tank from '../../assets/icons/white_tank.png';
import white_camel from '../../assets/icons/white_camel.png';
import white_elephant from '../../assets/icons/white_elephant.png';
import white_rook from '../../assets/icons/white_rook.png';
import white_sailboat from '../../assets/icons/white_sailboat.png';
import white_rukh from '../../assets/icons/white_rukh.png';
import white_ferz from '../../assets/icons/white_ferz.png';
import white_king from '../../assets/icons/white_king.png';
import white_checkers from '../../assets/icons/white_checkers.png';
import white_giraffe from '../../assets/icons/white_giraffe.png';
import white_dinozavr from '../../assets/icons/white_dinozavr.png';

const imageMap = {
    black_pawn,
    black_soldier,
    black_horse,
    black_bishop,
    black_firzan,
    black_tank,
    black_camel,
    black_elephant,
    black_rook,
    black_sailboat,
    black_rukh,
    black_ferz,
    black_king,
    black_checkers,
    black_giraffe,
    black_dinozavr,
    white_pawn,
    white_soldier,
    white_horse,
    white_bishop,
    white_firzan,
    white_tank,
    white_camel,
    white_elephant,
    white_rook,
    white_sailboat,
    white_rukh,
    white_ferz,
    white_king,
    white_checkers,
    white_giraffe,
    white_dinozavr,
};
const getPieceType = (pieceName) => {
    if (!pieceName) return null;
    const parts = pieceName.split('_');
    if (parts.length > 1) {
        const type = parts[1];
        if (type === 'sailboat' || type === 'rukh') {
            return type;
        }
        return type;
    }
    return pieceName;
};
const CapturedPieces = ({ whiteCaptures, blackCaptures, handleHideCustomPanel }) => {
    const calculateScore = (captures) => {
        return captures.reduce((sum, piece) => {
            const type = getPieceType(piece);
            return sum + (pieceValues[type] || 0);
        }, 0);
    };
    const whiteCaptureScore = calculateScore(whiteCaptures);
    const blackCaptureScore = calculateScore(blackCaptures);
    const balance = whiteCaptureScore - blackCaptureScore;
    return (
        <div className={styles['captured-container']}>
            <div className={styles['side-white']}>
                <div className={styles['header-button']}>
                    <h3>White Captures</h3>
                </div>
                <div className={styles['captures']}>
                    {whiteCaptures.map((piece, idx) => {
                        const type = getPieceType(piece);
                        const value = pieceValues[type] || 0;
                        return (
                            <div key={idx} className={styles['captured-piece']}>
                                <img src={imageMap[piece]} alt={piece} title={`${piece} (+${value})`} />
                                <span className={styles['value']}>+{value}</span>
                            </div>
                        );
                    })}
                </div>
                <div className={styles['score']}>Score: {whiteCaptureScore}</div>
            </div>
            <div className={styles['balance']}>
                <div className={`${styles['balance-text']} ${balance > 0 ? styles['white-ahead'] : balance < 0 ? styles['black-ahead'] : ''}`}>
                    {balance > 0 ? `White +${balance}` : balance < 0 ? `Black +${Math.abs(balance)}` : 'Equal'}
                </div>
            </div>
            <div className={styles['side-black']}>
                <h3>Black Captures</h3>
                <div className={styles['captures']}>
                    {blackCaptures.map((piece, idx) => {
                        const type = getPieceType(piece);
                        const value = pieceValues[type] || 0;
                        return (
                            <div key={idx} className={styles['captured-piece']}>
                                <img src={imageMap[piece]} alt={piece} title={`${piece} (+${value})`} />
                                <span className={styles['value']}>+{value}</span>
                            </div>
                        );
                    })}
                </div>
                <div className={styles['score']}>Score: {blackCaptureScore}</div>
            </div>
        </div>
    );
};

export default CapturedPieces;
