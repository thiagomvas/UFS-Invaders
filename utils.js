/**
 * Reveza recursivamente entre seno e cosseno N vezes;
 * @param {number} valor Valor usado nas funções
 * @param {number} camadas Numero de camadas(funções seno e cosseno) que o valor passará 
 * @returns 
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
 * @returns 
 */
const criarProjetil = (xpos, ypos, raio) => {return {x: xpos, y: ypos, raio: raio}}; // função base que cria um novo projetil

/**
 * Cria um inimigo em uma especificada coordenada
 * @param {number} xpos Posição no eixo X
 * @param {number} ypos Posição no eixo Y
 * @param {number} raio Raio do inimigo (Geralmente utilizado para colisões)
 * @returns 
 */
const criarInimigo = (xpos, ypos, raio) => {return {x: xpos, y: ypos, raio: raio}};

/**
 * Adiciona um elemento a uma lista qualquer
 * @param {any[]} lista Lista para adicionar o elemento
 * @param {any} novoelemento Elemento a ser adicionado
 * @returns 
 */
const addNaLista = (lista, novoelemento) => [...lista, novoelemento]; // função que adiciona os novos projeteis a serem lançados, dentro da lista de projeteis do EstadoDeJogo

/**
 * Checa se um determinado elemento `x` é indefinido
 * @param {any} x Elemento para checar
 * @returns 
 */
const indef = (x) => typeof x == 'undefined';

/**
 * Calcula a dificuldade do jogo baseada na duração da partida
 * @param {number} tempoDeJogo A duração da partida
 * @returns 
 */
const dificuldadeInimigos = (tempoDeJogo) => 1 + tempoDeJogo/20; // Substituido a formula temporariamente até encontrar uma melhor.
// Formula antiga: tempoDeJogo**(3/2)/200 + Math.sqrt(tempoDeJogo)/10


/**
 * Checa se 2 objetos estão colidindo, utilizando seus raios e suas coordenadas para calcular a colisão
 * @param {object} obj1 Primeiro Objeto
 * @param {object} obj2 Segundo Objeto
 * @returns 
 */
const checarColisao = (obj1, obj2) => {
    distanciaQuadrado = (obj1.x - obj2.x)**2 + (obj1.y - obj2.y)**2
    somaDosRaiosQuadrado = (obj1.raio + obj2.raio)**2;

    return distanciaQuadrado <= somaDosRaiosQuadrado;
}

/**
 * Remove um item qualquer de uma lista qualquer
 * @param {any[]} lista Lista para remover o elemento
 * @param {any} obj O elemento a se remover
 * @returns 
 */
const removerDaLista = (lista, obj) => lista.filter((x) => x != obj);