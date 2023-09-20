const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const update = () => {
    const frame = () => {       //Tudo que quiser fazer por frame façam aqui dentro dessa função
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
        testeAnimacao();
    }
    const id = setInterval(frame, 5);
}

// Exemplo de como desenhar algo e mover usando funcao trigonometrica.
const testeAnimacao = () => {
    ctx.beginPath(); // "Começando a desenhar"
    ctx.arc(600 + Math.cos(Date.now()/250) * 500, 400 + Math.sin(Date.now()/450) * 300, 25, 0, 2 * Math.PI); // Desenhar um arco de 360°
    ctx.closePath; // "Parando de desenhar"
    ctx.strokeStyle = ctx.fillStyle = '#00FF00'; // Definindo a cor 
    ctx.fill(); // Dizendo que é pra encher o "arco" (que nesse caso forma um circulo)
}

update(); // Inicializando o loop de updates