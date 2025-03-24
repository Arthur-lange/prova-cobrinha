const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};

document.addEventListener('keydown', (e) => {
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(tecla)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
    
    desenhar() {
        ctx.fillStyle = 'gray'; 
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
    }
    
    atualizar() {
        if (teclasPressionadas.KeyW) {
            this.y -= 7;
        } else if (teclasPressionadas.KeyS) {
            this.y += 7;
        } else if (teclasPressionadas.KeyA) {
            this.x -= 7;
        } else if (teclasPressionadas.KeyD) {
            this.x += 7;
        }

        if (
            this.x < 0 || 
            this.x + this.largura > canvas.width || 
            this.y < 0 || 
            this.y + this.altura > canvas.height
        ) {
            return true; 
        }

        return false; 
    }
    
    desenhar() {
        ctx.fillStyle = 'green'; 
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
    
    verificarColisao(comida) {
        if (
            this.x < comida.x + comida.largura &&
            this.x + this.largura > comida.x &&
            this.y < comida.y + comida.altura &&
            this.y + this.altura > comida.y
        ) {
            this.#houveColisao(comida);
        }
    }
    
    #houveColisao(comida) {
        comida.x = Math.random() * (canvas.width - 20); 
        comida.y = Math.random() * (canvas.height - 20); 
    }
}

class Comida extends Entidade {
    constructor() {
        super(Math.random() * (canvas.width - 20), Math.random() * (canvas.height - 20), 20, 20);
    }
    
    desenhar() {
        ctx.fillStyle = 'red'; 
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

const cobra = new Cobra(100, 200, 20, 20);
const comida = new Comida();

let gameOver = false; 

function exibirGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameOver) {
        exibirGameOver();
        return; 
    }

    cobra.desenhar();
    if (cobra.atualizar()) { 
        gameOver = true; 
    }
    
    comida.desenhar();
    cobra.verificarColisao(comida);
    
    requestAnimationFrame(loop);
}

loop();