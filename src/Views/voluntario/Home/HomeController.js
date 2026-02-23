import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api"

export default () => {
  const explicaciontitulo = document.querySelector(".explicacion__titulo");
  const nombre = localStorage.getItem("full_name");
  const genero = localStorage.getItem("gender_id");

  if (genero == 1) {
    explicaciontitulo.innerHTML += "o " + nombre;
  } else {
    explicaciontitulo.innerHTML += "a " + nombre;
  }

  window.addEventListener("click", async (e) => {
    if (e.target.matches("#cerrarSesion")) {
      const pregunta = await alerta.alertaQuest('¿Seguro que quieres cerrar sesion?');
      if (pregunta.isConfirmed) {
        await api.post('logout');
        window.location.href = '#/login';
        localStorage.clear();
      }
    }
    if (e.target.matches("#nuevoPlan")) {
      window.location.href = '#/voluntario-planFamiliar/crear';
    }
    if (e.target.matches("#verPlan")) {
      window.location.href = '#/voluntario-verPlanFamiliar';
    }

  });
}