// Initial Board State
let board = [
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],   // (1 - 6)
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],   // (7 - 12)
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],   // (13 - 18)
    [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]    // (19 - 24)
];

let boardCanvas, piecesCanvas, boardCtx, piecesCtx;
let boardWidth, boardHeight, pointWidth, pointHeight;
let triangles = [];
let pieces = [];
let selectedPiece = null;
let selectedPiecePosition = null;

// Function to draw a triangle
function drawTriangle(ctx, x, y, width, height, color, direction, positionIndex) {
    ctx.beginPath();
    if (direction === 'up') {
        ctx.moveTo(x, y); // Top point
        ctx.lineTo(x + width / 2, y + height); // Bottom right
        ctx.lineTo(x - width / 2, y + height); // Bottom left
    } else {
        ctx.moveTo(x, y + height); // Bottom point
        ctx.lineTo(x + width / 2, y); // Top right
        ctx.lineTo(x - width / 2, y); // Top left
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Store triangle data
    triangles.push({ x, y, width, height, direction, positionIndex });
}

// Function to draw pieces on a position
function drawPieces(ctx, x, y, whiteCount, blackCount, isTop, positionIndex) {
    const pieceRadius = pointWidth / 4;
    const spacing = pieceRadius * 2;

    // Draw white pieces
    for (let i = 0; i < whiteCount; i++) {
        const pieceY = isTop ? y + spacing * i + 1.5*pieceRadius : y - spacing * i - 1.5*pieceRadius;
        drawPiece(ctx, x, pieceY, pieceRadius, 'white', positionIndex);
    }

    // Draw black pieces
    for (let i = 0; i < blackCount; i++) {
        const pieceY = isTop ? y + spacing * i + 1.5*pieceRadius : y - spacing * i - 1.5*pieceRadius;
        drawPiece(ctx, x, pieceY, pieceRadius, 'black', positionIndex);
    }
}

// Function to draw a single piece
function drawPiece(ctx, x, y, radius, color, positionIndex) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Store piece data
    pieces.push({ x, y, radius, color, positionIndex });
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
        drawTriangle(boardCtx, x, y, pointWidth, pointHeight, color, direction, positionIndex);

        // Draw pieces for this point
        drawPieces(piecesCtx, x, direction === 'down' ? y : y + pointHeight, board[positionIndex][0], board[positionIndex][1], direction === 'down', positionIndex);

        // Toggle color
        colorToggle = (i % 6 === 5) ? colorToggle : !colorToggle;
    }
}

// Function to draw the center bar and frame
function drawCenterBarAndFrame() {
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

// Function to check if a point is inside a circle
function isPointInCircle(px, py, circle) {
    const { x, y, radius } = circle;
    const dx = px - x;
    const dy = py - y;
    return dx * dx + dy * dy <= radius * radius;
}

// Function to handle piece movement
function handlePieceMovement(clickX, clickY) {
    if (selectedPiece) {
        // Move piece to new triangle
        for (let i = 0; i < triangles.length; i++) {
            if (isPointInTriangle(clickX, clickY, triangles[i])) {
                const newPositionIndex = triangles[i].positionIndex;
                if (board[newPositionIndex]) {
                    console.log(isMoveLegal(selectedPiecePosition, newPositionIndex))
                    if (selectedPiece.color === 'white') {
                        board[selectedPiecePosition][0]--;
                        board[newPositionIndex][0]++;
                    } else {
                        board[selectedPiecePosition][1]--;
                        board[newPositionIndex][1]++;
                    }
                    selectedPiece = null;
                    selectedPiecePosition = null;
                    piecesCtx.clearRect(0, 0, piecesCanvas.width, piecesCanvas.height);
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
                selectedPiece = pieces[i];
                selectedPiecePosition = pieces[i].positionIndex;
                console.log(`Piece selected at position ${selectedPiecePosition}`);
                break;
            }
        }
    }
}

function isMoveLegal(start, end) {
    playerInTurn = 'white';
    player = playerInTurn === 'white' ? 0 : 1;
    opponentPiecesAtEnd = board[end][1 - player];
    piece = board[start][player];

    
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
function createBoard() {
    boardCanvas = document.getElementById('boardCanvas');
    piecesCanvas = document.getElementById('piecesCanvas');
    boardCtx = boardCanvas.getContext('2d');
    piecesCtx = piecesCanvas.getContext('2d');

    boardWidth = boardCanvas.width;
    boardHeight = boardCanvas.height;
    pointWidth = boardWidth / 12;
    pointHeight = boardHeight / 2;

    // Draw the board
    drawPointsAndPieces();
    drawCenterBarAndFrame(); // Draw the center bar and frame

    // Add click event listener
    piecesCanvas.addEventListener('click', (event) => {
        const rect = piecesCanvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        handlePieceMovement(clickX, clickY);
    });
}

// Wait for the entire page to load and initialize the board
window.addEventListener('load', () => {
    createBoard();
});