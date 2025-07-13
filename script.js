
async function cargarMalla() {
  const params = new URLSearchParams(window.location.search);
  const malla = params.get("m") || "geologia";

  const data = await fetch(`data/data_${malla}.json`).then(r => r.json());
  const colors = await fetch(`data/colors_${malla}.json`).then(r => r.json());

  const contenedor = document.getElementById("malla-container");
  contenedor.innerHTML = "";

  data.forEach((semestre) => {
    const columna = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${semestre.semestre}`;
    columna.appendChild(titulo);

    semestre.ramos.forEach((ramo) => {
      const div = document.createElement("div");
      div.className = "ramo";
      if (ramo.tipo === "E") div.classList.add("electivo");

      div.style.backgroundColor = colors[ramo.tipo]?.background || "#fff";
      div.style.borderLeftColor = colors[ramo.tipo]?.border || "#000";

      div.innerHTML = `<strong>${ramo.codigo}</strong><br>${ramo.nombre}<br><small>Requisitos: ${ramo.requisitos.join(", ") || "Ninguno"}</small>`;
      columna.appendChild(div);
    });

    contenedor.appendChild(columna);
  });
}

cargarMalla();
