// =====================================================
// CONFIGURACIÓN BASE
// =====================================================

import { log10 } from "chart.js/helpers";

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


export const keyboard_numero = (event) =>
  permitirTecla(event, /^\d$/);

export const keyboard_texto = (event) =>
  permitirTecla(event, /^[A-Za-zÁÉÍÓÚáéíóúÑñ]$/);

export const keyboard_textoEspacio = (event) =>
  permitirTecla(event, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/);


// =====================================================
// LIMITE DE CARACTERES
// =====================================================
export const keyboard_limite = (event, limite) => {
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

export const validar_correo = (input) => {
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

export const validar_password = (input) => {
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

export const validar_vacio = (input) => {
  const value = input.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "No puede estar vacio.");

  return true;
};

export const validar_minimo = (input, minimo) => {

  const value = input.value.trim();

  limpiarError(input);

  if (!value)
    return error(input, "No puede estar vacío.");

  if (value.length < minimo)
    return error(
      input,
      `Debe tener al menos ${minimo} caracteres.`
    );

  return true;
};

export const validar_maximo = (input, maximo) => {
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

export const validar_select = (select) => {
  const value = select.value;
  
  limpiarError(select);

  if (!value || value === "")
    return error(select, "Debe seleccionar una opción.");

  return true;
};

export const validar_minimoMaximo = (input, minimo, maximo) => {
  const value = input.value.trim();

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

export const validar_igualdad = (input, inputComparar) => {
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

export const validar_mayoriaEdad = (input) => {
  const value = input.value;
  
  limpiarError(input);

  if (!value)
    return error(input, "La fecha es obligatoria.");

  const fechaNacimiento = new Date(value);
  const hoy = new Date();

  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())){
    edad--;
  }

  if (edad < 18)
    return error(
      input,
      `Debe ser mayor de 18 años.`
  );

  return true;
};

export const  validar_siExiste = (input, minimo) => {
  const value = input.value.trim();

  limpiarError(input);

  // Si está vacío, no valida nada y devuelve true
  if (!value) return true;

  // Si tiene contenido, ejecuta la validación que le pases
  return validarMinimo(input,minimo);
};

// objeto encargado de establecer un esquema para validar los inputs
// cada propiedad de este objeto indica un DATA ATTRIBUTE que debe tener cada input para que este sea validado
// faltan mas por agregar

const inputTipos={
  textoCorto: { keyboard:keyboard_textoEspacio,min:3,max:50},

  textoLargo: { keyboard:keyboard_textoEspacio,min:8,max:255},

  textoNombres: { keyboard:keyboard_textoEspacio,min:3,max:70},

  textoCortoOpcional: { keyboard:keyboard_textoEspacio,min:3,max:50,opcional: true},

  textoLargoOpcional: { keyboard:keyboard_textoEspacio,min:8,max:255,opcional: true},

  numerico: { keyboard: keyboard_numero,min:1,max: 50},

  numericoOpcional: { keyboard: keyboard_numero,min:1,max: 50,opcional: true},

  telefono:{keyboard: keyboard_numero ,min:7,max:15},

  telefonoOpcional:{keyboard: keyboard_numero ,min:7,max:15,opcional: true},
  
  documento:{keyboard: keyboard_numero ,min:7,max:15},

  correo:{validacion:(input)=>validar_correo(input)},

  password:{validacion:(input)=>validar_password(input),max:40},

  mayorDeEdad:{validacion:(input)=>validar_minimoMaximo(input)}
};


// validarTodo (formulario) para que valide TODOS los inputs una vez que se oprima "submit" en el formulario.
// Las funciones de este objeto 


export const validadorAutomatico = {
  // init se utiliza para incializar la validacion de un form (validacion.validadorAutomatico.init(formulario))
  init: (formulario) => {
    const inputs = formulario.querySelectorAll("input")
    const selects = formulario.querySelectorAll("select");
    
    inputs.forEach(input => {
      const tipo = input.dataset.tipo
      
      // A cada input se le añade la validacion para escribir solo los caracteres permitidos por input y el evento para borrar el error una vez corregido

      if (tipo in inputTipos){
        input.addEventListener("keydown", e => {
          if (inputTipos[tipo].max) keyboard_limite(e,inputTipos[tipo].max)
        })
        input.addEventListener("blur", e => {
          limpiarError(input)
        })
      }
    })

    selects.forEach(select => {
          select.addEventListener("change", e => {
            limpiarError(select)
        })
    })
  },
  
  // validarTodo se usa para validar todo el form una vez se haya oprimido el boton de submit (validacion.validadorAutomatico.validarTodo(formulario))
  validarTodo: (formulario) => {

    const inputs = formulario.querySelectorAll("input");
    const selects = formulario.querySelectorAll("select");
  
    inputs.forEach(input => {
      const tipo = input.dataset.tipo

      if (tipo in inputTipos){        
        // NOTA: en minimo, poner el valor minimo de todos modos
        if (inputTipos[tipo].opcional){     
          validar_siExiste(input, Number(inputTipos[tipo].min))
          return
        }
        if (inputTipos[tipo].min && inputTipos[tipo].max){
          validar_minimoMaximo(input,inputTipos[tipo].min,inputTipos[tipo].max);
        }
        else if (inputTipos[tipo].min){
          validar_minimo(input,Number(inputTipos[tipo].min));
        }
        else if (inputTipos[tipo].max){
          validar_maximo(input,Number(inputTipos[tipo].max));
        }
        if(inputTipos[tipo].validacion) inputTipos[tipo].validacion(input);
      }
    })

    selects.forEach(select => {
      validar_select(select);
    })
    //IMPORTANTE:
    // Esta funcion valida cada input de acuerdo a los DATA ATTRIBUTES del <input> (data-atributo) que se escriben en el HTML
    // Los data attributes que se validan son:
    // data-validacion: El tipo de dato que maneja el input (nombre, telefono)
    // Los <select> no requieren data attributes ya que estos se validan al hacer submit en el form y verificar si estan o no seleccionados
    const buscarError = document.querySelectorAll('.error');
    if (buscarError.length > 0) return false;
    else return true
  }
}