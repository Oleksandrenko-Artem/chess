import React from 'react';
import styles from './Pieces.module.scss';

const Piece = ({ rank, file, piece, imageSrc }) => {
    const baseClass = styles.piece;
    const pieceTypeClass = styles[piece];

    const classNames = `${baseClass} ${pieceTypeClass}`;
    const onDragStart = e => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${piece},${rank},${file}`);
        const img = new Image();
        img.src = imageSrc;
        e.dataTransfer.setDragImage(img, 25, 25);
        setTimeout(() => {
            e.target.classList.add(styles.dragging);
        }, 0);
    }
    const onDragEnd = e => e.target.classList.remove(styles.dragging);
    return (
        <div className={classNames} draggable={true} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            
        </div>
    );
};

export default Piece;