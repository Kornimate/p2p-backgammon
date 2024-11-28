import blackImage from '../assets/black_player.png';
import whiteImage from '../assets/white_player.png';
import { useMemo } from 'react';

const GameBoardPieceHolder = ({x, size, piecesNum, isBlack, onTop}) => {

    const pieces = useMemo(() => [...Array(piecesNum).keys()], [piecesNum]);

    return (
        <>
        {
            pieces.map((element) => (
                <img
                    alt=""
                    src={isBlack ? blackImage : whiteImage}
                    style={{
                        position: 'absolute',
                        left: x,
                        top: onTop ? `${element*(size/3)+5}px` : undefined,
                        bottom: !onTop ? `${element*(size/3)+5}px` : undefined,
                        width: size
                    }}
                    key={`${x}_${element}`} />
            ))
        }

        </>
    )
}

export default GameBoardPieceHolder;