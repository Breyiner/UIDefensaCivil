  import * as api from "../api";
  import * as alerta from "../alertas";

  export const ver = async (id) => {
    const datos = await api.get(`availableResources/${id}`);

    const htmlModal = `
          <div class="modalVer modal">
              <div class="modalVer__dato modalVer__dato--largo">
                  <i class="ri-error-warning-line"></i>
                  <div class="modalVer__titulo">Nombre del recurso</div>
                  <div class="modalVer__texto">${datos.resource_name}</div>
              </div>
              <div class="modalVer__dato modalVer__dato--largo">
                  <i class="ri-heart-line"></i>
                  <div class="modalVer__titulo">Servicio</div>
                  <div class="modalVer__texto">${datos.resource_service}</div>
              </div>
              <div class="modalVer__dato modalVer__dato--largo">
                  <i class="ri-phone-line"></i>
                  <div class="modalVer__titulo">Telefono de contacto</div>
                  <div class="modalVer__texto">${datos.phone}</div>
              </div>
              <div class="modalVer__dato modalVer__dato--largo">
                  <i class="ri-file-text-line"></i>
                  <div class="modalVer__titulo">Descripcion</div>
                  <div class="modalVer__texto">${datos.description}</div>
              </div>
              <div class="modalVer__dato modalVer__dato--largo">
                  <i class="ri-map-2-line"></i>
                  <div class="modalVer__titulo">Ubicacion</div>
                  <div class="modalVer__texto">${datos.location}</div>
              </div>
              <div class="modalVer__dato modalVer__dato--largo">
                  <i class="ri-map-pin-line"></i>
                  <div class="modalVer__titulo">Ubicacion</div>
                  <div class="modalVer__texto">${datos.distance}</div>
              </div>
          </div>`;
    alerta.Ver(htmlModal, false, false, null, null);
  };