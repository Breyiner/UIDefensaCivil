import * as api from "../api";
import * as alerta from "../alertas";

export const ver = async(id) => {
  const datos = await api.get(`housingGraphics/${id}`);
  
  const htmlModal = `
    <div class="modalVer modal">
    <div class="modalVer__dato modalVer__dato--largo">
        <i class="ri-file-image-line"></i>
        <div class="modalVer__titulo">Grafico de vivienda</div>
        </div>
      <img class="modalVer__imagen" src="${api.urlStorage+"/"+datos.path}">
      <div class="modalVer__dato modalVer__dato--largo">
        <i class="ri-parent-line"></i>
        <div class="modalVer__titulo">Descripcion</div>
        <div class="modalVer__texto">${datos.description}</div>
      </div>

    </div>
  `;

  alerta.Ver(htmlModal, false, false, null, null);
};