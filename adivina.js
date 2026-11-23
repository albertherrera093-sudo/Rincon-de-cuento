const RONDAS = 5;          // cuentos por partida
const NUM_OPCIONES = 4;    // opciones para elegir
const PISTAS_MAX = 3;      // pistas que tiene cada cuento

// Qué tan borrosa se ve la portada según las pistas usadas (en píxeles).
// Un número más chico = se ve más clara.
const DESENFOQUES = [36, 24, 14];

const elRonda = document.getElementById("ronda");
const elPuntos = document.getElementById("puntos");
const marcoImagen = document.getElementById("marco-imagen");
const signo = document.getElementById("signo");
const portada = document.getElementById("portada");
const listaPistas = document.getElementById("pistas");
const btnPista = document.getElementById("btn-pista");
const contOpciones = document.getElementById("opciones");
const mensaje = document.getElementById("mensaje");
const btnSiguiente = document.getElementById("btn-siguiente");
const cajaFinal = document.getElementById("final");
const finalPuntos = document.getElementById("final-puntos");
const finalTexto = document.getElementById("final-texto");
const btnOtra = document.getElementById("btn-otra");

let orden = [];
let ronda = 0;
let puntos = 0;
let actual = null;
let pistasVistas = 0;
let rondaTerminada = false;

function iniciarJuego() {
  orden = mezclar(CUENTOS_JUEGOS).slice(0, RONDAS);
  ronda = 0;
  puntos = 0;
  elPuntos.textContent = "⭐ 0";
  cajaFinal.classList.add("oculto");
  siguienteRonda();
}

function siguienteRonda() {
  if (ronda >= RONDAS) {
    mostrarFinal();
    return;
  }

  actual = orden[ronda];
  ronda++;
  pistasVistas = 0;
  rondaTerminada = false;

  elRonda.textContent = "Cuento " + ronda + " de " + RONDAS;
  mensaje.textContent = "";
  btnSiguiente.hidden = true;
  btnSiguiente.textContent = ronda === RONDAS ? "Ver mi resultado ➜" : "Siguiente cuento ➜";
  btnPista.disabled = false;
  listaPistas.innerHTML = "";

  // La portada aparece muy borrosa y se va aclarando con cada pista
  marcoImagen.classList.remove("revelada", "sin-imagen");
  marcoImagen.style.setProperty("--desenfoque", DESENFOQUES[0] + "px");
  signo.textContent = "?";
  portada.hidden = true;
  portada.onload = () => { portada.hidden = false; };
  portada.onerror = () => {
    // Si todavía no está la imagen, se queda el signo de pregunta
    portada.hidden = true;
    marcoImagen.classList.add("sin-imagen");
  };
  portada.src = actual.imagen;

  crearOpciones();
  mostrarPista();
}

function mostrarPista() {
  if (pistasVistas >= actual.pistas.length) return;

  const li = document.createElement("li");
  li.textContent = actual.pistas[pistasVistas];
  listaPistas.appendChild(li);
  pistasVistas++;

  aclararImagen();
  if (pistasVistas >= actual.pistas.length) btnPista.disabled = true;
}

// Con cada pista, la portada se ve un poco menos borrosa
function aclararImagen() {
  const nivel = Math.max(0, Math.min(pistasVistas, DESENFOQUES.length) - 1);
  marcoImagen.style.setProperty("--desenfoque", DESENFOQUES[nivel] + "px");
}

function crearOpciones() {
  const otros = mezclar(CUENTOS_JUEGOS.filter((c) => c.id !== actual.id)).slice(0, NUM_OPCIONES - 1);
  const opciones = mezclar([actual, ...otros]);

  contOpciones.innerHTML = "";
  opciones.forEach((cuento) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "opcion";
    boton.textContent = cuento.titulo;
    boton.addEventListener("click", () => elegir(cuento, boton));
    contOpciones.appendChild(boton);
  });
}

function elegir(cuento, boton) {
  if (rondaTerminada) return;

  if (cuento.id === actual.id) {
    acierto(boton);
  } else {
    boton.disabled = true;
    boton.classList.add("mal");
    if (pistasVistas < actual.pistas.length) {
      mensaje.textContent = "¡Casi! Aquí va otra pista 💪";
      mostrarPista();
    } else {
      mensaje.textContent = "¡Casi! Prueba con otra opción 💪";
    }
  }
}

function acierto(boton) {
  rondaTerminada = true;

  // Menos pistas usadas = más estrellas
  const ganadas = actual.pistas.length - pistasVistas + 1;
  puntos += ganadas;
  elPuntos.textContent = "⭐ " + puntos;

  boton.classList.add("bien");
  contOpciones.querySelectorAll("button").forEach((b) => { b.disabled = true; });
  btnPista.disabled = true;
  mensaje.textContent = "¡Correcto! Es “" + actual.titulo + "” (+" + ganadas + (ganadas === 1 ? " estrella)" : " estrellas)");
  btnSiguiente.hidden = false;

  revelarImagen();
  reproducir("victoria", { fundido: false });
}

// La portada se aclara del todo poco a poco
function revelarImagen() {
  if (marcoImagen.classList.contains("sin-imagen")) {
    signo.textContent = actual.titulo;   // todavía no está la imagen: mostramos el título
    return;
  }
  marcoImagen.classList.add("revelada");
}

function mostrarFinal() {
  const maximo = RONDAS * PISTAS_MAX;
  const proporcion = puntos / maximo;

  finalPuntos.textContent = "⭐ " + puntos + " de " + maximo;

  if (proporcion >= 0.8) finalTexto.textContent = "¡Eres un gran detective de cuentos!";
  else if (proporcion >= 0.5) finalTexto.textContent = "¡Muy bien! Conoces muchos cuentos.";
  else finalTexto.textContent = "¡Buen intento! Lee más cuentos y vuelve a jugar.";

  cajaFinal.classList.remove("oculto");
  lluviaDeConfeti();
}

btnPista.addEventListener("click", mostrarPista);
btnSiguiente.addEventListener("click", siguienteRonda);
btnOtra.addEventListener("click", iniciarJuego);

crearBotonSonido();
iniciarJuego();