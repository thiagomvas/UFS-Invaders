const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurações
const FPSDesejado = 60;
const velocidadeNave = 3;
const velocidadeProjeteis = -10;
const distNaveParedeMinima = 10; // Distancia minima entre a nave e a parede (basicamente a largura de uma parede imaginaria nos lados)
const velocidadeInimigos = 10 //velocidade de aproximação do inimigo as naves dos jogadores

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
    inimigos: [{x: 0, y: 0, raio: 25}],
    projeteis: [],
}

// Checando as teclas apertadas
document.addEventListener("keydown", (event) => {
    // INPUT JOGADOR 1
    if(event.key.toUpperCase() === "A") // Seta Esquerda
        EstadoDeJogo.jogador1.input = -1
    else if(event.key.toUpperCase() == "D") // Seta Direita
        EstadoDeJogo.jogador1.input = 1;
    else if(event.key.toUpperCase() == "W") // W
        {
            const projetil = criarProjetil(EstadoDeJogo.jogador1.x, EstadoDeJogo.jogador1.y); //cria um novo projetil e o adiciona á lista de disparos realizados, quando o jogador 1 clica na tecla "W"
            EstadoDeJogo.projeteis = addNaLista(EstadoDeJogo.projeteis, projetil);
        }

    if(event.key === "ArrowLeft") // Seta Esquerda
        EstadoDeJogo.jogador2.input = -1;
    else if(event.key == "ArrowRight") // Seta Direita
        EstadoDeJogo.jogador2.input = 1;
    else if(event.key == "ArrowUp") // Seta para cima
    {
        const projetil = criarProjetil(EstadoDeJogo.jogador2.x, EstadoDeJogo.jogador2.y); //cria um novo projetil e o adiciona á lista de disparos realizados, quando o jogador 2 clica na tecla "ArrowUp"
        EstadoDeJogo.projeteis = addNaLista(EstadoDeJogo.projeteis, projetil);
    }

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

    const horaInicial = Date.now() //contador de tempo do jogo

    const frame = () => {       //Tudo que quiser fazer por frame façam aqui dentro dessa função

        const p1Input = EstadoDeJogo.jogador1.input;
        const p1posX = EstadoDeJogo.jogador1.x;
        const p2Input = EstadoDeJogo.jogador2.input;
        const p2posX = EstadoDeJogo.jogador2.x;

        const tempoDeJogoTotal = Date.now() - horaInicial //função que mostra o tempo total de jogo frame a frame

        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);

        EstadoDeJogo.inimigos = EstadoDeJogo.inimigos.map((inim) => moverInimigo(inim, inim.x, inim.y + velocidadeInimigos*dificuldadeInimigos(tempoDeJogoTotal))) 
        EstadoDeJogo.inimigos = removerForaDoMapa(EstadoDeJogo.inimigos);

        EstadoDeJogo.projeteis = EstadoDeJogo.projeteis.map((proj) => moverProjetil(proj, velocidadeProjeteis))
        EstadoDeJogo.projeteis = removerForaDoMapa(EstadoDeJogo.projeteis);

        desenharProjeteisRecursivo(EstadoDeJogo.projeteis, '#FF00FF')
        desenharInimigosRecursivo(EstadoDeJogo.inimigos, '#FFFFFF');



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

const moverProjetil = (projetil, deltaY) => {return {...projetil, x: projetil.x, y: projetil.y + deltaY}}; //função que move os projeteis para cima, em função do eixo Y das coordenadas

const desenharProjeteisRecursivo = (projeteis, cor) => { //função base que desenha os projeteis  
    const [projetil, ...xs] = projeteis;
    if(indef(projetil)) return 0; //se não forem adicionados novos projeteis a lista, nada acontece 
    ctx.beginPath(); 
    ctx.arc(projetil.x, projetil.y, 5, 0, 2 * Math.PI); 
    ctx.closePath();
    ctx.strokeStyle = ctx.fillStyle = cor;
    ctx.fill();

    desenharProjeteisRecursivo(xs, cor);
}

const desenharInimigosRecursivo = (inimigos, cor) => {

    const [inimigo, ...xs] = inimigos;
    if(indef(inimigo)) return 0;

    ctx.beginPath();
    ctx.arc(inimigo.x, inimigo.y, inimigo.raio, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.strokeStyle = ctx.fillStyle = cor;
    ctx.fill();

    desenharInimigosRecursivo(xs, cor);
}

const removerForaDoMapa = ([elem, ...xs]) => {
    if(indef(elem)) return [];

    if(elem.x < 0 // Saiu do mapa pela esquerda
    || elem.x > canvas.clientWidth // Saiu do mapa pela direita
    || elem.y < 0 // Saiu do mapa por cima
    || elem.y > canvas.clientHeight) // Saiu do mapa por baixo
    return [...removerForaDoMapa(xs)]
    else return [elem, ...removerForaDoMapa(xs)];
}


update(); // Inicializando o loop de updates