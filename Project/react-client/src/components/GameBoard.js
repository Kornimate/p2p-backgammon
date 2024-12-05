import { Button } from '@mui/material';
import { useState, useRef, useEffect, Fragment } from 'react';
import boardImage from '../assets/board.png';
import blackImage from '../assets/black_player.png';
import whiteImage from '../assets/white_player.png';
import "../styles/GameBoard.css";
import GameBoardPieceHolder from './GameBoardPieceHolder.js';
import { GetPlayerName, IncreasePlayerGames, IncreasePlayerWins } from '../shared-resources/StorageHandler.js';
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
    const [isBearingOff, setIsBearingOff] = useState(false);
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

        if(knockedOutPieces[GetPositionInBoard()] > 0){
            if(isBlack){
                if(index !== 23){
                    setOpen(true);
                    return;
                }

                if(board[CalculatePositionInBoard(index, availableThrows[activeThrow])][GetOpponentPositionInBoard()] > 1){
                    setOpen(true);
                    return;
                }
            } else {
                if(index !== 0){
                    setOpen(true);
                    return;
                }

                if(board[CalculatePositionInBoard(index, availableThrows[activeThrow])][GetOpponentPositionInBoard()] > 1){
                    setOpen(true);
                    return;
                }
            }

            const tempBoard = [...board]
            tempBoard[index][GetPositionInBoard()]++;
            setBoard(tempBoard);

            const tempKnocked = [...knockedOutPieces];
            tempKnocked[GetPositionInBoard()]--;
            setKnockedOutPieces(tempKnocked);

            PostOpponentReEntry(index);
        }

        if(isBearingOff){

            if(isBlack){
                if(!IndexOnHomeBoardOfBlack(index)){
                    setOpen(true);
                    return;
                }
            } else {
                if(!IndexOnHomeBoardOfWhite(index)){
                    setOpen(true);
                    return;
                }
            }

            const tempBoard = [...board]
            tempBoard[index][GetPositionInBoard()]--;
            setBoard(tempBoard);

            PostOpponentBearOff(index);
            
            return;
        }

        const tempBoard = [...board]
        tempBoard[index][GetPositionInBoard()]--;
        tempBoard[CalculatePositionInBoard(index, availableThrows[activeThrow])][GetPositionInBoard()]++
        if(tempBoard[CalculatePositionInBoard(index, availableThrows[activeThrow])][GetOpponentPositionInBoard()] === 1){
            tempBoard[CalculatePositionInBoard(index, availableThrows[activeThrow])][GetOpponentPositionInBoard()] = 0;
            const tempKnocked = [...knockedOutPieces];
            tempKnocked[GetOpponentPositionInBoard()]++;
            setKnockedOutPieces(tempKnocked);
        }
        setBoard(tempBoard);

        PostOpponentNewStep(index, temp[activeThrow]);

        CheckIsGameEnded();

        if(isBearingOff){

        }

        const temp = [...availableThrows];
        temp[activeThrow] = -1;
        setAvailableThrows(temp);

        setActiveThrow((prev) => (prev+1)%2);
    }

    function IsMoveIllegal(index){
        if(board[index][GetPositionInBoard()] === 0)
            return true;

        if(board[CalculatePositionInBoard(index, availableThrows[activeThrow])][GetOpponentPositionInBoard()] > 1)
            return true;

        return false;
    }

    function CheckIsGameEnded(){
        let sum = 0;

        if(isBlack){
            for(let i=18;i<24;i++){
                sum += board[i][0];
            }

            if(sum >= 15){
                setIsBearingOff(true);
            }
        } else {
            for(let i=0;i<6;i++){
                sum += board[i][1];
            }

            if(sum >= 15){
                setIsBearingOff(true);
            }
        }

        if(isBlack){
            if(board.every((element) => element[0] === 0)){
                IncreasePlayerGames();
                IncreasePlayerWins();
                navigate("/game/result?text=Win")
                return;
            }
            if(board.every((element) => element[1] === 0)){
                IncreasePlayerGames();
                navigate("/game/result?text=Defeat")
                return;
            }
        } else {
            if(board.every((element) => element[1] === 0)){
                IncreasePlayerGames();
                IncreasePlayerWins();
                navigate("/game/result?text=Win")
                return;
            }
            if(board.every((element) => element[0] === 0)){
                IncreasePlayerGames();
                navigate("/game/result?text=Defeat")
                return;
            }
        }
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

    function SetOwnTimer(){
        setTimer(setTimeout(() => {
            PassHandlingToOther()
        }, 120000));
    }

    function SetOpponentTimer(){
        setTimer(setTimeout(() => {
            EndMatchIfNotResponsive()
        }, 150000));
    }

    function PassHandlingToOther(){
        if(!isActive){
            setOpen(true);
            return;
        }
        setIsActive(false);
        SendData({
            type: "CONTROL",
            value: true
        })

        clearTimeout(timer);
        SetOpponentTimer();
    }

    function PostOpponentNewStep(startIndex, stepSize){
        SendData({
            type: "STEP",
            value: {
                index: startIndex,
                step: stepSize
            }
        })
    }

    function PostOpponentBearOff(index){
        SendData({
            type: "BEAROFF",
            value: index
        })
    }

    function PostOpponentReEntry(index){
        SendData({
            type:"REENTRY",
            value: index
        })
    }

    function IndexOnHomeBoardOfBlack(index){
        return index < 24 && index > 17;
    }
  
    function IndexOnHomeBoardOfWhite(index){
        return index >= 0 && index < 6;
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
        SetOwnTimer();
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
            return;
        }

        setIsActive(false);
        SetOpponentTimer();
    }, [])

    useEffect(() => {
        if(!incomingMessage)
            return;

        if(incomingMessage.type === "CONTROL"){
            clearInterval(timer);
            setIsActive(true);
            return;
        }

        if(incomingMessage.type === "STEP"){
            const tempBoard = [...board]
            tempBoard[incomingMessage.value.index][GetOpponentPositionInBoard()]--;
            tempBoard[CalculateOpponentPositionInBoard(incomingMessage.value.index, incomingMessage.value.step)][GetOpponentPositionInBoard()]++
            if(tempBoard[CalculateOpponentPositionInBoard(incomingMessage.value.index, incomingMessage.value.step)][GetPositionInBoard()] === 1){
                tempBoard[CalculateOpponentPositionInBoard(incomingMessage.value.index, incomingMessage.value.step)][GetPositionInBoard()] = 0;
                const tempKnocked = [...knockedOutPieces];
                tempKnocked[GetPositionInBoard()]++;
                setKnockedOutPieces(tempKnocked);
            }
            setBoard(tempBoard);
        }

        if(incomingMessage.type === "BEAROFF"){
            const tempBoard = [...board]
            tempBoard[incomingMessage.value][GetOpponentPositionInBoard()]--;
            setBoard(tempBoard);
            return;
        }

        if(incomingMessage.type === "REENTRY"){
            const tempKnocked = [...knockedOutPieces];
            tempKnocked[GetOpponentPositionInBoard()]--;
            setKnockedOutPieces(tempKnocked);
            return;
        }

    }, [incomingMessage])

    useEffect(() => {
        if(!isActive)
            return;

        GetDiceRolls();
    }, [isActive])

    useEffect(() => {
        if(!availableThrows.every((element) => element < 0))
            return;

        PassHandlingToOther();
    }, [availableThrows]);

    const action = (
        <Fragment>
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
                <div>
                    <h3 className={isActive ? "activePlayer" : ""}>{GetPlayerName()}</h3> VS <h3 className={!isActive ? "activePlayer" : ""}>{opponentName}</h3>
                </div>
                <div>
                    <img src={isBlack ? blackImage : whiteImage } className="indicatorImage"/>
                </div>
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
                <div className="passDiv">
                    <Button variant='outlined' onClick={() => PassHandlingToOther()}>Pass</Button>
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

