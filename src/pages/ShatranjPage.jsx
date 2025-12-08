import React from 'react';
import ChessBoard from '../components/ChessBoard/ChessBoard';

const ShatranjPage = (props) => {
    const { initialPosition } = props;
    return (
        <div>
            <ChessBoard initialPosition={initialPosition} />
        </div>
    );
};

export default ShatranjPage;