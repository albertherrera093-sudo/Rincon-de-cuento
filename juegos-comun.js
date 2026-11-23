// ---------- Funciones compartidas por los juegos ----------
function mezclar(lista) {
    const copia = lista.slice();
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }
  
  function lluviaDeConfeti() {
    const signos = ["⭐"];
    for (let i = 0; i < 50; i++) {
      const c = document.createElement("span");
      c.className = "confeti";
      c.textContent = signos[Math.floor(Math.random() * signos.length)];
      c.style.left = Math.random() * 100 + "vw";
      c.style.fontSize = 18 + Math.random() * 22 + "px";
      c.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
      c.style.animationDelay = Math.random() + "s";
      c.addEventListener("animationend", () => c.remove());
      document.body.appendChild(c);
    }
  }
  
  // ---------- Cuentos de los juegos ----------
  // "id" debe ser el mismo que en script.js. "pistas": de la más difícil a la más fácil.
  const CUENTOS_JUEGOS = [
    { id: "caperucita", categoria: "clasicos", titulo: "Caperucita Roja", imagen: "imagenes/caperucitaroja.png", pistas: [
      "Una niña lleva una cesta con comida para su abuelita enferma.",
      "En el bosque se encuentra con un animal astuto que le hace preguntas.",
      "Su capa es de un color muy brillante y el lobo se disfraza de abuelita." ] },
    { id: "cerditos", categoria: "clasicos", titulo: "Los Tres Cerditos", imagen: "imagenes/tres-cerditos.jfif", pistas: [
      "Tres hermanos deciden construir su propia casa.",
      "Los materiales son paja, madera y ladrillos.",
      "Un lobo sopla y sopla para derribarlas." ] },
    { id: "patito-feo", categoria: "clasicos", titulo: "El Patito Feo", imagen: "imagenes/patitofeo.jfif", pistas: [
      "Un animalito nace distinto a sus hermanos y todos se burlan de él.",
      "Se va de la granja y pasa un invierno muy duro.",
      "Al final se mira en el agua y descubre que se ha convertido en un hermoso cisne." ] },
    { id: "pinocho", categoria: "clasicos", titulo: "Pinocho", imagen: "imagenes/pinocho.jfif", pistas: [
      "Un carpintero talla un muñeco y desea que sea un niño de verdad.",
      "Cuando dice mentiras le pasa algo muy raro en la nariz.",
      "Un grillo es su conciencia y una ballena se traga a su papá." ] },
    { id: "cenicienta", categoria: "clasicos", titulo: "Cenicienta", imagen: "imagenes/cenicienta.jfif", pistas: [
      "Una joven bondadosa vive con su madrastra y sus hermanastras.",
      "Un hada convierte una calabaza en carruaje para que vaya al baile.",
      "A medianoche pierde un zapato de cristal al salir corriendo." ] },
    { id: "blancanieves", categoria: "clasicos", titulo: "Blancanieves", imagen: "imagenes/blancanieves.jfif", pistas: [
      "Una reina vanidosa le pregunta todos los días a su espejo mágico.",
      "Una princesa encuentra una casita con siete camas pequeñas.",
      "Prueba una manzana envenenada y la rodean siete enanitos." ] },
    { id: "hansel-gretel", categoria: "clasicos", titulo: "Hansel y Gretel", imagen: "imagenes/hansel-gretel.jfif", pistas: [
      "Dos hermanos se pierden en el bosque.",
      "Dejan piedritas y migas de pan para encontrar el camino.",
      "Encuentran una casa hecha de dulces donde vive una bruja." ] },
    { id: "ricitos-de-oro", categoria: "clasicos", titulo: "Ricitos de Oro", imagen: "imagenes/ricitos-de-oro.jfif", pistas: [
      "Una niña entra sin permiso en una casa del bosque.",
      "Prueba tres tazones de avena, tres sillas y tres camas.",
      "Una familia de osos la encuentra durmiendo en la cama más pequeña." ] },
    { id: "sirenita", categoria: "clasicos", titulo: "La Sirenita", imagen: "imagenes/sirenita.jfif", pistas: [
      "Una joven del mar sueña con conocer el mundo de arriba.",
      "Cambia su voz por un par de piernas.",
      "Tiene cola de pez y se enamora de un príncipe." ] },
    { id: "principito", categoria: "clasicos", titulo: "El Principito", imagen: "imagenes/principito.jfif", pistas: [
      "Un aviador se queda varado en el desierto y conoce a un niño muy especial.",
      "Viene de un planeta diminuto donde cuida de una rosa.",
      "Un zorro le enseña que lo esencial es invisible a los ojos." ] },
    { id: "traje-emperador", categoria: "clasicos", titulo: "El Traje Nuevo del Emperador", imagen: "imagenes/traje-emperador.jfif", pistas: [
      "Un gobernante gasta todo su dinero en ropa elegante.",
      "Dos tramposos le venden una tela que, dicen, solo ven los inteligentes.",
      "Un niño grita que el emperador no lleva nada puesto." ] },
    { id: "soldadito-plomo", categoria: "clasicos", titulo: "El Soldadito de Plomo", imagen: "imagenes/soldadito-plomo.jfif", pistas: [
      "Un juguete tiene una sola pierna, pero es muy valiente.",
      "Se enamora de una bailarina de papel.",
      "Viaja en un barquito de papel y se lo traga un pez." ] },
    { id: "bella-bestia", categoria: "clasicos", titulo: "La Bella y la Bestia", imagen: "imagenes/bella-bestia.jfif", pistas: [
      "Una joven cambia su libertad para salvar a su papá.",
      "Un castillo misterioso esconde a una criatura de aspecto aterrador pero de buen corazón.",
      "Una rosa roja y un hechizo que solo se rompe con amor verdadero." ] },
    { id: "gato-con-botas", categoria: "clasicos", titulo: "El Gato con Botas", imagen: "imagenes/gato-con-botas.jfif", pistas: [
      "Un muchacho hereda solo un animal, pero resulta ser muy ingenioso.",
      "Su dueño es presentado ante el Rey como el Marqués de Carabás.",
      "Engaña a un ogro para que se convierta en ratón." ] },
    { id: "pedro-lobo", categoria: "clasicos", titulo: "Pedro y el Lobo", imagen: "imagenes/pedro-lobo.jfif", pistas: [
      "Un niño valiente vive junto a un bosque con su abuelo.",
      "Sus amigos son un pajarito y un pato.",
      "Atrapa a un lobo con una cuerda desde lo alto de un árbol." ] },
    { id: "pez-arcoiris", categoria: "emociones", titulo: "El Pez Arcoíris", imagen: "imagenes/pez-arcoiris.jpeg", pistas: [
      "El animal más hermoso del océano se siente muy solo.",
      "Un pulpo sabio le da un consejo sobre sus escamas.",
      "Aprende que compartir sus escamas brillantes le da amigos." ] },
    { id: "cuatro-esquinitas", categoria: "emociones", titulo: "Por cuatro esquinitas de nada", imagen: "imagenes/cuatro-esquinitas.jpeg", pistas: [
      "Un personaje no puede entrar a una casa porque la puerta no tiene su forma.",
      "Sus amigos redonditos intentan ayudarlo.",
      "Al final recortan las esquinas de la puerta para que quepa Cuadradito." ] },
    { id: "el-punto", categoria: "emociones", titulo: "El punto", imagen: "imagenes/el-punto.jfif", pistas: [
      "Una niña dice que no sabe dibujar y deja su hoja en blanco.",
      "Su profesora le pide que haga una marca y que la firme.",
      "Descubre que un simple punto puede convertirse en arte." ] },
    { id: "cazo-de-lorenzo", categoria: "emociones", titulo: "El cazo de Lorenzo", imagen: "imagenes/caso-de-lorenzo.jfif", pistas: [
      "Un niño debe cargar siempre con algo que le complica la vida.",
      "Al principio se enoja y quiere esconderse del mundo.",
      "Una persona sabia le enseña a convivir con su cazo rojo." ] },
    { id: "orejas-de-mariposa", categoria: "emociones", titulo: "Orejas de Mariposa", imagen: "imagenes/orejas-de-mariposa.jfif", pistas: [
      "Una niña responde con imaginación cuando se burlan de ella.",
      "Dice que no tiene las orejas grandes.",
      "Sus orejas son de mariposa, ¡y revolotean!" ] },
    { id: "monstruo-rosa", categoria: "emociones", titulo: "Monstruo Rosa", imagen: "imagenes/monstruo-rosa.jfif", pistas: [
      "En un país todo es blanco y todos son iguales.",
      "Un monstruo de otro color hace ruido y no cabe por las puertas.",
      "Emprende un viaje y encuentra amigos tan diferentes como él." ] },
    { id: "sabe-la-luna", categoria: "emociones", titulo: "¿A qué sabe la luna?", imagen: "imagenes/sabe-la-luna.jfif", pistas: [
      "Todos los animales quieren probar algo que está muy lejos en el cielo.",
      "Se suben unos encima de otros formando una torre.",
      "El ratoncito de arriba muerde un pedacito de luna." ] },
    { id: "hilo-invisible", categoria: "emociones", titulo: "El hilo invisible", imagen: "imagenes/hilo-invisible.jfif", pistas: [
      "Una noche de tormenta, una niña va corriendo a la habitación de su mamá.",
      "Su mamá le cuenta un secreto sobre las personas que se quieren.",
      "Un hilo que nunca se rompe une a quienes se aman, aunque estén lejos." ] },
    { id: "tengo-un-volcan", categoria: "emociones", titulo: "Tengo un volcán", imagen: "imagenes/tengo-un-volcan.jfif", pistas: [
      "Una niña siente un calor que sube desde la tripa cuando se enfada.",
      "Sus papás le enseñan trucos para calmarse.",
      "Respirar hondo apaga el volcán de la rabia." ] },
    { id: "ruby-preocupacion", categoria: "emociones", titulo: "Ruby tiene una preocupación", imagen: "imagenes/ruby-preocupacion.jfif", pistas: [
      "Una niña feliz encuentra algo gris que crece y crece.",
      "Se siente sola con su problema y no se lo cuenta a nadie.",
      "Al hablar con otro niño en el parque, su preocupación se hace pequeña." ] },
    { id: "cosas-que-me-gustan", categoria: "emociones", titulo: "Cosas que me gustan de mí", imagen: "imagenes/cosas-que-me-gustan.jfif", pistas: [
      "Una niña juega a descubrir lo que le gusta de sí misma.",
      "Le gustan sus manos, sus piernas, sus orejas y su voz.",
      "También le gustan su corazón, su imaginación y su sonrisa." ] },
    { id: "todos-extraordinarios", categoria: "emociones", titulo: "Todos somos extraordinarios", imagen: "imagenes/todos-extraordinarios.jfif", pistas: [
      "Un niño se esconde dentro de un casco de astronauta.",
      "Su cara es distinta y la gente lo mira de más.",
      "Aprende a salir con una sonrisa y a ver que todos somos especiales." ] },
    { id: "arbol-de-los-recuerdos", categoria: "emociones", titulo: "El árbol de los recuerdos", imagen: "imagenes/arbol-de-los-recuerdos.jfif", pistas: [
      "Un animal muy querido del bosque se va para siempre.",
      "Sus amigos se reúnen tristes para recordarlo.",
      "De la tierra crece un árbol donde viven sus recuerdos." ] },
    { id: "adivina-cuanto-te-quiero", categoria: "emociones", titulo: "Adivina cuánto te quiero", imagen: "imagenes/adivina-cuanto-te-quiero.jfif", pistas: [
      "Dos animalitos se preparan para dormir.",
      "Se miden el cariño abriendo los brazos y saltando muy alto.",
      "Se quieren tanto que el cariño llega hasta la luna." ] }
  ];