/**
 * Controlador: Menu Central Hub Navegador de un Plan Específico (menuController.js)
 * La Estructura "Araña" del sistema: Desde aquí el voluntario salta a rellenar:
 * Datos Básicos, Integrantes, Mascotas, Riesgos, etc. 
 * También gestiona el Envio Final a Supervisores (Cambio de Estado).
 */
import * as api from "../../../../helpers/api";
import * as alerta from "../../../../helpers/alertas";
import AccesoPlan from "../../../../helpers/accesoPlan"; // Security Guard Midleware Role Front

export default async () => {
  // Selectores DOM de la Cuadrícula HTML de Módulos (Iconos grandes)
  const botonBack = document.getElementById("botonBack");
  const nombreFamilia = document.querySelector(".informacion__nombreFamiliar");
  const datosPrincipales = document.getElementById("datosPrincipales");
  const integrante = document.getElementById("integrantes");
  const mascotas = document.getElementById("mascotas");
  const factoresRiesgo = document.getElementById("factoresRiesgo");
  const recursosDisponibles = document.getElementById("recursosDisponibles");
  const graficosVivienda = document.getElementById("graficosVivienda");
  const planAccion = document.getElementById("planAccion");
  const graficoEntorno = document.getElementById("graficoEntorno");

  // Nodos UI Actioners Finales
  const comentarios = document.getElementById("comentarios"); // Badge Peligro Si hubo un rechazo ("Lee por qué lo devolvieron")
  const botonEnviar = document.getElementById("enviar"); // Submit Todo el dossier al Jefe
  const verPDF = document.getElementById("verPDF"); // Export Maker

  const id = location.hash.split("=")[1]; // Family ID Current Focus
  
  // Guardián Frontend: ¿El usuario que intenta entrar por URL es el dueño de este plan? ¿Tiene el estado correcto para modificarlo? Si no, lo patea.
  await AccesoPlan(id); 

  // Fetch Cabecera Datos Básicos Flia 
  const planFamiliar = await api.get(`familyPlans/${id}`);

  // Inyección Custom Title en Top Bar UI (Ej: Familia "Perez Rodriguez")
  nombreFamilia.textContent += ` ${planFamiliar.last_names}`;

  // Definir si existen miembros de la familia para realizar acciones en el menu -------------------------------------------------------------------------------...
  const tieneMiembros = await api.get(`familyPlans/${id}/has-members`);
  console.log(tieneMiembros);
  

  // Router Volver al Muro General
  botonBack.onclick = () => {
    location.href = `#/voluntario/plan_familiar`;
  };

  /**
   * SECCIÓN ENRUTADORES SUB-MÓDULOS (Branching Routes)
   * Asignan el HASH URL appending the Current Family Plan ID as argument passing.
   */
  datosPrincipales.addEventListener("click", async () => {
    location.href = `#/voluntario/plan_familiar/datos?id=${id}`;
  });

  integrante.addEventListener("click", async () => {
    location.href = `#/voluntario/plan_familiar/integrantes?id=${id}`;
  });

  mascotas.addEventListener("click", async () => {
    location.href = `#/voluntario/plan_familiar/mascotas?id=${id}`;
  });

  factoresRiesgo.addEventListener("click", async () => {
    
    if(!tieneMiembros.has_members){
      // console.log("No tiene miembros");
      alerta.alertaWarning(`El Plan de la Familia ${planFamiliar.last_names} no posee ningun integrante`);
      return;
    }

    location.href = `#/voluntario/plan_familiar/factores_de_riesgo?id=${id}`;
  });

  recursosDisponibles.addEventListener("click", async () => {
    location.href = `#/voluntario/plan_familiar/recursos?id=${id}`;
  });

  graficoEntorno.addEventListener("click", async () => {
    location.href = `#/voluntario/plan_familiar/grafico_del_entorno/editar?id=${id}`;
  });

  graficosVivienda.addEventListener("click", async () => {
    location.href = `#/voluntario/plan_familiar/grafico_vivienda?id=${id}`;
  });

  planAccion.addEventListener("click", async () => {
    location.href = `#/voluntario/plan_familiar/plan_de_accion/antes?id=${id}`;
  });

  // BOTÓN MAESTRO: Entregar Trabajo (Cambio Flujo Vida Útil Status Id)
  botonEnviar.addEventListener("click", async () => {
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que ya deseas enviar tu plan familiar?",
    );
    if (confirmacion.isConfirmed) {
      try {
        // Envio Endpoint Workflow. 
        // 4 -> 'Enviado a Revisión (Ficha Completa)'. El supervisor ahora lo verá en su bandeja y al autor se le bloquea la app en modo Read-only a nivel backend.
        const data = await api.patch(`familyPlans/status/${id}`, {
          status_plan_id: 4, 
        });
        if (data.success) {
          await alerta.alertaOK(data.message);
          window.location.href = `#/voluntario-verPlanFamiliar`; // Lo echa pa fuera 
        } else alerta.alertaWarning(data.message, data.errors); // Si intentó mandarlo sin completar algun modulo OBLIGATORIO backend lo frena aquí
      } catch (error) {
        alerta.alertaError(error.errors);
      }
    }
  });

  // Accion Boton Exportar Visor PDF (Axios Request Arraybuffer Helper Native Window open)
  verPDF.addEventListener("click", () => {
    // Abre el PDF en otra pestaña usando un helper API modificado para files/blobs Mime Types PDF Headers Stream Support 
    api.getPdf(`familyPlans/pdf/${id}`, `plan_${id}.pdf`);
  });

  /**
   * LÓGICA DE FEEDBACK UX DE RECHAZO
   * Si el Backend me mandó de vuelta la propiedad 'comentary' poblada 
   * significa que el supervisor me devolvió la tarea con notas rojas.
   */
  if (planFamiliar.comentary) comentarios.classList.remove("invisible"); // Desenmascara la campana roja
  
  // Al pulsar la campana, Lanza el Sweet Alert Explicativo con el texto largo del Jefe
  comentarios.addEventListener("click", async () => {
    const htmlModal = `
        <div class="explicacion modal">
          <p class="explicacion__titulo">Rechazado con solicitud de cambios</p>
          <p class="explicacion__subtitulo">Este plan familiar fue rechazado con solicitud de cambios y en el siguiente texto se especifica cuales fueron esos errores</p>
        </div>
        <div class="explicacion_subtitulo">${planFamiliar.comentary}</div>`; // Inyección String Raw DB text Response
    alerta.Ver(htmlModal, false, false, null, null); // Render Pure Html Raw 
  });
};
