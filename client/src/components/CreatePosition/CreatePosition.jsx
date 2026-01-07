import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/Context';
import { initialSpecialGameState } from '../../constants';
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
import styles from './CreatePosition.module.scss';

const CreatePosition = (props) => {
    const { toggleOrientation } = props;
    const { dispatch } = useAppContext();
    const [color, setColor] = useState('white');
    const DEFAULT_LIGHT_COLOR = '#ffdabb';
    const DEFAULT_DARK_COLOR = '#7e5e2e';
    const rgbStringToHex = (rgb) => {
        if (!rgb || typeof rgb !== 'string') return rgb;
        const m = rgb.match(/rgba?\s*\((\s*\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
        if (!m) return rgb;
        const toHex = (n) => {
            const v = parseInt(n, 10);
            const h = v.toString(16);
            return h.length === 1 ? '0' + h : h;
        };
        return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
    };
    const getStoredColor = (key, defaultColor) => {
        try {
            const v = localStorage.getItem(key);
            if (!v) return defaultColor;
            if (v.trim().startsWith('rgb')) return rgbStringToHex(v);
            return v;
        } catch (e) {
            return defaultColor;
        }
    };
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
                    <h3>Standart</h3>
                    <img src={white_pawn} alt="white_pawn" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_pawn,isNew`)} />
                    <img src={white_horse} alt="white_horse" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_horse,isNew`)}/>
                    <img src={white_bishop} alt="white_bishop" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_bishop,isNew`)}/>
                    <img src={white_rook} alt="white_rook"
                    draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_rook,isNew`)}/>
                    <img src={white_ferz} alt="white_ferz" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_ferz,isNew`)}/>
                    <img src={white_king} alt="white_king" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_king,isNew`)}/>
                </div>
                <div>
                    <h3>Old</h3>
                    <img src={white_firzan} alt="white_firzan" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_firzan,isNew`)} />
                    <img src={white_elephant} alt="white_elephant" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_elephant,isNew`)} />
                    <img src={white_tank} alt="white_tank" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_tank,isNew`)} />
                    <img src={white_camel} alt="white_camel" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_camel,isNew`)} />
                    <img src={white_giraffe} alt="white_giraffe" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_giraffe,isNew`)} />
                </div>
                <div>
                    <h3>Special</h3>
                    <img src={white_dinozavr} alt="white_dinozavr" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `white_dinozavr,isNew`)} />
                </div>
            </div>}
            {color === 'black' && <div>
                <div>
                    <h3>Standart</h3>
                    <img src={black_pawn} alt="black_pawn" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_pawn,isNew`)} />
                    <img src={black_horse} alt="black_horse" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_horse,isNew`)} />
                    <img src={black_bishop} alt="black_bishop" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_bishop,isNew`)} />
                    <img src={black_rook} alt="black_rook" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_rook,isNew`)} />
                    <img src={black_ferz} alt="black_ferz" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_ferz,isNew`)} />
                    <img src={black_king} alt="black_king" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_king,isNew`)} />
                </div>
                <div>
                    <h3>Old</h3>
                    <img src={black_firzan} alt="black_firzan" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_firzan,isNew`)} />
                    <img src={black_elephant} alt="black_elephant" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_elephant,isNew`)} />
                    <img src={black_tank} alt="black_tank" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_tank,isNew`)} />
                    <img src={black_camel} alt="black_camel" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_camel,isNew`)} />
                    <img src={black_giraffe} alt="black_giraffe" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_giraffe,isNew`)} />
                </div>
                <div>
                    <h3>Special</h3>
                    <img src={black_dinozavr} alt="black_dinozavr" draggable="true" onDragStart={(e) => e.dataTransfer.setData('text', `black_dinozavr,isNew`)} />
                </div>
            </div>}
        </div>
    );
}

export default CreatePosition;