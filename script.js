
let ramosAprobados = new Set();
const STORAGE_KEY = "malla-aprobados";

function guardarProgreso() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ramosAprobados]));
}

function cargarProgreso() {
  const guardado = localStorage.getItem(STORAGE_KEY);
  if (guardado) {
    ramosAprobados = new Set(JSON.parse(guardado));
  }
}

async function cargarMalla() {
  const params = new URLSearchParams(window.location.search);
  const malla = params.get("m") || "geologia";

  const data = await fetch(`data/data_${malla}.json`).then(r => r.json());
  const colors = await fetch(`data/colors_${malla}.json`).then(r => r.json());

  cargarProgreso();

  const contenedor = document.getElementById("malla-container");
  contenedor.innerHTML = "";

  const ramoMap = new Map(); // guardar cada ramo por su código

  data.forEach((semestre) => {
    const columna = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${semestre.semestre}`;
    columna.appendChild(titulo);

    semestre.ramos.forEach((ramo) => {
      const div = document.createElement("div");
      div.className = "ramo";
      if (ramo.tipo === "E") div.classList.add("electivo");

      div.dataset.codigo = ramo.codigo;
      div.dataset.requisitos = JSON.stringify(ramo.requisitos);

      div.style.backgroundColor = colors[ramo.tipo]?.background || "#fff";
      div.style.borderLeftColor = colors[ramo.tipo]?.border || "#000";

      div.innerHTML = `<strong>${ramo.codigo}</strong><br>${ramo.nombre}<br><small>Requisitos: ${ramo.requisitos.join(", ") || "Ninguno"}</small>`;

      if (ramosAprobados.has(ramo.codigo)) {
        div.classList.add("aprobado");
      }

      div.addEventListener("click", () => {
        if (div.classList.contains("aprobado")) {
          ramosAprobados.delete(ramo.codigo);
          div.classList.remove("aprobado");
        } else {
          ramosAprobados.add(ramo.codigo);
          div.classList.add("aprobado");
        }
        guardarProgreso();
        actualizarDisponibles();
      });

      contenedor.appendChild(div);
      ramoMap.set(ramo.codigo, div);
    });

    contenedor.appendChild(columna);
  });

  function actualizarDisponibles() {
    ramoMap.forEach((div, codigo) => {
      const requisitos = JSON.parse(div.dataset.requisitos);
      const cumplidos = requisitos.every(r => ramosAprobados.has(r));

      if (!div.classList.contains("aprobado")) {
        div.style.opacity = cumplidos ? "1" : "0.4";
        div.style.filter = cumplidos ? "none" : "grayscale(60%)";
      }
    });
  }

  actualizarDisponibles();
}
cargarMalla();
