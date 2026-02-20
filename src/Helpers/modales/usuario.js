import * as api from "../api";
import * as alerta from "../alertas";

export const ver = async (id, recargarContainer,esPeticion,esAdmin) => {

  try {
    const datos = await api.get(`users/${id}`);

    const perfil = datos.profile ?? {};
    const documentType = perfil.document_type ?? {};
    const gender = perfil.gender ?? {};
    const organization = perfil.organization ?? {};
    const sectional = organization.sectional ?? {};
    const estado = datos.status.id
    const rol = datos.rol.id
    const htmlModal = `
      <div class="modalVer modal">

          <div class="modalVer__dato modalVer__dato--largo">
              <i class="ri-user-line"></i>
              <div class="modalVer__titulo">Usuario</div>
              <div class="modalVer__texto">${perfil.names} ${perfil.last_names ?? ""}</div>
          </div>

          <div class="modalVer__dato modalVer__dato--largo">
              <i class="ri-mail-line"></i>
              <div class="modalVer__titulo">Correo</div>
              <div class="modalVer__texto">${datos.email}</div>
          </div>

          <div class="modalVer__dato">
              <i class="ri-info-card-line"></i>
              <div class="modalVer__titulo">Tip.Documento</div>
              <div class="modalVer__texto">${documentType.name}</div>
          </div>

          <div class="modalVer__dato">
              <i class="ri-id-card-line"></i>
              <div class="modalVer__titulo">Num.Documento</div>
              <div class="modalVer__texto">${perfil.document_number}</div>
          </div>

          <div class="modalVer__dato">
              <i class="ri-calendar-line"></i>
              <div class="modalVer__titulo">Fecha Nacimiento</div>
              <div class="modalVer__texto">${perfil.birth_date}</div>
          </div>
        
          <div class="modalVer__dato">
              <i class="ri-men-line"></i>
              <div class="modalVer__titulo">Género</div>
              <div class="modalVer__texto">${gender.name}</div>
          </div>

          <div class="modalVer__dato modalVer__dato--largo">
              <i class="ri-phone-line"></i>
              <div class="modalVer__titulo">Teléfono</div>
              <div class="modalVer__texto">${perfil.phone}</div>
          </div>

          <div class="modalVer__dato">
              <i class="ri-map-pin-line"></i>
              <div class="modalVer__titulo">Seccional</div>
              <div class="modalVer__texto">${sectional.name}</div>
          </div>

          <div class="modalVer__dato">
              <i class="ri-building-line"></i>
              <div class="modalVer__titulo">Organización</div>
              <div class="modalVer__texto">${organization.name}</div>
          </div>
          ${!esPeticion ? 
            `<div class="modalVer__dato">
            <i class="ri-admin-line"></i>
              <div class="modalVer__titulo">Rol</div>
              <div class="modalVer__texto">`+datos.rol.name+`</div>
            </div>
            <div class="modalVer__dato">
            <i class="ri-lock-line"></i>
              <div class="modalVer__titulo">Estado</div>
              <div class="modalVer__texto">`+datos.status.name+`</div>
            </div>`
          :""
        }
      </div>
    `;

    // 👇 AQUÍ USAMOS TU ALERTA NUEVA
    if (esPeticion) alerta.VerAprobarEliminarUsuarios(htmlModal, recargarContainer, id);
    else alerta.VerCambiarEstadoRolUsuarios(htmlModal, recargarContainer, id,estado,rol,esAdmin);
    

  } catch (error) {
    console.error(error);
    alerta.alertaError("Error al obtener el usuario");
  }
};
