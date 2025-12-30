import React, { useState } from 'react';
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
import styles from './CreatePosition.module.scss';

const CreatePosition = (props) => {
    const { toggleOrientation } = props;
    const { dispatch } = useAppContext();
    const [color, setColor] = useState('white');
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
    return (
        <div className={styles.wrapper}>
            <div className={styles['btns-div']}>
                <button onClick={handleChangeColor}>Change color</button>
                <button onClick={handleResetPosition}>Reset position</button>
                <button onClick={toggleOrientation}>Rotate</button>
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