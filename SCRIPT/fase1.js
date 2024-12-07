///MOVIMENTAÇÃO -- INÍCIO
const personagem = document.getElementById('personagem');
let posicaoHorizontal = 0;
let posicaoVertical = 0;
const step = 10;
let tiroAcertados = 0;
let isJumping = false; // Variável para controle do pulo

function updatePersonagemPosition() {
  personagem.style.left = `${posicaoHorizontal}px`;
  personagem.style.bottom = `${posicaoVertical}px`;
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      jump();
      break;
    case 'a':
      posicaoHorizontal -= step;
      break;
    case 'd':
      posicaoHorizontal += step;
      break;
    case ' ':
      atirar();
      break;
  }
  updatePersonagemPosition();
});
//MOVIMENTAÇÃO -- FIM

//TIRO -- INÍCIO

let isMovingLeft = false; // Variável para rastrear o estado da tecla "a" pressionada

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      isMovingLeft = true;
      break;
    case 'd':
      isMovingLeft = false; // Parar o movimento à esquerda se a tecla "d" for pressionada
      break;
    case ' ':
      atirar();
      break;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'a') {
    isMovingLeft = false; // Parar o movimento à esquerda quando a tecla "a" for solta
  }
});

function atirar() {
  const tiro = document.createElement('div');
  tiro.classList.add('tiro');
  
  if (isMovingLeft) {
    tiro.classList.add('tiro-esquerda');
  }

  document.body.appendChild(tiro);

  const personagemRect = personagem.getBoundingClientRect();
  const tiroLeft = personagemRect.left + (isMovingLeft ? -10 : personagemRect.width + 10);

  tiro.style.left = tiroLeft + 'px';
  tiro.style.top = (personagemRect.top + personagemRect.height / 5) + 'px';

  const tiroMovement = isMovingLeft ? -5 : 5;

  const tiroInterval = setInterval(() => {
    const tiroRect = tiro.getBoundingClientRect();
    if (tiroRect.left > 0 && tiroRect.right < window.innerWidth) {
      tiro.style.left = (parseInt(tiro.style.left) || 0) + tiroMovement + 'px';
    } else {
      clearInterval(tiroInterval);
      document.body.removeChild(tiro);
    }
    checkCollisionTiro(tiro, inimigo);
    checkCollisionTiroB(tiro, inimigoB);
    
    
  }, 10);

  
}
//TIRO -- FIM

//INIMIGO -- INÍCIO

const inimigo = document.getElementById('inimigo');
let inimigoPositionX = window.innerWidth; 




function moverInimigo() {
  inimigo.style.left = inimigoPositionX + 'px';
  inimigoPositionX -= 2; 

  if (inimigoPositionX < -50) {
    inimigoPositionX = window.innerWidth;
    
  }
}


setInterval(moverInimigo, 10);



//INIMIGO -- FIM

//DETECÇÃO -- INÍCIO


function checkCollision() {
  const personagemRect = personagem.getBoundingClientRect();
  const inimigoRect = inimigo.getBoundingClientRect();

  if (
    personagemRect.left < inimigoRect.right &&
    personagemRect.right > inimigoRect.left &&
    personagemRect.top < inimigoRect.bottom &&
    personagemRect.bottom > inimigoRect.top
  ) {
    subtrairVida();
  }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      jump();
      break;
    case 'a':
      personagem.style.left = (parseInt(personagem.style.left) || 0) - 10 + 'px';
      break;
    case 'd':
      personagem.style.left = (parseInt(personagem.style.left) || 0) + 10 + 'px';
      break;
  }

  checkCollision(inimigo);
  checkCollisionB(inimigoB);
});

//DETECÇÃO -- FIM

//GANHAR VIDA -- INÍCIO

const character = document.getElementById('character');
const vidaCountElement = document.getElementById('vidaCount');

let vidaCount = 3;

function updateVidaCount() {
  vidaCountElement.textContent = vidaCount;
}

function subtrairVida() {
  vidaCount--;
  updateVidaCount();

  if (vidaCount <= 0) {
    alert('Game Over! Vidas esgotadas.');
    resetGame();
  }
}

function resetGame() {
  vidaCount = 3;
  updateVidaCount();
  character.style.left = '0px';
  character.style.top = '0px';
}


//GANHAR VIDA -- FIM

//DETECÇÃO TIRO -- INÍCIO
function checkCollisionTiro(tiro, inimigo) {
  const tiroRect = tiro.getBoundingClientRect();
  const inimigoRect = inimigo.getBoundingClientRect();

  if (
    tiroRect.left < inimigoRect.right &&
    tiroRect.right > inimigoRect.left &&
    tiroRect.top < inimigoRect.bottom &&
    tiroRect.bottom > inimigoRect.top
  ) {
    tiroAcertados++
    updateVidaCount()
    document.body.removeChild(tiro)
    window.location.href="cena2.html";
  }


  

  if (tiroAcertados === 3) {
    document.getElementById("inimigo").remove();
    tiroAcertados = 0; 
  }

}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      tiro.style.left = (parseInt(tiro.style.left) || 0) - 10 + 'px';
      break;
    case 'd':
      tiro.style.left = (parseInt(tiro.style.left) || 0) + 10 + 'px';
      break;
  }

 
});

//DETECÇÃO TIRO -- FIM

//GANHAR VIDA -- INÍCIO
function updateVidaCount() {
  vidaCountElement.textContent = vidaCount;
}

function addVida() {
  vidaCount++;
  updateVidaCount();
}



document.addEventListener('keydown', (event) => {
  if (event.shiftKey) {
    addVida();
  }


});

//GANHAR VIDA -- FIM

//PULAR -- INÍCIO
function jump() {
  if (isJumping) return;
  isJumping = true;

  // Adiciona a classe de animação de pulo
  personagem.classList.add('jump-animation');

  // Define a altura máxima do pulo
  const alturaMaxima = 200;
  let alturaAtual = 0;
  let indoParaCima = true;

  const jumpInterval = setInterval(() => {
    if (!isJumping) {
      clearInterval(jumpInterval);
      return;
    }

    if (indoParaCima) {
      alturaAtual += 10; // Incrementa a altura
      if (alturaAtual >= alturaMaxima) {
        indoParaCima = false; 
      }
    } else {
      alturaAtual -= 10; 
      if (alturaAtual <= 0) {
        alturaAtual = 0;
        isJumping = false;
        clearInterval(jumpInterval);
        personagem.classList.remove('jump-animation');
      }
    }

    // Atualiza a posição do personagem
    posicaoVertical = alturaAtual;
    updatePersonagemPosition();
  }, 10);
}
//PULAR -- FIM

//INIMIGO2 -- INICIO
const inimigoB = document.getElementById('inimigoB');
let inimigoBPositionX = window.innerWidth-400; // Inimigo B começa na extremidade direita

function moverInimigoB() {
  inimigoB.style.left = inimigoBPositionX + 'px';
  inimigoBPositionX -= 2; // Movimento para a esquerda

  // Reposicionar o Inimigo B quando ele sair da tela
  if (inimigoBPositionX < -50) {
    inimigoBPositionX = window.innerWidth;
  }
}

setInterval(moverInimigoB, 10);
//INIMIGO2 -- FIM

//COLISÃO2 -- INÍCIO

function checkCollisionB() {
  const personagemRect = personagem.getBoundingClientRect();
  const inimigoBRect = inimigoB.getBoundingClientRect();

  if (
    personagemRect.left < inimigoBRect.right &&
    personagemRect.right > inimigoBRect.left &&
    personagemRect.top < inimigoBRect.bottom &&
    personagemRect.bottom > inimigoBRect.top
  ) {
    subtrairVida();
  }
}

//COLISÃO2 -- FIM


//COLISÃOTIRO2 -- INICIO

function checkCollisionTiroB(tiro, inimigoB) {
  const tiroRect = tiro.getBoundingClientRect();
  const inimigoBRect = inimigoB.getBoundingClientRect();

  if (
    tiroRect.left < inimigoBRect.right &&
    tiroRect.right > inimigoBRect.left &&
    tiroRect.top < inimigoBRect.bottom &&
    tiroRect.bottom > inimigoBRect.top
  ) {
    tiroAcertados++
    updateVidaCount()
    document.body.removeChild(tiro)
    
   
  }


  

  if (tiroAcertados === 3) {
    document.getElementById("inimigoB").remove();
    tiroAcertados = 0; // Reinicia a contagem de tiros acertados
  }

}


//COLISÃOTIRO2 -- FIM

//REMOVE BALA -- INÍCIO

function removeBala(){
document.getElementById("tiro").remove();
}

//REMOVE BALA -- FIM


