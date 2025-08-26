/**
 * Simple Memory Card Game
 * Clean and elegant implementation with beautiful animations
 */

class MemoryGame {
    constructor() {
        this.currentLevel = 'easy';
        this.gameState = 'ready'; // ready, playing, finished
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.startTime = 0;
        this.gameTimer = null;
        this.soundEnabled = true;
        
        // Game configurations
        this.levels = {
            easy: { size: 4, pairs: 8 },
            medium: { size: 6, pairs: 18 },
            hard: { size: 8, pairs: 32 }
        };
        
        // Card symbols (emojis for simplicity)
        this.symbols = [
            '🎯', '🎲', '🎪', '🎨', '🎭', '🎺', '🎸', '🎹',
            '🚀', '🛸', '🌟', '⭐', '🌙', '☀️', '🌈', '⚡',
            '🦋', '🐝', '🐞', '🦄', '🐙', '🐠', '🐯', '🦁',
            '🍎', '🍓', '🍊', '🍋', '🥝', '🍇', '🍒', '🥥'
        ];
        
        this.init();
    }

    init() {
        this.displayDeveloperCredits();
        this.loadBestScores();
        this.bindEvents();
        this.newGame();
    }

    displayDeveloperCredits() {
        console.log('%c┌────────────────────────────────────────────┐', 'color: #667eea; font-size: 14px;');
        console.log('%c│                                            │', 'color: #667eea; font-size: 14px;');
        console.log('%c│        Welcome to Memory Game!            │', 'color: #764ba2; font-size: 16px; font-weight: bold;');
        console.log('%c│                                            │', 'color: #667eea; font-size: 14px;');
        console.log('%c│    Designed & Developed by Blessan Corley  │', 'color: #f093fb; font-size: 14px; font-weight: 600;');
        console.log('%c│                                            │', 'color: #667eea; font-size: 14px;');
        console.log('%c│           Technologies Used:               │', 'color: #a8edea; font-size: 14px; font-weight: 500;');
        console.log('%c│           • Vanilla JavaScript            │', 'color: #fed6e3; font-size: 12px;');
        console.log('%c│           • CSS3 Animations               │', 'color: #fed6e3; font-size: 12px;');
        console.log('%c│           • HTML5 Semantic Elements       │', 'color: #fed6e3; font-size: 12px;');
        console.log('%c│           • Web Audio API                 │', 'color: #fed6e3; font-size: 12px;');
        console.log('%c│           • Local Storage API             │', 'color: #fed6e3; font-size: 12px;');
        console.log('%c│                                            │', 'color: #667eea; font-size: 14px;');
        console.log('%c│           Enjoy the Game!                  │', 'color: #ffecd2; font-size: 14px; font-weight: 500;');
        console.log('%c│                                            │', 'color: #667eea; font-size: 14px;');
        console.log('%c└────────────────────────────────────────────┘', 'color: #667eea; font-size: 14px;');
    }

    bindEvents() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLevel = btn.dataset.level;
                this.newGame();
            });
        });

        // Control buttons
        document.getElementById('new-game').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('sound-toggle').addEventListener('click', () => {
            this.toggleSound();
        });

        // Modal buttons
        document.getElementById('play-again').addEventListener('click', () => {
            this.hideModal();
            this.newGame();
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideModal();
        });

        // Click outside modal to close
        document.getElementById('win-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });
    }

    newGame() {
        this.gameState = 'ready';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.startTime = 0;
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.createCards();
        this.renderBoard();
        this.updateDisplay();
    }

    createCards() {
        const config = this.levels[this.currentLevel];
        const selectedSymbols = this.shuffleArray(this.symbols).slice(0, config.pairs);
        const cardPairs = [...selectedSymbols, ...selectedSymbols];
        
        this.cards = this.shuffleArray(cardPairs).map((symbol, index) => ({
            id: index,
            symbol: symbol,
            isFlipped: false,
            isMatched: false
        }));
    }

    renderBoard() {
        const board = document.getElementById('game-board');
        const config = this.levels[this.currentLevel];
        
        board.className = `game-board ${this.currentLevel}`;
        board.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            board.appendChild(cardElement);
        });
    }

    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.dataset.cardId = card.id;
        cardDiv.style.animationDelay = `${index * 0.05}s`;
        
        cardDiv.innerHTML = `
            <div class="card-face back">?</div>
            <div class="card-face front">${card.symbol}</div>
        `;

        cardDiv.addEventListener('click', () => {
            this.flipCard(card.id);
        });

        return cardDiv;
    }

    flipCard(cardId) {
        if (this.gameState === 'finished' || this.flippedCards.length >= 2) return;
        
        const card = this.cards.find(c => c.id === cardId);
        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        
        if (card.isFlipped || card.isMatched) return;

        // Start timer on first move
        if (this.gameState === 'ready') {
            this.startGame();
        }

        // Flip the card
        card.isFlipped = true;
        cardElement.classList.add('flipped');
        this.flippedCards.push(card);
        this.playSound('flip');

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            
            setTimeout(() => {
                this.checkForMatch();
            }, 600);
        }
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const card1Element = document.querySelector(`[data-card-id="${card1.id}"]`);
        const card2Element = document.querySelector(`[data-card-id="${card2.id}"]`);

        if (card1.symbol === card2.symbol) {
            // Match found!
            card1.isMatched = true;
            card2.isMatched = true;
            card1Element.classList.add('matched');
            card2Element.classList.add('matched');
            
            this.matchedPairs++;
            this.score += this.calculateScore();
            this.playSound('match');
            
            // Check if game is complete
            if (this.matchedPairs === this.levels[this.currentLevel].pairs) {
                this.gameComplete();
            }
        } else {
            // No match
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                card1Element.classList.remove('flipped');
                card2Element.classList.remove('flipped');
                this.playSound('flip');
            }, 500);
        }

        this.flippedCards = [];
        this.updateDisplay();
    }

    calculateScore() {
        const baseScore = 100;
        const timeBonus = Math.max(0, 30 - this.getElapsedTime()) * 5;
        const moveBonus = Math.max(0, 50 - this.moves) * 2;
        return baseScore + timeBonus + moveBonus;
    }

    startGame() {
        this.gameState = 'playing';
        this.startTime = Date.now();
        this.gameTimer = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    gameComplete() {
        this.gameState = 'finished';
        clearInterval(this.gameTimer);
        
        const finalTime = this.getElapsedTime();
        this.updateBestScore(finalTime);
        this.showWinModal(finalTime);
        this.playSound('win');
    }

    getElapsedTime() {
        if (this.startTime === 0) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    updateDisplay() {
        // Timer
        const elapsed = this.getElapsedTime();
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Moves
        document.getElementById('moves').textContent = this.moves;
        
        // Score
        document.getElementById('score').textContent = this.score;
    }

    updateBestScore(time) {
        const bestScores = this.getBestScores();
        const currentBest = bestScores[this.currentLevel];
        
        if (!currentBest || time < currentBest) {
            bestScores[this.currentLevel] = time;
            localStorage.setItem('memoryGame_bestScores', JSON.stringify(bestScores));
            this.loadBestScores();
        }
    }

    getBestScores() {
        return JSON.parse(localStorage.getItem('memoryGame_bestScores') || '{}');
    }

    loadBestScores() {
        const bestScores = this.getBestScores();
        
        Object.keys(this.levels).forEach(level => {
            const timeElement = document.getElementById(`best-${level}`);
            const bestTime = bestScores[level];
            
            if (bestTime) {
                const minutes = Math.floor(bestTime / 60);
                const seconds = bestTime % 60;
                timeElement.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                timeElement.textContent = '--:--';
            }
        });
    }

    showWinModal(finalTime) {
        const minutes = Math.floor(finalTime / 60);
        const seconds = finalTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('final-time').textContent = timeString;
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-score').textContent = this.score;
        
        document.getElementById('win-modal').style.display = 'flex';
    }

    hideModal() {
        document.getElementById('win-modal').style.display = 'none';
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('sound-toggle');
        soundBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
    }

    playSound(type) {
        if (!this.soundEnabled) return;

        // Create simple audio feedback using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Different frequencies for different sounds
            const frequencies = {
                flip: 800,
                match: 1200,
                win: 1600
            };

            oscillator.frequency.setValueAtTime(frequencies[type] || 800, audioContext.currentTime);
            oscillator.type = 'sine';

            // Envelope
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Fallback - silent fail if Web Audio API is not supported
            console.log('Audio not supported');
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.memoryGame = new MemoryGame();
});