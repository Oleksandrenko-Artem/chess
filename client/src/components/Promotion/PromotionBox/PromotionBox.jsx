import React, { useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../../../contexts/Context';
import { copyPosition, getNewMoveNotation } from '../../../helpers';
import { promoteAndMove } from '../../../reducers/actions/promotion';
import arbiter from '../../../arbiter/arbiter';
import black_ferz from '../../../assets/icons/black_ferz.png';
import black_rook from '../../../assets/icons/black_rook.png';
import black_bishop from '../../../assets/icons/black_bishop.png';
import black_horse from '../../../assets/icons/black_horse.png';
import white_ferz from '../../../assets/icons/white_ferz.png';
import white_rook from '../../../assets/icons/white_rook.png';
import white_bishop from '../../../assets/icons/white_bishop.png';
import white_horse from '../../../assets/icons/white_horse.png';
import white_sailboat from '../../../assets/icons/white_sailboat.png';
import white_rukh from '../../../assets/icons/white_rukh.png';
import black_sailboat from '../../../assets/icons/black_sailboat.png';
import black_rukh from '../../../assets/icons/black_rukh.png';
import styles from '../../Pieces/Pieces.module.scss';

const promoImageMap = {
    black_ferz,
    black_rook,
    black_bishop,
    black_horse,
    black_sailboat,
    black_rukh,
    white_ferz,
    white_rook,
    white_bishop,
    white_horse,
    white_sailboat,
    white_rukh,
};

const PromotionBox = ({ onClosePromotion }) => {
    const options = [
        'ferz',
        'rook',
        'bishop',
        'horse',
    ];
    const { appState, dispatch } = useAppContext();
    const { promotionSquare } = appState;
    const variant = typeof window !== 'undefined' ? window.localStorage.getItem('chess_variant') : 'chess';
    const color = promotionSquare?.targetRank === 0 ? 'white' : 'black';
    const replaceSetting = typeof window !== 'undefined' ? localStorage.getItem('replaceRook') : null;
    const processedPromotionRef = useRef(null);
    const handlePromotion = useCallback((pieceName) => {
        if (!promotionSquare) return;
        const newPosition = copyPosition(appState.position[appState.position.length - 1]);
        newPosition[promotionSquare.rank][promotionSquare.file] = '';
        let finalPieceName = pieceName;
        if (pieceName === 'rook') {
            try {
                const rep = typeof window !== 'undefined' ? localStorage.getItem('replaceRook') : null;
                if (rep === 'sailboat') finalPieceName = 'sailboat';
                else if (rep === 'rukh') finalPieceName = 'rukh';
            } catch (e) {}
        }
        newPosition[promotionSquare.targetRank][promotionSquare.targetFile] = `${color}_${finalPieceName}`;
        const newCastleDirection = { ...appState.castleDirection };
        const piece = appState.position[appState.position.length - 1][promotionSquare.targetRank]?.[promotionSquare.targetFile];
        if (piece && piece.endsWith('rook')) {
            const playerColor = piece.startsWith('white') ? 'white' : 'black';
            const currentDir = newCastleDirection[playerColor];
            if (promotionSquare.targetFile === 0) {
                newCastleDirection[playerColor] = currentDir === 'both' ? 'right' : 'none';
            } else if (promotionSquare.targetFile === 7) {
                newCastleDirection[playerColor] = currentDir === 'both' ? 'left' : 'none';
            }
        }
        const nextPlayer = appState.playerTurn === 'white' ? 'black' : 'white';
        const gameStatus = arbiter.getGameStatus({ 
            position: newPosition, 
            playerColor: nextPlayer, 
            castleDirection: newCastleDirection 
        });
        const newMove = getNewMoveNotation({
            ...promotionSquare,
            p: color + '_pawn',
            promotesTo: pieceName,
            position: appState.position[appState.position.length - 1]
        })
        dispatch(promoteAndMove({ newPosition, newMove, castleDirection: newCastleDirection, gameStatus }));
    }, [promotionSquare, appState.position, appState.castleDirection, dispatch, color]);
    useEffect(() => {
        if (promotionSquare && variant === 'shatranj') {
            const promotionKey = `${promotionSquare.rank}-${promotionSquare.file}-${promotionSquare.targetRank}-${promotionSquare.targetFile}`;
            if (processedPromotionRef.current === promotionKey) {
                return;
            }
            processedPromotionRef.current = promotionKey;
            handlePromotion('firzan');
        }
    }, [promotionSquare, variant, handlePromotion]);
    
    if (!promotionSquare) {
        processedPromotionRef.current = null;
        return null;
    }
    const onClick = option => {
        handlePromotion(option);
        onClosePromotion?.();
    };
    if (variant === 'shatranj') {
        return null;
    }
    return (
        <div className={styles['promotion']}>
            {
                options.map(option => {
                    const displayOption = option === 'rook' ? (replaceSetting === 'sailboat' ? 'sailboat' : replaceSetting === 'rukh' ? 'rukh' : 'rook') : option;
                    const keyName = `${color}_${displayOption}`;
                    const imageSrc = promoImageMap[keyName];
                    const style = imageSrc ? { backgroundImage: `url(${imageSrc})` } : {};
                    if (option === 'pawn') {
                        style.marginTop = '5px';
                        style.width = '40px';
                    }
                    return <div key={option} className={`${styles.piece} ${styles.selected}`} style={style} onClick={()=>onClick(option)}></div>
                })
            }
        </div>
    );
};

export default PromotionBox;