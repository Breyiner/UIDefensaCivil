// =====================================================
// CONFIGURACIÓN BASE
// =====================================================

export const TECLAS_ESPECIALES = [
  "Backspace",
  "Tab",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "Delete",
  "Home",
  "End"
];

// =====================================================
// MANEJO DE ERRORES
// =====================================================

const mostrarError = (input, mensaje) => {

  limpiarError(input);

  const span = document.createElement("span");
  span.className = "error";
  span.textContent = mensaje;

  input.parentElement.parentElement.append(span);
  console.log(`ERROR EN EL INPUT:`, input)

};

export const limpiarError = (input) => {
  const error = input.parentElement.parentElement.querySelector(".error");
  if (error) error.remove();
};

const error = (input, mensaje) => {
  mostrarError(input, mensaje);
  return false;
};

// =====================================================
// VALIDACIONES POR TECLA
// =====================================================

// Funcion permitir tecla, params: Evento y la regex para permitir la tecla
const permitirTecla = (event, regex) => {
  if (
    !regex.test(event.key) &&
    !TECLAS_ESPECIALES.includes(event.key)
  ) {
    event.preventDefault();
  }
};


export const soloNumeros = (event) =>
  permitirTecla(event, /^\d$/);

export const soloTexto = (event) =>
  permitirTecla(event, /^[A-Za-zÁÉÍÓÚáéíóúÑñ]$/);

export const textoConEspacios = (event) =>
  permitirTecla(event, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/);


// =====================================================
// LIMITE DE CARACTERES
// =====================================================
export const limiteCaracteres = (event, limite) => {
  const input = event.target;

  if (
    !TECLAS_ESPECIALES.includes(event.key) &&
    input.value.length >= limite
  ) {
    event.preventDefault();
  }
};
// =====================================================
// VALIDAR CORREO
// =====================================================

export const validarCorreo = (input) => {
  const value = input.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

  limpiarError(input);

  if (!value)
    return error(input, "El correo es obligatorio.");

  if (!regex.test(value))
    return error(input, "El formato del correo no es válido.");

  return true;
};

// =====================================================
// VALIDAR CONTRASEÑA
// =====================================================

export const validarPassword = (input) => {
  const value = input.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "La contraseña es obligatoria.");

  const reglas = [
    { test: /[A-Z]/, msg: "una mayúscula" },
    { test: /[a-z]/, msg: "una minúscula" },
    { test: /\d/, msg: "un número" },
    { test: /\W/, msg: "un carácter especial" },
    { test: /.{8,}/, msg: "mínimo 8 caracteres" }
  ];

  const errores = reglas
    .filter(r => !r.test.test(value))
    .map(r => r.msg);

  if (errores.length)
    return error(
      input,
      `Debe contener: ${errores.join(", ")}.`
    );

  return true;
};

export const validarVacio = (input) => {
  const value = input.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "No puede estar vacio.");

  return true;
};

export const validarMinimo = (input, minimo) => {

  const value = input.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "No puede estar vacío.");

  if (value.length < minimo)
    // console.log("XD")
    return error(
      input,
      `Debe tener al menos ${minimo} caracteres.`
    );

  return true;
};

export const validarMaximo = (input, maximo) => {
  const value = input.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "No puede estar vacío.");

  if (value.length > maximo)
    return error(
      input,
      `No puede tener más de ${maximo} caracteres.`
    );

  return true;
};

export const validarSelect = (select) => {
  const value = select.value;

  limpiarError(select);

  if (!value || value === "")
    return error(select, "Debe seleccionar una opción.");

  return true;
};

export const validarMinimoMaximo = (input, minimo, maximo) => {
  const value = input.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "No puede estar vacío.");

  if (value.length < minimo)
    return error(
      input,
      `Debe tener al menos ${minimo} caracteres.`
    );

  if (value.length > maximo)
    return error(
      input,
      `No puede tener más de ${maximo} caracteres.`
    );

  return true;
}; 

// =====================================================
// VALIDAR IGUALDAD DE CAMPOS
// =====================================================

export const validarIgualdad = (input, inputComparar) => {
  const value = input.value.trim();
  const valueComparar = inputComparar.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "No puede estar vacío.");

  if (value !== valueComparar)
    return error(input, "Los campos no coinciden.");

  return true;
};

// =====================================================
// VALIDAR MAYOR DE EDAD
// =====================================================

export const validarMayorDeEdad = (input, edadMinima = 18) => {
  const value = input.value;

  limpiarError(input);

  if (!value)
    return error(input, "La fecha es obligatoria.");

  const fechaNacimiento = new Date(value);    
  const hoy = new Date();

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())
  ) {
    edad--;
  }

  if (edad < edadMinima)
    return error(
      input,
      `Debe ser mayor de ${edadMinima} años.`
    );

  return true;
};


export const  validarSiExiste = (input, minimo) => {
  const value = input.value.trim();

  limpiarError(input);

  // Si está vacío, no valida nada y devuelve true
  if (!value) return true;

  // Si tiene contenido, ejecuta la validación que le pases
  return validarMinimo(input,minimo);
};





// objeto encargado de establecer un esquema para validar los inputs
// faltan mas por agregar
const inputTipos = {
  nombre: {validacion: (e) => textoConEspacios(e), min: 3, max: 50},
  telefono: {validacion: (e) => soloNumeros(e), min: 7, max: 10, opcional: true},
}


// validarTodo (formulario) para que valide TODOS los inputs una vez que se oprima "submit" en el formulario.
// Las funciones de este objeto 

export const validadorAutomatico = {
  init: (formulario) => {
    const inputs = formulario.querySelectorAll("input")

    // new

    inputs.forEach(input => {

      const tipo = input.dataset.tipo

      if (tipo in inputTipos){
        input.addEventListener("keydown", e=> {
          inputTipos[tipo].validacion(e);
        })
      }
    })
  },

  validarTodo: (formulario) => {

    const inputs = formulario.querySelectorAll("input");
    const selects = formulario.querySelectorAll("select");

    
    inputs.forEach(input => {
      
      const tipo = input.dataset.tipo
      console.log(input)
      console.log(tipo)
      console.log(tipo in inputTipos)
      if (tipo in inputTipos){

        if (inputTipos[tipo].min && inputTipos[tipo].max){
          validarMinimoMaximo(input,inputTipos[tipo].min,inputTipos[tipo].max)
        }
    
        if (inputTipos[tipo].min){
          validarMinimo(input,Number(inputTipos[tipo].min))
        }
        if (inputTipos[tipo].max){
          validarMaximo(input,Number(inputTipos[tipo].max))
        }
  
        // NOTA: en minimo, poner el valor minimo de todos modos
        if (inputTipos[tipo].opcional){
          validarSiExiste(input, Number(inputTipos[tipo].min))
        }

      }
    })

    selects.forEach(select => {
      validarSelect(select);
    })
    //IMPORTANTE:
    // Esta funcion valida cada input de acuerdo a los DATA ATTRIBUTES del <input> (data-atributo) que se escriben en el HTML
    // Los data attributes que se validan son:
    // data-min: Si hay minimo de caracteres
    // data-max: Si hay maximo de caracteres
    // data-tipo: El tipo de dato que maneja el input (texto, textoEspacio y numero)
    // data-opcional: Si el dato es opcional o no (Mientras el atributo exista, se valida como opcional sin importar el valor de este)
    // data-mayorEdad: Si es necesario que el sujeto sea mayor de edad
    // Los <select> no requieren data attributes ya que estos se validan al hacer submit en el form y verificar si estan o no seleccionados
  }


}