import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api"

export default async() => {
  const botonBack = document.getElementById("boton-back");
  if (window.procesoPeticion === undefined) {
  window.procesoPeticion = false;
  }
  window.procesoPeticion = false;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/administrador-home`;
  };

  window.addEventListener("click", (e) => {
    const boton = e.target.closest("#sectionals");
    if (boton) {
      window.location.href = "#/administrador-datosMaestros/seccional";
    }
  });
}