/**
 * Helper de Modales Complejos: Integrante (integrante.js)
 * Archivo encargado de gestionar los modales SweetAlert dedicados al sub-módulo Médico
 * de un Integrante familiar. Permite visualizar, crear, editar y eliminar "Afecciones Médicas" 
 * y sus regímenes de dosificación.
 */
import * as api from "../api";
import * as alerta from "../alertas";
import * as validacion from "../validacionInputs"
import { initTomSelectPortatil } from "../tomSelectPortatil";
import * as adjuntarOpc from "../adjuntarOpciones";

// Función para ver los detalles globales del integrante de una sola vez
export const ver = async (id) => {

  // Descarga info personal del integrante
  const datos = await api.get(`members/${id}`);
  
  // Descarga el listado de afecciones que sufre el integrante
  const condiciones = await api.get(`conditionMembers/member/${id}`);

  let condicionNombre = "";
  let condicionMedicina = "";
  let contadorCondicionNombre = 0;
  let contadorCondicionMedicina = 0;

  // Itera sobre el array de afecciones uniendo todo en un string gigante separado por comas
  condiciones.forEach((condicion) => {
    // Nombre de la afección
    contadorCondicionNombre > 0
      ? (condicionNombre += ", " + condicion.name)
      : (condicionNombre += condicion.name);
    contadorCondicionNombre++;
    
    // Tratamiento o medicina especificados (si se ha documentado alguno)
    if (condicion.dose != null) {
      contadorCondicionMedicina > 0
        ? (condicionMedicina += ", " + condicion.dose)
        : (condicionMedicina += condicion.dose);
      contadorCondicionMedicina++;
    }
    
    // Si quedan vacios
    contadorCondicionNombre == 0 ? (condicionNombre = "ninguno") : "";
    contadorCondicionMedicina == 0 ? (condicionNombre = "ninguno") : "";
  });

  // Chequeo global por si no existe ni una sola condición
  if (condiciones.length == 0) {
    condicionNombre = "ninguno";
    condicionMedicina = "ninguno";
  }

  // Interfaz de solo lectura con diseño grid
  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modalVer", "modal");

  const crearDato = (claseIcono, titulo, texto, largo, claseIconoExtra) => {
    const dato = document.createElement("div");
    dato.classList.add("modalVer__dato");
    if (largo) dato.classList.add("modalVer__dato--largo");

    const icon = document.createElement("i");
    icon.classList.add(claseIcono);
    if (claseIconoExtra) icon.classList.add(claseIconoExtra);

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = titulo;

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = texto;

    dato.append(icon, tituloDiv, textoDiv);
    return dato;
  };

  modalDiv.append(
    crearDato("ri-user-line", "Nombre", datos.names),
    crearDato("ri-user-line", "Apellidos", datos.last_names),
    crearDato("ri-info-card-line", "Tip documento", datos.document_type.acronym),
    crearDato("ri-id-card-line", "Num documento", datos.document_number),
    crearDato("ri-calendar-line", "Fecha nacimiento", datos.birth_date, false, "modalVer__icono"),
    crearDato("ri-phone-line", "Telefono", datos.phone),
    crearDato("ri-men-line", "Genero", datos.gender.name),
    crearDato("ri-flag-line", "Parentesco", datos.kinship.name),
    crearDato("ri-heart-pulse-line", "Grupo Sanguineo", datos.blood_group.name),
    crearDato("ri-health-book-line", "EPS", datos.eps),
    crearDato("ri-flag-line", "Nacionalidad", datos.nationality.name),
    crearDato("ri-stethoscope-line", "Afecciones", condicionNombre, true),
    crearDato("ri-capsule-fill", "Medicinas o Dosis", condicionMedicina, true)
  );

  // Abre ventana base sin botones extras
  alerta.Ver(modalDiv, false, false, null, null);
};


// Agrega una nueva enfermedad o condición
export const afeccionCrear = async (id, recargarContainer) => {
  // Solicita la tabla tipoAfecciones (ej: "Alergia", "Enfermedad Crónica") para el dropdwon select
  const tiposAfeccionesPeticion = await api.get(`conditionTypes`);

  const explicacionDiv = document.createElement("div");
  explicacionDiv.classList.add("modal-edicion__cabecera");

  const tituloP = document.createElement("p");
  tituloP.classList.add("modal-edicion__titulo");
  tituloP.textContent = "Agregar Afección";
  explicacionDiv.appendChild(tituloP);

  const containerGap = document.createElement("div");
  containerGap.classList.add("container__gap", "modal-50");

  const inputDiv1 = document.createElement("div");
  inputDiv1.classList.add("input");

  const inputBox1 = document.createElement("div");
  inputBox1.classList.add("form__inputBox", "form__inputBox--selector");

  const icon1 = document.createElement("i");
  icon1.classList.add("ri-id-card-line");
  icon1.id = "selector__icono";

  const select = document.createElement("select");
  select.classList.add("selector-portatil");
  select.id = "afecciones";

  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.hidden = true;
  optionDefault.textContent = "Seleccione una afeccion...";
  select.appendChild(optionDefault);

  for (let i = 0; i < tiposAfeccionesPeticion.length; i++) {
    const option = document.createElement("option");
    option.value = tiposAfeccionesPeticion[i].id;
    option.textContent = tiposAfeccionesPeticion[i].name;
    select.appendChild(option);
  }

  inputBox1.append(icon1, select);
  inputDiv1.appendChild(inputBox1);
  containerGap.appendChild(inputDiv1);

  const inputDiv2 = document.createElement("div");
  inputDiv2.classList.add("input");

  const inputBox2 = document.createElement("div");
  inputBox2.classList.add("form__inputBox");

  const icon2 = document.createElement("i");
  icon2.classList.add("ri-syringe-line");

  const inputNombre = document.createElement("input");
  inputNombre.type = "text";
  inputNombre.placeholder = "Nombre de la afección";
  inputNombre.id = "nombreAfeccion";
  inputNombre.autocomplete = "off";
  inputNombre.dataset.tipo = "textoCorto";

  inputBox2.append(icon2, inputNombre);
  inputDiv2.appendChild(inputBox2);
  containerGap.appendChild(inputDiv2);

  const inputDiv3 = document.createElement("div");
  inputDiv3.classList.add("input");

  const inputBox3 = document.createElement("div");
  inputBox3.classList.add("form__inputBox");

  const icon3 = document.createElement("i");
  icon3.classList.add("ri-calendar-line");

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Descripción de dosis";
  textarea.id = "descripcion";
  textarea.autocomplete = "off";
  textarea.dataset.tipo = "textoLargoOpcional";

  inputBox3.append(icon3, textarea);
  inputDiv3.appendChild(inputBox3);
  containerGap.appendChild(inputDiv3);

  const container = document.createElement("div");
  container.append(explicacionDiv, containerGap);

  // CALLBACK principal (click en Guardar en SweetAlert)
  const funcionModal = async () => {
    const contenedor = document.querySelector(".container__gap");
    const afeccion = document.getElementById("afecciones");
    const nombreAfeccion = document.getElementById("nombreAfeccion")
    const descripcion = document.getElementById("descripcion");

    const booleanValidacion = validacion.validadorAutomatico.validarTodo(contenedor);
    // Solo si aprueba validaciones prosigue la petición
    if (!booleanValidacion) return false
     
      // Objeto JSON asociativo para este miembro
      const datos = {
        member_id: id,
        condition_type_id: afeccion.value,
        name: nombreAfeccion.value,
        dose: descripcion.value,
      };

      try {
        const data = await api.post("conditionMembers", datos);    
        if (data.success) {
          await alerta.alertaOK(data.message); // Notifica confirmación
          await recargarContainer(); // Carga de nuevo toda la información de pantalla
          return true
        }
        else {
          alerta.alertaWarning(data.message, data.errors);
          return false
        }
      } catch (error) {
        alerta.alertaError(error.errors);
        return false
      }
  };
  
  // LOGICA SECUNDARIA: Funciones de evento inyectadas cuando Swal TERMINA DE ABRIRSE (Para TomSelect y detectores KeyDown en caliente)
  const funcionAlAbrir = async () => {
    const contenedor = document.querySelector(".container__gap");
    validacion.validadorAutomatico.init(contenedor);
    initTomSelectPortatil();
  }
  
  // Ejecuta Sweet alert pasando modal visual y funciones reactivas para el on-click y on-open
  alerta.Crear(container, funcionModal, funcionAlAbrir);
}


// Manejador anidado para inspeccionar una afección particular (de una posible lista en el plan)
export const verEditarEliminar = async (id, integranteId, recargarContainer, esSupervisor) => {
  // Pide el contenido existente de esa receta o afección puntual
  const datos = await api.get(`conditionMembers/${id}`);
  
  // Vista resumida
  const modalDiv = document.createElement("div");
  modalDiv.classList.add("modalVer", "modal");

  const crearDato = (claseIcono, titulo, texto, largo) => {
    const dato = document.createElement("div");
    dato.classList.add("modalVer__dato");
    if (largo) dato.classList.add("modalVer__dato--largo");

    const icon = document.createElement("i");
    icon.classList.add(claseIcono, "modalVer__icono");

    const tituloDiv = document.createElement("div");
    tituloDiv.classList.add("modalVer__titulo");
    tituloDiv.textContent = titulo;

    const textoDiv = document.createElement("div");
    textoDiv.classList.add("modalVer__texto");
    textoDiv.textContent = texto;

    dato.append(icon, tituloDiv, textoDiv);
    return dato;
  };

  const descripcionTexto = datos.dose != null ? datos.dose : "-";

  modalDiv.append(
    crearDato("ri-building-line", "Tipo de Afeccion", datos.condition_type.name),
    crearDato("ri-syringe-line", "Nombre Afeccion", datos.name),
    crearDato("ri-calendar-line", "Descripcion", descripcionTexto, true)
  );

  // ✏ Lógica si el usuario oprime "Modificar" en el mini-modal de afección
  const funcionModalEditar = async () => {
    // Es imperativo sacar tipos nuevamente para el listado de Select
    const tipos = await api.get("conditionTypes");
    const info = await api.get(`conditionMembers/${id}`);

    // HTML de edición rellenado
    const explicacionDiv = document.createElement("div");
    explicacionDiv.classList.add("explicacion", "modal");

    const tituloP = document.createElement("p");
    tituloP.classList.add("explicacion__titulo");
    tituloP.textContent = "Editar Afección";
    explicacionDiv.appendChild(tituloP);

    const containerGap = document.createElement("div");
    containerGap.classList.add("container__gap", "modal-50");

    const inputDiv1 = document.createElement("div");
    inputDiv1.classList.add("input");

    const inputBox1 = document.createElement("div");
    inputBox1.classList.add("form__inputBox", "form__inputBox--selector");

    const icon1 = document.createElement("i");
    icon1.classList.add("ri-id-card-line");
    icon1.id = "selector__icono";

    const select = document.createElement("select");
    select.classList.add("selector-portatil");
    select.id = "afecciones";

    const optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.hidden = true;
    optionDefault.textContent = "Seleccione una afeccion...";
    select.appendChild(optionDefault);

    for (let i = 0; i < tipos.length; i++) {
      const option = document.createElement("option");
      option.value = tipos[i].id;
      option.textContent = tipos[i].name;
      if (tipos[i].id == info.condition_type_id) option.selected = true;
      select.appendChild(option);
    }

    inputBox1.append(icon1, select);
    inputDiv1.appendChild(inputBox1);
    containerGap.appendChild(inputDiv1);

    const inputDiv2 = document.createElement("div");
    inputDiv2.classList.add("input");

    const inputBox2 = document.createElement("div");
    inputBox2.classList.add("form__inputBox");

    const icon2 = document.createElement("i");
    icon2.classList.add("ri-syringe-line");

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.id = "nombreAfeccion";
    inputNombre.placeholder = "Nombre de la afección";
    inputNombre.autocomplete = "off";
    inputNombre.value = info.name;

    inputBox2.append(icon2, inputNombre);
    inputDiv2.appendChild(inputBox2);
    containerGap.appendChild(inputDiv2);

    const inputDiv3 = document.createElement("div");
    inputDiv3.classList.add("input");

    const inputBox3 = document.createElement("div");
    inputBox3.classList.add("form__inputBox");

    const icon3 = document.createElement("i");
    icon3.classList.add("ri-calendar-line");

    const textarea = document.createElement("textarea");
    textarea.id = "descripcion";
    textarea.placeholder = "Descripción de dosis";
    textarea.autocomplete = "off";
    textarea.textContent = info.dose ?? "";

    inputBox3.append(icon3, textarea);
    inputDiv3.appendChild(inputBox3);
    containerGap.appendChild(inputDiv3);

    const container = document.createElement("div");
    container.append(explicacionDiv, containerGap);

    // Acción on-click Edit Confirm
    const funcionModal = async () => {

      const afeccion = document.getElementById("afecciones");
      const nombreAfeccion = document.getElementById("nombreAfeccion");
      const descripcion = document.getElementById("descripcion");

      // Corre validaciones preventivas JS
      let validarAfeccion = validacion.validar_select(afeccion);
      let validarNombre = validacion.validar_minimo(nombreAfeccion, 3);
      let validarDescripcion = validacion.validar_siExiste(descripcion, 10);

      // Si todo aprueba
      if (validarAfeccion && validarNombre && validarDescripcion) {

        const datos = {
          member_id: integranteId,
          condition_type_id: afeccion.value,
          name: nombreAfeccion.value,
          dose: descripcion.value
        };

        try {

          // Opciones con PUT verbo REST para reemplazar recursos totales.
          const data = await api.put(`conditionMembers/${id}`, datos);

          if (data.success) {

            await alerta.alertaOK(data.message); // Modificación completada
            await recargarContainer();
            return true;

          } else {

            alerta.alertaWarning(data.message, data.errors);
            return false;

          }

        } catch (error) {
          alerta.alertaError(error.errors);
          return false;

        }

      }

      return false;

    };

    // Reengancha detectores de escritura (restricciones de sintaxis dictadas) en el DOM recién abierto
    // Y aplica renderizado Tom Select una vez SweetAlert ya insertó el modal en el DOM real
    const funcionAlAbrir = () => {

      const afeccion = document.getElementById("afecciones");
      const nombreAfeccion = document.getElementById("nombreAfeccion");
      const descripcion = document.getElementById("descripcion");

      nombreAfeccion.addEventListener("keydown", (e) => {
        validacion.keyboard_limite(e, 30);
        validacion.keyboard_textoEspacio(e);
      });

      descripcion.addEventListener("keydown", (e) => {
        validacion.keyboard_limite(e, 200);
      });

      afeccion.addEventListener("change", (e) => {
        validacion.limpiarError(e.target);
      });

      initTomSelectPortatil();

    };

    // Abre modal de edición
    alerta.Crear(container, funcionModal, funcionAlAbrir);

  };
  
  // 🗑 Confirmación de purgado
  const funcionModalEliminar = async () => {
    // Sweetalert modo cuestionario
    const confirmacion = await alerta.alertaQuest(
      "¿Seguro que deseas eliminar esta afeccion del integrante?",
    );
    // Escape si pulsa botón negativo
    if (!confirmacion.isConfirmed) return;
    
    // Dispara borrado real a la nube
    const eliminado = await api.delet(`conditionMembers/${id}`);
    
    if (eliminado.success) {
      await alerta.alertaOK(eliminado.message);
      await recargarContainer(); // Carga entorno padre
    }
  };

  alerta.Ver(modalDiv, true, true, funcionModalEditar, funcionModalEliminar, esSupervisor);
}