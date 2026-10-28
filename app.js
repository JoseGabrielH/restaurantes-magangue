// Carga las categorías y sus restaurantes desde data/restaurantes.json y los muestra.
// Para agregar o editar restaurantes, solo modifica ese archivo JSON.

document.getElementById("anio").textContent = new Date().getFullYear();

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

// Arma la tarjeta de un restaurante. Los campos vacíos simplemente no se muestran.
function tarjeta(r) {
  const lineas = [];
  if (r.tipo) lineas.push(`<p class="tipo">${escapar(r.tipo)}</p>`);
  if (r.direccion) lineas.push(`<p>📍 ${escapar(r.direccion)}</p>`);
  if (r.telefono) {
    const tel = r.telefono.replace(/\D/g, "");
    lineas.push(`<p>📞 <a href="tel:+57${tel}">${escapar(r.telefono)}</a></p>`);
  }
  if (r.horario) lineas.push(`<p>🕒 ${escapar(r.horario)}</p>`);

  const enlaces = [];
  if (r.instagram) {
    const usuario = encodeURIComponent(r.instagram.replace(/^@/, ""));
    enlaces.push(`<a href="https://www.instagram.com/${usuario}/" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (r.web && /^https?:\/\//.test(r.web)) {
    enlaces.push(`<a href="${escapar(r.web)}" target="_blank" rel="noopener">Ver menú</a>`);
  }
  if (enlaces.length) lineas.push(`<p class="enlaces">${enlaces.join(" · ")}</p>`);

  return `
    <article class="tarjeta">
      <h3>${escapar(r.nombre)}</h3>
      ${lineas.join("\n      ")}
    </article>`;
}

// Arma una sección completa (título + restaurantes, o "se añaden pronto" si está vacía).
function seccion(c) {
  const restaurantes = c.restaurantes || [];
  const cuerpo = restaurantes.length
    ? `<div class="lista">${restaurantes.map(tarjeta).join("")}</div>`
    : `<p class="pronto">Se añaden pronto.</p>`;

  return `
    <section id="${escapar(c.id)}" class="seccion">
      <h2>${escapar(c.icono)} ${escapar(c.nombre)}</h2>
      ${c.descripcion ? `<p class="descripcion">${escapar(c.descripcion)}</p>` : ""}
      ${cuerpo}
    </section>`;
}

// Botón del menú de categorías (enlace a la sección correspondiente).
function boton(c) {
  const total = (c.restaurantes || []).length;
  return `<a href="#${escapar(c.id)}" data-id="${escapar(c.id)}">${escapar(c.icono)} ${escapar(c.nombre)} <span class="contador">${total}</span></a>`;
}

// Navegación por categorías:
// - Al tocar un botón, la página baja a esa sección y ese botón queda marcado.
// - Al desplazarse manualmente, se marca la categoría que está debajo de la barra.
function activarNavegacion() {
  const nav = document.getElementById("categorias");
  const enlaces = [...nav.querySelectorAll("a")];
  const secciones = [...document.querySelectorAll(".seccion")];
  let bloqueado = false; // mientras la página se desplaza por un clic, no recalcular
  let temporizador;

  const marcar = (id) => {
    enlaces.forEach((a) => {
      const activo = a.dataset.id === id;
      a.classList.toggle("activo", activo);
      if (activo) {
        // Desliza solo la barra de categorías (en celular) para que el botón activo quede visible
        const izq = a.offsetLeft; // la barra es "sticky", así que offsetLeft ya es relativo a ella
        if (izq < nav.scrollLeft || izq + a.offsetWidth > nav.scrollLeft + nav.clientWidth) {
          nav.scrollLeft = izq - 16;
        }
      }
    });
  };

  const irA = (id, suave) => {
    const destino = document.getElementById(id);
    if (!destino) return;
    marcar(id);
    bloqueado = true;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { bloqueado = false; }, 1500); // respaldo si no existe "scrollend"
    const y = destino.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    window.scrollTo({ top: y, behavior: suave ? "smooth" : "auto" });
    history.replaceState(null, "", "#" + id);
  };

  enlaces.forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      irA(a.dataset.id, true);
    })
  );

  // Categoría visible = la última sección cuyo título ya pasó por debajo de la barra
  const actualizar = () => {
    if (bloqueado) return;
    const limite = nav.offsetHeight + 10;
    let actual = secciones[0];
    for (const s of secciones) {
      if (s.getBoundingClientRect().top <= limite) actual = s;
    }
    if (actual) marcar(actual.id);
  };
  window.addEventListener("scroll", actualizar, { passive: true });
  // Al terminar el desplazamiento de un clic, se libera el bloqueo
  window.addEventListener("scrollend", () => { bloqueado = false; });

  // Si se entra con un enlace directo (ej. .../#comida-tipica), ir a esa sección
  const inicial = decodeURIComponent(location.hash.slice(1));
  if (inicial && document.getElementById(inicial)) irA(inicial, false);
  else actualizar();
}

async function cargar() {
  const contenido = document.getElementById("contenido");
  try {
    // "no-store" evita que el navegador muestre una versión vieja de los datos
    const resp = await fetch("data/restaurantes.json", { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const categorias = await resp.json();

    document.getElementById("categorias").innerHTML = categorias.map(boton).join("");
    contenido.innerHTML = categorias.map(seccion).join("");
    activarNavegacion();
  } catch (err) {
    console.error(err);
    contenido.textContent = "No se pudieron cargar los restaurantes.";
  }
}

cargar();
