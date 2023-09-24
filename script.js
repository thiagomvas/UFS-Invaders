const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configurações
const FPSDesejado = 60;
const velocidadeNave = 2;
const velocidadeProjeteis = -250; 
const distNaveParedeMinima = 10; // Distancia minima entre a nave e a parede (basicamente a largura de uma parede imaginaria nos lados)
const velocidadeInimigos = 50 //velocidade de aproximação do inimigo as naves dos jogadores
const delaySpawnInimigos = 1500;

// Objeto que contem todos os objetos do jogo
var EstadoDeJogo = {
    horaInicial: 0,
    jogador1: {
        pontos: 0,
        input: 1,
        x: 200,
        y: canvas.clientHeight - 100,
        raio: 25,
    },
    jogador2: {
        pontos: 0,
        input: -1,
        x: 400,
        y: canvas.clientHeight - 100,
        raio: 25,
    },
    jogadorVencedor: 0,
    inimigos: [],
    projeteis: [],
    proximoSpawn: 0,
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
            const projetil = criarProjetil(EstadoDeJogo.jogador1.x, EstadoDeJogo.jogador1.y, 5); //cria um novo projetil e o adiciona á lista de disparos realizados, quando o jogador 1 clica na tecla "W"
            EstadoDeJogo.projeteis = addNaLista(EstadoDeJogo.projeteis, projetil);
        }

    if(event.key === "ArrowLeft") // Seta Esquerda
        EstadoDeJogo.jogador2.input = -1;
    else if(event.key == "ArrowRight") // Seta Direita
        EstadoDeJogo.jogador2.input = 1;
    else if(event.key == "ArrowUp") // Seta para cima
    {
        const projetil = criarProjetil(EstadoDeJogo.jogador2.x, EstadoDeJogo.jogador2.y, 5); //cria um novo projetil e o adiciona á lista de disparos realizados, quando o jogador 2 clica na tecla "ArrowUp"
        EstadoDeJogo.projeteis = addNaLista(EstadoDeJogo.projeteis, projetil);
    }

    // INPUT JOGADOR 2 (Mesma logica que o jogador 1)
})


const update = () => {

    EstadoDeJogo.horaInicial = Date.now() //contador de tempo do jogo

    const frame = () => {       //Tudo que quiser fazer por frame façam aqui dentro dessa função

        // Constantes que representam o input e posições no eixo X de cada jogador
        const p1Input = EstadoDeJogo.jogador1.input;
        const p1posX = EstadoDeJogo.jogador1.x;
        const p2Input = EstadoDeJogo.jogador2.input;
        const p2posX = EstadoDeJogo.jogador2.x;


        // Constante que tem como valor o tempo total de jogo em milisegundos
        const tempoDeJogoTotal = Date.now() - EstadoDeJogo.horaInicial 

        // Constante que representa a dificuldade do jogo
        const dificuldade = dificuldadeInimigos(tempoDeJogoTotal/1000);

        // Limpar o canvas
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);

        // Se estiver na hora de invocar novos inimigos e todo mundo estiver vivo, invoque inimigos
        if(deveInvocarInimigo(tempoDeJogoTotal, EstadoDeJogo.proximoSpawn) && EstadoDeJogo.jogadorVencedor == 0)
        {
            EstadoDeJogo.proximoSpawn = calcularProximoSpawn(tempoDeJogoTotal, EstadoDeJogo.proximoSpawn, dificuldade);

            const quantidade = Math.floor(Math.random() * 5 * dificuldade)

            EstadoDeJogo.inimigos = [...EstadoDeJogo.inimigos, ...invocarInimigosRecursivo(EstadoDeJogo.inimigos, quantidade)]
        }

        if(EstadoDeJogo.inimigos.filter((x) => checarColisao(EstadoDeJogo.jogador1,x)).length > 0) EstadoDeJogo.jogadorVencedor = 2;
        if(EstadoDeJogo.inimigos.filter((x) => checarColisao(EstadoDeJogo.jogador2,x)).length > 0) EstadoDeJogo.jogadorVencedor = 1;

        // Mover os inimigos e remover os que sairem do mapa
        EstadoDeJogo.inimigos = EstadoDeJogo.inimigos.map((inim) => moverInimigo(inim, inim.x, inim.y + velocidadeInimigos*dificuldade / FPSDesejado)) 
        EstadoDeJogo.inimigos = removerForaDoMapa(EstadoDeJogo.inimigos);

        // Mover os projeteis e remover os que sairem do mapa
        EstadoDeJogo.projeteis = EstadoDeJogo.projeteis.map((proj) => moverProjetil(proj, velocidadeProjeteis/FPSDesejado))
        EstadoDeJogo.projeteis = removerForaDoMapa(EstadoDeJogo.projeteis);

        // Desenhar os projeteis e inimigos
        desenharProjeteisRecursivo(EstadoDeJogo.projeteis, '#FF00FF')
        desenharInimigosRecursivo(EstadoDeJogo.inimigos, '#FFFFFF');

        // Desenhar os jogadores
        desenharNave(EstadoDeJogo.jogador1.x, EstadoDeJogo.jogador1.y, '#0000FF'); // Jogador 1
        desenharNave(EstadoDeJogo.jogador2.x, EstadoDeJogo.jogador2.y, '#FF0000'); // Jogador 2

        // Mover os jogadores se ambos estiverem vivos
        if(EstadoDeJogo.jogadorVencedor < 1)
        {
            EstadoDeJogo.jogador1.x = moverNave(p1posX, p1Input * velocidadeNave);
            EstadoDeJogo.jogador2.x = moverNave(p2posX, p2Input * velocidadeNave);
        }

        // Caso algum dos jogadores tenha vencido, mostre quem ganhou
        switch(EstadoDeJogo.jogadorVencedor)
        {
            case 1:
                ctx.font = "30px Arial"
                ctx.fillText("Jogador 1 (AZUL) Ganhou!!!", canvas.clientWidth/2, canvas.clientHeight/2)
                break;
            case 2:
                ctx.font = "30px Arial"
                ctx.fillText("Jogador 2 (VERMELHO) Ganhou!!!", canvas.clientWidth/2, canvas.clientHeight/2)
                break;
        }

        // Remove os inimigos que colidirem com os projeteis
        EstadoDeJogo.inimigos = removerColisoes(EstadoDeJogo.inimigos, EstadoDeJogo.projeteis);

    }
    setInterval(frame, 1/FPSDesejado);

}


// Exemplo de como desenhar algo e mover usando funcao trigonometrica.
const moverInimigo = (inimigo, deltaX, deltaY) => {
    return {...inimigo, x: deltaX, y: deltaY};
}

const moverNave = (posX, deltaX) => {
    if(posX + deltaX <= 0) return canvas.clientWidth - 10; // Checa se vai sair do mundo pela esquerda
    else if(posX + deltaX >= canvas.clientWidth - distNaveParedeMinima) return 10 // O mesmo para a direita;
    else return posX + deltaX;
}

const moverProjetil = (projetil, deltaY) => {return {...projetil, x: projetil.x, y: projetil.y + deltaY}}; //função que move os projeteis para cima, em função do eixo Y das coordenadas

const desenharProjeteisRecursivo = (projeteis, cor) => { //função base que desenha os projeteis  
    const [projetil, ...xs] = projeteis;
    if(indef(projetil)) return 0; //se não forem adicionados novos projeteis a lista, nada acontece 
    ctx.beginPath(); 
    ctx.arc(projetil.x, projetil.y, projetil.raio, 0, 2 * Math.PI); 
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

const deveInvocarInimigo = (tempoDeJogo, delayAtual) => tempoDeJogo >= delayAtual;
const calcularProximoSpawn = (tempoDeJogo, delayAtual, dificuldade) => tempoDeJogo >= delayAtual ? delaySpawnInimigos/dificuldade + delayAtual : delayAtual;

const invocarInimigosRecursivo = (inimigos, quantidade) => {
    if(quantidade <= 0) return [];
    
    const posicaoX = canvas.clientWidth/2 +  (Math.sin(quantidade + Date.now()) + Math.cos((quantidade + Date.now())/3) + Math.sin((quantidade + Date.now())/9)) * canvas.clientWidth/2
    const raio = Math.abs(25 + senCosRecursivo(quantidade + Date.now(), 3) * 15);

    const inimigo = criarInimigo(posicaoX, 100, raio);
    return [inimigo, ...invocarInimigosRecursivo(inimigos, quantidade - 1)]
}

const removerColisoes = (inimigos, projeteis) => {
    const objetosParaRemover = checarTodasColisoes(inimigos,projeteis);

    return inimigos.filter((x) => objetosParaRemover.indexOf(x) == -1);
}

const checarTodasColisoes = (inimigos, projeteis) => {
    const [a, ...as] = inimigos;
    const [b, ...bs] = projeteis;

    if(indef(a)) return [];
    if(indef(b)) return [...checarTodasColisoes(as, projeteis)]
    if(!checarColisao(a, b)) return [...checarTodasColisoes(as, projeteis)] 
    else return [a, ...checarTodasColisoes(as, bs)]

}



update(); // Inicializando o loop de updates
