import React from 'react';
import { useAppContext } from '../../contexts/Context';
import { status } from '../../constants';
import PromotionBox from './PromotionBox/PromotionBox';
import styles from './Promotion.module.scss';
import { closePromotion } from '../../reducers/actions/promotion';

const Promotion = () => {
    const { appState, dispatch } = useAppContext();
    if (appState.status === status.ongoing) {
        return null;
    }
    if (appState.status === status.white || appState.status === status.black || appState.status === status.draw) {
        return null;
    }
    const onClosePromotion = () => {
        dispatch(closePromotion());
    };
    return (
        <div className={styles.wrapper}>
            <PromotionBox onClosePromotion={onClosePromotion} />
        </div>
    );
};

export default Promotion;