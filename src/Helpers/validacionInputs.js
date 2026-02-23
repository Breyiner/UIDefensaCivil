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

  input.parentElement.parentElement.appendChild(span);
};

const limpiarError = (input) => {
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