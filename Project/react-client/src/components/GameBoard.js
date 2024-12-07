import { Button } from '@mui/material';
import { useState, useRef, useEffect, Fragment } from 'react';
import boardImage from '../assets/board.png';
import blackImage from '../assets/black_player.png';
import whiteImage from '../assets/white_player.png';
import "../styles/GameBoard.css";
import GameBoardPieceHolder from './GameBoardPieceHolder.js';
import { GetPlayerName, IncreasePlayerGames, IncreasePlayerWins } from '../shared-resources/StorageHandler.js';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import nodice from "../assets/nodice.png"
import one from "../assets/one.png"
import two from "../assets/two.png"
import three from "../assets/three.png"
import four from "../assets/four.png"
import five from "../assets/five.png"
import six from "../assets/six.png"
import DiceProtocol from '../shared-resources/DiceRollProtocol.js';

const GameBoard = ({ write, listen, opponentName, isBlack}) => {
    
    const[incomingMessage, setIncomingMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [selfTimer, setSelfTimer] = useState(null);
    const [opponentTimer, setOpponentTimer] = useState(null);

    const navigate = useNavigate();

    const boardRef = useRef()

    const [board, setBoard] = useState([
        [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],   // (1 - 6) // black and white
        [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],   // (7 - 12)
        [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],   // (13 - 18)
        [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2]    // (19 - 24)
    ]);

    // const [board, setBoard] = useState([ //for testing bearoff and game end
    //     [0, 3], [0, 3], [0, 3], [0, 3], [0, 2], [0, 1],   // (1 - 6) // black and white
    //     [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],   // (7 - 12)
    //     [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],   // (13 - 18)
    //     [3, 0], [3, 0], [3, 0], [3, 0], [2, 0], [1, 0]    // (19 - 24)
    // ]);

    const [buttons1To12] = useState([...Array(12).keys()].map(i => 11-i));
    const [buttons13To24] = useState([...Array(12).keys()].map(i => (12 + i)));

    const [knockedOutPieces, setKnockedOutPieces] = useState([0, 0]); // black and white 
    const [availableThrows, setAvailableThrows] = useState([0, 0]); // black and white 

    const [dice1Img, setDice1Img] = useState(nodice);
    const [dice2Img, setDice2Img] = useState(nodice);

    const [firstMove, setFirstMove] = useState(!isBlack);
    const [isActive, setIsActive] = useState(false);
    const [isBearingOff, setIsBearingOff] = useState(false);
    const [activeThrow, setActiveThrow] = useState(0);

    const [calculatedDice, setCalculatedDice] = useState(0);
    const [calculatedDices, setCalculatedDices] = useState([0, 0]);
    const [diceCalculator, setDiceCalculator] = useState(new DiceProtocol());

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
        
        if(knockedOutPieces[GetPositionInBoard()] > 0){
            if(isBlack){
                if(index !== 0){
                    setOpen(true);
                    return;
                }

                if(board[CalculatePositionInBoard(index, availableThrows[activeThrow] - 1)][GetOpponentPositionInBoard()] > 1){
                    setOpen(true);
                    return;
                }
            } else {
                if(index !== 23){
                    setOpen(true);
                    return;
                }

                if(board[CalculatePositionInBoard(index, availableThrows[activeThrow] - 1)][GetOpponentPositionInBoard()] > 1){
                    setOpen(true);
                    return;
                }
            }

            const tempBoard = [...board]
            const tempKnocked = [...knockedOutPieces];

            tempBoard[CalculatePositionInBoard(index, availableThrows[activeThrow] - 1)][GetPositionInBoard()]++;
            tempKnocked[GetPositionInBoard()]--;

            if(tempBoard[CalculatePositionInBoard(index, availableThrows[activeThrow] - 1)][GetOpponentPositionInBoard()] === 1){
                tempBoard[CalculatePositionInBoard(index, availableThrows[activeThrow] - 1)][GetOpponentPositionInBoard()]--;
                tempKnocked[GetOpponentPositionInBoard()]++;
            }
            
            setBoard(tempBoard);
            setKnockedOutPieces(tempKnocked);

            PostOpponentReEntry(CalculatePositionInBoard(index, availableThrows[activeThrow]-1));

            DecreaseAvailableThrows();

            return;
        }

        if(isBearingOff){

            if(isBlack){
                if(!IndexOnHomeBoardOfBlack(index)){
                    setOpen(true);
                    return;
                }

                if(index !== 24-availableThrows[activeThrow]){
                    setOpen(true);
                    return;
                }
            } else {
                if(!IndexOnHomeBoardOfWhite(index)){
                    setOpen(true);
                    return;
                }

                if(index !== (-1)+availableThrows[activeThrow]){
                    setOpen(true);
                    return;
                }
            }

            if(board[index][GetPositionInBoard()] === 0){
                setOpen(true);
                return;
            }

            const tempBoard = [...board]
            tempBoard[index][GetPositionInBoard()]--;
            setBoard(tempBoard);

            PostOpponentBearOff(index);

            DecreaseAvailableThrows();
            
            return;
        }

        if(IsMoveIllegal(index)){
            setOpen(true);
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

        PostOpponentNewStep(index, availableThrows[activeThrow]);

        DecreaseAvailableThrows();
    }

    function DecreaseAvailableThrows(){
        const temp = [...availableThrows];
        temp[activeThrow] = -1;
        setAvailableThrows(temp);

        setActiveThrow((prev) => (prev+1)%2);
    }

    function IsMoveIllegal(index){

        const newPos = CalculatePositionInBoard(index, availableThrows[activeThrow]); 

        if(newPos > 23 || newPos < 0)
            return true;

        if(board[index][GetPositionInBoard()] === 0)
            return true;

        if(board[newPos][GetOpponentPositionInBoard()] > 1)
            return true;

        return false;
    }

    function CheckIsGameEnded(){
        let sum = 0;
        if(isBlack){
            for(let i=0;i<18;i++){
                sum += board[i][0];
            }

            if(sum === 0){
                setIsBearingOff(true);
            }
        } else {
            for(let i=6;i<24;i++){
                sum += board[i][1];
            }

            if(sum === 0){
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

    function SendData(data){
        write.send(JSON.stringify(data))
    }

    function HandleIncomingData(data){
        const msg = JSON.parse(data)
        setIncomingMessage({...msg})
    }

    function NullTimers(){
        if(selfTimer !== null){
            clearTimeout(selfTimer);
            setSelfTimer(null);
        }

        if(opponentTimer !== null){
            clearTimeout(opponentTimer);
            setOpponentTimer(null);
        }
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
        return isBlack? index + offset : index - offset;
    }

    function CalculateOpponentPositionInBoard(index, offset){
        return isBlack? index - offset : index + offset;
    }

    function GetOpponentPositionInBoard(){
        return isBlack ? 1 : 0;
    }

    function SetOwnTimer(){
        if(opponentTimer != null){
            clearTimeout(opponentTimer);
            setOpponentTimer(null);
        }

        setSelfTimer(setTimeout(() => {
            if(isActive){
                PassHandlingToOther()
            }
        }, 20000));
    }

    function SetOpponentTimer(){
        if(selfTimer != null){
            clearTimeout(selfTimer);
            setSelfTimer(null);
        }

        setOpponentTimer(setTimeout(() => {
            EndMatchIfNotResponsive()
        }, 30000));
    }

    function PassHandlingToOther(){
        if(!isActive){
            setOpen(true);
            return;
        }
        setIsActive(false);
        setAvailableThrows([0, 0]);
        SendData({
            type: "CONTROL",
            value: true
        })

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
        StartDiceRoll();
        setActiveThrow(0);
        SetOwnTimer();
    }

    function StartDiceRoll(){
        diceCalculator.clear();
        setAvailableThrows([0, 0]);
        setCalculatedDices([0, 0]);
        setCalculatedDice(0);

        SendFirstHash();
    }

    function SendFirstHash(){
        SendData({
            type:"HASH",
            value: diceCalculator.startProtocol()
        });
    }

    function GetDiceImgForPosition(pos){
        if(availableThrows[pos] < 1) return nodice;
        if(availableThrows[pos] === 1) return one;
        if(availableThrows[pos] === 2) return two;
        if(availableThrows[pos] === 3) return three;
        if(availableThrows[pos] === 4) return four;
        if(availableThrows[pos] === 5) return five;
        if(availableThrows[pos] === 6) return six;
        if(availableThrows[pos] > 6) return nodice;
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

        if(incomingMessage.type === "HASH"){
            diceCalculator.setOpponentHash(incomingMessage.value);
            SendData({
                type: "HASHRESPONSE",
                value: diceCalculator.startProtocol()
            });
            return;
        }

        if(incomingMessage.type === "HASHRESPONSE"){
            diceCalculator.setOpponentHash(incomingMessage.value);
            SendData({
                type: "HASHREVEAL",
                value: diceCalculator.getNonceAndRandomNum()
            });
            return;
        }

        if(incomingMessage.type === "HASHREVEAL"){
            diceCalculator.setOpponentNonceAndRandomNum(incomingMessage.value);
            SendData({
                type: "HASHREVEALRESPONSE",
                value: diceCalculator.getNonceAndRandomNum()
            });
            return;
        }

        if(incomingMessage.type === "HASHREVEALRESPONSE"){
            diceCalculator.setOpponentNonceAndRandomNum(incomingMessage.value);

            try{
                const tempDiceRolls = [...calculatedDices];
                tempDiceRolls[calculatedDice] = diceCalculator.verifyAndRollDice();
                setCalculatedDices(tempDiceRolls);
                setCalculatedDice((prev) => prev + 1);
            } catch {
                console.log(diceCalculator)
                alert("possible cheating detected, disconnecting");
                write.close();
                listen.close();
                navigate("/game");
            }
            return;
        }

        if(incomingMessage.type === "CONTROL"){
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
            return;
        }

        if(incomingMessage.type === "BEAROFF"){
            const tempBoard = [...board]
            tempBoard[incomingMessage.value][GetOpponentPositionInBoard()]--;
            setBoard(tempBoard);
            return;
        }

        if(incomingMessage.type === "REENTRY"){
            const tempBoard = [...board]
            const tempKnocked = [...knockedOutPieces];

            tempBoard[incomingMessage.value][GetOpponentPositionInBoard()]++;
            tempKnocked[GetOpponentPositionInBoard()]--;

            if(tempBoard[incomingMessage.value][GetPositionInBoard()] === 1){
                tempBoard[incomingMessage.value][GetPositionInBoard()]--;
                tempKnocked[GetPositionInBoard()]++;
            }
            
            setBoard(tempBoard);
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

    useEffect(() => {

        setDice1Img(GetDiceImgForPosition(0));
        setDice2Img(GetDiceImgForPosition(1));

    }, [availableThrows]);

    useEffect(() => {
        if(calculatedDice === 1){
            SendFirstHash()
        }
        if(calculatedDice === 2){
            setAvailableThrows([...calculatedDices])
        }
    }, [calculatedDice])

    useEffect(() => {
        //Nothing to do, just force update
    }, [opponentTimer, selfTimer])

    useEffect(() => {
        //Nothing to do, just force update
    }, [calculatedDices, diceCalculator])

    useEffect(() => {
        CheckIsGameEnded();
    }, [board])

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
                        <img alt="" src={blackImage} />
                        <div>{knockedOutPieces[0]}</div>
                    </div>
                    <div className="knockedOutDiv">
                        <img alt="" src={whiteImage} />
                        <div>{knockedOutPieces[1]}</div>
                    </div>
                </div>
                <div className="knockedOutPiecesDivHolder">
                    <div className={activeThrow === 0 ? "ActiveDiceDiv knockedOutDiv": "DiceDiv knockedOutDiv"}>
                        <img alt="" src={dice1Img} onClick={() => ManageActiveThrow(0)} />
                    </div>
                    <div className={activeThrow === 1 ? "ActiveDiceDiv knockedOutDiv": "DiceDiv knockedOutDiv"}>
                        <img alt="" src={dice2Img} onClick={() => ManageActiveThrow(1)} />
                    </div>
                </div>
                <div className="passDiv">
                    <Button variant='outlined' sx={{color: "black", borderColor: "black"}} onClick={() => PassHandlingToOther()}>Pass</Button>
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

