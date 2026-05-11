class Question {
    constructor(questionText, correctAnswer, explanation = '') {
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

class ColoredQuestion extends Question {
    constructor(questionText, correctAnswer, explanation, colorType) {
        super(questionText, correctAnswer, explanation);
        this.colorType = colorType;
        this.points = this.getPoints();
    }
    
    getPoints() {
        switch(this.colorType) {
            case 'red': return -1;
            case 'yellow': return 2;
            case 'green': return 1;
            default: return 1;
        }
    }
    
    getColorClass() {
        switch(this.colorType) {
            case 'red': return 'question-red';
            case 'yellow': return 'question-yellow';
            case 'green': return 'question-green';
            default: return '';
        }
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
        const baseQuestions = [
    // Раздел 4.1 - Роль JavaScript и история
    new Question('Как называется последовательность инструкций для интерпретации?', 'скрипт', 'Сценарий или скрипт'),
    new Question('Какой язык используется для клиентских сценариев?', 'javascript', 'JavaScript'),
    new Question('Кто создал JavaScript?', 'Брендан Эйх', 'Брендан Эйх'),
    new Question('В каком году создан JavaScript?', '1995', '1995 год'),
    new Question('Как назывался JavaScript изначально?', 'Mocha', 'Mocha'),
    new Question('Какая организация стандартизирует JavaScript?', 'ECMA', 'ECMA International'),
    new Question('Как называется стандарт JavaScript?', 'ECMAScript', 'ECMAScript'),
    new Question('Какая версия ECMAScript добавила классы?', 'ES6', 'ES6 или ECMAScript 2015'),
    new Question('Что преобразует современный JavaScript в старый?', 'Babel', 'Транспилер Babel'),
    new Question('Что добавляет отсутствующие методы в старые браузеры?', 'полифиллы', 'Полифиллы'),
    new Question('Какой движок JS используется в Chrome?', 'V8', 'V8'),
    new Question('Как называется главный справочник по JS?', 'MDN', 'MDN Web Docs'),
    
    // Раздел 4.2 - Подключение скриптов
    new Question('Какой тег подключает JavaScript?', 'script', 'Тег script'),
    new Question('Какой атрибут откладывает выполнение скрипта?', 'defer', 'defer'),
    new Question('Какой атрибут загружает скрипт параллельно?', 'async', 'async'),
    
    // Раздел 4.3 - Переменные
    new Question('Какое ключевое слово для изменяемой переменной?', 'let', 'let'),
    new Question('Какое ключевое слово для константы?', 'const', 'const'),
    new Question('Какое устаревшее ключевое слово для переменной?', 'var', 'var'),
    new Question('Что имеет let, но не имеет var?', 'блок', 'Блочная область видимости'),
    new Question('Как называется поднятие переменной?', 'hoisting', 'Поднятие (hoisting)'),
    
    // Раздел 4.4 - Типы данных
    new Question('Какой тип для целых и дробных чисел?', 'number', 'Number'),
    new Question('Какой тип для true/false?', 'boolean', 'Boolean'),
    new Question('Какой тип для текста?', 'string', 'String'),
    new Question('Какое значение у необъявленной переменной?', 'undefined', 'undefined'),
    new Question('Какое значение означает "пусто"?', 'null', 'null'),
    new Question('Какой тип для уникальных идентификаторов?', 'Symbol', 'Symbol'),
    new Question('Какой тип для очень больших целых чисел?', 'BigInt', 'BigInt'),
    new Question('Что возвращает typeof null?', 'object', 'object'),
    new Question('Как проверить массив?', 'Array.isArray', 'Array.isArray()'),
    new Question('Какой оператор строгого равенства?', '===', 'Тройное равно'),
    new Question('Какие кавычки для шаблонных строк?', 'обратные', 'Обратные кавычки (`)'),
    new Question('Какой метод преобразует строку в число?', 'Number', 'Number()'),
    
    // Раздел 4.5 - Функции
    new Question('Что передаётся в другую функцию?', 'callback', 'Колбэк-функция'),
    new Question('Какой синтаксис стрелочной функции?', 'стрелка', '=> (стрелка)'),
    new Question('Что не создают стрелочные функции?', 'this', 'Собственный this'),
    
    // Раздел 4.6 - Условия
    new Question('Какой оператор сокращает if-else?', 'тернарный', 'Тернарный оператор (?:)'),
    
    // Раздел 4.7 - Циклы
    new Question('Какой цикл выполняется хотя бы раз?', 'do while', 'do...while'),
    new Question('Какой цикл перебирает ключи объекта?', 'for in', 'for...in'),
    new Question('Какой цикл перебирает значения?', 'for of', 'for...of'),
    
    // Раздел 4.8 - Массивы и объекты
    new Question('Какой метод преобразует массив?', 'map', 'map()'),
    new Question('Какой метод фильтрует массив?', 'filter', 'filter()'),
    new Question('Какой метод сводит массив к значению?', 'reduce', 'reduce()'),
    new Question('Какой метод выполняет действие для каждого элемента?', 'forEach', 'forEach()'),
    new Question('Какой оператор копирует объект?', 'spread', 'Спред-оператор (...)'),
    
    // Раздел 4.9 - Деструктуризация
    new Question('Что извлекает значения из массива?', 'деструктуризация', 'Деструктуризация'),
    
    // Раздел 4.10-4.11 - DOM
    new Question('Как называется модель документа?', 'DOM', 'DOM'),
    new Question('Как получить элемент по id?', 'getElementById', 'getElementById()'),
    new Question('Какой метод выбирает по CSS-селектору?', 'querySelector', 'querySelector()'),
    new Question('Как добавить обработчик события?', 'addEventListener', 'addEventListener()'),
    new Question('Как отменить действие браузера?', 'preventDefault', 'preventDefault()'),
    new Question('Какое событие после загрузки HTML?', 'DOMContentLoaded', 'DOMContentLoaded'),
    new Question('Как добавить класс элементу?', 'classList.add', 'classList.add()'),
    new Question('Как удалить элемент из DOM?', 'remove', 'remove()'),
    
    // Раздел 4.12 - JSON
    new Question('Как расшифровывается JSON?', 'JavaScript Object Notation', 'JavaScript Object Notation'),
    new Question('Как объект превратить в JSON?', 'stringify', 'JSON.stringify()'),
    new Question('Как JSON превратить в объект?', 'parse', 'JSON.parse()'),
    
    // Раздел 4.13 - Асинхронность
    new Question('Что представляет результат асинхронной операции?', 'Promise', 'Promise'),
    new Question('Какой метод для HTTP-запросов?', 'fetch', 'fetch()'),
    new Question('Какое слово делает функцию асинхронной?', 'async', 'async'),
    new Question('Какое слово ждёт Promise?', 'await', 'await'),
    
    // Раздел 4.14 - Ошибки
    new Question('Как ловить ошибки?', 'try catch', 'try...catch')
];      
        for (const q of baseQuestions) {
            const colors = ['red', 'yellow', 'green'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.questions.push(new ColoredQuestion(
                q.questionText, 
                q.correctAnswer, 
                q.explanation, 
                randomColor
            ));
        }
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
        const questionContent = document.getElementById('questionContent');
        const questionText = document.getElementById('questionText');
        const answerInput = document.getElementById('answerInput');
        const answerFeedback = document.getElementById('answerFeedback');
        
        if (!modal || !questionText || !answerInput || !answerFeedback) {
            console.error('Элементы модального окна не найдены');
            return;
        }
        
        questionContent.className = 'question-content ' + this.currentQuestion.getColorClass();
        
        let pointsText = '';
        if (this.currentQuestion.colorType === 'red') pointsText = '🔴 ЛОВУШКА! -1 балл';
        else if (this.currentQuestion.colorType === 'yellow') pointsText = '🟡 БОНУС! +2 балла';
        else pointsText = '🟢 Обычный вопрос +1 балл';
        
        questionText.innerHTML = `<div style="margin-bottom:10px; font-size:14px;">${pointsText}</div>${this.currentQuestion.questionText}`;
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
        const pointsEarned = isCorrect ? this.currentQuestion.points : 0;
        const moveDataToSend = this.pendingMove;
        
        let feedbackMessage = '';
        if (isCorrect) {
            const pointsSymbol = pointsEarned > 0 ? `+${pointsEarned}` : pointsEarned;
            feedbackMessage = `✅ Правильно! ${pointsSymbol} балл(ов). ${this.currentQuestion.explanation}`;
            answerFeedback.className = 'answer-feedback correct-answer';
        } else {
            feedbackMessage = `❌ Неправильно! Правильный ответ: ${this.currentQuestion.correctAnswer}. 0 баллов. ${this.currentQuestion.explanation}`;
            answerFeedback.className = 'answer-feedback wrong-answer';
        }
        
        answerFeedback.textContent = feedbackMessage;
        
        setTimeout(() => {
            this.closeModal();
            if (this.onAnswerCallback) {
                this.onAnswerCallback(isCorrect, pointsEarned, moveDataToSend);
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
        this.wallsRevealed = { top: false, right: false, bottom: false, left: false };
    }
    
    hasWall(direction) { 
        return this.walls[direction]; 
    }
    
    isWallRevealed(direction) {
        return this.wallsRevealed[direction];
    }
    
    revealWall(direction) {
        this.wallsRevealed[direction] = true;
    }
    
    getWallClasses() {
        let classes = '';
        if (this.walls.top && this.wallsRevealed.top) classes += 'wall-top ';
        if (this.walls.right && this.wallsRevealed.right) classes += 'wall-right ';
        if (this.walls.bottom && this.wallsRevealed.bottom) classes += 'wall-bottom ';
        if (this.walls.left && this.wallsRevealed.left) classes += 'wall-left ';
        return classes.trim();
    }
    
    isStart() { return this.row === 0 && this.col === 0; }
    isFinish() { return this.row === 4 && this.col === 4; }
}

class Player {
    constructor(startRow, startCol) {
        this.row = startRow;
        this.col = startCol;
        this.startRow = startRow;
        this.startCol = startCol;
        this.visitedCells = new Set();
        this.addCurrentToVisited();
    }
    
    addCurrentToVisited() {
        this.visitedCells.add(`${this.row},${this.col}`);
    }
    
    moveTo(newRow, newCol) {
        this.row = newRow;
        this.col = newCol;
        this.addCurrentToVisited();
    }
    
    reset() {
        this.row = this.startRow;
        this.col = this.startCol;
        this.visitedCells.clear();
        this.addCurrentToVisited();
    }
    
    getPosition() { return { row: this.row, col: this.col }; }
    isOnFinish() { return this.row === 4 && this.col === 4; }
    
    hasVisited(row, col) {
        return this.visitedCells.has(`${row},${col}`);
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
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) return this.grid[row][col];
        return null;
    }
    
    canMove(row, col, direction) {
        const currentCell = this.getCell(row, col);
        if (!currentCell) return false;
        switch(direction) {
            case 'up': return !currentCell.hasWall('top');
            case 'down': return !currentCell.hasWall('bottom');
            case 'left': return !currentCell.hasWall('left');
            case 'right': return !currentCell.hasWall('right');
            default: return false;
        }
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    revealWallsAroundPosition(row, col) {
        const cell = this.getCell(row, col);
        if (!cell) return;
        
        if (cell.hasWall('top')) cell.revealWall('top');
        if (cell.hasWall('right')) cell.revealWall('right');
        if (cell.hasWall('bottom')) cell.revealWall('bottom');
        if (cell.hasWall('left')) cell.revealWall('left');
        
        const neighbors = [
            { dir: 'top', row: row - 1, col: col, neighborWall: 'bottom' },
            { dir: 'bottom', row: row + 1, col: col, neighborWall: 'top' },
            { dir: 'left', row: row, col: col - 1, neighborWall: 'right' },
            { dir: 'right', row: row, col: col + 1, neighborWall: 'left' }
        ];
        
        for (const neighbor of neighbors) {
            const neighborCell = this.getCell(neighbor.row, neighbor.col);
            if (neighborCell && neighborCell.hasWall(neighbor.neighborWall)) {
                neighborCell.revealWall(neighbor.neighborWall);
            }
        }
    }
}

class GameUI {
    constructor(containerId, messageId) {
        this.container = document.getElementById(containerId);
        this.messageDiv = document.getElementById(messageId);
        if (!this.container || !this.messageDiv) throw new Error('UI элемент не найден');
        this.container.style.gridTemplateColumns = 'repeat(5, 90px)';
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
            wallClasses.split(' ').forEach(cls => { if (cls) cellDiv.classList.add(cls); });
        }
        
        const isPlayerHere = (cell.row === playerPos.row && cell.col === playerPos.col);
        
        if (cell.isStart() && !isPlayerHere) {
            cellDiv.classList.add('start');
            cellDiv.textContent = '🏁';
        }
        
        if (cell.isFinish() && !isPlayerHere) {
            cellDiv.classList.add('end');
            cellDiv.textContent = '🏆';
        }
        
        if (isPlayerHere) {
            cellDiv.classList.add('player-cell');
            if (cell.isFinish()) cellDiv.textContent = '😻';
            else cellDiv.textContent = '😺';
            cellDiv.style.fontSize = '40px';
        }
        return cellDiv;
    }
    
    updateMessage(message, isWin = false) {
        this.messageDiv.innerHTML = message;
        if (isWin) this.messageDiv.classList.add('win');
        else this.messageDiv.classList.remove('win');
    }
    
    showTemporaryMessage(message, duration = 1000) {
        const originalMessage = this.messageDiv.innerHTML;
        this.messageDiv.innerHTML = message;
        setTimeout(() => {
            if (this.messageDiv.innerHTML === message) this.messageDiv.innerHTML = originalMessage;
        }, duration);
    }
}

class Game {
    constructor(mazeData) {
        this.maze = new Maze(mazeData);
        this.ui = new GameUI('maze', 'message');
        this.player = new Player(0, 0);
        this.questionManager = new QuestionManager();
        this.gameActive = false;
        this.pendingDirection = null;
        this.isWaitingForAnswer = false;
        this.originalMazeData = mazeData;
        
        this.playerName = '';
        this.playerLastName = '';
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.movesCount = 0;
        
        this.setupResetButton();
        this.setupHistoryModal();
        this.setupNameModal();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        
        this.updateStatsDisplay();
        
        this.revealStartWalls();
        
        this.showNameModal();
    }
    
    sortAndLimitResults(results) {
        results.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            if (b.accuracy !== a.accuracy) {
                return b.accuracy - a.accuracy;
            }
            return b.correct - a.correct;
        });
        return results.slice(0, 7);
    }
    
    revealStartWalls() {
        this.maze.revealWallsAroundPosition(0, 0);
        this.ui.render(this.maze, this.player, this.gameActive);
    }
    
    setupNameModal() {
        this.nameModal = document.getElementById('nameModal');
        this.firstNameInput = document.getElementById('firstNameInput');
        this.lastNameInput = document.getElementById('lastNameInput');
        this.startGameBtn = document.getElementById('startGameBtn');
        this.nameError = document.getElementById('nameError');
        
        if (this.firstNameInput && this.lastNameInput) {
            const checkInputs = () => {
                const firstName = this.firstNameInput.value.trim();
                const lastName = this.lastNameInput.value.trim();
                if (firstName && lastName) {
                    this.startGameBtn.disabled = false;
                    this.nameError.textContent = '';
                } else {
                    this.startGameBtn.disabled = true;
                    this.nameError.textContent = '❌ Пожалуйста, введите имя и фамилию';
                }
            };
            
            this.firstNameInput.addEventListener('input', checkInputs);
            this.lastNameInput.addEventListener('input', checkInputs);
            
            this.startGameBtn.addEventListener('click', () => {
                this.playerName = this.firstNameInput.value.trim();
                this.playerLastName = this.lastNameInput.value.trim();
                if (this.playerName && this.playerLastName) {
                    this.closeNameModal();
                    this.start();
                }
            });
        }
    }
    
    showNameModal() {
        if (this.nameModal) {
            this.nameModal.style.display = 'flex';
            if (this.firstNameInput) this.firstNameInput.focus();
        }
    }
    
    closeNameModal() {
        if (this.nameModal) {
            this.nameModal.style.display = 'none';
        }
    }
    
    setupResetButton() {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            const newBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newBtn, resetBtn);
            newBtn.addEventListener('click', () => this.reset());
        }
    }
    
    setupHistoryModal() {
        this.historyModal = document.getElementById('historyModal');
        this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        
        if (this.closeHistoryBtn) {
            this.closeHistoryBtn.addEventListener('click', () => this.closeHistoryModal());
        }
        
        if (this.playAgainBtn) {
            this.playAgainBtn.addEventListener('click', () => {
                this.closeHistoryModal();
                this.reset();
            });
        }
        
        if (this.historyModal) {
            this.historyModal.addEventListener('click', (e) => {
                if (e.target === this.historyModal) {
                    this.closeHistoryModal();
                }
            });
        }
    }
    
    closeHistoryModal() {
        if (this.historyModal) {
            this.historyModal.style.display = 'none';
        }
    }
    
    showHistoryModal() {
        if (!this.historyModal) return;
        
        const accuracy = this.movesCount > 0 ? ((this.correctAnswers / this.movesCount) * 100).toFixed(1) : 0;
        document.getElementById('playerNameDisplay').textContent = `${this.playerName} ${this.playerLastName}`;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalCorrect').textContent = this.correctAnswers;
        document.getElementById('finalWrong').textContent = this.wrongAnswers;
        document.getElementById('finalMoves').textContent = this.movesCount;
        document.getElementById('finalAccuracy').textContent = accuracy;
        
        this.loadResultsIntoModal();
        this.historyModal.style.display = 'flex';
    }
    
    loadResultsIntoModal() {
        const results = JSON.parse(localStorage.getItem('mazeResults') || '[]');
        const tbody = document.getElementById('historyBody');
        if (!tbody) return;
        
        const sortedResults = this.sortAndLimitResults([...results]);
        
        if (sortedResults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Пока нет побед</td></tr>';
            return;
        }
        
        tbody.innerHTML = sortedResults.map((result, index) => {
            let medal = '';
            if (index === 0) medal = '🥇 ';
            else if (index === 1) medal = '🥈 ';
            else if (index === 2) medal = '🥉 ';
            
            return `
                <tr>
                    <td>${medal}${index + 1}</td>
                    <td><strong>${result.fullName || result.playerName + ' ' + result.playerLastName}</strong></td>
                    <td>${result.dateTime}</td>
                    <td><strong style="color: #4CAF50;">${result.score}</strong></td>
                    <td>${result.correct}</td>
                    <td>${result.wrong}</td>
                    <td>${result.moves}</td>
                    <td>${result.accuracy}%</td>
                </tr>
            `;
        }).join('');
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
        
        let newRow = currentPos.row, newCol = currentPos.col;
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
        this.questionManager.askQuestion((isCorrect, pointsEarned, moveData) => {
            this.onQuestionAnswered(isCorrect, pointsEarned, moveData);
        }, this.pendingDirection);
    }
    
    onQuestionAnswered(isCorrect, pointsEarned, moveData) {
        if (isCorrect) {
            this.correctAnswers++;
            this.score += pointsEarned;
            const pointText = pointsEarned > 0 ? `+${pointsEarned}` : pointsEarned;
            this.ui.showTemporaryMessage(`✅ ${pointText} балла(ов)! Счёт: ${this.score}`, 1000);
        } else {
            this.wrongAnswers++;
            this.ui.showTemporaryMessage(`❌ Неправильно! 0 баллов. Счёт: ${this.score}`, 1500);
        }
        
        this.movesCount++;
        this.updateStatsDisplay();
        
        if (moveData) {
            this.player.moveTo(moveData.newRow, moveData.newCol);
            this.maze.revealWallsAroundPosition(moveData.newRow, moveData.newCol);
            this.ui.render(this.maze, this.player, this.gameActive);
            this.checkWin();
        }
        
        this.isWaitingForAnswer = false;
        this.pendingDirection = null;
    }
    
    updateStatsDisplay() {
        const scoreEl = document.getElementById('scoreValue');
        const correctEl = document.getElementById('correctCount');
        const wrongEl = document.getElementById('wrongCount');
        const movesEl = document.getElementById('movesCount');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (correctEl) correctEl.textContent = this.correctAnswers;
        if (wrongEl) wrongEl.textContent = this.wrongAnswers;
        if (movesEl) movesEl.textContent = this.movesCount;
    }
    
    checkWin() {
        if (this.player.isOnFinish()) {
            this.gameActive = false;
            this.saveResult();
            const accuracy = this.movesCount > 0 ? ((this.correctAnswers / this.movesCount) * 100).toFixed(1) : 0;
            this.ui.updateMessage(`🎉 ПОБЕДА! Счёт: ${this.score} | Точность: ${accuracy}% 🎉`, true);
            this.ui.render(this.maze, this.player, this.gameActive);
            
            setTimeout(() => {
                this.showHistoryModal();
            }, 500);
        }
    }
    
    saveResult() {
        const now = new Date();
        const dateTime = now.toLocaleString('ru-RU');
        const accuracy = this.movesCount > 0 ? ((this.correctAnswers / this.movesCount) * 100).toFixed(1) : 0;
        
        const result = {
            id: Date.now(),
            playerName: this.playerName,
            playerLastName: this.playerLastName,
            fullName: `${this.playerName} ${this.playerLastName}`,
            dateTime: dateTime,
            score: this.score,
            correct: this.correctAnswers,
            wrong: this.wrongAnswers,
            moves: this.movesCount,
            accuracy: accuracy
        };
        
        let results = JSON.parse(localStorage.getItem('mazeResults') || '[]');
        results.push(result);
        results = this.sortAndLimitResults(results);
        localStorage.setItem('mazeResults', JSON.stringify(results));
    }
    
    reset() {
        this.player.reset();
        this.gameActive = true;
        this.isWaitingForAnswer = false;
        this.pendingDirection = null;
        
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.movesCount = 0;
        this.updateStatsDisplay();
        
        this.maze = new Maze(this.originalMazeData);
        this.revealStartWalls();
        
        this.ui.updateMessage(`${this.playerName} ${this.playerLastName}, игра сброшена! Используйте стрелки для движения.`);
    }
    
    start() {
        this.gameActive = true;
        this.ui.render(this.maze, this.player, this.gameActive);
        this.ui.updateMessage('Используйте стрелки на клавиатуре! 🔴 -1, 🟡 +2, 🟢 +1 балл за правильный ответ!');
        document.removeEventListener('keydown', this.handleKeyPress);
        document.addEventListener('keydown', this.handleKeyPress);
    }
}

const mazeWalls = [
    [
        { top: true, right: false, bottom: false, left: true },
        { top: true, right: true, bottom: true, left: false },
        { top: true, right: false, bottom: false, left: true },
        { top: true, right: true, bottom: false, left: false },
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
        { top: true, right: true, bottom: false, left: false }
    ],
    [
        { top: true, right: true, bottom: false, left: true },
        { top: false, right: true, bottom: false, left: true },
        { top: false, right: false, bottom: true, left: true },
        { top: true, right: true, bottom: false, left: false },
        { top: false, right: true, bottom: true, left: true }
    ],
    [
        { top: false, right: false, bottom: true, left: true },
        { top: false, right: false, bottom: true, left: false },
        { top: true, right: true, bottom: true, left: false },
        { top: false, right: false, bottom: true, left: true },
        { top: true, right: true, bottom: true, left: false }
    ]
];

const game = new Game(mazeWalls);
window.game = game;