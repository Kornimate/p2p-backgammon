import { Button, CircularProgress } from '@mui/material';
import { useState, useRef, useEffect, Fragment } from 'react';
import boardImage from '../assets/board.png';
import blackImage from '../assets/black_player.png';
import whiteImage from '../assets/white_player.png';
import "../styles/GameBoard.css";
import GameBoardPieceHolder from './GameBoardPieceHolder.js';

import { GetPlayerName } from '../shared-resources/StorageHandler.js';

const GameBoard = ({ peerjsConnection, opponentName}) => {


    const [remotePeerId, setRemotePeerId] = useState("");
    const [receivedMessage, setReceivedMessage] = useState("");
    const [message, setMessage] = useState("")
    const [connection, setConnection] = useState(null);
    const peerInstance = useRef(null);

    const connectToPeer = () => {
        const conn = peerInstance.current.connect(remotePeerId);
        setConnection(conn);

        conn.on("data", (data) => {
            console.log("Received:", data);
            setReceivedMessage(data);
        });

        // conn.on("open", () => {
        // console.log("Connection is open!");
        // });
    };

    const sendMessage = () => {
        if (connection) {
        connection.send(message);
        console.log("Sent:", message);
        } else {
        console.error("No active connection.");
        }
    };

    const boardRef = useRef()

    const [board, setBoard] = useState([
        [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],   // (1 - 6) // black and white
        [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],   // (7 - 12)
        [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],   // (13 - 18)
        [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2]    // (19 - 24)
    ]);

    const [knockedOutPieces, setKnockedOutPieces] = useState([0,0]); // black and white 

    function ButtonClicked(index){
        console.log(board[index])
    }

    function BlackKnockedOutClicked(){
        const temp = knockedOutPieces;
        temp[0]++;
        setKnockedOutPieces([...temp])
    }

    function WhiteKnockedOutClicked(){
        const temp = knockedOutPieces;
        temp[1]++;
        setKnockedOutPieces([...temp])
    }

    const [buttons1To12] = useState([...Array(12).keys()].map(i => 11-i));
    const [buttons13To24] = useState([...Array(12).keys()].map(i => (12 + i)));

    return (
        <div className="container">
            <h3>{GetPlayerName()} VS {opponentName}</h3>
            <div className="buttonsDiv">
                {
                    buttons13To24.map((identifier) => (
                        <Button onClick={() => ButtonClicked(identifier)} sx={{width: 66, color: 'black'}} key={identifier}>{identifier + 1}</Button>
                    ))
                }
            </div>
            <div className="relativeDiv">
                <img alt="board" src={boardImage} className="boardImg" ref={boardRef} />
                {board.map((element, index) => {
                    const x = index >= 12 ? (index - 12) * 66 + 16.5 : (11 - index) * 66 + 16.5;
                    const isTop = index >= 12;
                    return (
                        <Fragment key={`fragment-${index}`}>
                            <GameBoardPieceHolder
                                x={x}
                                size={33}
                                piecesNum={element[0]}
                                isBlack={true}
                                onTop={isTop}
                            />
                            <GameBoardPieceHolder
                                x={x}
                                size={33}
                                piecesNum={element[1]}
                                isBlack={false}
                                onTop={isTop}
                            />
                        </Fragment>
                    );
                })}
            </div>
            <div className="">
                {
                    buttons1To12.map((identifier) => (
                        <Button onClick={() => ButtonClicked(identifier)} sx={{width: 66, color: 'black'}} key={identifier}>{identifier + 1}</Button>
                    ))
                }
            </div>
            <div class="knockedOutPiecesDivHolder">
                <div className="knockedOutDiv">
                    <img alt="" src={blackImage} onClick={BlackKnockedOutClicked} />
                    <div>{knockedOutPieces[0]}</div>
                </div>
                <div className="knockedOutDiv">
                    <img alt="" src={whiteImage} onClick={WhiteKnockedOutClicked} />
                    <div>{knockedOutPieces[1]}</div>
                </div>
            </div>
        </div>
    )
}
export default GameBoard;

