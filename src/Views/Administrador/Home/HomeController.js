import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";

export default () => {
  // Ajustar todos los canvas para que no se vean borrosos
  const canvasIds = [
    'canvaEstadoUsuario',
    'canvaRoles',
    'canvaCatalogoEstados',
    'canvaCambiosRoles'
  ];

  canvasIds.forEach(id => {
    const c = document.getElementById(id);
    if (c) {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    }
  });

  // Doughnut: Estado de usuarios
  new Chart(document.getElementById('canvaEstadoUsuario'), {
    type: "doughnut",
    data: {
      labels: ["Activos", "Peticiones", "Inactivos"],
      datasets: [{
        label: "Estado",
        data: [23, 12, 6],
        backgroundColor: ["#0770CC", "#BDBDBD", "#FF0000"] // verde, gris limón, rojo
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Estados de usuarios" }
      }
    }
  });

  // Bar: Roles de usuarios
  new Chart(document.getElementById('canvaRoles'), {
    type: "bar",
    data: {
      labels: ["Voluntarios", "Supervisor", "Administrador"],
      datasets: [{
        label: "Usuarios",
        data: [30, 10, 1],
        backgroundColor: ["#0770CC", "#FF6600", "#7575FC"]
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Usuarios con roles" }
      }
    }
  });

  // Line: Catálogo Activos/Inactivos por mes
  new Chart(document.getElementById('canvaCatalogoEstados'), {
    type: "line",
    data: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Activos",
          data: [10, 12, 8, 15, 9, 11, 14],
          borderColor: "#0770CC",
          backgroundColor: "rgba(6, 112, 204, 0.1)",
          tension: 0.3,
          fill: true
        },
        {
          label: "Inactivos",
          data: [5, 4, 6, 3, 7, 5, 6],
          borderColor: "#BDBDBD",
          backgroundColor: "rgba(189,189,189,0.1)",
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Catálogo Activos e Inactivos" }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Cantidad" } },
        x: { title: { display: true, text: "Mes" } }
      }
    }
  });

  // Line: Cambios de usuarios por auditoría (colores distintos)
  new Chart(document.getElementById('canvaCambiosRoles'), {
    type: 'line',
    data: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Cambios en usuarios",
          data: [5, 8, 6, 12, 9, 7, 10],
          borderColor: "#FF6600",          // naranja
          backgroundColor: "rgba(255, 201, 164, 0.2)",
          tension: 0.3,
          fill: true
        },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Cambios de usuarios (Auditoría)" }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Cantidad de cambios" } },
        x: { title: { display: true, text: "Mes" } }
      }
    }
  });

  // Eventos click
  window.addEventListener("click", async (e) => {
    if (e.target.matches("#cerrarSesion")) {
      const pregunta = await alerta.alertaQuest('¿Seguro que quieres cerrar sesión?');
      if (pregunta.isConfirmed) {
        await api.post('logout');
        window.location.href = '#/login';
        localStorage.clear();
      }
    }
    if (e.target.matches("#datosMaestros")) {
      window.location.href = '#/administrador-datosMaestros';
    }
    if (e.target.matches("#peticiones")) {
      window.location.href = '#/administrador-usuarios/peticiones';
    }
    if (e.target.matches("#gestion")) {
      window.location.href = '#/administrador-usuarios/gestion';
    }
  });
};
