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

const criarProjetil = (xpos, ypos) => {return {x: xpos, y: ypos}}; // função base que cria um novo projetil

const addNaLista = (lista, novoelemento) => [...lista, novoelemento]; // função que adiciona os novos projeteis a serem lançados, dentro da lista de projeteis do EstadoDeJogo