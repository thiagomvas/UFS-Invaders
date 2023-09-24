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

/**
 * Inicializa o gameloop do jogo, tentando rodar com `FPSDesejado` frames por segundo
 */
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
            console.log('test');
            EstadoDeJogo.jogador1.x = moverNave(EstadoDeJogo.jogador1, p1Input * velocidadeNave);
            EstadoDeJogo.jogador2.x = moverNave(EstadoDeJogo.jogador2, p2Input * velocidadeNave);
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


/**
 * Move um determinado inimigo para o ponto (`deltaX`, `deltaY`) no plano XY
 * @param {object} inimigo O objeto do inimigo que será movido
 * @param {number} deltaX Coordenadas no eixo X
 * @param {number} deltaY Coordenadas no eixo Y
 * @returns
 */
const moverInimigo = (inimigo, deltaX, deltaY) => {
    return {...inimigo, x: deltaX, y: deltaY};
}

/**
 * Calcula a nova posição de uma `nave` no eixo X depois de mover `deltaX` unidades. Será levado para o outro lado do mapa se a nave chegar nas bordas do mapa
 * @param {object} nave A nave que deseja calcular a nova posição
 * @param {number} deltaX Unidades para se mover no eixo X
 * @returns 
 */
const moverNave = (nave, deltaX) => {
    if(nave.x + deltaX <= 0) return canvas.clientWidth - 10; // Checa se vai sair do mundo pela esquerda
    else if(nave.x + deltaX >= canvas.clientWidth - distNaveParedeMinima) return 10 // O mesmo para a direita;
    else return nave.x + deltaX;
}

/**
 * Calcula a nova posição de um `projetil` depois de mover `deltaY` unidades no eixo Y
 * @param {object} projetil Projetil que deseja calcular a nova posição
 * @param {number} deltaY Unidades para se mover no eixo Y
 * @returns 
 */
const moverProjetil = (projetil, deltaY) => {return {...projetil, x: projetil.x, y: projetil.y + deltaY}}; 

/**
 * Desenha uma lista de `projeteis` utilizando recursividade para repetir a ação em cada um dos elementos da lista
 * @param {object[]} projeteis A lista de projeteis a se desenhar
 * @param {string} cor A cor dos projeteis em formato hexadecimal (EX: '#FFFFFF' é a cor branca)
 * @returns 
 */
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

/**
 * Desenha uma lista de `inimigos` utilizando recursividade para repetir a ação em cada um dos elementos da lista
 * @param {object[]} inimigos A lista ded inimigos a se desenhar
 * @param {string} cor A cor dos inimigos em formato hexadecimal (EX: '#FFFFFF' é a cor branca)
 * @returns 
 */
const desenharInimigosRecursivo = (inimigos, cor) => {

    const [inimigo, ...xs] = inimigos;
    if(indef(inimigo)) return 0;

    const asteroide=()=>{
        //Começando a desenhar o círculo do asteroide.
        ctx.beginPath();
        ctx.arc(inimigo.x, inimigo.y, inimigo.raio, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle=ctx.fillStyle="#F8F8FF"
        ctx.fill();
        
        //Primeiro triângulo da parte interna do círculo.
        ctx1.beginPath();
        ctx1.moveTo(inimigo.x-23,inimigo.y+20);//Ponta de baixo do triângulo.
        ctx1.lineTo (inimigo.x-5,inimigo.y-30);//Ponta de cima do triângulo.
        ctx1.lineTo (inimigo.x-28,inimigo.y-15);//Ponta do meio do triângulo.
        ctx1.closePath();
        ctx1.strokeStyle=ctx1.fillStyle="#000000"
        ctx1.fill();
        
        //Pegundo triangulo da parte interna do círculo.
        ctx2.beginPath();
        ctx2.moveTo(inimigo.x,inimigo.y);//Ponta do triângulo localizada interna ao círculo.
        ctx2.lineTo (inimigo.x+28,inimigo.y-10);//Ponta do triângulo localizada na parte de baixo e  externa ao círculo.
        ctx2.lineTo(inimigo.x+23,inimigo.y+20) ;//Ponta do triângulo localizada na parte de cimae externa ao círculo. 
        ctx2.closePath();
        ctx2.strokeStyle=ctx2.fillStyle="#000000"
        ctx2.fill();
    }        
    desenharInimigosRecursivo(xs, cor);
}

/**
 * Retorna uma lista de todos os objetos que se situam dentro do mapa(canvas), removendo os que estão fora.
 * @param {object[]} lista Lista de objetos para remover de fora do mapa
 * @returns 
 */
const removerForaDoMapa = ([elem, ...xs]) => {
    if(indef(elem)) return [];

    if(elem.x < 0 // Saiu do mapa pela esquerda
    || elem.x > canvas.clientWidth // Saiu do mapa pela direita
    || elem.y < 0 // Saiu do mapa por cima
    || elem.y > canvas.clientHeight) // Saiu do mapa por baixo
    return [...removerForaDoMapa(xs)]
    else return [elem, ...removerForaDoMapa(xs)];
}

/**
 * Condição que checa se ja esta na hora de invocar a proxima horda de inimigos
 * @param {number} tempoDeJogo A duração da partida atual
 * @param {number} delayAtual A hora que será invocada a proxima/foi invocada a horda anterior
 * @returns 
 */
const deveInvocarInimigo = (tempoDeJogo, delayAtual) => tempoDeJogo >= delayAtual;

/**
 * Calcula qual será o horario de invocar a proxima horda de inimigos
 * @param {number} tempoDeJogo A duração da partida atual
 * @param {number} delayAtual O horario que foi definido para a horda de inimigos mais recente
 * @param {number} dificuldade A dificuldade atual do jogo
 * @returns 
 */
const calcularProximoSpawn = (tempoDeJogo, delayAtual, dificuldade) => tempoDeJogo >= delayAtual ? delaySpawnInimigos/dificuldade + delayAtual : delayAtual;

/**
 * Retorna uma lista de inimigos, com a inclusão de `quantidade` inimigos. Ação feita por meio de recursividade
 * @param {object[]} inimigos A lista de inimigos para se incluir a nova horda.
 * @param {number} quantidade A quantidade de inimigos na nova horda
 * @returns 
 */
const invocarInimigosRecursivo = (inimigos, quantidade) => {
    if(quantidade <= 0) return [];
    
    const posicaoX = canvas.clientWidth/2 +  (Math.sin(quantidade + Date.now()) + Math.cos((quantidade + Date.now())/3) + Math.sin((quantidade + Date.now())/9)) * canvas.clientWidth/2
    const raio = Math.abs(25 + senCosRecursivo(quantidade + Date.now(), 3) * 15);

    const inimigo = criarInimigo(posicaoX, 100, raio);
    return [inimigo, ...invocarInimigosRecursivo(inimigos, quantidade - 1)]
}

/**
 * Retorna uma lista de `inimigos` que não colidiram com nenhum projetil da lista `projeteis`. 
 * Essa função utiliza `checarTodasColisoes()` como função auxiliar, visto que esta retorna a lista de inimigos que colidiu com projeteis da lista `projeteis`.
 * @param {object[]} inimigos A lista de inimigos para se checar colisões
 * @param {object[]} projeteis A lista de projeteis para se checar colisões
 * @returns 
 */
const removerColisoes = (inimigos, projeteis) => {
    const objetosParaRemover = checarTodasColisoes(inimigos,projeteis);

    return inimigos.filter((x) => objetosParaRemover.indexOf(x) == -1);
}

/**
 * 
 * @param {object[]} inimigos 
 * @param {object[]} projeteis 
 * @returns 
 */
const checarTodasColisoes = (inimigos, projeteis) => {
    const [a, ...as] = inimigos;
    const [b, ...bs] = projeteis;

    if(indef(a)) return [];
    if(indef(b)) return [...checarTodasColisoes(as, projeteis)]
    if(!checarColisao(a, b)) return [...checarTodasColisoes(as, projeteis)] 
    else return [a, ...checarTodasColisoes(as, bs)]

}



update(); // Inicializando o loop de updates
