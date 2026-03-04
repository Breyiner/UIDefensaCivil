import * as api from "../api";
import * as alerta from "../alertas";
import * as validacion from "../validacionInputs"
import {initTomSelectPortatil} from "../../main";

export const ver = async(id) => {
  const datos = await api.get(`members/${id}`);
  const condiciones = await api.get(`conditionMembers/member/${id}`);

  let condicionNombre = "";
  let condicionMedicina = "";
  let contadorCondicionNombre = 0;
  let contadorCondicionMedicina = 0;

  condiciones.forEach((condicion) => {
    contadorCondicionNombre > 0
      ? (condicionNombre += "," + condicion.name)
      : (condicionNombre += condicion.name);
    contadorCondicionNombre++;
    if (condicion.dose != null) {
      contadorCondicionMedicina > 0
        ? (condicionMedicina += "," + condicion.dose)
        : (condicionMedicina += condicion.dose);
      contadorCondicionMedicina++;
    }
    contadorCondicionNombre == 0 ? (condicionNombre = "ninguno") : "";
    contadorCondicionMedicina == 0 ? (condicionNombre = "ninguno") : "";
  });

  if (condiciones.length == 0) {
    condicionNombre = "ninguno";
    condicionMedicina = "ninguno";
  }

  const htmlModal = `
            <div class="modalVer modal">
                <div class="modalVer__dato">
                    <i class="ri-user-line"></i>
                    <div class="modalVer__titulo">Nombre</div>
                    <div class="modalVer__texto">${datos.names}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-user-line"></i>
                    <div class="modalVer__titulo">Apellidos</div>
                    <div class="modalVer__texto">${datos.last_names}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-info-card-line"></i>
                    <div class="modalVer__titulo">Tip documento </div>
                    <div class="modalVer__texto">${datos.document_type.acronym}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-id-card-line"></i>
                    <div class="modalVer__titulo">Num documento</div>
                    <div class="modalVer__texto">${datos.document_number}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-calendar-line modalVer__icono"></i>
                    <div class="modalVer__titulo">Fecha nacimiento</div>
                    <div class="modalVer__texto">${datos.birth_date}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-phone-line"></i>
                    <div class="modalVer__titulo">Telefono</div>
                    <div class="modalVer__texto">${datos.phone}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-men-line"></i>
                    <div class="modalVer__titulo">Genero</div>
                    <div class="modalVer__texto">${datos.gender.name}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-flag-line"></i>
                    <div class="modalVer__titulo">Parentesco</div>
                    <div class="modalVer__texto">${datos.kinship.name}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-heart-pulse-line"></i>
                    <div class="modalVer__titulo">Grupo Sanguineo</div>
                    <div class="modalVer__texto">${datos.blood_group.name}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-health-book-line"></i>
                    <div class="modalVer__titulo">EPS</div>
                    <div class="modalVer__texto">${datos.eps}</div>
                </div>
                <div class="modalVer__dato">
                    <i class="ri-flag-line"></i>
                    <div class="modalVer__titulo">Nacionalidad</div>
                    <div class="modalVer__texto">${datos.nationality.name}</div>
                </div>
                <div class="modalVer__dato modalVer__dato--largo">
                    <i class="ri-stethoscope-line"></i>
                    <div class="modalVer__titulo">Afecciones</div>
                    <div class="modalVer__texto">${condicionNombre}</div>
                </div>
                <div class="modalVer__dato modalVer__dato--largo">
                    <i class="ri-capsule-fill"></i>
                    <div class="modalVer__titulo">Medicinas o Dosis</div>
                    <div class="modalVer__texto">${condicionMedicina}</div>
                </div>
            </div>`;
  alerta.Ver(htmlModal, false, false, null, null);
};

export const crear = async (id,recargarContainer) => {
  const tiposAfeccionesPeticion = await api.get(`conditionTypes`);
  let tiposAfecciones = "";
  for (let i = 0; i < tiposAfeccionesPeticion.length; i++) {
    tiposAfecciones += `<option value="${tiposAfeccionesPeticion[i].id}">${tiposAfeccionesPeticion[i].name}</option>`;
  }

  const htmlModal = `
    <div class="explicacion modal">
      <p class="explicacion__titulo">Agregar Afección</p>
    </div>
    <div class="container__gap modal-50">
    <div class="input">
      <div class="form__inputBox form__inputBox--selector">
        <i class="ri-id-card-line" id="selector__icono"></i>
        <select class="form__input selector--afeccion" id="selector">
          <option value ="" hidden>Seleccione una afeccion...</option>
          ${tiposAfecciones}
        </select>
      </div>
    </div>
      <div class="input">
        <div class="form__inputBox">
          <i class="ri-syringe-line"></i>
          <input type="text" class="form__input" placeholder="Nombre de la afección" id="nombreAfeccion" autocomplete="off">
        </div>
      </div>
      <div class="input">
        <div class="form__inputBox">
          <i class="ri-calendar-line"></i>
          <input type="text" class="form__input" placeholder="Descripción de dosis" id="descripcion" autocomplete="off">
        </div>
      </div>
    </div>`;
  
  const funcionModal = async () => {
    const afeccion = document.querySelector(".selector--afeccion");
    const nombreAfeccion = document.getElementById("nombreAfeccion")
    const descripcion = document.getElementById("descripcion");

    let validarAfeccion = validacion.validarSelect(afeccion);
    let validarNombreAfeccion = validacion.validarMinimo(nombreAfeccion, 3);
    let validarDescripcion = validacion.validarSiExiste(descripcion, 10);
    
    if (validarAfeccion &&
        validarNombreAfeccion &&
        validarDescripcion){
      const datos = {
        member_id: id,
        condition_type_id: afeccion.value,
        name: nombreAfeccion.value,
        dose: descripcion.value,
      };
      
      try {
        const data = await api.post("conditionMembers", datos);
        if (data.success) {
          await alerta.alertaOK(data.message);
          await recargarContainer();
          return true} 
        else{
          alerta.alertaWarning(data.message, data.errors);
          return false
        }
      }catch (error){
        console.log(error);
        alerta.alertaError(error.errors);
        return false}
    }return false
    };
    const funcionAlAbrir = async () => {
      const afeccion = document.querySelector(".selector--afeccion");
      const nombreAfeccion = document.getElementById("nombreAfeccion")
      const descripcion = document.getElementById("descripcion");
      
      nombreAfeccion.addEventListener("keydown", (e) => {
        validacion.limiteCaracteres(e, 30);
        validacion.textoConEspacios(e);
      });
      descripcion.addEventListener("keydown", (e) => {
        validacion.limiteCaracteres(e, 200);
      });

      afeccion.addEventListener("change", (e) => {
          validacion.limpiarError(e.target);
      });
      nombreAfeccion.addEventListener("blur", (e) => {
        validacion.limpiarError(e.target);
      });
      descripcion.addEventListener("blur", (e) => {
        validacion.limpiarError(e.target);
      });
    }
      alerta.Crear(htmlModal, funcionModal,funcionAlAbrir);
      initTomSelectPortatil();
    }

export const verEditarEliminar = async (id,integranteId,recargarContainer) => {
    const datos = await api.get(`conditionMembers/${id}`);
    const htmlModal = `
            <div class="modalVer modal">
                <div class="modalVer__dato">
                    <i class="ri-building-line modalVer__icono"></i>
                    <div class="modalVer__titulo">Tipo de Afeccion</div>
                    <div class="modalVer__texto">${datos.condition_type.name}</div>
                </div>

                <div class="modalVer__dato">
                    <i class="ri-syringe-line modalVer__icono"></i>
                    <div class="modalVer__titulo">Nombre Afeccion</div>
                    <div class="modalVer__texto">${datos.name}</div>
                </div>

                <div class="modalVer__dato modalVer__dato--largo">
                    <i class="ri-calendar-line modalVer__icono"></i>
                    <div class="modalVer__titulo">Descripcion</div>
                    <div class="modalVer__texto">${datos.dose}</div>
                </div>
            </div>`;

    const funcionModalEditar = async () => {
      const tipos = await api.get("conditionTypes");
      const info = await api.get(`conditionMembers/${id}`);
      let opcionesTexto = "";
      for (let i = 0; i < tipos.length; i++) {
        opcionesTexto += `<option value="${tipos[i].id}" ${tipos[i].id == info.condition_type_id ? "selected" : ""}>${tipos[i].name}</option>`;
      }
      const htmlModal = `
            <div class="explicacion modal">
                <p class="explicacion__titulo">Agregar Afección</p>
            </div>
            <div class="form">
                <div class="form__inputBox modal-50">
                    <i class="ri-building-fill"></i>
                    <select class="form__input form__afeccion">
                    ${opcionesTexto}
                    </select>
                    </div>
                <div class="form__inputBox">
                    <i class="ri-syringe-fill"></i>
                    <input type="text" class="form__input form__nombreAfeccion" placeholder="Nombre de la afección" autocomplete="off" value="${info.name}">
                </div>
                <div class="form__inputBox">
                    <i class="ri-calendar-fill"></i>
                    <input type="text" class="form__input form__descripcion" placeholder="Descripción de dosis" autocomplete="off" value="${info.dose}">
                </div>
            </div>`;

      const funcionModal = async () => {
        const afeccion = document.querySelector(".form__afeccion").value;
        const nombreAfeccion = document.querySelector(
          ".form__nombreAfeccion",
        ).value;
        const descripcion = document.querySelector(".form__descripcion").value;

        const datos = {
          member_id: integranteId,
          condition_type_id: afeccion,
          name: nombreAfeccion,
          dose: descripcion,
        };

        try {
          const data = await api.put(`conditionMembers/${id}`, datos);
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
        "¿Seguro que deseas eliminar esta afeccion del integrante?",
      );
      if (!confirmacion.isConfirmed) return;
      const eliminado = await api.delet(`conditionMembers/${id}`);
      if (eliminado.success) {
        await alerta.alertaOK(eliminado.message);
        await recargarContainer();
      }
    };

    alerta.Ver(htmlModal, true, true, funcionModalEditar, funcionModalEliminar);
}