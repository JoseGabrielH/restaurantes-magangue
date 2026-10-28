// Carga la lista de restaurantes desde data/restaurantes.json y la muestra en la página.
// Para agregar o editar restaurantes, solo modifica ese archivo JSON.

document.getElementById("anio").textContent = new Date().getFullYear();

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
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

    lista.innerHTML = restaurantes
      .map(
        (r) => `
        <article class="tarjeta">
          <h2>${escapar(r.nombre)}</h2>
          <p class="tipo">${escapar(r.tipo)}</p>
          <p>📍 ${escapar(r.direccion)}</p>
          <p>📞 ${escapar(r.telefono)}</p>
          <p>🕒 ${escapar(r.horario)}</p>
        </article>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    lista.textContent = "No se pudieron cargar los restaurantes.";
  }
}

cargarRestaurantes();
