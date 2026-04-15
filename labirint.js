class Question {
    constructor(questionText, correctAnswer, explanation = ''){
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }
   
}

class QuestionManager {
            constructor() {
                this.questions = [];
                this.currentQuestion = null;
                this.pendingMove = null; // Сохраняем ожидающее движение
                this.onAnswerCallback = null;
                this.initQuestions();
            }
     initQuestions() {
                this.questions = [
                    new Question('Напишите код для подключения внешнего файла', '<script src= "">  </script>'),
                ];
            }
}

   class Cell {
     constructor(row, col, walls) {
        this.row = row;
        this.col = col;
        this.walls = { ...walls };
    }
    
    hasWall(direction) {
        return this.walls[direction];
    }
    
    setWall(direction, value) {
        this.walls[direction] = value;
    }
            
    getWallClasses() {
        let classes = '';
        if (this.walls.top) classes += 'wall-top ';
        if (this.walls.right) classes += 'wall-right ';
        if (this.walls.bottom) classes += 'wall-bottom ';
        if (this.walls.left) classes += 'wall-left ';
        return classes.trim();
    }       
    isStart() {
        return this.row === 0 && this.col === 0;
    }
            
    isFinish() {
        return this.row === 4 && this.col === 4;
    }
}


class Player {
    constructor(startRow, startCol) {
        this.row = startRow;
        this.col = startCol;
        this.startRow = startRow;
        this.startCol = startCol;
    }
    moveTo(newRow, newCol) {
        this.row = newRow;
        this.col = newCol;
    }
            
    reset() {
        this.row = this.startRow;
        this.col = this.startCol;
    }
            
    getPosition() {
        return { row: this.row, col: this.col };
    }
            
     isOnFinish() {
        return this.row === 4 && this.col === 4;
    }
}

class Maze {
    constructor(wallsData) {
        this.rows = 5;
        this.cols = 5;
        this.grid = [];
        this.initGrid(wallsData);
    }
            
    initGrid(wallsData) {
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col] = new Cell(row, col, wallsData[row][col]);
            }
        }
    }
getCell(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            return this.grid[row][col];
        }
        return null;
    }
 canMove(row, col, direction) {
                const cell = this.getCell(row, col);
                if (!cell) return false;
                return !cell.hasWall(direction);
            }
            
            isValidPosition(row, col) {
                return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
            }
}
 class GameUI {
            constructor(containerId) {
                this.container = document.getElementById(containerId);
                if (!this.container) {
                    throw new Error('UI элемент не найден');
                }
                this.container.style.gridTemplateColumns = 'repeat(5, 100px)';
            }
      render(maze, player, gameActive) {
                if (!maze || !player) return;
                
                this.container.innerHTML = '';
                const playerPos = player.getPosition();
                
                for (let row = 0; row < maze.rows; row++) {
                    for (let col = 0; col < maze.cols; col++) {
                        const cell = maze.getCell(row, col);
                        const cellDiv = this.createCellElement(cell, playerPos, gameActive);
                        this.container.appendChild(cellDiv);
                    }
                }
            }
            
             createCellElement(cell, playerPos, gameActive) {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                
                const wallClasses = cell.getWallClasses();
                if (wallClasses) {
                    wallClasses.split(' ').forEach(cls => {
                        if (cls) cellDiv.classList.add(cls);
                    });
                }
                
                const isPlayerHere = (cell.row === playerPos.row && cell.col === playerPos.col);
                
                if (cell.isStart()) {
                    cellDiv.classList.add('start');
                    if (!isPlayerHere && !cell.isFinish()) {
                        cellDiv.textContent = '🏁';
                        cellDiv.style.fontSize = '30px';
                    }
                }
                
                if (cell.isFinish()) {
                    cellDiv.classList.add('end');
                    if (!isPlayerHere) {
                        cellDiv.textContent = '🏆';
                        cellDiv.style.fontSize = '30px';
                    }
                }
                
                if (isPlayerHere && gameActive) {
                    cellDiv.classList.add('player-cell');
                    cellDiv.textContent = '😺';
                    cellDiv.style.fontSize = '40px';
                }
                if (isPlayerHere && cell.isFinish()) {
                    cellDiv.textContent = '😻';
                    cellDiv.style.fontSize = '40px';
                }
                
                return cellDiv; 

        }
}
class Game {
            constructor(mazeData) {
                this.maze = new Maze(mazeData);
                this.ui = new GameUI('maze');
                this.player = new Player(0, 0);
                this.gameActive = true;
                this.pendingDirection = null;
                this.setupResetButton();
                this.handleKeyPress = this.handleKeyPress.bind(this);
                document.addEventListener('keydown', this.handleKeyPress);
            }
              setupResetButton() {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.reset();
            });
        } else {
            console.warn('Кнопка сброса не найдена');
        }
    }
            handleKeyPress(event) {
                if (!this.gameActive) return;
                
                const key = event.key;
                let direction = null;
                
                switch(key) {
                    case 'ArrowUp': direction = 'up'; break;
                    case 'ArrowDown': direction = 'down'; break;
                    case 'ArrowLeft': direction = 'left'; break;
                    case 'ArrowRight': direction = 'right'; break;
                    default: return;
                }
                
                event.preventDefault();
                this.attemptMove(direction);
            }
            attemptMove(direction) {
                // Проверяем, можно ли физически переместиться (без учета вопросов)
                const currentPos = this.player.getPosition();
                
                if (!this.maze.canMove(currentPos.row, currentPos.col, direction)) {
                    this.ui.showTemporaryMessage('🧱 Здесь стена! Ищите другой путь!');
                    return;
                }
                
                let newRow = currentPos.row;
                let newCol = currentPos.col;
                
                switch(direction) {
                    case 'up': newRow--; break;
                    case 'down': newRow++; break;
                    case 'left': newCol--; break;
                    case 'right': newCol++; break;
                }
                
                if (!this.maze.isValidPosition(newRow, newCol)) {
                    this.ui.showTemporaryMessage('❌ Нельзя выходить за пределы лабиринта!');
                    return;
                }
                this.player.moveTo(newRow, newCol);
    
                this.ui.render(this.maze, this.player, this.gameActive);
    
    // Проверка победы
    if (this.player.isOnFinish()) {
        this.gameActive = false;
    }
            }
             reset() {
                this.player.reset();
                this.gameActive = true;
                this.pendingDirection = null;
                this.ui.render(this.maze, this.player, this.gameActive);
            }
            start() {
                this.ui.render(this.maze, this.player, this.gameActive);
                console.log('Поле с клетками отображено');
            }
        }
         const mazeWalls = [
            [
                { top: true,  right: false, bottom: false,  left: true  },
                { top: true,  right: true,  bottom: true,  left: false },
                { top: true,  right: true, bottom: false, left: true  },
                { top: true,  right: true, bottom: true, left: true },
                { top: true,  right: true,  bottom: false, left: true  }
            ],
            [
                { top: false,  right: true, bottom: false, left: true  },
                { top: true,  right: false,  bottom: false,  left: true },
                { top: false,  right: false,  bottom: true,  left: false },
                { top: false, right: false, bottom: false, left: false  },
                { top: false, right: true,  bottom: true,  left: false  }
            ],
            [
                { top: false, right: false, bottom: true, left: true  },
                { top: false, right: true, bottom: false, left: false },
                { top: true, right: false, bottom: false, left: true },
                { top: false, right: false, bottom: true,  left: false },
                { top: true, right: true,  bottom: false,  left: true  }
            ],
            [
                { top: true, right: true,  bottom: false,  left: true  },
                { top: false, right: false,  bottom: false,  left: true  },
                { top: false,  right: false, bottom: true, left: false  },
                { top: true,  right: true,  bottom: false,  left: false },
                { top: false,  right: true,  bottom: true,  left: true  }
            ],
            [
                { top: false, right: false, bottom: true,  left: true  },
                { top: false, right: false, bottom: true,  left: false },
                { top: true, right: true, bottom: true,  left: true },
                { top: false, right: false, bottom: true,  left: true },
                { top: true, right: true,  bottom: true,  left: false  }
            ]
        ];
        
        // Создаем и запускаем отображение поля
        const game = new Game(mazeWalls);
        game.start();
        window.game = game;
       