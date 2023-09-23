
/**
 * Desenha uma nave em uma determinada posição
 * @param {*} x Coordenada no eixo X para desenhar
 * @param {*} y Coordenada no eixo Y para desenhar
 * @param {*} corNave A cor da nave
 */
const desenharNave = (x, y, corNave) => {
  // Inicia o desenho
  ctx.beginPath(); 

  // Desenha o corpo principal e as asas
  // As funções abaixo representam movimentos e ações usadas sobre o contexto atual do canvas
  // Essas funções podem ser imaginadas como comandos para sua mão segurando um lapis sobre um papel

  //Corpo Principal
  ctx.moveTo(x, y - 60);
  ctx.lineTo(x + 20, y - 10);
  ctx.lineTo(x - 20, y - 10);

  // Primeira Asa (Esquerda)
  ctx.moveTo(x - 53, y + 20);
  ctx.lineTo(x, y - 30);
  ctx.lineTo(x, y + 20);

  // Segunda Asa (Direita)
  ctx.moveTo(x + 55, y + 20);
  ctx.lineTo(x, y + 20);
  ctx.lineTo(x, y - 30); 
  ctx.closePath(); // Para de "Desenhar"
  ctx.strokeStyle = ctx.fillStyle = corNave; // Adiciona cor verde
  ctx.fill(); // Preenche o desenho

  // Cabine da nava e propulsão
  ctx.beginPath();
  ctx.arc(x, y - 30, 9, 0, 2 * Math.PI); //criação da cabine
  ctx.moveTo(x, y + 65 - senCosRecursivo(Date.now()/30, 10) * 3); // Utilização da função cosseno e o Date.now() que é um valor em ms que muda com o tempo para animar a chama
  ctx.lineTo(x - 13, y + 40);
  ctx.lineTo(x + 13, y + 40);
  ctx.closePath();
  ctx.strokeStyle = ctx.fillStyle = "#5353ec"; // Adiciona cor azul
  ctx.fill(); // Preenchimento

  // Turbina
  ctx.beginPath();
  ctx.rect(x - 13, y + 5, 25, 25);
  ctx.closePath();
  ctx.strokeStyle = ctx.fillStyle = corNave; // Adiciona cor verde
  ctx.fill();
};