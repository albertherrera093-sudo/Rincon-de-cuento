const NIVELES = {
  facil:   { pares: 6,  columnas: 4 },
  medio:   { pares: 8,  columnas: 4 },
  dificil: { pares: 10, columnas: 5 }
};

const tablero = document.getElementById("tablero");
const elMovimientos = document.getElementById("movimientos");
const elTiempo = document.getElementById("tiempo");
const botonesNivel = document.querySelectorAll(".nivel");
const btnReiniciar = document.getElementById("btn-reiniciar");
const cajaFinal = document.getElementById("final");
const finalEstrellas = document.getElementById("final-estrellas");
const finalTexto = document.getElementById("final-texto");
const btnOtra = document.getElementById("btn-otra");

let nivel = "facil";
let primera = null;
let bloqueado = false;
let movimientos = 0;
let encontradas = 0;
let segundos = 0;
let reloj = null;

function formatoTiempo(s) {
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

function iniciarReloj() {
  detenerReloj();
  reloj = setInterval(() => {
    segundos++;
    elTiempo.textContent = formatoTiempo(segundos);
  }, 1000);
}

function detenerReloj() {
  clearInterval(reloj);
  reloj = null;
}

// Portada del cuento; si todavía no existe la imagen, se muestra el título
function crearPortada(cuento) {
  const img = document.createElement("img");
  img.src = cuento.imagen;
  img.alt = cuento.titulo;
  img.draggable = false;
  img.addEventListener("error", () => {
    const titulo = document.createElement("span");
    titulo.className = "carta-titulo";
    titulo.textContent = cuento.titulo;
    img.replaceWith(titulo);
  });
  return img;
}

function nuevoJuego() {
  detenerReloj();
  segundos = 0;
  movimientos = 0;
  encontradas = 0;
  primera = null;
  bloqueado = false;
  elMovimientos.textContent = "0";
  elTiempo.textContent = "0:00";
  cajaFinal.classList.add("oculto");

  const { pares, columnas } = NIVELES[nivel];
  const elegidos = mezclar(CUENTOS_JUEGOS).slice(0, pares);
  const mazo = mezclar([...elegidos, ...elegidos]);

  // Se cargan las portadas antes para que al voltear aparezcan al instante
  elegidos.forEach((cuento) => {
    const precarga = new Image();
    precarga.src = cuento.imagen;
  });

  tablero.innerHTML = "";
  tablero.style.setProperty("--columnas", columnas);

  mazo.forEach((cuento) => {
    const carta = document.createElement("button");
    carta.type = "button";
    carta.className = "carta";
    carta.dataset.id = cuento.id;
    carta.setAttribute("aria-label", "Carta boca abajo");
    carta.innerHTML =
      '<span class="carta-giro">' +
      '<span class="cara cara-frente">❦</span>' +
      '<span class="cara cara-dorso"></span>' +
      "</span>";
    carta.querySelector(".cara-dorso").appendChild(crearPortada(cuento));
    carta.addEventListener("click", () => tocar(carta));
    tablero.appendChild(carta);
  });
}

function tocar(carta) {
  if (bloqueado || carta === primera || carta.classList.contains("encontrada")) return;

  carta.classList.add("volteada");
  if (!reloj) iniciarReloj();

  // Primera carta: esperamos la segunda
  if (!primera) {
    primera = carta;
    return;
  }

  movimientos++;
  elMovimientos.textContent = movimientos;
  const segunda = carta;

  if (primera.dataset.id === segunda.dataset.id) {
    // ¡Pareja!
    primera.classList.add("encontrada");
    segunda.classList.add("encontrada");
    primera = null;
    encontradas++;
    if (encontradas === NIVELES[nivel].pares) terminar();
  } else {
    // No son pareja: se voltean otra vez
    bloqueado = true;
    const anterior = primera;
    primera = null;
    setTimeout(() => {
      anterior.classList.remove("volteada");
      segunda.classList.remove("volteada");
      bloqueado = false;
    }, 1000);
  }
}

function terminar() {
  detenerReloj();
  const pares = NIVELES[nivel].pares;

  let estrellas = 1;
  if (movimientos <= pares + 3) estrellas = 3;
  else if (movimientos <= pares * 2) estrellas = 2;

  finalEstrellas.textContent = "⭐".repeat(estrellas);
  finalTexto.textContent = movimientos + " movimientos en " + formatoTiempo(segundos);

  reproducir("victoria", { fundido: false });
  lluviaDeConfeti();
  setTimeout(() => cajaFinal.classList.remove("oculto"), 700);
}

botonesNivel.forEach((boton) => {
  boton.addEventListener("click", () => {
    nivel = boton.dataset.nivel;
    botonesNivel.forEach((b) => {
      b.classList.toggle("activo", b === boton);
      b.classList.toggle("btn-claro", b !== boton);
    });
    nuevoJuego();
  });
});

btnReiniciar.addEventListener("click", nuevoJuego);
btnOtra.addEventListener("click", nuevoJuego);

crearBotonSonido();
nuevoJuego();