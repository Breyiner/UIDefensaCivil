/**
 * Helper de Modales de Administrador: Ficha de Usuario (usuario.js)
 * Levanta un modal denso, de sólo lectura (Sín Crear o Editar explícito),
 * con toda la información consolidada de registro de una persona.
 *
 * Basado en las variables "esPeticion" y "esAdmin" redirige a dos flujos
 * del componente Alert (alertas.js) distintos:
 * 1. Flujo Aprobar/Rechazar nuevo registro.
 * 2. Flujo Mantenibilidad: Cambiar Rol o Suspender temporalmente la cuenta.
 */
import * as api from "../api";
import * as alerta from "../alertas";

import { initTomSelectPortatil } from "@/helpers/tomSelectPortatil";

// Ventana maestra para auditoría. Exhibe la información de ficha civil completa del Account
export const ver = async (id, recargarContainer, esPeticion, esAdmin) => {
  try {
    // Solicitud general de registro (Incluirá sub-objetos y profiles nested)
    const datos = await api.get(`users/${id}`);

    // Coalescencia Nula (??) para prevenir quiebres de programa sí un elemento JSON viene omitido o vació
    const perfil = datos.profile ?? {};
    const documentType = perfil.document_type ?? {};
    const gender = perfil.gender ?? {};
    const organization = perfil.organization ?? {};
    const sectional = organization.sectional ?? {};
    // Extraemos de forma segura el ID del estado y rol por si el backend lo manda plano, anidado o en otra propiedad
    const estado =
      datos.state_user_id ??
      datos.status?.id ??
      (datos.status === "Activo" ? 1 : 2);
    const rol =
      datos.rol_id ?? datos.rol?.id ?? (datos.rol === "Supervisor" ? 3 : 2);

    const modal = document.createElement("div");
    modal.classList.add("modalVer", "modal");

    // Usuario
    const datoUsuario = document.createElement("div");
    datoUsuario.classList.add("modalVer__dato", "modalVer__dato--largo");

    const iUsuario = document.createElement("i");
    iUsuario.classList.add("ri-user-line");

    const tituloUsuario = document.createElement("div");
    tituloUsuario.classList.add("modalVer__titulo");
    tituloUsuario.textContent = "Usuario";

    const textoUsuario = document.createElement("div");
    textoUsuario.classList.add("modalVer__texto");
    textoUsuario.textContent = `${datos.names} ${datos.last_names ?? ""}`;
    datoUsuario.append(iUsuario, tituloUsuario, textoUsuario);

    // Correo
    const datoCorreo = document.createElement("div");
    datoCorreo.classList.add("modalVer__dato", "modalVer__dato--largo");

    const iCorreo = document.createElement("i");
    iCorreo.classList.add("ri-mail-line");

    const tituloCorreo = document.createElement("div");
    tituloCorreo.classList.add("modalVer__titulo");
    tituloCorreo.textContent = "Correo";

    const textoCorreo = document.createElement("div");
    textoCorreo.classList.add("modalVer__texto");
    textoCorreo.textContent = datos.email;
    datoCorreo.append(iCorreo, tituloCorreo, textoCorreo);

    // Tip.Documento
    const datoTipoDoc = document.createElement("div");
    datoTipoDoc.classList.add("modalVer__dato");

    const iTipoDoc = document.createElement("i");
    iTipoDoc.classList.add("ri-info-card-line");

    const tituloTipoDoc = document.createElement("div");
    tituloTipoDoc.classList.add("modalVer__titulo");
    tituloTipoDoc.textContent = "Tip.Documento";

    const textoTipoDoc = document.createElement("div");
    textoTipoDoc.classList.add("modalVer__texto");
    textoTipoDoc.textContent = datos.document_type;
    datoTipoDoc.append(iTipoDoc, tituloTipoDoc, textoTipoDoc);

    // Num.Documento
    const datoNumDoc = document.createElement("div");
    datoNumDoc.classList.add("modalVer__dato");

    const iNumDoc = document.createElement("i");
    iNumDoc.classList.add("ri-id-card-line");

    const tituloNumDoc = document.createElement("div");
    tituloNumDoc.classList.add("modalVer__titulo");
    tituloNumDoc.textContent = "Num.Documento";

    const textoNumDoc = document.createElement("div");
    textoNumDoc.classList.add("modalVer__texto");
    textoNumDoc.textContent = datos.document_number;
    datoNumDoc.append(iNumDoc, tituloNumDoc, textoNumDoc);

    // Fecha Nacimiento
    const datoFecha = document.createElement("div");
    datoFecha.classList.add("modalVer__dato");

    const iFecha = document.createElement("i");
    iFecha.classList.add("ri-calendar-line");

    const tituloFecha = document.createElement("div");
    tituloFecha.classList.add("modalVer__titulo");
    tituloFecha.textContent = "Fecha Nacimiento";

    const textoFecha = document.createElement("div");
    textoFecha.classList.add("modalVer__texto");
    textoFecha.textContent = datos.birth_date;
    datoFecha.append(iFecha, tituloFecha, textoFecha);

    // Género
    const datoGenero = document.createElement("div");
    datoGenero.classList.add("modalVer__dato");

    const iGenero = document.createElement("i");
    iGenero.classList.add("ri-men-line");

    const tituloGenero = document.createElement("div");
    tituloGenero.classList.add("modalVer__titulo");
    tituloGenero.textContent = "Género";

    const textoGenero = document.createElement("div");
    textoGenero.classList.add("modalVer__texto");
    textoGenero.textContent = datos.gender;
    datoGenero.append(iGenero, tituloGenero, textoGenero);

    // Teléfono
    const datoTelefono = document.createElement("div");
    datoTelefono.classList.add("modalVer__dato", "modalVer__dato--largo");

    const iTelefono = document.createElement("i");
    iTelefono.classList.add("ri-phone-line");

    const tituloTelefono = document.createElement("div");
    tituloTelefono.classList.add("modalVer__titulo");
    tituloTelefono.textContent = "Teléfono";

    const textoTelefono = document.createElement("div");
    textoTelefono.classList.add("modalVer__texto");
    textoTelefono.textContent = datos.phone;
    datoTelefono.append(iTelefono, tituloTelefono, textoTelefono);

    // Seccional
    const datoSeccional = document.createElement("div");
    datoSeccional.classList.add("modalVer__dato");

    const iSeccional = document.createElement("i");
    iSeccional.classList.add("ri-map-pin-line");

    const tituloSeccional = document.createElement("div");
    tituloSeccional.classList.add("modalVer__titulo");
    tituloSeccional.textContent = "Seccional";

    const textoSeccional = document.createElement("div");
    textoSeccional.classList.add("modalVer__texto");
    textoSeccional.textContent = datos.sectional;
    datoSeccional.append(iSeccional, tituloSeccional, textoSeccional);

    // Organización
    const datoOrg = document.createElement("div");
    datoOrg.classList.add("modalVer__dato");

    const iOrg = document.createElement("i");
    iOrg.classList.add("ri-building-line");

    const tituloOrg = document.createElement("div");
    tituloOrg.classList.add("modalVer__titulo");
    tituloOrg.textContent = "Organización";

    const textoOrg = document.createElement("div");
    textoOrg.classList.add("modalVer__texto");
    textoOrg.textContent = datos.organization;
    datoOrg.append(iOrg, tituloOrg, textoOrg);

    modal.append( datoUsuario, datoCorreo, datoTipoDoc, datoNumDoc, datoFecha, datoGenero, datoTelefono, datoSeccional, datoOrg );

    if (!esPeticion) {

      // Rol
      const datoRol = document.createElement("div");
      datoRol.classList.add("modalVer__dato");

      const iRol = document.createElement("i");
      iRol.classList.add("ri-admin-line");

      const tituloRol = document.createElement("div");
      tituloRol.classList.add("modalVer__titulo");
      tituloRol.textContent = "Rol";

      const textoRol = document.createElement("div");
      textoRol.classList.add("modalVer__texto");
      textoRol.textContent = datos.rol?.name ?? "Voluntario";
      datoRol.append(iRol, tituloRol, textoRol);

      // Estado
      const datoEstado = document.createElement("div");
      datoEstado.classList.add("modalVer__dato");

      const iEstado = document.createElement("i");
      iEstado.classList.add("ri-lock-line");

      const tituloEstado = document.createElement("div");
      tituloEstado.classList.add("modalVer__titulo");
      tituloEstado.textContent = "Estado";

      const textoEstado = document.createElement("div");
      textoEstado.classList.add("modalVer__texto");
      textoEstado.textContent = datos.status;
      datoEstado.append(iEstado, tituloEstado, textoEstado);

      modal.append(datoRol, datoEstado);
    }

    let selectRol = null;

    if (esPeticion && esAdmin) {
      const datoSelectRol = document.createElement("div");
      datoSelectRol.classList.add("modalVer__dato", "modalVer__dato--largo");

      const iSelectRol = document.createElement("i");
      iSelectRol.classList.add("ri-admin-line");

      const tituloSelectRol = document.createElement("div");
      tituloSelectRol.classList.add("modalVer__titulo");
      tituloSelectRol.textContent = "Asignar Rol";

      const select = document.createElement("select");
      select.classList.add("selector-portatil");
      select.id = "selectRol";

      const optVoluntario = document.createElement("option");
      optVoluntario.value = 3;
      optVoluntario.textContent = "Voluntario";

      const optSupervisor = document.createElement("option");
      optSupervisor.value = 2;
      optSupervisor.textContent = "Supervisor";

      // initTomSelectPortatil();

      select.append(optVoluntario, optSupervisor);

      datoSelectRol.append(iSelectRol, tituloSelectRol, select);

      selectRol = select; // guarda la referencia al elemento

      modal.append(datoSelectRol);
    }


    if (esPeticion) {
      alerta.VerAprobarEliminarUsuarios(modal, recargarContainer, id, esAdmin, selectRol, initTomSelectPortatil);
      initTomSelectPortatil();
    } else {
      alerta.VerCambiarEstadoRolUsuarios(modal, recargarContainer, id, estado, rol, esAdmin);
    }

  } catch (error) {
    console.error(error);
    alerta.alertaError("Error al obtener el usuario");
  }
};
