import { useState, useRef, useEffect } from 'react';
import '../styles/GameBoard.css';

const GameBoard = () => {

    // Initial Board State

    const [board, setBoard] = useState([
        [2, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 5],   // (1 - 6)
        [0, 0], [0, 3], [0, 0], [0, 0], [0, 0], [5, 0],   // (7 - 12)
        [0, 5], [0, 0], [0, 0], [0, 0], [3, 0], [0, 0],   // (13 - 18)
        [5, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 2]    // (19 - 24)
    ]);

    const boardCanvas = useRef();
    const piecesCanvas = useRef();


    const [boardCtx, setBoardCtx] = useState(null);
    const [piecesCtx, setPiecesCtx] = useState(null);
    const [boardWidth, setBoardWidth] = useState(null);
    const [boardHeight, setBoardHeight] = useState(null);
    const [pointWidth, setPointWidth] = useState(null);
    const [pointHeight, setPointHeight] = useState(null);
    const [triangles, setTriangles] = useState([]);
    const [pieces, setPieces] = useState([]);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [selectedPiecePosition, setSelectedPiecePosition] = useState(null);

    useEffect(() => {
        if (!boardCanvas.current) {
            return;
        }

        setBoardWidth(boardCanvas.current.width);
        setBoardHeight(boardCanvas.current.height);
    }, [boardCanvas]);


    // Function to draw a triangle
    function drawTriangle(x, y, width, height, color, direction, positionIndex) {
        const boardCtx = boardCanvas.current.getContext('2d');
        boardCtx.beginPath();
        if (direction === 'up') {
            boardCtx.moveTo(x, y); // Top point
            boardCtx.lineTo(x + width / 2, y + height); // Bottom right
            boardCtx.lineTo(x - width / 2, y + height); // Bottom left
        } else {
            boardCtx.moveTo(x, y + height); // Bottom point
            boardCtx.lineTo(x + width / 2, y); // Top right
            boardCtx.lineTo(x - width / 2, y); // Top left
        }
        boardCtx.closePath();
        boardCtx.fillStyle = color;
        boardCtx.fill();

        // Store triangle data
        setTriangles((prev) => [...prev, { x, y, width, height, direction, positionIndex }]);
    }

    // Function to draw points and pieces
    function drawPointsAndPieces() {
        let colorToggle = true; // Alternate colors
        for (let i = 0; i < 24; i++) {
            let x, y, color, direction, positionIndex;

            if (i < 12) {
                x = boardWidth - (i % 12) * pointWidth - pointWidth / 2;
                y = boardHeight / 2;
                direction = 'up';
                positionIndex = i;
            } else {
                x = (i % 12) * pointWidth + pointWidth / 2;
                y = 0;
                direction = 'down';
                positionIndex = i;
            }

            color = (direction === 'down') ? (colorToggle ? 'red' : 'orange') : (!colorToggle ? 'red' : 'orange');

            // Draw triangle
            drawTriangle(x, y, pointWidth, pointHeight, color, direction, positionIndex);

            // Draw pieces for this point
            drawPieces(x, direction === 'down' ? y : y + pointHeight, board[positionIndex][0], board[positionIndex][1], direction === 'down', positionIndex);

            // Toggle color
            colorToggle = (i % 6 === 5) ? colorToggle : !colorToggle;
        }
    }

    // Function to draw the center bar and frame
    function drawCenterBarAndFrame() {
        const boardCtx = boardCanvas.current.getContext('2d');

        // Draw the center bar
        boardCtx.fillStyle = 'black';
        boardCtx.fillRect(boardWidth / 2 - 5, 0, 10, boardHeight);

        // Draw the frame
        boardCtx.strokeStyle = 'black';
        boardCtx.lineWidth = 10;
        boardCtx.strokeRect(0, 0, boardWidth, boardHeight);
    }

    // Function to check if a point is inside a triangle
    function isPointInTriangle(px, py, triangle) {
        const { x, y, width, height, direction } = triangle;
        let x1, y1, x2, y2, x3, y3;

        if (direction === 'up') {
            x1 = x; y1 = y;
            x2 = x + width / 2; y2 = y + height;
            x3 = x - width / 2; y3 = y + height;
        } else {
            x1 = x; y1 = y + height;
            x2 = x + width / 2; y2 = y;
            x3 = x - width / 2; y3 = y;
        }

        const area = 0.5 * (-y2 * x3 + y1 * (-x2 + x3) + y2 * x1 + y3 * (x2 - x1));
        const s = 1 / (2 * area) * (y1 * x3 - x1 * y3 + (y3 - y1) * px + (x1 - x3) * py);
        const t = 1 / (2 * area) * (x1 * y2 - y1 * x2 + (y1 - y2) * px + (x2 - x1) * py);

        return s > 0 && t > 0 && 1 - s - t > 0;
    }

    // Function to draw pieces on a position
    function drawPieces(x, y, whiteCount, blackCount, isTop, positionIndex) {
        const pieceRadius = pointWidth / 4;
        const spacing = pieceRadius * 2;

        // Draw white pieces
        for (let i = 0; i < whiteCount; i++) {
            const pieceY = isTop ? y + spacing * i + 1.5 * pieceRadius : y - spacing * i - 1.5 * pieceRadius;
            drawPiece(x, pieceY, pieceRadius, 'white', positionIndex);
        }

        // Draw black pieces
        for (let i = 0; i < blackCount; i++) {
            const pieceY = isTop ? y + spacing * i + 1.5 * pieceRadius : y - spacing * i - 1.5 * pieceRadius;
            drawPiece(x, pieceY, pieceRadius, 'black', positionIndex);
        }
    }

    // Function to draw a single piece
    function drawPiece(x, y, radius, color, positionIndex) {
        const piecesCtx = piecesCanvas.current.getContext('2d');
        piecesCtx.beginPath();
        piecesCtx.arc(x, y, radius, 0, Math.PI * 2);
        piecesCtx.fillStyle = color;
        piecesCtx.fill();
        piecesCtx.strokeStyle = 'black';
        piecesCtx.stroke();

        // Store piece data
        setPieces(() => [...pieces, { x, y, radius, color, positionIndex }]);
    }





    // Function to check if a point is inside a circle
    function isPointInCircle(px, py, circle) {
        const { x, y, radius } = circle;
        const dx = px - x;
        const dy = py - y;
        return dx * dx + dy * dy <= radius * radius;
    }



    function isMoveLegal(start, end) {
        const playerInTurn = 'white';
        const player = playerInTurn === 'white' ? 0 : 1;
        const opponentPiecesAtEnd = board[end][1 - player];
        const piece = board[start][player];


        if (opponentPiecesAtEnd > 1) {
            return false;
        }

        if (playerInTurn === 'white') {
            if (start > end) {
                return false;
            }
        }
        else {
            if (start < end) {
                return false;
            }
        }

    }



    // Function to create the board
    useEffect(() => {
        if (!piecesCanvas.current || !boardCanvas.current) {
            return;
        }

        setPointWidth(boardWidth / 12);
        setPointHeight(boardHeight / 2);

        // Draw the board
        drawPointsAndPieces();
        drawCenterBarAndFrame(); // Draw the center bar and frame

    }, []);


    useEffect(() => {
        // Function to handle piece movement
        function handlePieceMovement(clickX, clickY) {
            if (selectedPiece) {
                // Move piece to new triangle
                for (let i = 0; i < triangles.length; i++) {
                    if (isPointInTriangle(clickX, clickY, triangles[i])) {
                        const newPositionIndex = triangles[i].positionIndex;
                        if (board[newPositionIndex]) {
                            if (selectedPiece.color === 'white') {
                                board[selectedPiecePosition][0]--;
                                board[newPositionIndex][0]++;
                            } else {
                                board[selectedPiecePosition][1]--;
                                board[newPositionIndex][1]++;
                            }
                            setSelectedPiece(null);
                            setSelectedPiecePosition(null);
                            piecesCtx.clearRect(0, 0, piecesCanvas.current.width, piecesCanvas.current.height);
                            pieces = [];
                            drawPointsAndPieces();
                            drawCenterBarAndFrame();
                        }
                        break;
                    }
                }
            } else {
                // Select piece
                for (let i = 0; i < pieces.length; i++) {
                    if (isPointInCircle(clickX, clickY, pieces[i])) {
                        setSelectedPiece(pieces[i]);
                        setSelectedPiecePosition(pieces[i].positionIndex);
                        console.log(`Piece selected at position ${selectedPiecePosition}`);
                        break;
                    }
                }
            }
        }

        piecesCanvas.current.addEventListener('click', (event) => {
            console.log('click');
            const rect = piecesCanvas.current.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            handlePieceMovement(clickX, clickY);
        })

        return () => {
            piecesCanvas.current.removeEventListener('click', () => { });
        }
    }, [piecesCanvas.current])

    return (
        <div className="board-container">
            <canvas ref={boardCanvas} width="1000" height="500"></canvas>
            <canvas ref={piecesCanvas} width="1000" height="500"></canvas>
        </div>
    )
}
export default GameBoard;