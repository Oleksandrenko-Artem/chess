import React from 'react';
import { useAppContext } from '../../../contexts/Context';
import { copyPosition } from '../../../helpers';
import { makeNewMove } from '../../../reducers/actions/move';
import actionTypes from '../../../reducers/actionTypes';
import black_ferz from '../../../assets/images/icons/black_ferz.png';
import black_rook from '../../../assets/images/icons/black_rook.png';
import black_bishop from '../../../assets/images/icons/black_bishop.png';
import black_horse from '../../../assets/images/icons/black_horse.png';
import white_ferz from '../../../assets/images/icons/white_ferz.png';
import white_rook from '../../../assets/images/icons/white_rook.png';
import white_bishop from '../../../assets/images/icons/white_bishop.png';
import white_horse from '../../../assets/images/icons/white_horse.png';
import styles from '../../Pieces/Pieces.module.scss';

const promoImageMap = {
    black_ferz,
    black_rook,
    black_bishop,
    black_horse,
    white_ferz,
    white_rook,
    white_bishop,
    white_horse,
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
    if (!promotionSquare) {
        return null;
    }
    const color = promotionSquare.targetRank === 0 ? 'white' : 'black';
    const onClick = option => {
        onClosePromotion()
        const newPosition = copyPosition(appState.position[appState.position.length - 1]);
        newPosition[promotionSquare.rank][promotionSquare.file] = '';
        newPosition[promotionSquare.targetRank][promotionSquare.targetFile] = `${color}_${option}`;
        dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
        dispatch(makeNewMove({ newPosition }));
    };
    return (
        <div className={styles['promotion']}>
            {
                options.map(option => {
                    const keyName = `${color}_${option}`;
                    const imageSrc = promoImageMap[keyName];
                    const style = imageSrc ? { backgroundImage: `url(${imageSrc})` } : {};
                    if (option === 'pawn' || option === 'soldier') {
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