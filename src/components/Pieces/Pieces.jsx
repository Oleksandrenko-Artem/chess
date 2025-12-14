import React, { useState, useRef, useEffect } from 'react';
import actionTypes from '../../reducers/actionTypes';
import { openPromotion } from '../../reducers/actions/promotion';
import { copyPosition } from '../../helpers';
import { useAppContext } from '../../contexts/Context';
import { makeNewMove } from '../../reducers/actions/move';
import { status } from '../../constants';
import Piece from './Piece';
import black_king from '../../assets/images/icons/black_king.png';
import black_ferz from '../../assets/images/icons/black_ferz.png';
import black_rook from '../../assets/images/icons/black_rook.png';
import black_horse from '../../assets/images/icons/black_horse.png';
import black_bishop from '../../assets/images/icons/black_bishop.png';
import black_pawn from '../../assets/images/icons/black_soldier.png';
import black_soldier from '../../assets/images/icons/black_soldier.png';
import black_elephant from '../../assets/images/icons/black_elephant.png';
import black_firzan from '../../assets/images/icons/black_firzan.png';
import black_dinozavr from '../../assets/images/icons/black_dinozavr.png';
import white_king from '../../assets/images/icons/white_king.png';
import white_ferz from '../../assets/images/icons/white_ferz.png';
import white_rook from '../../assets/images/icons/white_rook.png';
import white_horse from '../../assets/images/icons/white_horse.png';
import white_bishop from '../../assets/images/icons/white_bishop.png';
import white_pawn from '../../assets/images/icons/white_soldier.png';
import white_soldier from '../../assets/images/icons/white_soldier.png';
import white_elephant from '../../assets/images/icons/white_elephant.png';
import white_firzan from '../../assets/images/icons/white_firzan.png';
import white_dinozavr from '../../assets/images/icons/white_dinozavr.png';
import styles from './../ChessBoard/ChessBoard.module.scss';

const imageMap = {
    black_king,
    black_ferz,
    black_rook,
    black_horse,
    black_bishop,
    black_soldier,
    black_pawn,
    black_elephant,
    black_firzan,
    black_dinozavr,
    white_king,
    white_ferz,
    white_rook,
    white_horse,
    white_bishop,
    white_pawn,
    white_soldier,
    white_elephant,
    white_firzan,
    white_dinozavr,
};

const getPieceImageSrc = (pieceName) => {
    return imageMap[pieceName] || '';
};

const Pieces = ({ flipped = false }) => {
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
        let dispFile = Math.floor((e.clientX - left) / size);
        let dispRank = Math.floor((e.clientY - top) / size);
        if (dispFile < 0 || dispFile > 7 || dispRank < 0 || dispRank > 7) return { x: -1, y: -1 };
        const realFile = flipped ? 7 - dispFile : dispFile;
        const realRank = flipped ? 7 - dispRank : dispRank;
        return { x: realRank, y: realFile };
    };
    const openPromotionBox = ({ rank, file, targetRank, targetFile }) => {
        dispatch(openPromotion({
            rank: Number(rank), file: Number(file), targetRank, targetFile
        }));
    };
    const onDrop = e => {
        e.preventDefault();
        if (appState.status !== status.ongoing) {
            return;
        }
        const coords = calculateCoords(e);
        if (coords.x === -1 || coords.y === -1) return;

        const [p, rankStr, fileStr] = e.dataTransfer.getData('text').split(',');
        const rank = parseInt(rankStr, 10);
        const file = parseInt(fileStr, 10);
        const targetRank = coords.x;
        const targetFile = coords.y;
        const isValidMove = appState.validMoves?.find(
            move => move[0] === targetRank && move[1] === targetFile
        );
        if (isValidMove) {
            if ((p === 'white_pawn' && targetRank === 0) || (p === 'black_pawn' && targetRank === 7)) {
                openPromotionBox({ rank, file, targetRank, targetFile });
                return;
            }
            if ((p === 'white_soldier' && targetRank === 0) || (p === 'black_soldier' && targetRank === 7)) {
                openPromotionBox({ rank, file, targetRank, targetFile });
                return;
            }
        }
        if (!isValidMove) {
            dispatch({ type: actionTypes.CLEAR_VALID_MOVES });
            return; 
        }
        const newPosition = copyPosition(currentPosition);
        if (p.endsWith('pawn') && !newPosition[targetRank][targetFile] && targetFile !== file) {
            newPosition[rank][targetFile] = '';
        }
        newPosition[rank][file] = '';
        newPosition[targetRank][targetFile] = p;
        dispatch(makeNewMove({ newPosition }));
        dispatch({type: actionTypes.CLEAR_VALID_MOVES});
    }
    const onDragOver = e => e.preventDefault();

    if (!imagesLoaded) {
        return <div>Загрузка фигур...</div>;
    }
    const position = appState.position[appState.position.length - 1]

    return (
        <div ref={ref} className={styles['chess-board']} onDrop={onDrop} onDragOver={onDragOver}>
            {[...Array(8)].map((_, dispRank) => {
                return (
                    <React.Fragment key={dispRank}>
                        {[...Array(8)].map((__, dispFile) => {
                            const realRank = flipped ? 7 - dispRank : dispRank;
                            const realFile = flipped ? 7 - dispFile : dispFile;
                            const f = currentPosition[realRank][realFile];
                            const number = dispRank + dispFile + 2;
                            let tileClass = number % 2 === 0 ? styles['white-tile'] : styles['black-tile'];
                            if (appState.validMoves?.find(m => m[0] === realRank && m[1] === realFile)) {
                                const selected = appState.selected;
                                let isAttack = !!position[realRank][realFile];
                                if (!isAttack && selected && selected.piece && selected.piece.endsWith('pawn')) {
                                    const fromFile = selected.from?.[1];
                                    if (fromFile !== undefined && fromFile !== realFile) {
                                        isAttack = true;
                                    }
                                }
                                if (isAttack) {
                                    tileClass += ` ${styles['attacking']}`
                                } else {
                                    tileClass += ` ${styles['highlight']}`
                                }
                            }
                            return (
                                <div
                                    key={realRank + '-' + realFile}
                                    className={tileClass}
                                >
                                    {f 
                                        ? <Piece 
                                            rank={realRank} 
                                            file={realFile} 
                                            piece={f} 
                                            imageSrc={getPieceImageSrc(f)} 
                                          /> 
                                        : null
                                    }
                                </div>
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Pieces;
