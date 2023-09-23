//essa função deve ser implementada a função de destruição de objeto e tiro
const maisponto1=(x,jogadorpontos=jogador1.pontos)=>{
    jogadorpontos +=x
    return jogadorpontos
}
const maisponto2=(x,jogadorpontos=jogador2.pontos)=>{
    jogadorpontos +=x
    return jogadorpontos
}
//a função funciona como uma soma basica, porém vai depender dos pontos que o jogador tem, qual objeto destruiu e qual jogador desturiu, 
//puxando os dados dos objetos e adicionando mais a cada vez que um objeto for destruido 
// const destroiObj =()=>.....
//if (tiro.pos==objto.pos){(construção da função), jogadorX.pontos=maispontoX}