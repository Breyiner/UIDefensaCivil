import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api";
import ventanaHistorial from "../../../Helpers/ventanaHistorial";
import * as canva from "../../../Helpers/canvas";

export default async() => {
  const usuariosHistorial = document.getElementById('usuariosHistorial');
  const catalogoHistorial = document.getElementById('catalogoHistorial');
  const canvaEstadoUsuario = document.getElementById('canvaEstadoUsuario');
  const canvaRoles = document.getElementById('canvaRoles');
  const canvaCatalogoEstados = document.getElementById('canvaCatalogoEstados'); 
  const totalUsuarios = document.getElementById('totalUsuarios')
  const activos = document.getElementById('activos')
  const inactivos = document.getElementById('inactivos')
  const voluntarios = document.getElementById('voluntarios')
  const {history_general,history_members,monthly_changes,rols,summary} = await api.get('audits/dashBoardAdmin');

  ventanaHistorial(history_members,usuariosHistorial)
  ventanaHistorial(history_general,catalogoHistorial)
  canva.dona(canvaEstadoUsuario,"ESTADOS DE USUARIO","Activos","Inactivos","Pendientes",summary.active,summary.inactive,summary.request);
  canva.barra(canvaRoles,"USUARIOS POR ROL","Voluntarios","Supervisor",rols.volunteer,rols.supervisor);
  canva.lineaTemporal(canvaCatalogoEstados,"CATALOGOS DE ACTIVOS E INACTIVOS",
    monthly_changes[0].month,monthly_changes[1].month,monthly_changes[2].month,monthly_changes[3].month,monthly_changes[4].month,monthly_changes[5].month,
    monthly_changes[0].total,monthly_changes[1].total,monthly_changes[2].total,monthly_changes[3].total,monthly_changes[4].total,monthly_changes[5].total);
  totalUsuarios.textContent = Number(summary.active) + Number(summary.inactive);
  activos.textContent = summary.active;
  inactivos.textContent = summary.inactive;
  voluntarios.textContent = rols.volunteer;

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
