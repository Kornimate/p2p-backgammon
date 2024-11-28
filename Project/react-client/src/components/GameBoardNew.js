import { Button } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import boardImage from '../assets/board.png'
import "../styles/GameBoard.css"
import GameBoardPieceHolder from './GameBoardPieceHolder.js';

const GameBoardNew = () => {

    // Initial Board State

    const boardRef = useRef()

    const [board, setBoard] = useState([
        [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],   // (1 - 6)
        [0, 0], [0, 15], [0, 0], [0, 0], [0, 0], [5, 0],   // (7 - 12)
        [0, 5], [0, 0], [0, 0], [0, 0], [15, 0], [0, 0],   // (13 - 18)
        [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2]    // (19 - 24)
    ]);

    function ButtonClicked(index){
        console.log(board[index])
    }

    const [buttons1To12, setButtons1To12] = useState([...Array(12).keys()].map(i => 11-i));
    const [buttons13To24, setButtons12To24] = useState([...Array(12).keys()].map(i => (12 + i)));

    return (
        <div className="container">
            <div>
                {
                    buttons13To24.map((identifier) => (
                        <Button onClick={() => ButtonClicked(identifier)} sx={{width: 66, color: 'black'}} key={identifier}>{identifier + 1}</Button>
                    ))
                }
            </div>
            <div className="relativeDiv">
                <img alt="board" src={boardImage} className="boardImg" ref={boardRef} />
                { //13-24 blacks
                    board.map((element, index) => (
                        index >= 12 && <GameBoardPieceHolder x={(index-12)*66 + 16.5} size={33} piecesNum={element[0]} isBlack={true} onTop={true} />
                    ))
                }
                { //13-24 whites
                    board.map((element, index) => (
                        index >= 12 && <GameBoardPieceHolder x={(index-12)*66 + 16.5} size={33} piecesNum={element[1]} isBlack={false} onTop={true} />
                    ))
                }  
                { //1-12 blacks
                    board.map((element, index) => (
                        index < 12 && <GameBoardPieceHolder x={(11-index)*66 + 16.5} size={33} piecesNum={element[0]} isBlack={true} onTop={false} />
                    ))
                } 
                { //1-12 whites
                    board.map((element, index) => (
                        index < 12 && <GameBoardPieceHolder x={(11-index)*66 + 16.5} size={33} piecesNum={element[1]} isBlack={false} onTop={false} />
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

