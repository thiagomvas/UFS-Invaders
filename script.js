const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('canvas2');// Adicionando novo "canvas2" para a tela de pontuação dos jogadores.
const ctx2 = canvas2.getContext('2d');
// Configurações
const FPSDesejado = 60;                 // O valor do FPS(Frames Per Second) desejado
const velocidadeNave = 2;               // Velocidade de movimento da nave
const velocidadeProjeteis = -250;       // Velocidade dos projeteis
const distNaveParedeMinima = 10;        // Distancia minima entre a nave e a parede (basicamente a largura de uma parede imaginaria nos lados)
const velocidadeInimigos = 50           //velocidade de aproximação do inimigo as naves dos jogadores
const delaySpawnInimigos = 1500;        // Delay base de spawn para os inimigos
const funcoesDeMovimento = [            // Funções de movimento que serão utilizado pelos inimigos.
    (x, xI, y, yI) => x,
]

// Objeto que contem todos os objetos do jogo
const EstadoDeJogoPadrao = {
    horaInicial: 0,                         // Horario inicial da partida
    jogador1: {                             // Objeto que representa o jogador 1                                
        pontos: 0,                          // Quantos pontos o jogador 1 tem
        input: 1,                           // O input que representa a direção que o jogador se move (1 = direita, -1 = esquerda)
        x: 200,                             // Posição no eixo X
        y: canvas.clientHeight - 100,       // Posição no eixo Y     
        raio: 25,                           // Raio de colisão    
    },                                
    jogador2: {                              // Objeto que representa o jogador 2, mesmos atributos que o jogador 1
        pontos: 0,
        input: -1,
        x: 400,
        y: canvas.clientHeight - 100,
        raio: 25,
    },
    jogadorVencedor: 0,                      // ID que representa quem ganhou (0 = Ninguem, 1 = Jogador 1, 2 = Jogador 2)
    inimigos: [],                            // Lista de inimigos
    projeteis1: [],                          // Lista de projeteis atirados pelo jogador 1
    projeteis2: [],                          // Lista de projeteis atirados pelo jogador 2
    proximoSpawn: 0,                         // Proximo horario para invocar inimigos
}

var EstadoDeJogo = EstadoDeJogoPadrao;

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
            EstadoDeJogo.projeteis1 = addNaLista(EstadoDeJogo.projeteis1, projetil);

        }

    if(event.key === "ArrowLeft") // Seta Esquerda
        EstadoDeJogo.jogador2.input = -1;
    else if(event.key == "ArrowRight") // Seta Direita
        EstadoDeJogo.jogador2.input = 1;
    else if(event.key == "ArrowUp") // Seta para cima
    {
        const projetil = criarProjetil(EstadoDeJogo.jogador2.x, EstadoDeJogo.jogador2.y, 5); //cria um novo projetil e o adiciona á lista de disparos realizados, quando o jogador 2 clica na tecla "ArrowUp"
        EstadoDeJogo.projeteis2 = addNaLista(EstadoDeJogo.projeteis2, projetil);
    }

    // INPUT JOGADOR 2 (Mesma logica que o jogador 1)
})

/**
 * Inicializa o gameloop do jogo, tentando rodar com `FPSDesejado` frames por segundo
 */
const update = () => {

    EstadoDeJogo.horaInicial = Date.now() //contador de tempo do jogo

    const frame = () => {       //Tudo que quiser fazer por frame façam aqui dentro dessa função

        const estadoDeJogoAtual =   EstadoDeJogo;
        const jogador1 =            estadoDeJogoAtual.jogador1;
        const jogador2 =            estadoDeJogoAtual.jogador2;
        const inimigos =            estadoDeJogoAtual.inimigos;
        const projeteis1 =          estadoDeJogoAtual.projeteis1;
        const projeteis2 =          estadoDeJogoAtual.projeteis2;
        const proximoSpawn =        estadoDeJogoAtual.proximoSpawn;
        const jogadorVencedor =     estadoDeJogoAtual.jogadorVencedor;
        
        switch(jogadorVencedor)
        {
            
            case 1:
                ctx2.font = "30px Courier New"// Adicionando nova fonte de letra.
                ctx2.fillText("Jogador 1 (AZUL) Ganhou!!! ", (canvas2.clientWidth/2)-415, (canvas2.clientHeight/2)-5)//Alterando parametros de altura para que o jogador1 e os seus pontos sejam mostradas na tela de pontuação.
                ctx2.fillText("Pontos:", (canvas2.clientWidth/2)-415, (canvas2.clientHeight/2)+35)
                ctx2.fillText(jogador1.pontos, (canvas2.clientWidth/2)+0, (canvas2.clientHeight/2)+40)
                ctx2.fillStyle="#FFFF00"
                return;
            case 2:
                ctx2.font = "30px Courier New"// Adicionando nova fonte de letra.
                ctx2.fillText("Jogador 2 (VERMELHO) Ganhou!!! ", (canvas2.clientWidth/2)-415, (canvas2.clientHeight/2)-5)//Alterando parametros de altura para que o jogador1 e os seus pontos sejam mostradas na tela de pontuação.
                ctx2.fillText("Pontos:", (canvas2.clientWidth/2)-415, (canvas2.clientHeight/2)+35)
                ctx2.fillText(jogador2.pontos, (canvas2.clientWidth/2)+0, (canvas2.clientHeight/2)+40)
                ctx2.fillStyle="#FFFF00"
                return;
        }


        // Constante que tem como valor o tempo total de jogo em milisegundos
        const tempoDeJogoTotal = Date.now() - estadoDeJogoAtual.horaInicial 

        // Constante que representa a dificuldade do jogo
        const dificuldade = dificuldadeInimigos(tempoDeJogoTotal/1000);

        // Limpar o canvas
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
        ctx2.clearRect(0, 0, canvas2.clientWidth, canvas2.clientWidth);

        // Se estiver na hora de invocar novos inimigos e todo mundo estiver vivo, invoque inimigos
        const novoHorarioDeSpawn = calcularProximoSpawn(tempoDeJogoTotal, proximoSpawn, dificuldade);
        const quantidadeParaInvocar = Math.floor(5 * dificuldade);
        const inimigosPosSpawn = deveInvocarInimigo(tempoDeJogoTotal, proximoSpawn) ? [...inimigos, ...invocarInimigosRecursivo(inimigos, quantidadeParaInvocar, funcoesDeMovimento)] : inimigos;

        // Checar se alguem ganhou
        const novoJogadorVencedor = checarJogadorVencedor(inimigos, jogador1, jogador2)

        // Calcular novas posições dos inimigos
        const inimigosPosMovimento = inimigosPosSpawn.map((inim) => moverInimigo(inim, velocidadeInimigos, dificuldade / FPSDesejado)) 
        const inimigosDentroDoMapa = removerForaDoMapa(inimigosPosMovimento);

        // Calcular novas posições para os projeteis
        const projeteis1PosMovimento = projeteis1.map((proj) => moverProjetil(proj, velocidadeProjeteis/FPSDesejado))
        const projeteis2PosMovimento = projeteis2.map((proj) => moverProjetil(proj, velocidadeProjeteis/FPSDesejado))
        const projeteis1DentroDoMapa = removerForaDoMapa(projeteis1PosMovimento);
        const projeteis2DentroDoMapa = removerForaDoMapa(projeteis2PosMovimento);//necessario a repetição para verificar cada projetil

        // Desenhar os projeteis e inimigos
        desenharProjeteisRecursivo(projeteis1DentroDoMapa, '#FF00FF')
        desenharProjeteisRecursivo(projeteis2DentroDoMapa, '#FF00FF')
        desenharInimigosRecursivo(inimigosDentroDoMapa, '#FFFFFF');

        // Desenhar os jogadores
        desenharNave(jogador1.x, jogador1.y, '#0000FF'); // Jogador 1
        desenharNave(jogador2.x, jogador2.y, '#FF0000'); // Jogador 2

        // Calcular as novas posições dos jogadores
        const jogador1PosMovimento = moverNave(jogador1, jogador1.input * velocidadeNave);
        const jogador2PosMovimento = moverNave(jogador2, jogador2.input * velocidadeNave);

        
        // Calcular novos pontos caso algum dos projeteis de cada jogador atingir um inimigo
        const jogador1AcertouAlgo = checarTodasColisoes(inimigos, projeteis1).length > 0
        const jogador2AcertouAlgo = checarTodasColisoes(inimigos, projeteis2).length > 0
        const jogador1Final = jogador1PosMovimento
        
        const jogador2Final = jogador2PosMovimento
        
        // Calcular os inimigos pos colisão
        const inimigosPosColisaoComProj1 = jogador1AcertouAlgo ? removerColisoes(inimigosDentroDoMapa, projeteis1) : inimigosDentroDoMapa;
        const inimigosPosColisaoComProj2 = jogador1AcertouAlgo ? removerColisoes(inimigosPosColisaoComProj1, projeteis2) : inimigosPosColisaoComProj1;

        // Definindo as listas de inimigos e projeteis finais apos todas as funções executarem.
        const inimigosFinais = inimigosPosColisaoComProj2;
        const projeteis1Finais = projeteis1DentroDoMapa;
        const projeteis2Finais = projeteis2DentroDoMapa;
        
        const novoEstadoDeJogo = gerarNovoEstadoDeJogo(estadoDeJogoAtual.horaInicial, 
                                                       jogador1Final, 
                                                       jogador2Final,
                                                       novoJogadorVencedor,
                                                       inimigosFinais,
                                                       projeteis1Finais,
                                                       projeteis2Finais,
                                                       novoHorarioDeSpawn);
        EstadoDeJogo = novoEstadoDeJogo;
        
    }
    setInterval(frame, 1/FPSDesejado);

}


/**
 * Move um determinado inimigo para o ponto (`deltaX`, `deltaY`) no plano XY
 * @param {object} inimigo O objeto do inimigo que será movido
 * @param {number} velocidade Coordenadas no eixo X
 * @param {number} dificuldade Coordenadas no eixo Y
 * @returns
 */
const moverInimigo = (inimigo, velocidade, dificuldade) => {
    const novoX = inimigo.funcaoMovimentoX(inimigo.x, inimigo.xInicial, inimigo.y, inimigo.yInicial);
    const novoY = inimigo.y + velocidade * dificuldade
    return {...inimigo, x: novoX, y: novoY};
}

/**
 * Calcula a nova posição de uma `nave` no eixo X depois de mover `deltaX` unidades. Será levado para o outro lado do mapa se a nave chegar nas bordas do mapa
 * @param {object} nave A nave que deseja calcular a nova posição
 * @param {number} deltaX Unidades para se mover no eixo X
 * @returns 
 */
const moverNave = (nave, deltaX) => {
    if(nave.x + deltaX <= 0) return {...nave, x: canvas.clientWidth - 10}; // Checa se vai sair do mundo pela esquerda
    else if(nave.x + deltaX >= canvas.clientWidth - distNaveParedeMinima) return {...nave, x: 10} // O mesmo para a direita;
    else return {...nave, x: nave.x + deltaX};
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

        //Começando a desenhar o círculo do asteroide.
        ctx.beginPath();
        ctx.arc(inimigo.x, inimigo.y,inimigo.raio, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle=ctx.fillStyle="#F8F8FF"
        ctx.fill();
        
        //Primeiro triângulo da parte interna do círculo.
        ctx.beginPath();
        ctx.moveTo(inimigo.x-(inimigo.raio-2),inimigo.y+(inimigo.raio-5));//Ponta de baixo do triângulo.
        ctx.lineTo (inimigo.x-(inimigo.raio-20),inimigo.y-(inimigo.raio+5));//Ponta de cima do triângulo.
        ctx.lineTo (inimigo.x-(inimigo.raio+3),inimigo.y-(inimigo.raio-10));//Ponta do meio do triângulo.
        ctx.closePath();
        ctx.strokeStyle=ctx.fillStyle="#000000"
        ctx.fill();
        
        //Pegundo triangulo da parte interna do círculo.
        ctx.beginPath();
        ctx.moveTo(inimigo.x,inimigo.y);//Ponta do triângulo localizada interna ao círculo.
        ctx.lineTo (inimigo.x+(inimigo.raio+3),inimigo.y-(inimigo.raio-15));//Ponta do triângulo localizada na parte de baixo e  externa ao círculo.
        ctx.lineTo(inimigo.x+(inimigo.raio-2),inimigo.y+(inimigo.raio-5)) ;//Ponta do triângulo localizada na parte de cimae externa ao círculo. 
        ctx.closePath();
        ctx.strokeStyle=ctx.fillStyle="#000000"
        ctx.fill();
          
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
 * @param {function[]} funcoesDeMovimento As possiveis funções de movimento que os inimigos podem usar
 * @returns 
 */
const invocarInimigosRecursivo = (inimigos, quantidade, funcoesDeMovimento) => {
    if(quantidade <= 0) return [];
    
    const rand = (Math.sin(quantidade + Date.now()) + Math.cos((quantidade + Date.now())/3) + Math.sin((quantidade + Date.now())/9))
    const posicaoX = canvas.clientWidth/2 +  (Math.sin(quantidade + Date.now()) + Math.cos((quantidade + Date.now())/3) + Math.sin((quantidade + Date.now())/9)) * canvas.clientWidth/2
    const raio = Math.abs(30 + senCosRecursivo(quantidade + Date.now(), 3) * 10);
    const funcMovimento = selecionarItemAleatorio(funcoesDeMovimento, rand)

    const inimigo = criarInimigo(posicaoX, 1, raio, funcMovimento);
    return [inimigo, ...invocarInimigosRecursivo(inimigos, quantidade - 1, funcoesDeMovimento)]
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
 * Checa se uma lista de inimigos colide com algum projetil 
 * @param {object[]} inimigos Lista de inimigos
 * @param {object[]} projeteis Lista de projeteis
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
