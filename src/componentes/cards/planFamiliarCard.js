
export const cardPlanFamiliar = (planFamiliar) => {

    const div = document.createElement("div");
    div.classList.add("verPlan", "tarjeta");

  // Lógica de Semáforo UI basado en el Código de Estado (Status_id) del Flujo de Aprobación
  // 3: Enviado a Revisión (Azul)
  // 4, 7: Aprobados / Certificados (Verde)
  // 5, 6: Rechazos temporales o definitivos (Rojo)
    const estadoClase =
    planFamiliar.status_id == 3
        ? "verPlan__estado--azul"
        : planFamiliar.status_id == 4 || planFamiliar.status_id == 7
        ? "verPlan__estado--verde"
        : planFamiliar.status_id == 5 || planFamiliar.status_id == 6
        ? "verPlan__estado--rojo"
          : ""; // Vacio por default (Asume estado 1 o 2 'En Progreso')

    const tipoClase = planFamiliar.family_type_id == 1 ? "verPlan__tipo--rojo" : planFamiliar.family_type_id == 2 ? "verPlan__tipo--verde" : "verPlan__tipo--gris";
  // Override Label Texto para Rechazos (El backend tal vez manda textos largos, front los recorta)
    
    // console.log("EStados:", planFamiliar.status);
    
  // Maquetación DOM de la Carta
    div.innerHTML = `

        <div class="verPlan__icono">
            <i class="ri-parent-fill"></i>
        </div>

        <div class="verPlan__apellidos"> Familia ${planFamiliar.last_names} </div>

        <div class="verPlan__tipo--estado">

        <div class="verPlan__estado ${estadoClase}">
            ${planFamiliar.status}
        </div>

        <div class="verPlan__tipo ${tipoClase}">
            Familia ${planFamiliar.family_type}
        </div>

        </div>

        <div class="verPlan__detalles--ubicacion">
            <i class="ri-map-pin-line"></i>
            ${planFamiliar.department} - ${planFamiliar.city}
        </div>
        <div class="verPlan__detalles--fecha">
            <i class="ri-calendar-event-fill"></i>
            Ultima Edicion: ${planFamiliar.date_create}
        </div>
        ${
          // Restricción de Botón "Revisar":
          // Desaparece si el plan está: (2) Enviado a certificar, (6) Rechazo Mortal, (7) Terminado
        planFamiliar.status_id == 2 ||
        planFamiliar.status_id == 6 ||
        planFamiliar.status_id == 7 ||
        planFamiliar.status_id == 5 ||
        planFamiliar.status_id == 4
            ? ""
            : `<button class="verPlan__boton boton" 
                            data-id="${planFamiliar.id}" 
                            data-status="${planFamiliar.status_id}">
                        Revisar Plan
                    </button>`
        }
    `;

    return div;
};
