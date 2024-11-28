import blackImage from '../assets/black_player.png';
import whiteImage from '../assets/white_player.png';
import { useState } from 'react';

const GameBoardPieceHolder = ({x, y, size, white, black}) => {

    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: size
      };

    console.log(style)

    const [blacks, setBlacks] = useState([...Array(black).map(i => i)])
    const [whites, setWhites] = useState([...Array(white).map(i => i)])

    return (
        <img src={blackImage} style={style} />
    )
}

export default GameBoardPieceHolder;