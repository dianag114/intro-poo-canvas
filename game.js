// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color; // Asignar un color único
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
        this.color = 'white'; // Color predeterminado
    }

    draw() {
        ctx.fillStyle = this.color; // Usar el color definido
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Movimiento de la paleta automática (IA)
    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.balls = []; // Array para almacenar múltiples pelotas
        this.paddle1 = new Paddle(0, canvas.height / 2 - 50, 10, 100, true); // Controlado por el jugador
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100); // Controlado por la computadora
        this.keys = {}; // Para capturar las teclas

        // Definir un conjunto de colores únicos para las bolas
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6', '#FFC300', '#8E44AD', '#3498DB', '#2ECC71', '#E74C3C'];

        // Crear varias bolas con tamaños y velocidades aleatorias
        for (let i = 0; i < 5; i++) { // Cambia 5 por el número de bolas que quieras
            const radius = Math.floor(Math.random() * 20) + 5; // Tamaño aleatorio entre 5 y 25
            const speedX = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 5 + 2); // Velocidad aleatoria
            const speedY = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 5 + 2);
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;

            // Asignar un color único a cada bola
            const color = colors[i % colors.length]; // Coger el color basado en el índice
            this.balls.push(new Ball(x, y, radius, speedX, speedY, color));
        }

        // Colores para las palas
        this.paddle1.color = '#FFFFFF'; // Color blanco para la pala del jugador
        this.paddle2.color = '#F39C12'; // Color naranja para la pala de la IA
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Dibujar todas las pelotas
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        // Mover todas las pelotas
        this.balls.forEach(ball => {
            ball.move();

            // Colisiones con las paletas
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Detectar cuando la pelota sale de los bordes (punto marcado)
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove(this.balls[0]); // Controla la paleta 2 con la primera pelota (puedes cambiar esto)
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();
