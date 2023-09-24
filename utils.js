/**
 * Reveza recursivamente entre seno e cosseno N vezes;
 * @param {*} valor Valor usado nas funções
 * @param {*} camadas Numero de camadas(funções seno e cosseno) que o valor passará 
 * @returns 
 */
const senCosRecursivo = (valor, camadas) => {
    if(camadas <= 0) return 0;
    else if(camadas % 2 == 0) return Math.sin(valor/camadas) + senCosRecursivo(valor, camadas - 1);
    else return Math.cos(valor/camadas) + senCosRecursivo(valor, camadas - 1);
}

const criarProjetil = (xpos, ypos, raio) => {return {x: xpos, y: ypos, raio: raio}}; // função base que cria um novo projetil

const criarInimigo = (xpos, ypos, raio) => {return {x: xpos, y: ypos, raio: raio}};

const addNaLista = (lista, novoelemento) => [...lista, novoelemento]; // função que adiciona os novos projeteis a serem lançados, dentro da lista de projeteis do EstadoDeJogo

const indef = (x) => typeof x == 'undefined';

const dificuldadeInimigos = (tempoDeJogo) => 1 + tempoDeJogo/20;

const checarColisao = (obj1, obj2) => {
    distanciaQuadrado = (obj1.x - obj2.x)**2 + (obj1.y - obj2.y)**2
    somaDosRaiosQuadrado = (obj1.raio + obj2.raio)**2;

    return distanciaQuadrado <= somaDosRaiosQuadrado;
}

const removerDaLista = (lista, obj) => lista.filter((x) => x == obj);
//função de crescimento exponencial da dificuldade do jogo em função do tempo