  import * as api from "../api";
  import * as alerta from "../alertas";

  export const ver = async (id) => {
    const datos = await api.get(`pets/${id}`);
    const condiciones = await api.get(`petVaccines/pet/${id}`);

    let condicionVacunas = "";
    let contadorCondicionVacunas = 0;

    condiciones.forEach((condicion) => {
      contadorCondicionVacunas > 0
        ? (condicionVacunas += "," + condicion.name)
        : (condicionVacunas += condicion.name);
      contadorCondicionVacunas++;
      contadorCondicionVacunas == 0 ? (condicionVacunas = "ninguna") : "";
    });

    if (condiciones.length == 0) {
      condicionVacunas = "ninguna";
    }

    const htmlModal = `
          <div class="modalVer modal">
              <div class="modalVer__dato">
                  <i class="ri-coupon-line"></i>
                  <div class="modalVer__titulo">Nombre</div>
                  <div class="modalVer__texto">${datos.name}</div>
              </div>
              <div class="modalVer__dato">
                  <i class="ri-dna-line"></i>
                  <div class="modalVer__titulo">Raza</div>
                  <div class="modalVer__texto">${datos.breed}</div>
              </div>
              <div class="modalVer__dato">
                  <i class="ri-cake-2-line"></i>
                  <div class="modalVer__titulo">Edad</div>
                  <div class="modalVer__texto">${datos.age}</div>
              </div>
              <div class="modalVer__dato">
                  <i class="ri-bell-line"></i>
                  <div class="modalVer__titulo">Especie</div>
                  <div class="modalVer__texto">${datos.species.name}</div>
              </div>
              <div class="modalVer__dato modalVer__dato--largo">
                  <i class="ri-syringe-line"></i>
                  <div class="modalVer__titulo">Vacunas</div>
                  <div class="modalVer__texto">${condicionVacunas}</div>
              </div>
          </div>`;
    alerta.Ver(htmlModal, false, false, null, null);
  };

  export const crearVacunas = async (mascotaId,recargarContainer) => {
      const htmlModal = `
          <div class="explicacion modal">
              <p class="explicacion__titulo">Agregar Vacunas</p>
          </div>
          <div class="form">
              <div class="form__inputBox modal-50">
                  <i class="ri-syringe-fill"></i>
                  <input type="text" class="form__input form__nombre" placeholder="Nombre de la vacuna" autocomplete="off">
              </div>
              <div class="form__inputBox">
                  <i class="ri-calendar-fill"></i>
                  <input type="date" class="form__input form__fecha">
              </div>
          </div>`;

    const funcionModal = async () => {
      const nombreVacuna = document.querySelector(".form__nombre").value;
      const fechaVacuna = document.querySelector(".form__fecha").value;

      const datos = {
        name: nombreVacuna,
        date: fechaVacuna,
        pet_id: mascotaId,
      };
      try {
        const data = await api.post("petVaccines", datos);
        if (data.success) {
          await alerta.alertaOK(data.message);
          await recargarContainer();
        } else alerta.alertaWarning(data.message, data.errors);
      } catch (error) {
        console.log(error);
        alerta.alertaError(error.errors);
      }
    };
    alerta.Crear(htmlModal, funcionModal);
  };

  export const verEditarEliminar = async (id,mascotaId,recargarContainer) => {
      const datos = await api.get(`petVaccines/${id}`);
      const htmlModal = `
              <div class="modalVer modal">
                  <div class="modalVer__dato">
                      <i class="ri-syringe-line modalVer__icono"></i>
                      <div class="modalVer__titulo">Nombre</div>
                      <div class="modalVer__texto">${datos.name}</div>
                  </div>

                  <div class="modalVer__dato">
                      <i class="ri-calendar-line modalVer__icono"></i>
                      <div class="modalVer__titulo">Fecha de Vacuna</div>
                      <div class="modalVer__texto">${datos.date}</div>
                  </div>
              </div>`;
      const funcionModalEditar = async () => {
      const info = await api.get(`petVaccines/${id}`);
      const htmlModal = `
        <div class="explicacion modal">
          <p class="explicacion__titulo">Editar Vacuna</p>
        </div>
        <div class="form">
          <div class="form__inputBox modal-50">
            <i class="ri-syringe-fill"></i>
            <input type="text" class="form__input form__nombre" placeholder="Nombre de la vacuna" autocomplete="off" value="${info.name}">
          </div>
          <div class="form__inputBox">
            <i class="ri-calendar-fill"></i>
            <input type="date" class="form__input form__fecha" value="${info.date}">
          </div>
        </div>`;
      const funcionModal = async () => {
        const nombreVacuna = document.querySelector(".form__nombre").value;
        const fechaVacuna = document.querySelector(".form__fecha").value;

        const datos = {
          name: nombreVacuna,
          date: fechaVacuna,
        };
        
        try {
          const data = await api.patch(`petVaccines/${id}`, datos);
          if (data.success) {
            await alerta.alertaOK(data.message);
            await recargarContainer();
          } else alerta.alertaWarning(data.message, data.errors);
        } catch (error) {
          console.log(error);
          alerta.alertaError(error.errors);
        }
      };
      alerta.Crear(htmlModal, funcionModal);
      };
      const funcionModalEliminar = async () => {
        const confirmacion = await alerta.alertaQuest(
          "¿Seguro que deseas eliminar esta vacuna de la mascota?",
        );
        if (!confirmacion.isConfirmed) return;
        const eliminado = await api.delet(`petVaccines/${id}`);
        if (eliminado.success) {
          await alerta.alertaOK(eliminado.message);
          await recargarContainer();
        }
      };

      alerta.Ver(htmlModal, true, true, funcionModalEditar, funcionModalEliminar);

  }