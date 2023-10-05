/**
 * Reveza recursivamente entre seno e cosseno N vezes;
 * @param {number} valor Valor usado nas funções
 * @param {number} camadas Numero de camadas(funções seno e cosseno) que o valor passará 
 * @returns {number} Resultado das operações
 */
const senCosRecursivo = (valor, camadas) => {
    if(camadas <= 0) return 0;
    else if(camadas % 2 == 0) return Math.sin(valor/camadas) + senCosRecursivo(valor, camadas - 1);
    else return Math.cos(valor/camadas) + senCosRecursivo(valor, camadas - 1);
}

/**
 * Cria um projetil em uma especifica coordenada no plano XY, de raio `raio`
 * @param {number} xpos Posição no eixo X
 * @param {number} ypos Posição no eixo Y
 * @param {number} raio Raio do projetil (Geralmente utilizado para colisões)
 * @returns {object} Um objeto no formato `{x, y, raio}` em que:
 * - `x`: Coordenada atual no eixo X
 * - `y`: Coordenada atual no eixo Y
 * - `raio`: Raio do projetil
 */
const criarProjetil = (xpos, ypos, raio) => {return {x: xpos, y: ypos, raio: raio}}; // função base que cria um novo projetil

/**
 * Cria um inimigo em uma especificada coordenada, com um determinado raio e que se deslocara no eixo X seguindo uma função de movimento `funcaoMovimentoX`.
 * 
 * Na execução, a função será chamada de forma `funcaoMovimentoX(x, xInicial, y, yInicial)`. Em que `x` e `y` representam suas atuais coordenadas nos eixos coordenados e
 * `xInicial` e `yInicial` são as coordenadas nos eixos coordenados em que foram invocados (que, tambem serão os mesmos valores de `xpos` e `ypos`)  e o resultado dessa 
 * função deverá ser uma nova coordenada no eixo X que será usada para posicionar o inimigo. 
 * @param {number} xpos Posição no eixo X
 * @param {number} ypos Posição no eixo Y
 * @param {number} raio Raio do inimigo (Geralmente utilizado para colisões)
 * @param {function} [funcaoMovimentoX] Função usada para representar o movimento deste inimigo. Deixando este parametro em branco resultará no inimigo movendo somente no eixo Y
 * @returns {object} Um objeto de inimigo no formado `{x, y, raio, funcaoMovimentoX, xInicial, yInicial}`
 * 
 * - `x`: Coordenada atual no eixo X
 * - `y`: Coordenada atual no eixo Y
 * - `raio`: Raio do inimigo
 * - `funcaoMovimentoX`: Função usada para calcular a nova coordenada no eixo X
 * - `xInicial`: Coordenada no eixo X em que esse objeto foi criado (mesmo valor que `xpos`)
 * - `yInicial`: Coordenada no eixo Y em quue esse objeto foi criado (mesmo valor que `ypos`)
 */
const criarInimigo = (xpos, ypos, raio, funcaoMovimentoX = (x, xI, y, yI) => x) => {return {x: xpos, y: ypos, raio: raio, funcaoMovimentoX: funcaoMovimentoX, xInicial: xpos, yInicial: ypos}};


/**
 * Adiciona um elemento a uma lista qualquer
 * @param {any[]} lista Lista para adicionar o elemento
 * @param {any} novoelemento Elemento a ser adicionado
 * @returns {any[]} um clone de `lista` com `novoelemento` incluso no final
 */
const addNaLista = (lista, novoelemento) => [...lista, novoelemento]; // função que adiciona os novos projeteis a serem lançados, dentro da lista de projeteis do EstadoDeJogo

/**
 * Checa se um determinado elemento `x` é indefinido
 * @param {any} x Elemento para checar
 * @returns {boolean} `true` se for indefinido, `false` se não
 */
const indef = (x) => typeof x == 'undefined';

/**
 * Calcula a dificuldade do jogo baseada na duração da partida
 * @param {number} tempoDeJogo A duração da partida
 * @returns {number} um valor de dificuldade
 */
const dificuldadeInimigos = (tempoDeJogo) => 1 + tempoDeJogo/20; // Substituido a formula temporariamente até encontrar uma melhor.
// Formula antiga: tempoDeJogo**(3/2)/200 + Math.sqrt(tempoDeJogo)/10


/**
 * Checa se 2 objetos estão colidindo, utilizando seus raios e suas coordenadas para calcular a colisão
 * @param {object} obj1 Primeiro Objeto
 * @param {object} obj2 Segundo Objeto
 * @returns {boolean} `true` se colidem, `false` se não
 */
const checarColisao = (obj1, obj2) => {
    const distanciaQuadrado = (obj1.x - obj2.x)**2 + (obj1.y - obj2.y)**2
    const somaDosRaiosQuadrado = (obj1.raio + obj2.raio)**2;

    return distanciaQuadrado <= somaDosRaiosQuadrado;
}

/**
 * Remove um item qualquer de uma lista qualquer
 * @param {any[]} lista Lista para remover o elemento
 * @param {any} obj O elemento a se remover
 * @returns {any[]} Uma lista sem `obj`
 */
const removerDaLista = (lista, obj) => lista.filter((x) => x != obj);

/**
 * Retorna um item aleatorio de uma lista usando seno para gerar um valor pseudoaleatorio
 * @param {any[]} lista A lista para selecionar um item aleatorio
 * @param {number} seed A semente usada no valor pseudoaleatorio
 * @returns {any} Item aleatorio da lista
 */
const selecionarItemAleatorio = (lista, seed) => {
    const valorPseudoAleatorio = Math.sin(seed) * 0.5 + 0.5;
    const index = Math.floor(valorPseudoAleatorio * lista.length);
    return lista[index];
}

const gerarNovoEstadoDeJogo = (horaInicial, jogador1, jogador2, jogadorVencedor, inimigos, projeteis1, projeteis2, proximoSpawn) => {
    return {horaInicial, jogador1, jogador2, jogadorVencedor, inimigos, projeteis1, projeteis2, proximoSpawn}
}

const checarJogadorVencedor = (inimigos, jogador1, jogador2) => {
    const colidiuComJogador1 = inimigos.filter((x) => checarColisao(jogador1,x)).length > 0;
    const colidiuComJogador2 = inimigos.filter((x) => checarColisao(jogador2,x)).length > 0;

    if(colidiuComJogador1) return 2;
    else if(colidiuComJogador2) return 1;
    else return 0;
}
