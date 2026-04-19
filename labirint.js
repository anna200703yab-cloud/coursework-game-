class Question {
    constructor(questionText, correctAnswer, explanation = ''){
        this.questionText = questionText;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }
    
    checkAnswer(userAnswer) {
        const normalizedUserAnswer = userAnswer.toString().toLowerCase().trim();
        const normalizedCorrectAnswer = this.correctAnswer.toString().toLowerCase().trim();
        return normalizedUserAnswer === normalizedCorrectAnswer;
    }
}

class QuestionManager {
    constructor() {
        this.questions = [];
        this.currentQuestion = null;
        this.pendingMove = null;
        this.onAnswerCallback = null;
        this.enterHandler = null;
        this.initQuestions();
    }
    
    initQuestions() {
        this.questions = [
            new Question('Какой оператор используется для объявления переменной?', 'let', 'Оператор let (или const, var)'),
            new Question('Какой оператор используется для объявления константы?', 'const', 'Оператор const'),
            new Question('Какой тип данных используется для хранения целых чисел?', 'number', 'Тип number'),
            new Question('Какой тип данных хранит true/false?', 'boolean', 'Тип boolean'),
            new Question('Какой оператор используется для сравнения "равно"?', '===', 'Оператор строгого равенства ==='),
            new Question('Какой оператор используется для логического "И"?', '&&', 'Логический оператор && (and)'),
            new Question('Какой оператор используется для логического "ИЛИ"?', '||', 'Логический оператор || (or)'),
            new Question('Какой оператор используется для отрицания?', '!', 'Логический оператор ! (not)'),
            new Question('Какой метод выводит сообщение в консоль?', 'console.log', 'Метод console.log()'),
            new Question('Какой метод показывает всплывающее окно с сообщением?', 'alert', 'Метод alert()'),
            new Question('Какой метод запрашивает ввод от пользователя?', 'prompt', 'Метод prompt()'),
            new Question('Как создать массив в JavaScript?', '[]', 'Квадратные скобки [] или new Array()'),
            new Question('Как получить длину массива?', 'length', 'Свойство length'),
            new Question('Как добавить элемент в конец массива?', 'push', 'Метод push()'),
            new Question('Как удалить последний элемент массива?', 'pop', 'Метод pop()'),
            new Question('Как создать функцию?', 'function', 'Ключевое слово function'),
            new Question('Как создать стрелочную функцию?', '=>', 'Стрелочная функция () => {}'),
            new Question('Какой оператор используется для цикла с условием?', 'while', 'Оператор while'),
            new Question('Какой оператор используется для цикла со счетчиком?', 'for', 'Оператор for'),
            new Question('Какой оператор прерывает цикл?', 'break', 'Оператор break'),
            new Question('Какой оператор пропускает итерацию цикла?', 'continue', 'Оператор continue'),
            new Question('Как создать объект?', '{}', 'Фигурные скобки {} или new Object()'),
            new Question('Как получить доступ к свойству объекта?', '.', 'Точечная нотация (obj.property)'),
            new Question('Как создать условное выражение?', 'if', 'Оператор if/else'),
            new Question('Какой оператор используется для выбора из нескольких вариантов?', 'switch', 'Оператор switch/case'),
            new Question('Как преобразовать строку в число?', 'Number', 'Функция Number() или parseInt()'),
            new Question('Как преобразовать число в строку?', 'toString', 'Метод toString()'),
            new Question('Какой символ используется для однострочного комментария?', '//', 'Двойной слеш //'),
            new Question('Какой символ используется для многострочного комментария?', '/*', '/* ... */'),
            new Question('Как получить текущую дату и время?', 'Date', 'Объект new Date()')
        ];
    }
    
    getRandomQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        return this.questions[randomIndex];
    }
    
    askQuestion(callback, moveData) {
        this.currentQuestion = this.getRandomQuestion();
        this.pendingMove = moveData ? { ...moveData } : null;
        this.onAnswerCallback = callback;
        
        const modal = document.getElementById('questionModal');
        const questionText = document.getElementById('questionText');
        const answerInput = document.getElementById('answerInput');
        const answerFeedback = document.getElementById('answerFeedback');
        
        if (!modal || !questionText || !answerInput || !answerFeedback) {
            console.error('Элементы модального окна не найдены');
            return;
        }
        
        questionText.textContent = this.currentQuestion.questionText;
        answerInput.value = '';
        answerFeedback.textContent = '';
        answerFeedback.className = 'answer-feedback';
        modal.style.display = 'flex';
        answerInput.focus();
        
        if (this.enterHandler) {
            document.removeEventListener('keydown', this.enterHandler);
        }
        
        this.enterHandler = (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        };
        document.addEventListener('keydown', this.enterHandler);
    }
    
    checkAnswer() {
        const answerInput = document.getElementById('answerInput');
        const userAnswer = answerInput.value;
        const answerFeedback = document.getElementById('answerFeedback');
        
        if (!this.currentQuestion) return;
        
        const isCorrect = this.currentQuestion.checkAnswer(userAnswer);
        const moveDataToSend = this.pendingMove;
        
        if (isCorrect) {
            answerFeedback.textContent = '✅ Правильно! ' + this.currentQuestion.explanation;
            answerFeedback.className = 'answer-feedback correct-answer';
        } else {
            const correctAnswer = this.currentQuestion.correctAnswer;
            answerFeedback.textContent = `❌ Неправильно! Правильный ответ: ${correctAnswer}. ${this.currentQuestion.explanation}`;
            answerFeedback.className = 'answer-feedback wrong-answer';
        }
        
        setTimeout(() => {
            this.closeModal();
            if (this.onAnswerCallback) {
                // Передаем是否正确 и данные движения
                this.onAnswerCallback(isCorrect, moveDataToSend);
            }
        }, 1500);
    }
    
    closeModal() {
        const modal = document.getElementById('questionModal');
        if (modal) {
            modal.style.display = 'none';
        }
        if (this.enterHandler) {
            document.removeEventListener('keydown', this.enterHandler);
            this.enterHandler = null;
        }
        this.currentQuestion = null;
        this.pendingMove = null;
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
        console.log(`Игрок переместился на позицию: row=${this.row}, col=${this.col}`);
    }
    
    reset() {
        this.row = this.startRow;
        this.col = this.startCol;
        console.log(`Игрок сброшен на старт: row=${this.row}, col=${this.col}`);
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
        const currentCell = this.getCell(row, col);
        if (!currentCell) return false;
        
        switch(direction) {
            case 'up':
                // При движении вверх проверяем верхнюю стену текущей клетки
                return !currentCell.hasWall('top');
                
            case 'down':
                // При движении вниз проверяем нижнюю стену текущей клетки
                return !currentCell.hasWall('bottom');
                
            case 'left':
                // При движении влево проверяем левую стену текущей клетки
                return !currentCell.hasWall('left');
                
            case 'right':
                // При движении вправо проверяем правую стену текущей клетки
                return !currentCell.hasWall('right');
                
            default:
                return false;
        }
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
}

class GameUI {
    constructor(containerId, messageId) {
        this.container = document.getElementById(containerId);
        this.messageDiv = document.getElementById(messageId);
        if (!this.container || !this.messageDiv) {
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
        
        if (cell.isStart() && !isPlayerHere) {
            cellDiv.classList.add('start');
            cellDiv.textContent = '🏁';
            cellDiv.style.fontSize = '30px';
        }
        
        if (cell.isFinish()&& !isPlayerHere) {
            cellDiv.classList.add('end');
            if (!isPlayerHere) {
                cellDiv.textContent = '🏆';
                cellDiv.style.fontSize = '30px';
            }
        }
        
         if (isPlayerHere) {
        cellDiv.classList.add('player-cell');
        if (cell.isFinish()) {
            cellDiv.textContent = '😻';  // Кот на финише
        } else {
            cellDiv.textContent = '😺';  // Обычный кот
        }
        cellDiv.style.fontSize = '40px';
    }
        
        return cellDiv;
    }
    
    updateMessage(message, isWin = false) {
        this.messageDiv.innerHTML = message;
        if (isWin) {
            this.messageDiv.classList.add('win');
        } else {
            this.messageDiv.classList.remove('win');
        }
    }
    
    showTemporaryMessage(message, duration = 1000) {
        const originalMessage = this.messageDiv.innerHTML;
        this.messageDiv.innerHTML = message;
        setTimeout(() => {
            if (this.messageDiv.innerHTML === message) {
                this.messageDiv.innerHTML = originalMessage;
            }
        }, duration);
    }
}

class Game {
    constructor(mazeData) {
        this.maze = new Maze(mazeData);
        this.ui = new GameUI('maze', 'message');
        this.player = new Player(0, 0);
        this.questionManager = new QuestionManager();
        this.gameActive = true;
        this.pendingDirection = null;
        this.isWaitingForAnswer = false;
        this.originalMazeData = mazeData; // Сохраняем данные лабиринта для сброса
        
        // Счетчики
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.movesCount = 0;
        
        this.setupResetButton();
        this.setupClearResultsButton();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        document.addEventListener('keydown', this.handleKeyPress);
        
        // Загружаем таблицу результатов
        this.loadResults();
        this.updateScoreDisplay();
    }
    
    setupResetButton() {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            const newBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newBtn, resetBtn);
            newBtn.addEventListener('click', () => {
                this.reset();
            });
        }
    }
    
    setupClearResultsButton() {
        const clearBtn = document.getElementById('clearResultsBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearResults();
            });
        }
    }
    
    handleKeyPress(event) {
        if (!this.gameActive || this.isWaitingForAnswer) return;
        
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
        
        this.isWaitingForAnswer = true;
        this.pendingDirection = { direction, newRow, newCol };
        
        this.questionManager.askQuestion((isCorrect, moveData) => {
            this.onQuestionAnswered(isCorrect, moveData);
        }, this.pendingDirection);
    }
    
    onQuestionAnswered(isCorrect, moveData) {
        // Обновляем счетчики
        if (isCorrect) {
            this.correctAnswers++;
            this.ui.showTemporaryMessage('✅ Правильно! Двигаемся дальше!', 800);
        } else {
            this.wrongAnswers++;
            this.ui.showTemporaryMessage('❌ Неправильный ответ! Но вы все равно двигаетесь!', 1500);
        }
        
        // Увеличиваем счетчик ходов
        this.movesCount++;
        
        // Обновляем отображение счета
        this.updateScoreDisplay();
        
        // Двигаем игрока
        if (moveData) {
            this.player.moveTo(moveData.newRow, moveData.newCol);
            this.ui.render(this.maze, this.player, this.gameActive);
            this.checkWin();
        }
        
        this.isWaitingForAnswer = false;
        this.pendingDirection = null;
    }
    
    updateScoreDisplay() {
        const correctEl = document.getElementById('correctCount');
        const wrongEl = document.getElementById('wrongCount');
        const movesEl = document.getElementById('movesCount');
        
        if (correctEl) correctEl.textContent = this.correctAnswers;
        if (wrongEl) wrongEl.textContent = this.wrongAnswers;
        if (movesEl) movesEl.textContent = this.movesCount;
    }
    
    checkWin() {
        if (this.player.isOnFinish()) {
            this.gameActive = false;
            
            // Сохраняем результат
            this.saveResult();
            
            const accuracy = this.movesCount > 0 ? ((this.correctAnswers / this.movesCount) * 100).toFixed(1) : 0;
            this.ui.updateMessage(`🎉 ПОБЕДА! Вы прошли лабиринт! 🎉\n✅ Правильно: ${this.correctAnswers} | ❌ Неправильно: ${this.wrongAnswers} | 📈 Точность: ${accuracy}%`, true);
            this.ui.render(this.maze, this.player, this.gameActive);
        }
    }
    
    saveResult() {
        const now = new Date();
        const dateTime = now.toLocaleString('ru-RU');
        const accuracy = this.movesCount > 0 ? ((this.correctAnswers / this.movesCount) * 100).toFixed(1) : 0;
        
        const result = {
            id: Date.now(),
            dateTime: dateTime,
            correct: this.correctAnswers,
            wrong: this.wrongAnswers,
            moves: this.movesCount,
            accuracy: accuracy
        };
        
        // Получаем существующие результаты из localStorage
        let results = JSON.parse(localStorage.getItem('mazeResults') || '[]');
        results.unshift(result); // Добавляем в начало
        results = results.slice(0, 10); // Храним только 10 последних результатов
        
        localStorage.setItem('mazeResults', JSON.stringify(results));
        this.loadResults();
    }
    
    loadResults() {
        const results = JSON.parse(localStorage.getItem('mazeResults') || '[]');
        const tbody = document.getElementById('resultsBody');
        
        if (!tbody) return;
        
        if (results.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Пока нет результатов</td></tr>';
            return;
        }
        
        tbody.innerHTML = results.map((result, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${result.dateTime}</td>
                <td>${result.correct}</td>
                <td>${result.wrong}</td>
                <td>${result.moves}</td>
                <td>${result.accuracy}%</td>
            </tr>
        `).join('');
    }
    
    clearResults() {
        if (confirm('Вы уверены, что хотите очистить всю историю результатов?')) {
            localStorage.removeItem('mazeResults');
            this.loadResults();
            this.ui.showTemporaryMessage('🗑️ История результатов очищена!', 1500);
        }
    }
    
    reset() {
        this.player.reset();
        this.gameActive = true;
        this.isWaitingForAnswer = false;
        this.pendingDirection = null;
        
        // Сбрасываем счетчики
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.movesCount = 0;
        this.updateScoreDisplay();
        
        // Сбрасываем лабиринт - создаем новый с оригинальными данными
        this.maze = new Maze(this.originalMazeData);
        
        this.ui.render(this.maze, this.player, this.gameActive);
        this.ui.updateMessage('Игра сброшена! Используйте стрелки для движения.');
    }
    
    start() {
        this.ui.render(this.maze, this.player, this.gameActive);
        this.ui.updateMessage('Используйте стрелки для движения! Отвечайте на вопросы!');
    }
}

const mazeWalls = [
    [
        { top: true, right: false, bottom: false, left: true },
        { top: true, right: true, bottom: true, left: false },
        { top: true, right: true, bottom: false, left: true },
        { top: true, right: true, bottom: true, left: true },
        { top: true, right: true, bottom: false, left: true }
    ],
    [
        { top: false, right: true, bottom: false, left: true },
        { top: true, right: false, bottom: false, left: true },
        { top: false, right: false, bottom: true, left: false },
        { top: false, right: false, bottom: false, left: false },
        { top: false, right: true, bottom: true, left: false }
    ],
    [
        { top: false, right: false, bottom: true, left: true },
        { top: false, right: true, bottom: false, left: false },
        { top: true, right: false, bottom: false, left: true },
        { top: false, right: false, bottom: true, left: false },
        { top: true, right: true, bottom: false, left: true }
    ],
    [
        { top: true, right: true, bottom: false, left: true },
        { top: false, right: false, bottom: false, left: true },
        { top: false, right: false, bottom: true, left: false },
        { top: true, right: true, bottom: false, left: false },
        { top: false, right: true, bottom: true, left: true }
    ],
    [
        { top: false, right: false, bottom: true, left: true },
        { top: false, right: false, bottom: true, left: false },
        { top: true, right: true, bottom: true, left: true },
        { top: false, right: false, bottom: true, left: true },
        { top: true, right: true, bottom: true, left: false }
    ]
];

// Создаем и запускаем игру
const game = new Game(mazeWalls);
game.start();
window.game = game;