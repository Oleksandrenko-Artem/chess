import React from 'react';
import { useAppContext } from '../../contexts/Context';
import { status } from '../../constants';
import styles from './Pieces.module.scss';
import arbiter from '../../arbiter/arbiter';
import { generateValidMoves } from '../../reducers/actions/move';

const Piece = ({ rank, file, piece, imageSrc }) => {
    const baseClass = styles.piece;
    const classNames = `${baseClass}`;
    const style = imageSrc ? { backgroundImage: `url(${imageSrc})` } : {};
    if (piece && (piece.endsWith('pawn') || piece.endsWith('soldier'))) {
        style.marginTop = '11px';
        style.width = '40px';
    }

    const { appState, dispatch } = useAppContext();
    const { playerTurn, castleDirection, position } = appState;
    const currentPosition = position[position.length - 1];
    
    const prevBoard = position.length > 1 ? position[position.length - 2] : null;
    const onDragStart = e => {
        if (appState.status !== status.ongoing) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${piece},${rank},${file}`);
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            e.dataTransfer.setDragImage(img, 25, 25);
        };
        setTimeout(() => {
            e.target.classList.add(styles.dragging);
        }, 0);
        if (piece.startsWith(playerTurn)) {
            const validMoves = arbiter.getRegularMoves({
                position: currentPosition, prevPosition: prevBoard, castleDirection: castleDirection[playerTurn], piece, rank, file
            });
            dispatch(generateValidMoves({ validMoves, selected: { from: [rank, file], piece } }));
        }
    };
    const onDragEnd = e => e.target.classList.remove(styles.dragging);
    return (
        <div className={classNames} style={style} draggable={true} onDragStart={onDragStart} onDragEnd={onDragEnd}></div>
    );
};

export default Piece;