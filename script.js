window.botonesSellados = window.botonesSellados || {};

/* ---------- NAVEGACIÓN: botones "invisibles" con flecha ---------- */
document.querySelectorAll('.door-area').forEach(btn => { 
  btn.addEventListener('click', (e) => {
    const target = btn.dataset.target;
    if (target) window.location.href = target;
  });

  // Permitir 'Enter' para accesibilidad
  btn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      btn.click();
    }
  });
});

let puntosRestadosTotales = 0;

// Chequea puntaje al cargar la pagina, y actualiza el contador de puntos
// Aprovecho la situación para chequear si las tres salas fueron completadas para cargar la victoria
document.addEventListener('DOMContentLoaded', () => {
  const actualPointCount = document.getElementById('actualPointCount');
  const paginaActual = window.location.pathname.split('/').pop();
  verificarVictoria();
  if (actualPointCount) {
    actualizarPuntaje(actualPointCount);
  }

  if (paginaActual === 'VictoryLobbyYAY.html') {
    recapitulando();
  }
});

function actualizarPuntaje () {
  let puntosGuardados = parseInt(sessionStorage.getItem('puntos')) || 0;
  document.getElementById('actualPointCount').textContent = puntosGuardados;
}


// Define el estado de los botones y chequea estado al cargar la página, bloquea botones de ser necesario
let door1ID = false;
const botonPuertaIzquierda = document.querySelector('.door-area.door-left');
document.addEventListener('DOMContentLoaded', () => {
  const estado1ID = sessionStorage.getItem('door1ID');
  if (estado1ID === 'true') {
    botonPuertaIzquierda.textContent = "✓";
    botonPuertaIzquierda.style.pointerEvents = 'none';
  }
});

let door2ID = false;
const botonPuertaCentral = document.querySelector('.door-area.door-center');
document.addEventListener('DOMContentLoaded', () => {
  const estado2ID = sessionStorage.getItem('door2ID');
  if (estado2ID === 'true') {
    botonPuertaCentral.textContent = "✓";
    botonPuertaCentral.style.pointerEvents = 'none';
  }
});

let door3ID = false;
const botonPuertaDerecha = document.querySelector('.door-area.door-right');
document.addEventListener('DOMContentLoaded', () => {
  const estado3ID = sessionStorage.getItem('door3ID');
  if (estado3ID === 'true') {
    botonPuertaDerecha.textContent = "✓";
    botonPuertaDerecha.style.pointerEvents = 'none';
  }
});

// Si todos los botones === true; redirije el usuario a la pantalla dde victoria
function verificarVictoria() {
  let alreadyRedirected = sessionStorage.getItem('alreadyRedirected') === 'true';

  const checkPuertaIzquierda = sessionStorage.getItem('door1ID') === 'true';
  const checkPuertaCentral = sessionStorage.getItem('door2ID') === 'true';
  const checkPuertaDerecha = sessionStorage.getItem('door3ID') === 'true';

  if (checkPuertaIzquierda && checkPuertaCentral && checkPuertaDerecha && !alreadyRedirected) {
    sessionStorage.setItem('alreadyRedirected', 'true');
    window.location.href = '/VictoryLobbyYAY.html';
  }
}

// Cambia el texto de los componentes en "VictoryLobbyYAY.html" para que sirvan como contadores
function recapitulando() {
  const contadorDeFallos = document.querySelector('#contadorDeFallos');
  const contadorDePuntajeTotal = document.querySelector('#contadorPuntajeTotal');

  if (contadorDeFallos) {
    contadorDeFallos.textContent = sessionStorage.getItem('puntosRestadosTotales') || 0;
  }
  if (contadorDePuntajeTotal) {
    contadorDePuntajeTotal.textContent = sessionStorage.getItem('puntos') || 0;
  }
}

// Sucede cuando se aprieta el boton en VictoryLobbyYAY, resetea TODO lo que esta en sessionStorage
const botonReiniciarJuego = document.querySelector('#botonReiniciar');
if (botonReiniciarJuego) {
  botonReiniciarJuego.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
  });
}

function startRoom(tipo) {
  const problemEl = document.getElementById("problem");
  const answerEl = document.getElementById("answer");
  const submitBtn = document.getElementById("submit");
  const feedbackEl = document.getElementById("feedback");
  const nextBtn = document.getElementById("next-problem");
  const returnLobby = document.getElementById("return-lobby");
  const nextContainer = document.getElementById("next-container");

  // Nuevo contenedor para guardar los íconos
  const iconHistory = document.createElement("div");
  iconHistory.id = "icon-history";
  feedbackEl.parentElement.insertBefore(iconHistory, feedbackEl);

  let correctas = 0;
  let total = 3; // cuántos ejercicios por sala
  let intentosRestantes = 3; // oportunidades totales
  let a, b, resultado;
  let gameEnded = false;
  let puntosRestados = 0;

  // Función de derrota, activada cuando intentos restantes es menor o igual a 0
  function deathDotExe() {
    const deathDotExe = document.getElementById("defeat-Rout");
    deathDotExe.style.display = "block";

    sessionStorage.removeItem('puntos');
    sessionStorage.removeItem('puntosRestadosTotales');
    sessionStorage.removeItem('door1ID');
    sessionStorage.removeItem('door2ID');
    sessionStorage.removeItem('door3ID');
    sessionStorage.removeItem('alreadyRedirected');
  }


  function generarProblema() {
    if(gameEnded) return;
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;

    switch (tipo) {
      case 'sumar':
        resultado = a + b;
        problemEl.textContent = `${a} + ${b} = ?`;
        break;
      case 'restar':
        resultado = a - b;
        problemEl.textContent = `${a} - ${b} = ?`;
        break;
      case 'multiplicar':
        resultado = a * b;
        problemEl.textContent = `${a} × ${b} = ?`;
        break;
      case 'dividir':
        resultado = a;
        let prod = a * b;
        problemEl.textContent = `${prod} ÷ ${b} = ?`;
        break;
    }

    feedbackEl.textContent = "";
    answerEl.value = "";
    nextContainer.style.display = "none";
  }

  submitBtn.addEventListener("click", () => {
    const valor = parseInt(answerEl.value);
    if (isNaN(valor)) return;

    // Creamos un nuevo icono visual para registrar la respuesta
    const icon = document.createElement("span");
    icon.style.fontSize = "2em";
    icon.style.margin = "0 5px";

    if (valor === resultado) {
      feedbackEl.style.color = "lime";
      icon.textContent = "✅";
      correctas++;
      setTimeout(generarProblema, 100);

    } else {
      feedbackEl.style.color = "red";
      icon.textContent = "❌";
      intentosRestantes--;
      setTimeout(generarProblema, 100);
      puntosRestados++;
    }

    iconHistory.appendChild(icon);

    // Si se quedan sin intentos
    if (intentosRestantes <= 0) {
      problemEl.textContent = "😵 ¡Sin más intentos!";
      submitBtn.disabled = true;
      answerEl.disabled = true;
      nextContainer.style.display = "none";
      returnLobby.style.display = "block";
      feedbackEl.textContent = "❌❌❌";
      feedbackEl.style.color = "red";
       gameEnded = true;
       deathDotExe();
      return;
    }

    nextContainer.style.display = "block";

    // Si completó todos los ejercicios
    if (correctas === total) {
      problemEl.textContent = "🎉 ¡Completaste todos los ejercicios!";
      submitBtn.disabled = true;
      answerEl.disabled = true;
      nextContainer.style.display = "none";
      returnLobby.style.display = "block";
      gameEnded = true;

      puntos = parseInt(sessionStorage.getItem('puntos')) || 0;
      puntosRestadosTotales = parseInt(sessionStorage.getItem('puntosRestadosTotales')) || 0;

      puntos = puntos + (correctas - puntosRestados);
      puntosRestadosTotales = puntosRestadosTotales + puntosRestados;

      sessionStorage.setItem("puntosRestadosTotales", puntosRestadosTotales.toString());
      sessionStorage.setItem("puntos", puntos.toString());
    }
    

  });
  

  nextBtn.addEventListener("click", generarProblema);

  generarProblema();
}

