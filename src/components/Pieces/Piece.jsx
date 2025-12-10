import React from 'react';
import { useAppContext } from '../../contexts/Context';
import styles from './Pieces.module.scss';
import arbiter from '../../arbiter/arbiter';
import { generateValidMoves } from '../../reducers/actions/move';

const Piece = ({ rank, file, piece, imageSrc }) => {
    const baseClass = styles.piece;
    const pieceTypeClass = styles[piece];

    const classNames = `${baseClass} ${pieceTypeClass}`;

    const { appState, dispatch } = useAppContext();
    const { playerTurn, position } = appState;
    const currentPosition = position[position.length - 1];

    const onDragStart = e => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${piece},${rank},${file}`);
        const img = new Image();
        img.src = imageSrc;
        e.dataTransfer.setDragImage(img, 25, 25);
        setTimeout(() => {
            e.target.classList.add(styles.dragging);
        }, 0);
        if (piece.startsWith(playerTurn)) {
            const validMoves = arbiter.getRegularMoves({ position: currentPosition, piece, rank, file });
            dispatch(generateValidMoves({ validMoves }));
        }
    };
    const onDragEnd = e => e.target.classList.remove(styles.dragging);
    return (
        <div className={classNames} draggable={true} onDragStart={onDragStart} onDragEnd={onDragEnd}></div>
    );
};

export default Piece;