// MOVIMENTAÇÃO -- INÍCIO
const personagem = document.getElementById('personagem');
let posicaoHorizontal = 0;
const step = 10;
let isJumping = false;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      if (!isJumping) {
        jump();
      }
      break;
    case 'a':
      posicaoHorizontal -= step;
      updatePersonagemPosition();
      break;
    case 'd':
      posicaoHorizontal += step;
      updatePersonagemPosition();
      break;
    case ' ':
      atirar();
      break;
  }
});

function updatePersonagemPosition() {
  personagem.style.left = posicaoHorizontal + 'px';
}

// PULO -- INÍCIO
function jump() {
  isJumping = true;
  personagem.classList.add('jump-animation');

  setTimeout(() => {
    personagem.classList.remove('jump-animation');
    isJumping = false;
  }, 500); 
}

// TIRO -- INÍCIO
let isMovingLeft = false;
let tirosAcertados = 0; 

document.addEventListener('keydown', (event) => {
  if (event.key === 'a') {
    isMovingLeft = true;
  } else if (event.key === 'd') {
    isMovingLeft = false;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'a') {
    isMovingLeft = false;
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
    checkCollisionTiro(tiro, inimigoB);
  }, 10);
}
// TIRO -- FIM

// INIMIGO -- INÍCIO
const inimigo = document.getElementById('inimigo');
const inimigoB = document.getElementById('inimigoB');
let inimigoPositionX = window.innerWidth;

function moverInimigo() {
  inimigo.style.left = inimigoPositionX + 'px';
  inimigoPositionX -= 0.5;

  if (inimigoPositionX < -50) {
    inimigoPositionX = window.innerWidth;
  }
}

setInterval(moverInimigo, 10);
// INIMIGO -- FIM

// DETECÇÃO -- INÍCIO
function checkCollisionTiro(tiro, inimigo) {
  const tiroRect = tiro.getBoundingClientRect();
  const inimigoRect = inimigo.getBoundingClientRect();

  if (
    tiroRect.left < inimigoRect.right &&
    tiroRect.right > inimigoRect.left &&
    tiroRect.top < inimigoRect.bottom &&
    tiroRect.bottom > inimigoRect.top
  ) {
    tirosAcertados++; 
    document.body.removeChild(tiro);

    
    if (tirosAcertados >= 10) {
      inimigo.style.display = 'none';
      alert("Você derrotou o inimigo!");
      window.location.href = "cena3.html"; 
    }
  }
}

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
// DETECÇÃO -- FIM

// VIDA -- INÍCIO
let vidaCount = 3;
const vidaCountElement = document.getElementById('vidaCount');

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
  personagem.style.left = '50px';
  posicaoHorizontal = 0;
}
// VIDA -- FIM
