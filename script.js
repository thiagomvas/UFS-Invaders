const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurações
const FPSDesejado = 60;
const velocidadeNave = 3;
const distNaveParedeMinima = 10; // Distancia minima entre a nave e a parede (basicamente a largura de uma parede imaginaria nos lados)

var EstadoDeJogo = {
    jogador1: {
        pontos: 0,
        input: 0,
        x: 200,
        y: canvas.clientHeight - 100,
    },
    jogador2: {
        pontos: 0,
        input: 0,
        x: 400,
        y: canvas.clientHeight - 100,
    },
    inimigos: [{x: 0, y: 0}],
}

// Checando as teclas apertadas
document.addEventListener("keydown", (event) => {
    // INPUT JOGADOR 1
    if(event.key.toUpperCase() === "A") // Seta Esquerda
        EstadoDeJogo.jogador1.input = -1
    else if(event.key.toUpperCase() == "D") // Seta Direita
        EstadoDeJogo.jogador1.input = 1;
    else if(event.key == "W") // W
        console.log("Jogador 1 Atirou!") // Placeholder para adicionar disparos

    if(event.key === "ArrowLeft") // Seta Esquerda
        EstadoDeJogo.jogador2.input = -1;
    else if(event.key == "ArrowRight") // Seta Direita
        EstadoDeJogo.jogador2.input = 1;
    else if(event.key == "ArrowUp") // Seta para cima
        console.log("Jogador 2 Atirou!") // Placeholder para adicionar disparos

    // INPUT JOGADOR 2 (Mesma logica que o jogador 1)
})

// Para o movimento quando a tecla for solta
document.addEventListener("keyup", (event) => {
    // INPUT JOGADOR 1 
    const p1Input = EstadoDeJogo.jogador1.input;
    if(event.key.toUpperCase() === "A" && p1Input == -1) 
        EstadoDeJogo.jogador1.input = 0;
    else if(event.key.toUpperCase() === "D" && p1Input == 1) 
        EstadoDeJogo.jogador1.input = 0;

    // INPUT JOGADOR 2  (Mesma logica que o jogador 1)
    const p2Input = EstadoDeJogo.jogador2.input;
    if(event.key === "ArrowLeft" && p2Input == -1) // Seta Esquerda
        EstadoDeJogo.jogador2.input = 0;
    else if(event.key == "ArrowRight" && p2Input == 1) // Seta Direita
        EstadoDeJogo.jogador2.input = 0;

})

const update = () => {
    const frame = () => {       //Tudo que quiser fazer por frame façam aqui dentro dessa função

        const p1Input = EstadoDeJogo.jogador1.input;
        const p1posX = EstadoDeJogo.jogador1.x;
        const p2Input = EstadoDeJogo.jogador2.input;
        const p2posX = EstadoDeJogo.jogador2.x;
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
        EstadoDeJogo.inimigos = EstadoDeJogo.inimigos.map((x) => moverInimigo(x, 600 + Math.cos(Date.now()/250) * 500, 400 + Math.sin(Date.now()/450) * 300))
        desenharNave(EstadoDeJogo.jogador1.x, EstadoDeJogo.jogador1.y, '#0000FF'); // Jogador 1
        desenharNave(EstadoDeJogo.jogador2.x, EstadoDeJogo.jogador2.y, '#FF0000'); // Jogador 2
        EstadoDeJogo.jogador1.x = moverNave(p1posX, p1Input * velocidadeNave);
        EstadoDeJogo.jogador2.x = moverNave(p2posX, p2Input * velocidadeNave);
    }
    const id = setInterval(frame, 1/FPSDesejado);
}



// Exemplo de como desenhar algo e mover usando funcao trigonometrica.
const moverInimigo = (inimigo, deltaX, deltaY) => {
    return {...inimigo, x: deltaX, y: deltaY};
}

const moverNave = (posX, deltaX) => {
    if(posX + deltaX <= distNaveParedeMinima) return distNaveParedeMinima; // Checa se vai sair do mundo pela esquerda
    else if(posX + deltaX >= canvas.clientWidth - distNaveParedeMinima) return canvas.clientWidth - distNaveParedeMinima // O mesmo para a direita;
    else return posX + deltaX;
}

update(); // Inicializando o loop de updates