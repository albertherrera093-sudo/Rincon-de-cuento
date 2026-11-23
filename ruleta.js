const NUM_SEGMENTOS = 10;   // cuentos que aparecen en la ruleta
const TAU = Math.PI * 2;
const TAM = 560;
const COLORES = ["#ffb3d1", "#a8dcf7", "#ffd1e3", "#bfe6fb", "#ff9ec7", "#8fd0f3"];

const lienzo = document.getElementById("ruleta");
const ctx = lienzo.getContext("2d");
lienzo.width = TAM;
lienzo.height = TAM;

const selectCategoria = document.getElementById("categoria");
const btnMezclar = document.getElementById("btn-mezclar");
const btnGirar = document.getElementById("btn-girar");
const btnOtra = document.getElementById("btn-otra");
const resultado = document.getElementById("resultado");
const resImagen = document.getElementById("res-imagen");
const resTitulo = document.getElementById("res-titulo");
const resLeer = document.getElementById("res-leer");

let segmentos = [];
let angulo = 0;
let girando = false;

function recortar(texto) {
  return texto.length > 20 ? texto.slice(0, 19) + "…" : texto;
}

function dibujar(resaltado = -1) {
  ctx.clearRect(0, 0, TAM, TAM);
  const c = TAM / 2;
  const r = c - 10;
  const n = segmentos.length;
  const arco = TAU / n;

  segmentos.forEach((cuento, i) => {
    const a0 = -Math.PI / 2 + angulo + i * arco;
    const a1 = a0 + arco;

    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, a0, a1);
    ctx.closePath();
    ctx.fillStyle = i === resaltado ? "#fff3b0" : COLORES[i % COLORES.length];
    ctx.fill();
    ctx.lineWidth = i === resaltado ? 6 : 3;
    ctx.strokeStyle = i === resaltado ? "#ffc93c" : "#fff";
    ctx.stroke();

    // Nombre del cuento
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(a0 + arco / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#4a2f43";
    ctx.font = "bold 17px Quicksand, sans-serif";
    ctx.fillText(recortar(cuento.titulo), r - 18, 0);
    ctx.restore();
  });

  // Centro
  ctx.beginPath();
  ctx.arc(c, c, 38, 0, TAU);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ff7eb3";
  ctx.stroke();
  ctx.font = "30px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("📖", c, c + 2);
}

function elegirSegmentos() {
  const categoria = selectCategoria.value;
  const base = CUENTOS_JUEGOS.filter((c) => categoria === "todos" || c.categoria === categoria);
  segmentos = mezclar(base).slice(0, NUM_SEGMENTOS);
  angulo = 0;
  resultado.hidden = true;
  dibujar();
}

function girar() {
  if (girando) return;
  girando = true;
  btnGirar.disabled = true;
  btnMezclar.disabled = true;
  selectCategoria.disabled = true;
  resultado.hidden = true;

  const inicio = angulo;
  const destino = angulo + (5 + Math.floor(Math.random() * 3)) * TAU + Math.random() * TAU;
  const duracion = 5000 + Math.random() * 1500;
  const t0 = performance.now();

  const paso = (t) => {
    const p = Math.min(1, (t - t0) / duracion);
    const suave = 1 - Math.pow(1 - p, 4);   // empieza rápido y frena poco a poco
    angulo = inicio + (destino - inicio) * suave;
    dibujar();

    if (p < 1) requestAnimationFrame(paso);
    else terminarGiro();
  };

  requestAnimationFrame(paso);
}

function terminarGiro() {
  // El puntero está arriba: se busca qué cuento quedó ahí
  const posicion = (((-angulo) % TAU) + TAU) % TAU;
  const indice = Math.floor(posicion / (TAU / segmentos.length));
  const cuento = segmentos[indice];

  dibujar(indice);
  girando = false;
  btnGirar.disabled = false;
  btnMezclar.disabled = false;
  selectCategoria.disabled = false;

  mostrarResultado(cuento);
  reproducir("victoria", { fundido: false });
  lluviaDeConfeti();
}

function mostrarResultado(cuento) {
  resTitulo.textContent = cuento.titulo;
  resLeer.href = "index.html?cuento=" + encodeURIComponent(cuento.id);

  resImagen.hidden = false;
  resImagen.onerror = () => { resImagen.hidden = true; };
  resImagen.alt = "Portada de " + cuento.titulo;
  resImagen.src = cuento.imagen;

  resultado.hidden = false;
  resultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

btnGirar.addEventListener("click", girar);
btnOtra.addEventListener("click", girar);
btnMezclar.addEventListener("click", () => { if (!girando) elegirSegmentos(); });
selectCategoria.addEventListener("change", elegirSegmentos);

crearBotonSonido();
elegirSegmentos();
if (document.fonts) document.fonts.ready.then(() => dibujar());