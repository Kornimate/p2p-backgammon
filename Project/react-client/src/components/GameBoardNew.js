import { Button } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import boardImage from '../assets/board.png'
import "../styles/GameBoard.css"
import GameBoardPieceHolder from './GameBoardPieceHolder.js';

const GameBoardNew = () => {

    // Initial Board State

    const boardRef = useRef()

    useEffect(() => {
        console.log(boardRef.current.getBoundingClientRect())
    }, [boardRef])

    const [board, setBoard] = useState([
        [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],   // (1 - 6)
        [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],   // (7 - 12)
        [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],   // (13 - 18)
        [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2]    // (19 - 24)
    ]);

    function ButtonClicked(index){
        console.log(index)
    }

    const [buttons1To12, setButtons1To12] = useState([...Array(12).keys()].map(i => 11-i));
    const [buttons12To24, setButtons12To24] = useState([...Array(12).keys()].map(i => (12 + i)));

    return (
        <div className="container">
            <div>
                {
                    buttons12To24.map((identifier) => (
                        <Button onClick={() => ButtonClicked(identifier)} sx={{width: 66, color: 'black'}} key={identifier}>{identifier + 1}</Button>
                    ))
                }
            </div>
            <div className="relativeDiv">
                <img src={boardImage} className="boardImg" ref={boardRef} />
                {
                    board.map((element) => (
                        <GameBoardPieceHolder x={boardRef?.current?.getBoundingClientRect().x + 16.5} y={boardRef?.current?.getBoundingClientRect().y + 6} size={33} black={element[0]} white={element[1]} />
                    ))
                }
            </div>
            <div>
                {
                    buttons1To12.map((identifier) => (
                        <Button onClick={() => ButtonClicked(identifier)} sx={{width: 66, color: 'black'}} key={identifier}>{identifier + 1}</Button>
                    ))
                }
            </div>
        </div>
    )
}
export default GameBoardNew;

