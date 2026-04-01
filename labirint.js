class Question {
    constructor(questionText, correctAnswer, explanation = ''){
        this.quastionText = questionText;
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
}
 class GameUI {
            constructor(containerId) {
                this.container = document.getElementById(containerId);
                if (!this.container) {
                    throw new Error('UI элемент не найден');
                }
                this.container.style.gridTemplateColumns = 'repeat(5, 100px)';
            }
      render(maze) {
                if (!maze) return;
                
                this.container.innerHTML = '';
                
                for (let row = 0; row < maze.rows; row++) {
                    for (let col = 0; col < maze.cols; col++) {
                        const cell = maze.getCell(row, col);
                        const cellDiv = this.createCellElement(cell);
                        this.container.appendChild(cellDiv);
                    }
                }
            }
            
             createCellElement(cell) {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                
                const wallClasses = cell.getWallClasses();
                if (wallClasses) {
                    wallClasses.split(' ').forEach(cls => {
                        if (cls) cellDiv.classList.add(cls);
                    });
                }
               if (cell.isStart()) {
                    cellDiv.classList.add('start');
                    cellDiv.textContent = '🏁';
                    cellDiv.style.fontSize = '30px';
                }
                
                if (cell.isFinish()) {
                    cellDiv.classList.add('end');
                    cellDiv.textContent = '🏆';
                    cellDiv.style.fontSize = '30px';
                }
                
                return cellDiv; 
        }
}
class Game {
            constructor(mazeData) {
                this.maze = new Maze(mazeData);
                this.ui = new GameUI('maze');
            }
            
            start() {
                this.ui.render(this.maze);
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
       