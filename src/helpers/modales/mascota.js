/**
 * Helper de Modales Complejos: Mascota (mascota.js)
 * Archivo encargado de gestionar los modales SweetAlert dedicados al perfil sanitario 
 * de una mascota. Permite visualizar su información base, así como crear, editar y eliminar 
 * registros de su esquema de "Vacunas".
 */
  import * as api from "../api";
  import * as alerta from "../alertas";

  // Muestra el resumen de la mascota seleccionada
  export const ver = async (id) => {
    // Busca los datos básicos de la mascota
    const datos = await api.get(`pets/${id}`);
    
    // Busca las vacunas registradas que pertenezcan a esa mascota
    const condiciones = await api.get(`petVaccines/pet/${id}`);

    let condicionVacunas = "";
    let contadorCondicionVacunas = 0;

    // Itera sobre el arreglo de vacunas devuelto por la API
    condiciones.forEach((condicion) => {
      // Si ya hay más de una, agrega una coma de separación, si es la primera la coloca sin coma
      contadorCondicionVacunas > 0
        ? (condicionVacunas += "," + condicion.name)
        : (condicionVacunas += condicion.name);
        
      contadorCondicionVacunas++;
      
      // Control de seguridad redundante
      contadorCondicionVacunas == 0 ? (condicionVacunas = "ninguna") : "";
    });

    // Si el arreglo viene vacío, indica visualmente que no hay vacunas
    if (condiciones.length == 0) {
      condicionVacunas = "ninguna";
    }

    // Estructura el DOM inyectando las propiedades de la mascota y el string de vacunas procesado
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modalVer", "modal");

    const crearDato = (claseIcono, titulo, texto, largo) => {
      const dato = document.createElement("div");
      dato.classList.add("modalVer__dato");
      if (largo) dato.classList.add("modalVer__dato--largo");

      const icon = document.createElement("i");
      icon.classList.add(claseIcono);

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
      crearDato("ri-coupon-line", "Nombre", datos.name),
      crearDato("ri-dna-line", "Raza", datos.breed),
      crearDato("ri-cake-2-line", "Edad", datos.age),
      crearDato("ri-bell-line", "Especie", datos.species.name),
      crearDato("ri-syringe-line", "Vacunas", condicionVacunas, true)
    );
          
    // Despliega la alerta modal en modo lectura      
    alerta.Ver(modalDiv, false, false, null, null);
  };

  // Abre un formulario modal para registrar una vacuna nueva a esta mascota
  export const crearVacunas = async (mascotaId,recargarContainer) => {
      // Obtiene la información de la mascota (incluyendo su fecha de nacimiento) para realizar validaciones de fecha
      const pet = await api.get(`pets/${mascotaId}`);
      const birthDateOnly = pet && pet.birth_date ? pet.birth_date.split('T')[0] : '';

      const explicacionDiv = document.createElement("div");
      explicacionDiv.classList.add("explicacion", "modal");

      const tituloP = document.createElement("p");
      tituloP.classList.add("explicacion__titulo");
      tituloP.textContent = "Agregar Vacunas";
      explicacionDiv.appendChild(tituloP);

      const formDiv = document.createElement("div");
      formDiv.classList.add("form");

      const inputBox1 = document.createElement("div");
      inputBox1.classList.add("form__inputBox", "modal-50");

      const icon1 = document.createElement("i");
      icon1.classList.add("ri-syringe-fill");

      const inputNombre = document.createElement("input");
      inputNombre.type = "text";
      inputNombre.classList.add("form__input", "form__nombre");
      inputNombre.placeholder = "Nombre de la vacuna";
      inputNombre.autocomplete = "off";

      inputBox1.append(icon1, inputNombre);
      formDiv.appendChild(inputBox1);

      const inputBox2 = document.createElement("div");
      inputBox2.classList.add("form__inputBox");

      const icon2 = document.createElement("i");
      icon2.classList.add("ri-calendar-fill");

      const inputFecha = document.createElement("input");
      inputFecha.type = "date";
      inputFecha.classList.add("form__input", "form__fecha");

      // Configura la fecha mínima permitida en el input para que sea estrictamente posterior al nacimiento de la mascota
      if (birthDateOnly) {
        const parts = birthDateOnly.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() + 1); // Suma un día para asegurar que la fecha sea mayor
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        inputFecha.min = `${yyyy}-${mm}-${dd}`;
      }

      inputBox2.append(icon2, inputFecha);
      formDiv.appendChild(inputBox2);

      const container = document.createElement("div");
      container.append(explicacionDiv, formDiv);

    // Lógica que se dispara al enviar el formulario modal
    const funcionModal = async () => {
      // Recoge información tecleada o seleccionada en la fecha
      const nombreVacuna = document.querySelector(".form__nombre").value;
      const fechaVacuna = document.querySelector(".form__fecha").value;

      // Valida del lado del cliente que la fecha de la vacuna sea mayor a la de nacimiento
      if (fechaVacuna && birthDateOnly && fechaVacuna <= birthDateOnly) {
        alerta.mostrarErrorValidacion("La fecha de la vacuna debe ser posterior a la fecha de nacimiento de la mascota.");
        return false;
      }

      // Ensambla el payload para el servidor (incluye el ID foráneo mascotaId)
      const datos = {
        name: nombreVacuna,
        date: fechaVacuna,
        pet_id: mascotaId,
      };
      
      try {
        // Manda crear la vacuna en base a la API
        const data = await api.post("petVaccines", datos);
        if (data.success) {
          // Todo correcto
          await alerta.alertaOK(data.message);
          await recargarContainer();
          return true;
        } else {
          // Errores comunes (campo vacío, vacuna duplicada)
          alerta.alertaWarning(data.message, data.errors);
          return false;
        }
      } catch (error) {
        alerta.alertaError(error.errors);
        return false;
      }
    };
    
    // Inicia SweetAlert con opciones creativas
    alerta.Crear(container, funcionModal);
  };

  // Muestra una vacuna individual permitiendo su eventual edición o eliminación
  export const verEditarEliminar = async (id, mascotaId, recargarContainer, esSupervisor) => {
      // Trae los detalles de la vacuna
      const datos = await api.get(`petVaccines/${id}`);
      
      // Modal de vista simple detallado
      const modalDiv = document.createElement("div");
      modalDiv.classList.add("modalVer", "modal");

      const crearDato = (claseIcono, titulo, texto) => {
        const dato = document.createElement("div");
        dato.classList.add("modalVer__dato");

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

      modalDiv.append(
        crearDato("ri-syringe-line", "Nombre", datos.name),
        crearDato("ri-calendar-line", "Fecha de Vacuna", datos.date)
      );
              
      // ✏ CALLBACK EDITAR: Si se clickea el lápiz de editar vacuna
      const funcionModalEditar = async () => {
      
      // Necesitamos la data viva para inyectar los 'value' por defecto
      const info = await api.get(`petVaccines/${id}`);
      // Obtiene la información de la mascota para validar las fechas en el formulario de edición
      const pet = await api.get(`pets/${mascotaId}`);
      const birthDateOnly = pet && pet.birth_date ? pet.birth_date.split('T')[0] : '';

      const explicacionDiv = document.createElement("div");
      explicacionDiv.classList.add("explicacion", "modal");

      const tituloP = document.createElement("p");
      tituloP.classList.add("explicacion__titulo");
      tituloP.textContent = "Editar Vacuna";
      explicacionDiv.appendChild(tituloP);

      const formDiv = document.createElement("div");
      formDiv.classList.add("form");

      const inputBox1 = document.createElement("div");
      inputBox1.classList.add("form__inputBox", "modal-50");

      const icon1 = document.createElement("i");
      icon1.classList.add("ri-syringe-fill");

      const inputNombre = document.createElement("input");
      inputNombre.type = "text";
      inputNombre.classList.add("form__input", "form__nombre");
      inputNombre.placeholder = "Nombre de la vacuna";
      inputNombre.autocomplete = "off";
      inputNombre.value = info.name;

      inputBox1.append(icon1, inputNombre);
      formDiv.appendChild(inputBox1);

      const inputBox2 = document.createElement("div");
      inputBox2.classList.add("form__inputBox");

      const icon2 = document.createElement("i");
      icon2.classList.add("ri-calendar-fill");

      const inputFecha = document.createElement("input");
      inputFecha.type = "date";
      inputFecha.classList.add("form__input", "form__fecha");
      inputFecha.value = info.date;

      // Configura la fecha mínima permitida en el input para que sea estrictamente posterior al nacimiento de la mascota
      if (birthDateOnly) {
        const parts = birthDateOnly.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setDate(d.getDate() + 1); // Suma un día para asegurar que la fecha sea mayor
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        inputFecha.min = `${yyyy}-${mm}-${dd}`;
      }

      inputBox2.append(icon2, inputFecha);
      formDiv.appendChild(inputBox2);

      const container = document.createElement("div");
      container.append(explicacionDiv, formDiv);
        
      // Lógica ejecutada tras confirmar la ventana de edición
      const funcionModal = async () => {
        // Obtiene valores nuevos
        const nombreVacuna = document.querySelector(".form__nombre").value;
        const fechaVacuna = document.querySelector(".form__fecha").value;

        // Valida del lado del cliente que la fecha de la vacuna editada sea mayor a la de nacimiento
        if (fechaVacuna && birthDateOnly && fechaVacuna <= birthDateOnly) {
          alerta.mostrarErrorValidacion("La fecha de la vacuna debe ser posterior a la fecha de nacimiento de la mascota.");
          return false;
        }

        // Construye payload
        const datos = {
          name: nombreVacuna,
          date: fechaVacuna,
        };
        
        try {
          // Invoca ruta API con verbo PATCH para modificar
          const data = await api.patch(`petVaccines/${id}`, datos);
          if (data.success) {
            await alerta.alertaOK(data.message);
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
      };
      
      // Crea el form flotante de edición
      alerta.Crear(container, funcionModal);
      };
      
      // 🗑 CALLBACK ELIMINAR: Si se clickea el bote de basura
      const funcionModalEliminar = async () => {
        // Lanzamos alerta que pide confirmación estricta
        const confirmacion = await alerta.alertaQuest(
          "¿Seguro que deseas eliminar esta vacuna de la mascota?",
        );
        // Si canceló, aborta ejecución
        if (!confirmacion.isConfirmed) return;
        
        // Emite DELETE
        const eliminado = await api.delet(`petVaccines/${id}`);
        // Notifica
        if (eliminado.success) {
          await alerta.alertaOK(eliminado.message);
          await recargarContainer();
        }
      };

      // Construye el modal inicial de solo vista con los callbacks activados (true)
      alerta.Ver(modalDiv, true, true, funcionModalEditar, funcionModalEliminar, esSupervisor);

  }