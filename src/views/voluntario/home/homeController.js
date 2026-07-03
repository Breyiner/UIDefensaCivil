import { api } from "@/helpers/index.js";
import tiempoRelativo from "@/componentes/tiempos/tiempoRelativo";

function crearCardNotificacion(notificacion) {
  const card = document.createElement("div");
  card.classList.add("v-notification-card");

  if (notificacion.entidad.tipo === "Plan Familiar") {
    const main = document.createElement("div");
    main.classList.add("v-card-main");

    const icono = document.createElement("div");
    icono.classList.add("v-card-icon");
    const i = document.createElement("i");
    i.classList.add("ri-parent-fill");
    icono.append(i);

    const info = document.createElement("div");
    info.classList.add("v-card-info");
    const titulo = document.createElement("h3");
    titulo.textContent = "Familia " + notificacion.entidad.apellidos;
    const pLoc = document.createElement("p");
    pLoc.classList.add("v-card-location");
    const iLoc = document.createElement("i");
    iLoc.classList.add("ri-map-pin-fill");
    pLoc.append(iLoc, " " + (notificacion.entidad.direccion || ""));
    info.append(titulo, pLoc);

    const estado = document.createElement("div");
    estado.classList.add("v-card-status");
    const tiempo = document.createElement("span");
    tiempo.classList.add("v-time");
    tiempo.textContent = tiempoRelativo(notificacion.created_at);
    const badge = document.createElement("span");
    badge.classList.add("v-status-badge");
    const estId = notificacion.entidad.estado_id;
    if (estId === 4) badge.classList.add("v-status-pending");
    else if (estId === 5) badge.classList.add("v-status-returned");
    else if (estId === 7) badge.classList.add("v-status-pending");
    badge.textContent = notificacion.entidad.estado;
    estado.append(tiempo, badge);

    main.append(icono, info, estado);
    card.append(main);

    if (notificacion.entidad.comentario) {
      const reason = document.createElement("div");
      reason.classList.add("v-card-reason");
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "Motivo: ";
      p.append(strong, notificacion.entidad.comentario);
      reason.append(p);
      card.append(reason);
    }

    card.addEventListener("click", async () => {
      await api.patch("notifications/" + notificacion.id, { is_read: true });
      window.location.href = "#/voluntario/plan_familiar/familia?id=" + notificacion.entidad.id;
    });
  }

  return card;
}

export default async () => {
  const volunteerName = document.querySelector(".v-volunteer-name");
  const fullName = localStorage.getItem("full_name");

  if (volunteerName) {
    volunteerName.textContent = fullName || "Voluntario";
  }

  try {
    const data = await api.get("familyPlans/stats_voluntario");
    document.getElementById("totalPlanes").textContent = data.total_planes;
    document.getElementById("numVuln").textContent = data.familias_registradas["Familias Vulnerables"];
    document.getElementById("numNoVuln").textContent = data.familias_registradas["Familias no Vulnerables"];
  } catch (error) {
    console.error("Error al cargar estadísticas del voluntario:", error);
  }

  const userId = localStorage.getItem("id");
  try {
    const notificaciones = await api.get("notifications/user/" + userId);
    if (notificaciones && notificaciones.length > 0) {
      const contenedor = document.querySelector(".v-notifications-list");
      if (contenedor) {
        contenedor.innerHTML = "";
        const primeras = notificaciones.slice(0, 3);
        primeras.forEach(n => contenedor.append(crearCardNotificacion(n)));
      }
    }
  } catch (error) {
    console.error("Error al cargar notificaciones:", error);
  }

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#nuevoPlan") || e.target.closest("#nuevoPlan")) {
      window.location.href = '#/voluntario/plan_familiar/crear';
    }
    if (e.target.matches("#verPlan") || e.target.closest("#verPlan")) {
      window.location.href = '#/voluntario/plan_familiar';
    }
    if (e.target.matches("#verTodasNotificaciones") || e.target.closest("#verTodasNotificaciones")) {
      window.location.href = '#/voluntario/notificaciones';
    }
  });
}