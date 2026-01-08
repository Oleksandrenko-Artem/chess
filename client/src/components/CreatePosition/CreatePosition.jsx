import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/Context';
import { initialSpecialGameState } from '../../constants';
import { Icon } from '@mdi/react';
import { mdiArrowRightThin } from '@mdi/js';
import { getStoredColor, rgbStringToHex } from '../../utils/color';
import actionTypes from '../../reducers/actionTypes';
import white_pawn from '../../assets/icons/white_soldier.png';
import white_horse from '../../assets/icons/white_horse.png';
import white_bishop from '../../assets/icons/white_bishop.png';
import white_rook from '../../assets/icons/white_rook.png';
import white_ferz from '../../assets/icons/white_ferz.png';
import white_king from '../../assets/icons/white_king.png';
import white_firzan from '../../assets/icons/white_firzan.png';
import white_elephant from '../../assets/icons/white_elephant.png';
import white_tank from '../../assets/icons/white_tank.png';
import white_camel from '../../assets/icons/white_camel.png';
import white_dinozavr from '../../assets/icons/white_dinozavr.png';
import white_giraffe from '../../assets/icons/white_giraffe.png';
import white_sailboat from '../../assets/icons/white_sailboat.png';
import white_rukh from '../../assets/icons/white_rukh.png';
import black_pawn from '../../assets/icons/black_soldier.png';
import black_horse from '../../assets/icons/black_horse.png';
import black_bishop from '../../assets/icons/black_bishop.png';
import black_rook from '../../assets/icons/black_rook.png';
import black_ferz from '../../assets/icons/black_ferz.png';
import black_king from '../../assets/icons/black_king.png';
import black_firzan from '../../assets/icons/black_firzan.png';
import black_elephant from '../../assets/icons/black_elephant.png';
import black_tank from '../../assets/icons/black_tank.png';
import black_camel from '../../assets/icons/black_camel.png';
import black_dinozavr from '../../assets/icons/black_dinozavr.png';
import black_giraffe from '../../assets/icons/black_giraffe.png';
import black_sailboat from '../../assets/icons/black_sailboat.png';
import black_rukh from '../../assets/icons/black_rukh.png';
import styles from './CreatePosition.module.scss';

const CreatePosition = (props) => {
    const { toggleOrientation } = props;
    const { dispatch } = useAppContext();
    const [color, setColor] = useState('white');
    const [pieceSailBoat, setPieceSailBoat] = useState(() => {
        try {
            if (typeof window === 'undefined') return false;
            return localStorage.getItem('replaceRook') === 'sailboat';
        } catch (e) { return false; }
    });
    const [pieceRukh, setPieceRukh] = useState(() => {
        try {
            if (typeof window === 'undefined') return false;
            return localStorage.getItem('replaceRook') === 'rukh';
        } catch (e) { return false; }
    });
    const DEFAULT_LIGHT_COLOR = '#ffdabb';
    const DEFAULT_DARK_COLOR = '#7e5e2e';
    const [lightSquareColor, setLightSquareColor] = useState(() => getStoredColor('lightSquareColor', DEFAULT_LIGHT_COLOR));
    const [darkSquareColor, setDarkSquareColor] = useState(() => getStoredColor('darkSquareColor', DEFAULT_DARK_COLOR));
    useEffect(() => {
        const lightHex = lightSquareColor && lightSquareColor.trim().startsWith('rgb') ? rgbStringToHex(lightSquareColor) : lightSquareColor;
        const darkHex = darkSquareColor && darkSquareColor.trim().startsWith('rgb') ? rgbStringToHex(darkSquareColor) : darkSquareColor;
        localStorage.setItem('lightSquareColor', lightHex);
        localStorage.setItem('darkSquareColor', darkHex);
        document.documentElement.style.setProperty('--light-square-color', lightHex);
        document.documentElement.style.setProperty('--dark-square-color', darkHex);
    }, [lightSquareColor, darkSquareColor]);
    useEffect(() => {
        const initLight = lightSquareColor && lightSquareColor.trim().startsWith('rgb') ? rgbStringToHex(lightSquareColor) : lightSquareColor;
        const initDark = darkSquareColor && darkSquareColor.trim().startsWith('rgb') ? rgbStringToHex(darkSquareColor) : darkSquareColor;
        document.documentElement.style.setProperty('--light-square-color', initLight);
        document.documentElement.style.setProperty('--dark-square-color', initDark);
    }, []);
    const handleChangeColor = () => {
        if (color === 'white') {
            setColor('black');
        } else {
            setColor('white');
        }
    };
    const handleResetPosition = () => {
        dispatch({ type: actionTypes.RESET_GAME, payload: { initialState: initialSpecialGameState } });
    };
    const handleResetBoardColors = () => {
        setLightSquareColor(DEFAULT_LIGHT_COLOR);
        setDarkSquareColor(DEFAULT_DARK_COLOR);
    };
    const handleReplacePieceSailBoat = () => {
        const newVal = !pieceSailBoat;
        setPieceSailBoat(newVal);
        setPieceRukh(false);
        try {
            if (typeof window !== 'undefined') {
                const newReplacement = newVal ? 'sailboat' : 'rook';
                localStorage.setItem('replaceRook', newReplacement);
                window.dispatchEvent(new CustomEvent('rook-replacement-changed', { detail: { replacement: newReplacement } }));
            }
        } catch (e) {}
    };
    const handleReplacePieceRukh = () => {
        const newVal = !pieceRukh;
        setPieceRukh(newVal);
        setPieceSailBoat(false);
        try {
            if (typeof window !== 'undefined') {
                const newReplacement = newVal ? 'rukh' : 'rook';
                localStorage.setItem('replaceRook', newReplacement);
                window.dispatchEvent(new CustomEvent('rook-replacement-changed', { detail: { replacement: newReplacement } }));
            }
        } catch (e) {}
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles['btns-div']}>
                <button onClick={handleChangeColor}>Change color</button>
                <button onClick={toggleOrientation}>Rotate</button>
                <button onClick={handleResetPosition}>Reset position</button>
            </div>
            <div className={styles['board-colors']}>
                <label>
                    Light tiles:
                </label>
                <input type="color" value={lightSquareColor} onChange={(e) => setLightSquareColor(e.target.value)} />
                <label>
                    Dark tiles:
                </label>
                <input type="color" value={darkSquareColor} onChange={(e) => setDarkSquareColor(e.target.value)} />
                <button onClick={handleResetBoardColors} className={styles['reset-colors-btn']}>
                    Reset colors
                </button>
            </div>
            {color === 'white' && <div>
                <div>
                    <h3>Standart Pieces</h3>
                    <img src={white_pawn} alt="white_pawn" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_pawn,isNew`)} />
                    <img src={white_horse} alt="white_horse" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_horse,isNew`)}/>
                    <img src={white_bishop} alt="white_bishop" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_bishop,isNew`)}/>
                    <img src={pieceSailBoat && white_sailboat || pieceRukh && white_rukh || white_rook} alt="white_rook"
                    draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `${pieceSailBoat ? 'white_sailboat' : pieceRukh ? 'white_rukh' : 'white_rook'},isNew`)}/>
                    <img src={white_ferz} alt="white_ferz" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_ferz,isNew`)}/>
                    <img src={white_king} alt="white_king" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_king,isNew`)}/>
                </div>
                <div>
                    <h3>Old Pieces</h3>
                    <img src={white_firzan} alt="white_firzan" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_firzan,isNew`)} />
                    <img src={white_elephant} alt="white_elephant" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_elephant,isNew`)} />
                    <img src={white_tank} alt="white_tank" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_tank,isNew`)} />
                    <img src={white_camel} alt="white_camel" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_camel,isNew`)} />
                    <img src={white_giraffe} alt="white_giraffe" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_giraffe,isNew`)} />
                </div>
                <div>
                    <h3>Special Pieces</h3>
                    <img src={white_dinozavr} alt="white_dinozavr" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_dinozavr,isNew`)} />
                </div>
                <div className={styles['replace-pieces']}>
                    <div>
                        <div className={styles['pieces-variants-text']}>
                            <h4>Replace rook with sailboat</h4>
                        </div>
                        <div onClick={handleReplacePieceSailBoat} className={`${styles['pieces-variants']} ${pieceSailBoat ? styles['selected'] : ''}`}>
                            <div className={styles['pieces-variants']}>
                                <img src={white_rook} alt="white_rook" draggable={false} />
                                <Icon path={mdiArrowRightThin} size={1.5} />
                                <img src={white_sailboat} alt="white_sailboat" draggable={false} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={styles['pieces-variants-text']}>
                            <h4>Replace rook with rukh</h4>
                        </div>
                        <div onClick={handleReplacePieceRukh} className={`${styles['pieces-variants']} ${pieceRukh ? styles['selected'] : ''}`}>
                            <div className={styles['pieces-variants']}>
                                <img src={white_rook} alt="white_rook" draggable={false} />
                                <Icon path={mdiArrowRightThin} size={1.5} />
                                <img src={white_rukh} alt="white_rukh" draggable={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {color === 'black' && <div>
                <div>
                    <h3>Standart Pieces</h3>
                    <img src={black_pawn} alt="black_pawn" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_pawn,isNew`)} />
                    <img src={black_horse} alt="black_horse" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_horse,isNew`)} />
                    <img src={black_bishop} alt="black_bishop" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_bishop,isNew`)} />
                    <img src={pieceSailBoat && black_sailboat || pieceRukh && black_rukh || black_rook} alt="black_rook" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `${pieceSailBoat ? 'black_sailboat' : pieceRukh ? 'black_rukh' : 'black_rook'},isNew`)}/>
                    <img src={black_ferz} alt="black_ferz" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_ferz,isNew`)} />
                    <img src={black_king} alt="black_king" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_king,isNew`)} />
                </div>
                <div>
                    <h3>Old Pieces</h3>
                    <img src={black_firzan} alt="black_firzan" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_firzan,isNew`)} />
                    <img src={black_elephant} alt="black_elephant" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_elephant,isNew`)} />
                    <img src={black_tank} alt="black_tank" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_tank,isNew`)} />
                    <img src={black_camel} alt="black_camel" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_camel,isNew`)} />
                    <img src={black_giraffe} alt="black_giraffe" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_giraffe,isNew`)} />
                </div>
                <div>
                    <h3>Special Pieces</h3>
                    <img src={black_dinozavr} alt="black_dinozavr" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_dinozavr,isNew`)} />
                </div>
                <div className={styles['replace-pieces']}>
                    <div>
                        <div className={styles['pieces-variants-text']}>
                            <h4>Replace rook with sailboat</h4>
                        </div>
                        <div onClick={handleReplacePieceSailBoat} className={`${styles['pieces-variants']} ${pieceSailBoat ? styles['selected'] : ''}`}>
                            <div className={styles['pieces-variants']}>
                                <img src={black_rook} alt="black_rook" draggable={false} />
                                <Icon path={mdiArrowRightThin} size={1.5} />
                                <img src={black_sailboat} alt="black_sailboat" draggable={false} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={styles['pieces-variants-text']}>
                            <h4>Replace rook with rukh</h4>
                        </div>
                        <div onClick={handleReplacePieceRukh} className={`${styles['pieces-variants']} ${pieceRukh ? styles['selected'] : ''}`}>
                            <div className={styles['pieces-variants']}>
                                <img src={black_rook} alt="black_rook" draggable={false} />
                                <Icon path={mdiArrowRightThin} size={1.5} />
                                <img src={black_rukh} alt="black_rukh" draggable={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default CreatePosition;