import React from 'react';
import ChessBoard from '../components/ChessBoard/ChessBoard';

const ChessPage = (props) => {
    const { initialPosition } = props;
    return (
        <div>
            <ChessBoard initialPosition={initialPosition} />
        </div>
    );
};

export default ChessPage;