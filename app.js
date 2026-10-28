// Carga la lista de restaurantes desde data/restaurantes.json y la muestra en la página.
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
      <h2>${escapar(r.nombre)}</h2>
      ${lineas.join("\n      ")}
    </article>`;
}

async function cargarRestaurantes() {
  const lista = document.getElementById("lista");
  try {
    // "no-store" evita que el navegador muestre una versión vieja de los datos
    const resp = await fetch("data/restaurantes.json", { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const restaurantes = await resp.json();

    if (restaurantes.length === 0) {
      lista.textContent = "Aún no hay restaurantes registrados.";
      return;
    }

    lista.innerHTML = restaurantes.map(tarjeta).join("");
  } catch (err) {
    console.error(err);
    lista.textContent = "No se pudieron cargar los restaurantes.";
  }
}

cargarRestaurantes();
