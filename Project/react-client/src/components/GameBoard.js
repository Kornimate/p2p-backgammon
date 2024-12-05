import { Button } from '@mui/material';
import { useState, useRef, useEffect, Fragment } from 'react';
import boardImage from '../assets/board.png';
import blackImage from '../assets/black_player.png';
import whiteImage from '../assets/white_player.png';
import "../styles/GameBoard.css";
import GameBoardPieceHolder from './GameBoardPieceHolder.js';
import { GetPlayerName } from '../shared-resources/StorageHandler.js';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const GameBoard = ({ write, listen, opponentName, isBlack}) => {
    
    const[incomingMessage, setIncomingMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [timer, setTimer] = useState(null);

    const navigate = useNavigate();

    const boardRef = useRef()

    const [board, setBoard] = useState([
        [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],   // (1 - 6) // black and white
        [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],   // (7 - 12)
        [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],   // (13 - 18)
        [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2]    // (19 - 24)
    ]);

    const [buttons1To12] = useState([...Array(12).keys()].map(i => 11-i));
    const [buttons13To24] = useState([...Array(12).keys()].map(i => (12 + i)));

    const [knockedOutPieces, setKnockedOutPieces] = useState([0,0]); // black and white 
    const [bearedOffPieces, setbearedOffPieces] = useState([0,0]); // black and white 
    const [availableThrows, setAvailableThrows] = useState([0, 0]); // black and white 

    const [firstMove, setFirstMove] = useState(!isBlack);
    const [isActive, setIsActive] = useState(false);
    const [activeThrow, setActiveThrow] = useState(0);

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    function ButtonClicked(index){
        if(!isActive){
            setOpen(true);
            return;
        }

        if(IsMoveIllegal(index)){
            setOpen(true);
            return;
        }

        const tempBoard = [...board]
        tempBoard[index][GetPositionInBoard]--;
        tempBoard[CalculatePositionInBoard(index, availableThrows[activeThrow])][GetPositionInBoard()]++
        setBoard(tempBoard);

        const temp = [...availableThrows];
        temp[activeThrow] = -1;
        setAvailableThrows(temp);

        setActiveThrow((prev) => (prev+1)%2);
    }

    function IsMoveIllegal(index){
        return false;
        //TODO implement game rules
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

    function SendData(data){
        write.send(JSON.stringify(data))
    }

    function HandleIncomingData(data){
        const msg = JSON.parse(data)
        setIncomingMessage({...msg})
    }

    function ManageActiveThrow(num){
        if(!isActive)
            return;

        if(availableThrows[num] < 0){
            setOpen(true);
            return;
        }

        setActiveThrow(num);
    }

    function GetPositionInBoard(){
        return isBlack ? 0 : 1;
    }

    function CalculatePositionInBoard(index, offset){
        return isBlack? index - offset : index + offset;
    }

    function CalculateOpponentPositionInBoard(index, offset){
        return isBlack? index + offset : index - offset;
    }

    function GetOpponentPositionInBoard(){
        return isBlack ? 1 : 0;
    }

    function PassHandlingToOther(){
        setIsActive(false);
        SendData({
            type: "CONTROL",
            value: true
        })

        setTimer(setTimeout(() => {
            EndMatchIfNotResponsive()
        }, 150000));
    }

    function EndMatchIfNotResponsive(){
        alert("Other player unresponsive")
        write.close();
        listen.close();
        navigate("/game");
    }

    function GetDiceRolls(){
        setAvailableThrows([Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1])
        setActiveThrow(0);
        setTimer(setTimeout(() => {
            PassHandlingToOther()
        }, 120000));
    }

    useEffect(() => {
        listen.on("data", (data) => {
            HandleIncomingData(data);
        });
    }, [])

    useEffect(() => {
        if(firstMove === true){
            setFirstMove(false);
            setIsActive(true);
        }
    }, [])

    useEffect(() => {
        if(!incomingMessage)
            return;

        ///handle messages

    }, [incomingMessage])

    useEffect(() => {
        if(!isActive)
            return;

        GetDiceRolls();
    }, [isActive])

    useEffect(() => {
        if(!availableThrows.every((element) => element < 0))
            return;

        clearTimeout(timer);
        PassHandlingToOther()
    }, [availableThrows]);

    const action = (
        <Fragment>
          <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Fragment>
      );

    return (
        <>
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
                <div className="knockedOutPiecesDivHolder">
                    <div className="knockedOutDiv">
                        <img alt="" src={blackImage} onClick={BlackKnockedOutClicked} />
                        <div>{knockedOutPieces[0]}</div>
                    </div>
                    <div className="knockedOutDiv">
                        <img alt="" src={whiteImage} onClick={WhiteKnockedOutClicked} />
                        <div>{knockedOutPieces[1]}</div>
                    </div>
                </div>
                <div className="knockedOutPiecesDivHolder">
                    <div className={activeThrow === 0 ? "ActiveDiceDiv": "DiceDiv"}>
                        <div onClick={() => ManageActiveThrow(0)}>{availableThrows[0]}</div>
                    </div>
                    <div className={activeThrow === 1 ? "ActiveDiceDiv": "DiceDiv"}>
                        <div onClick={() => ManageActiveThrow(1)}>{availableThrows[1]}</div>
                    </div>
                </div>
            </div>
            <div>
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Invalid Move!"
                    action={action}
                    />
            </div>
        </>
    )
}
export default GameBoard;

