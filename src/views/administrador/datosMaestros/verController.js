/**
 * Controlador de Menú Principal: Datos Maestros (verController.js)
 * Maneja la navegación y renderizado visual del contenedor principal.
 * Escucha los clics en las diferentes tarjetas ("cards") y redirige
 * a la vista específica del catálogo seleccionado (ej. Seccionales, Sectores).
 */
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { alertas as alerta } from "@/helpers/index.js";
// Importación explícita desde index.js del directorio para asegurar la resolución de rutas en Vite.
import { api } from "@/helpers/index.js";

export default async () => {

  const botonBack = document.getElementById("botonBack");

  if (window.procesoPeticion === undefined) {
    window.procesoPeticion = false;
  }
  window.procesoPeticion = false;

  botonBack.onclick = async () => {
    if (window.procesoPeticion) return;
    location.href = `#/administrador/`;
  };

  window.addEventListener("click", (e) => {

    if (e.target.closest("#sectionals")) {
      window.location.href = "#/administrador/datos_maestros/seccionales";
    }

    if (e.target.closest("#organizations")) {
      window.location.href = "#/administrador/datos_maestros/organizaciones";
    }

    if (e.target.closest("#document_types")) {
      window.location.href = "#/administrador/datos_maestros/tipos_documento";
    }

    if (e.target.closest("#housing_qualities")) {
      window.location.href = "#/administrador/datos_maestros/calidades_vivienda";
    }

    if (e.target.closest("#sectors")) {
      window.location.href = "#/administrador/datos_maestros/sectores";
    }

    if (e.target.closest("#vulnerable_questions")) {
      window.location.href = "#/administrador/datos_maestros/preguntas_vulnerabilidad";
    }

    if (e.target.closest("#nationalities")) {
      window.location.href = "#/administrador/datos_maestros/nacionalidades";
    }

    if (e.target.closest("#threat_types")) {
      window.location.href = "#/administrador/datos_maestros/tipos_amenaza";
    }

    if (e.target.closest("#species")) {
      window.location.href = "#/administrador/datos_maestros/especies";
    }

    if (e.target.closest("#resources")) {
      window.location.href = "#/administrador/datos_maestros/recursos";
    }

    if (e.target.closest("#cities")) {
      window.location.href = "#/administrador/datos_maestros/ciudades";
    }

    if (e.target.closest("#departments")) {
      window.location.href = "#/administrador/datos_maestros/departamentos";
    }

    if(e.target.closest("#vulnerabilities")) {
      window.location.href = "#/administrador/datos_maestros/vulnerabilidades";
    }

  });

};
