import React, { useState, useRef, useEffect } from 'react';
import { copyPosition } from '../../helpers';
import { useAppContext } from '../../contexts/Context';
import { makeNewMove } from '../../reducers/actions/move';
import Piece from './Piece';
import black_king from '../../assets/images/icons/black_king.png';
import black_ferz from '../../assets/images/icons/black_ferz.png';
import black_rook from '../../assets/images/icons/black_rook.png';
import black_horse from '../../assets/images/icons/black_horse.png';
import black_bishop from '../../assets/images/icons/black_bishop.png';
import black_soldier from '../../assets/images/icons/black_soldier.png';
import black_elephant from '../../assets/images/icons/black_elephant.png';
import black_firzan from '../../assets/images/icons/black_firzan.png';
import white_king from '../../assets/images/icons/white_king.png';
import white_ferz from '../../assets/images/icons/white_ferz.png';
import white_rook from '../../assets/images/icons/white_rook.png';
import white_horse from '../../assets/images/icons/white_horse.png';
import white_bishop from '../../assets/images/icons/white_bishop.png';
import white_soldier from '../../assets/images/icons/white_soldier.png';
import white_elephant from '../../assets/images/icons/white_elephant.png';
import white_firzan from '../../assets/images/icons/white_firzan.png';
import styles from './../ChessBoard/ChessBoard.module.scss';

const imageMap = {
    black_king,
    black_ferz,
    black_rook,
    black_horse,
    black_bishop,
    black_soldier,
    black_elephant,
    black_firzan,
    white_king,
    white_ferz,
    white_rook,
    white_horse,
    white_bishop,
    white_soldier,
    white_elephant,
    white_firzan,
};

const getPieceImageSrc = (pieceName) => {
    return imageMap[pieceName] || '';
};

const Pieces = () => {
    const ref = useRef(null);
    const { appState, dispatch } = useAppContext();
    const [imagesLoaded, setImagesLoaded] = useState(false);
    useEffect(() => {
        const loadImage = src => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () => reject();
        });

        const loadAllImages = async () => {
            try {
                const promises = Object.values(imageMap).map(loadImage);
                await Promise.all(promises);
                setImagesLoaded(true);
            } catch (error) {
                console.error("Ошибка загрузки изображений:", error);
                setImagesLoaded(true); 
            }
        };

        loadAllImages();
    }, []);
    if (!appState || !appState.position) {
        return null; 
    }
    const currentPosition = appState.position[appState.position.length - 1];
    const calculateCoords = e => {
        if (!ref.current) return { x: -1, y: -1 };
        const { width, left, top } = ref.current.getBoundingClientRect();
        const size = width / 8;
        const y = Math.floor((e.clientX - left) / size);
        const x = Math.floor((e.clientY - top) / size);
        return { x, y };
    }
    
    const onDrop = e => {
        e.preventDefault();
        const newPosition = copyPosition(currentPosition);
        const coords = calculateCoords(e);
        if (coords.x === -1 || coords.y === -1) return;

        const [p, rankStr, fileStr] = e.dataTransfer.getData('text').split(',');
        const rank = parseInt(rankStr, 10);
        const file = parseInt(fileStr, 10);

        newPosition[rank][file] = '';
        newPosition[coords.x][coords.y] = p;
        dispatch(makeNewMove({ newPosition }));
    }
    const onDragOver = e => e.preventDefault();

    if (!imagesLoaded) {
        return <div>Загрузка фигур...</div>;
    }

    return (
        <div ref={ref} className={styles['chess-board']} onDrop={onDrop} onDragOver={onDragOver}>
            {currentPosition.map((r, rank) =>
                r.map((f, file) => {
                    const number = rank + file + 2;
                    const tileClass = number % 2 === 0 ? styles['white-tile'] : styles['black-tile'];
                    return (
                        <div
                            key={rank + '-' + file}
                            className={tileClass}
                        >
                            {currentPosition[rank][file] 
                                ? <Piece 
                                    rank={rank} 
                                    file={file} 
                                    piece={currentPosition[rank][file]} 
                                    imageSrc={getPieceImageSrc(currentPosition[rank][file])} 
                                  /> 
                                : null
                            }
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Pieces;
