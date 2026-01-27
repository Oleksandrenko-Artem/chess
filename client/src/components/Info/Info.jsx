import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Info.module.scss';

const Info = () => {
    const { t } = useTranslation();
    return (
        <article className={styles.wrapper}>
            <h1>{t('header.info')}</h1>
            <div>
                <div>
                    <h2>{t('pieces.pawn.name')}</h2>
                    <div>
                        <img src="/src/assets/icons/white_soldier.png" alt="white_pawn" />
                        <img src="/src/assets/icons/black_soldier.png" alt="black_pawn" /> 
                    </div>
                </div>
                <h3>{t('pieces.desc_caption')}</h3>
                <p>{t('pieces.pawn.desc')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/pawn_directions.png" alt="pawn_directions" />
                    <img src="/src/assets/images/pawn_attacks.png" alt="pawn_attacks" />
                </div>
                <h3>{t('pieces.history_caption')}</h3>
                <p>{t('pieces.pawn.history')}</p>
            </div>
            <div>
                <div>
                    <h2>{t('pieces.horse.name')}</h2>
                    <div>
                        <img src="/src/assets/icons/white_horse.png" alt="white_horse" />
                        <img src="/src/assets/icons/black_horse.png" alt="black_horse" />
                    </div>
                </div>
                <h3>{t('pieces.desc_caption')}</h3>
                <p>{t('pieces.horse.desc')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/horse_directions.png" alt="horse_directions" />
                    <img src="/src/assets/images/horse_attacks.png" alt="horse_attacks" />
                </div>
                <h3>{t('pieces.history_caption')}</h3>
                <p>{t('pieces.horse.history')}</p>
            </div>
            <div>
                <div>
                    <h2>{t('pieces.bishop.name')}</h2>
                    <div>
                        <img src="/src/assets/icons/white_bishop.png" alt="white_bishop" />
                        <img src="/src/assets/icons/black_bishop.png" alt="black_bishop" />
                        <img src="/src/assets/icons/white_elephant.png" alt="white_elephant" />
                        <img src="/src/assets/icons/black_elephant.png" alt="black_elephant" />
                    </div>
                </div>
                <h3>{t('pieces.desc_caption')}</h3>
                <p>{t('pieces.bishop.desc')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/bishop_directions.png" alt="bishop_directions" />
                    <img src="/src/assets/images/bishop_attacks.png" alt="bishop_attacks" />
                </div>
                <h3>{t('pieces.history_caption')}</h3>
                <p>{t('pieces.bishop.history')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/elephant_directions.png" alt="elephant_directions" />
                    <img src="/src/assets/images/elephant_attacks.png" alt="elephant_attacks" />
                </div>
            </div>
            <div>
                <div>
                    <h2>{t('pieces.rook.name')}</h2>
                    <div>
                        <img src="/src/assets/icons/white_rook.png" alt="white_rook" />
                        <img src="/src/assets/icons/black_rook.png" alt="black_rook" />
                        <img src="/src/assets/icons/white_sailboat.png" alt="white_sailboat" />
                        <img src="/src/assets/icons/black_sailboat.png" alt="black_sailboat" />
                        <img src="/src/assets/icons/white_rukh.png" alt="white_rukh" />
                        <img src="/src/assets/icons/black_rukh.png" alt="black_rukh" />
                    </div>
                </div>
                <h3>{t('pieces.desc_caption')}</h3>
                <p>{t('pieces.rook.desc')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/rook_directions.png" alt="rook_directions" />
                    <img src="/src/assets/images/rook_attacks.png" alt="rook_attacks" />
                </div>
                <h3>{t('pieces.history_caption')}</h3>
                <p>{t('pieces.rook.history')}</p>
            </div>
            <div>
                <div>
                    <h2>{t('pieces.ferz.name')}</h2>
                    <div>
                        <img src="/src/assets/icons/white_ferz.png" alt="white_ferz" />
                        <img src="/src/assets/icons/black_ferz.png" alt="black_ferz" />
                        <img src="/src/assets/icons/white_firzan.png" alt="white_firzan" />
                        <img src="/src/assets/icons/black_firzan.png" alt="black_firzan" />
                    </div>
                </div>
                <h3>{t('pieces.desc_caption')}</h3>
                <p>{t('pieces.ferz.desc')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/ferz_directions.png" alt="ferz_directions" />
                    <img src="/src/assets/images/ferz_attacks.png" alt="ferz_attacks" />
                </div>
                <h3>{t('pieces.history_caption')}</h3>
                <p>{t('pieces.ferz.history')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/firzan_directions.png" alt="firzan_directions" />
                    <img src="/src/assets/images/firzan_attacks.png" alt="firzan_attacks" />
                </div>
            </div>
            <div>
                <div>
                    <h2>{t('pieces.king.name')}</h2>
                    <div>
                        <img src="/src/assets/icons/white_king.png" alt="white_king" />
                        <img src="/src/assets/icons/black_king.png" alt="white_king" />
                    </div>
                </div>
                <h3>{t('pieces.desc_caption')}</h3>
                <p>{t('pieces.king.desc')}</p>
                <div className={styles['pieces-info']}>
                    <img src="/src/assets/images/king_directions.png" alt="king_directions" />
                    <img src="/src/assets/images/king_attacks.png" alt="king_attacks" />
                    <img src="/src/assets/images/king_castling.png" alt="king_castling" />
                    <img src="/src/assets/images/king_castling_second.png" alt="king_castling_second" />
                    <img src="/src/assets/images/king_castling_third.png" alt="king_castling_third" />
                </div>
                <h3>{t('pieces.history_caption')}</h3>
                <p>{t('pieces.king.history')}</p>
            </div>
        </article>
    );
}

export default Info;