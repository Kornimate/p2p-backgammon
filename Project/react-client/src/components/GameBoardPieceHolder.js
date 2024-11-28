import blackImage from '../assets/black_player.png';
import whiteImage from '../assets/white_player.png';
import { useEffect, useState } from 'react';

const GameBoardPieceHolder = ({x, size, piecesNum, isBlack, onTop}) => {

    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        setPieces([...Array(piecesNum).keys()])
    }, [piecesNum])

    return (
        <>
        {
            pieces.map((element) => (
                piecesNum > 0 && onTop && <img alt="" src={isBlack ? blackImage : whiteImage} style={{position: 'absolute', left: x, top: `${element*(size/3)+5}px`, width: size}} key={`${x}_${element}`} />
            ))
        }
        {
            pieces.map((element) => (
               piecesNum > 0 && !onTop && <img alt="" src={isBlack ? blackImage : whiteImage} style={{position: 'absolute', left: x, bottom: `${element*(size/3)+5}px`, width: size}} key={`${x}_${element}`} />
            ))
        }
        </>
    )
}

export default GameBoardPieceHolder;