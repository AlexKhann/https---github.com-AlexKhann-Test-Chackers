const Player = {YELLOW: 'checker-yellow', BLUE: 'checker-blue'}

const defaultBoardAppearance = [
    [null, 'checker-blue', null, 'checker-blue', null, 'checker-blue', null, 'checker-blue' ],
    ['checker-blue', null, 'checker-blue', null, 'checker-blue', null, 'checker-blue', null],
    [null, 'checker-blue', null, 'checker-blue', null, 'checker-blue', null, 'checker-blue' ],
    [null, null, null, null, null, null, null, null ],
    [null, null, null, null, null, null, null, null],
    ['checker-yellow', null, 'checker-yellow', null, 'checker-yellow', null, 'checker-yellow', null],
    [null, 'checker-yellow', null, 'checker-yellow', null, 'checker-yellow', null, 'checker-yellow'],
    ['checker-yellow', null, 'checker-yellow', null, 'checker-yellow', null, 'checker-yellow', null],
];

let board;
let currentPlayer = Player.BLUE;
let selectedChecker = null;

function play(){
    board = [];
    defaultBoardAppearance.forEach(cells => board.push(Array.from(cells)));
    currentPlayer = Player.BLUE;
    document.querySelector('.restart-btn').addEventListener('click', play);
    redrawPlayerLabel();
    drawCheckers();
}

function changePlayer(){
    currentPlayer = currentPlayer === Player.BLUE ? Player.YELLOW : Player.BLUE;
    redrawPlayerLabel();
    drawCheckers();
}

function redrawPlayerLabel(){
    let playerContainer = document.querySelector('.current-player-container');
    clearNode(playerContainer);
    let playerElement = document.createElement('p');
    playerElement.className = 'current-player';
    let textNode = document.createTextNode(currentPlayer === Player.BLUE ? 'Blue Moves' : 'Yellow Moves');
    playerElement.appendChild(textNode);
    playerContainer.appendChild(playerElement);

}

function drawCheckers(){ 
    let boardCells = document.querySelector('.board-cells');
    clearNode(boardCells);
    let cell;
    let isCellBlack = true;

    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (j == 0) isCellBlack = !isCellBlack;
            cell = document.createElement('div');
            if (isCellBlack) cell.className = 'cell black';
            else cell.className = 'cell white';
                let currentCheckerType = board[i][j];
                if(currentCheckerType !== null){
                    let checkerClass = currentCheckerType;
                    let currentChecker = document.createElement('div');
                    currentChecker.className = checkerClass;
                    currentChecker.dataset.row = i;
                    currentChecker.dataset.column = j;
                    cell.appendChild(currentChecker);
                }
            cell.dataset.row = i;
            cell.dataset.column = j;
            boardCells.appendChild(cell);
            isCellBlack = !isCellBlack;
        }
    }
    invalidateListeners();
}

function invalidateListeners(){
  let checkers = document.querySelectorAll(`.${currentPlayer}`)
  checkers.forEach(checker =>
    checker.addEventListener('click',function() {
        if(selectedChecker == checker){
            selectedChecker = null;
            clearHighlights();
        } else{
            highliteMoves(parseInt(checker.dataset.row), parseInt(checker.dataset.column));
            selectedChecker = checker;
        }
    })
    );
}

function highliteMoves(row, column){
clearHighlights();
if(currentPlayer === Player.BLUE){
    if(row < 7){
        if(column > 0 && column < 7){
            if(board[row+1][column-1] == null){
                addHighlight(row+1, column-1)
            }
            if(board[row+1][column+1] == null){
                addHighlight(row+1, column+1)
            }
        }
        if(column > 0 && column === 7){
            if(board[row+1][column-1] == null){
                addHighlight(row+1, column-1)
            }
        }
        if(column === 0 && column < 7){
            if(board[row+1][column+1] == null){
                addHighlight(row+1, column+1)
            }
        }
    }
} else {
    if(row > 0){
        if(column > 0 && column < 7){
            if(board[row-1][column-1] == null){
                addHighlight(row-1, column-1)
            }
            if(board[row-1][column+1] == null){
                addHighlight(row-1, column+1)
            }
        }
        if(column > 0 && column === 7){
            if(board[row-1][column-1] == null){
                addHighlight(row-1, column-1)
            }
        }
        if(column === 0 && column < 7){
            if(board[row-1][column+1] == null){
                addHighlight(row-1, column+1)
            }
        }
    }
}
}

function addHighlight(row, column){
    let boardCells = document.querySelector('.board-cells');
    boardCells.childNodes.forEach(cell => {
        if(cell.dataset.row == row && cell.dataset.column == column){
           let highlight = document.createElement('div');
           highlight.className = 'highlight';
           cell.appendChild(highlight);
           highlight.addEventListener('click', function(){
                move(selectedChecker, highlight)
           })
        }})
}

function clearHighlights(){
    let highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => highlight.remove())
}

function move(checker, highlight){
    let translationY = (parseInt(highlight.parentNode.dataset.row) - parseInt(checker.dataset.row))*90;
    let translationX = (parseInt(highlight.parentNode.dataset.column) - parseInt(checker.dataset.column))*90;
    let currentRow = board[parseInt(checker.dataset.row)];
    let checkerType = currentRow[parseInt(checker.dataset.column)];
    currentRow[checker.dataset.column] = null;
    board[parseInt(checker.dataset.row)] = currentRow;

    let newRow = board[parseInt(highlight.parentNode.dataset.row)];
    newRow[highlight.parentNode.dataset.column] = checkerType;
    board[parseInt(highlight.parentNode.dataset.row)] = newRow;
    checker.style.transform = `translate(${translationX}px,${translationY}px)`;
    checker.style.transition = "transform 300ms linear 0s";
    setTimeout(function() { changePlayer(); }, 300);
}

play();


function clearNode(node) {
    while (node.hasChildNodes()) {
        clearRecursively(node.firstChild);
    }
  }

  function clearRecursively(node) {
    while (node.hasChildNodes()) {
        clearRecursively(node.firstChild);
    }
    node.parentNode.removeChild(node);
  }
  