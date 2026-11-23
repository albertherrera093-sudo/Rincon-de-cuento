// ---------- Sonidos y música ----------
// Guarda tus audios en la carpeta "musica". Si se llaman distinto, cambia solo las rutas.
// volumen: de 0 a 1 | bucle: true = se repite sin parar
const SONIDOS = {
    menu:     { ruta: "musica/menu.mp3",     volumen: 0.25, bucle: true  },   // menú principal
    libro:    { ruta: "musica/menu.mp3",  volumen: 0.18, bucle: true  },   // dentro del libro (opcional)
    carrera:  { ruta: "musica/carrera.mp3",  volumen: 0.5,  bucle: false },   // al empezar la carrera de gatitos
    victoria: { ruta: "musica/victoria.mp3", volumen: 0.7,  bucle: false }    // al ganar o calificar
  };
  
  const CLAVE_SONIDO = "rincon-sonido";
  const audios = {};
  const fundidos = {};
  const deseados = new Set();   // sonidos en bucle que deberían estar sonando
  let sonidoActivado = leerPreferenciaSonido();
  
  function leerPreferenciaSonido() {
    try { return localStorage.getItem(CLAVE_SONIDO) !== "no"; } catch (e) { return true; }
  }
  
  function guardarPreferenciaSonido(valor) {
    try { localStorage.setItem(CLAVE_SONIDO, valor ? "si" : "no"); } catch (e) {}
  }
  
  function obtenerAudio(nombre) {
    if (!audios[nombre]) {
      const config = SONIDOS[nombre];
      const audio = new Audio(config.ruta);
      audio.loop = config.bucle;
      audio.preload = "auto";
      audios[nombre] = audio;
    }
    return audios[nombre];
  }
  
  // Sube o baja el volumen poco a poco
  function fundir(nombre, destino, alTerminar) {
    const audio = obtenerAudio(nombre);
    clearInterval(fundidos[nombre]);
    fundidos[nombre] = setInterval(() => {
      const diferencia = destino - audio.volume;
      if (Math.abs(diferencia) < 0.021) {
        audio.volume = destino;
        clearInterval(fundidos[nombre]);
        if (alTerminar) alTerminar();
        return;
      }
      audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(diferencia) * 0.02));
    }, 50);
  }
  
  // reproducir("victoria", { fundido: false }) suena de inmediato, sin entrada suave
  function reproducir(nombre, opciones = {}) {
    const config = SONIDOS[nombre];
    if (!config) return;
    if (config.bucle) deseados.add(nombre);
    if (!sonidoActivado) return;
  
    const audio = obtenerAudio(nombre);
    const conFundido = opciones.fundido !== false;
    clearInterval(fundidos[nombre]);
  
    // Si ya está sonando, solo ajustamos el volumen
    if (config.bucle && !audio.paused) {
      fundir(nombre, config.volumen);
      return;
    }
  
    if (!config.bucle) audio.currentTime = 0;
    audio.volume = conFundido ? 0 : config.volumen;
  
    const promesa = audio.play();
    if (promesa) {
      promesa
        .then(() => { if (conFundido) fundir(nombre, config.volumen); })
        .catch(() => {});   // si el navegador lo bloquea, se reintenta con el primer toque
    }
  }
  
  function detener(nombre, conFundido = true) {
    deseados.delete(nombre);
    const audio = audios[nombre];
    if (!audio) return;
  
    if (!conFundido) {
      clearInterval(fundidos[nombre]);
      audio.pause();
      return;
    }
    fundir(nombre, 0, () => audio.pause());
  }
  
  function sonidoEstaActivo() {
    return sonidoActivado;
  }
  
  function alternarSonido() {
    sonidoActivado = !sonidoActivado;
    guardarPreferenciaSonido(sonidoActivado);
  
    if (sonidoActivado) {
      Array.from(deseados).forEach((nombre) => reproducir(nombre));
    } else {
      Object.keys(audios).forEach((nombre) => {
        clearInterval(fundidos[nombre]);
        audios[nombre].pause();
      });
    }
  
    actualizarBotonesSonido();
    return sonidoActivado;
  }
  
  // Botón flotante para activar o quitar el sonido
  function crearBotonSonido() {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-sonido";
    boton.addEventListener("click", () => alternarSonido());
    document.body.appendChild(boton);
    actualizarBotonesSonido();
  }
  
  function actualizarBotonesSonido() {
    document.querySelectorAll(".boton-sonido").forEach((boton) => {
      boton.textContent = sonidoActivado ? "🎵" : "🔕";
      boton.setAttribute("aria-label", sonidoActivado ? "Quitar el sonido" : "Poner el sonido");
    });
  }
  
  // Los navegadores no dejan sonar nada hasta que la persona toca la pantalla.
  // Con el primer toque se reintenta lo que debería estar sonando.
  function reintentarSonidos() {
    if (!sonidoActivado) return;
    deseados.forEach((nombre) => {
      const audio = audios[nombre];
      if (!audio || audio.paused) reproducir(nombre);
    });
  }
  
  ["pointerdown", "keydown", "touchstart"].forEach((evento) => {
    document.addEventListener(evento, reintentarSonidos, { passive: true });
  });
  
  // Al cambiar de pestaña, el sonido se pausa
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      Object.values(audios).forEach((audio) => audio.pause());
    } else {
      reintentarSonidos();
    }
  });