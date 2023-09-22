//Utilizando o codigo de animação, crie um desenho usando formas e deixe ele mais animado e interativo para usar como base quando comandos de inputs serem colocados
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ctx2 = canvas.getContext('2d');
const ctx3= canvas.getContext('2d');

const update = () => {
    const frame = () => {    
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
        ctx2.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
        ctx3.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
        naveAnimacao(50,100);// codigo que cria o objeto feito por formas para colocar ele em uma determinada posição e realizar a animação
    }
    const id = setInterval(frame, 5);//executa o codigo frame com um delay de 5 entre eles
}

const naveAnimacao = (x,y) => {//função que serve para criar um desenho de uma nave e ter animação de movimento para não ficar muito estatico
    const xA=x+600+Math.cos(Date.now()/250)*5
    const yA=y+200+Math.sin(Date.now()/250)*5// consts's padrões para o personagem ficar presente na tela e tenha sempre seu movimento
    ctx.beginPath();// começo da criação do desenho
    ctx.arc(xA, yA, 20, 0, 2 * Math.PI); 
    ctx.moveTo(xA,yA-60);
    ctx.lineTo(xA+20,yA-10);
    ctx.lineTo(xA-20,yA-10);// essa parte da função cria o corpo principal do personagem, sendo constituido por uma bola (ctx.arc) e um triangulo que começa na posição ctx.moveTo e tem pontas nos dois ctx.line
  // primeira asa
    ctx.moveTo(xA-53,yA+20);
    ctx.lineTo(xA,yA-30);
    ctx.lineTo(xA,yA+20);//criação da asa esquerda, com coordenadas baseados no corpo principal (tamém é construido por um triangulo que tem como ponta principal 53 pixels a esqueda do centro do corpo e 25 pixel abaixo do corpo)
  // segunda asa
    ctx.moveTo(xA+55,yA+20);
    ctx.lineTo(xA,yA+20); 
    ctx.lineTo(xA,yA-30);//criação da asa direita, baseado no mesmo processo que a da esquerda porem com, algumas, coordenas espelhadas 
    ctx.closePath; //termino da criação do desenho
    ctx.strokeStyle = ctx.fillStyle = '#00FF00'; //adição da cor verde
    ctx.fill(); //preencimento
  //cabine e fogo
    ctx2.beginPath();
    ctx2.arc(xA ,yA-30 ,9 , 0, 2*Math.PI);//criação da cabine
    ctx2.moveTo (xA,(yA+60)-Math.cos(Date.now()/250)*5);//processo de manufatura das asas e do corpo, porém a parte do fogo da nave tem a função math.cos juntando com o date.now para ficar sempre em movimento durante o game, mesmo sem adição de inputs
    ctx2.lineTo (xA-13,yA+40);
    ctx2.lineTo (xA+13,yA+40);
    ctx2.closePath;
    ctx.strokeStyle= ctx.fillStyle = '#5353ec';//adição da cor azul
    ctx.fill();
  // turbina 
   ctx3.beginPath();
   ctx3.rect(xA-13,yA+5,25,25);
   ctx3.closePath();
   ctx3.strokeStyle= ctx.fillStyle= '#00FF00';//quadrado da cor verde estacionado na parte de trás do corpo para simular uma turbina
   ctx3.fill();
}

update();//processo para loop 