import * as api from "../../../Helpers/api";
import * as alerta from "../../../Helpers/alertas";
import * as cargarDatos from "../../../Helpers/cargarDatos";
import * as adjuntarOpc from "../../../Helpers/adjuntarOpciones";

export default async () => {
    const botonBack = document.getElementById("boton-back");
    const boton = document.querySelector('.form__boton');
    const id = location.hash.split("=")[1];
    const planId = id.split(",")[0];
    const integranteId = id.split(",")[1];
    const contenedorAfeccioness = document.querySelector('.gestionarAfecciones__lista');
    const botonAñadir = document.querySelector('.gestionarAfecciones__boton');
    if (window.procesoPeticion === undefined) {window.procesoPeticion = true;}  
    window.procesoPeticion = true;

    botonBack.onclick = async() => {
    if(window.procesoPeticion) return;
    location.href = `#/planIntegrante/ver/id=${planId}`;}

    // Inputs de texto
    const nombres = document.querySelector('.input__nombres');
    const apellidos = document.querySelector('.input__apellidos');
    const numDocumento     = document.querySelector('.input__numDocumento');
    const eps              = document.querySelector('.input__eps');
    const celular          = document.querySelector('.input__celular');
    const nacimiento       = document.querySelector('.input__nacimiento');

    // Selects
    const tipoDocumento   = document.querySelector('.input__tipoDocumento');
    const genero          = document.querySelector('.input__genero');
    const parentesco      = document.querySelector('.input__parentesco');
    const grupoSanguineo  = document.querySelector('.input__grupoSanguineo');
    const nacionalidad    = document.querySelector('.input__nacionalidad');
    
    await adjuntarOpc.adjuntar(tipoDocumento,"documentTypes");
    await adjuntarOpc.adjuntarNoValida(genero,"genders");
    await adjuntarOpc.adjuntarNoValida(parentesco,"kinships");
    await adjuntarOpc.adjuntarNoValida(grupoSanguineo,"bloodGroups");
    await adjuntarOpc.adjuntarNoValida(nacionalidad,"nationalities");
    await cargarDatos.cargarDatos(`members/${integranteId}`,
        [nombres, apellidos, numDocumento, eps, celular, nacimiento,tipoDocumento,genero,parentesco,grupoSanguineo,nacionalidad],
        ["names", "last_names", "document_number", "eps", "phone", "birth_date","document_type_id","gender_id","kinship_id","blood_group_id","nationality_id"]
    );
    
    window.procesoPeticion = false;
    boton.disabled = false;

    const cargarAfecciones = async () => {
        const afecciones = await api.get(`conditionMembers/member/${integranteId}`);
        contenedorAfeccioness.innerHTML = '';
        
        afecciones.forEach(item => {
            const boton = document.createElement('button');
            boton.className = 'gestionarAfecciones__afeccion';
            boton.dataset.id = item.id;
            boton.innerHTML = `
                <span class="gestionarAfecciones__tipoNombre">
                    <i class="ri-eye-fill"></i> ${item.condition_type.name} - ${item.name}
                </span>`;
            contenedorAfeccioness.appendChild(boton);
        });
    }

    cargarAfecciones();

    //Query para alcanzar varios con una misma clase
    document.querySelectorAll(".acordeon__nombre").forEach(boton => {
        boton.addEventListener("click", () => {
            const acordeonContenido = boton.nextElementSibling; //devuelve el siguiente

            if (acordeonContenido.classList.contains("acordeon__contenido--oculto")) {
            acordeonContenido.className = "acordeon__contenido";
            } 
            else if (acordeonContenido.classList.contains("acordeon__contenido")) {
            acordeonContenido.className = "acordeon__contenido--oculto";
            }
        });
    });
    botonAñadir.addEventListener('click', async () => {
        const tipos = await api.get('conditionTypes');
        let opcionesTexto = '';
        for (let i = 0; i < tipos.length; i++) {
            // Vamos sumando cada opción al texto
            opcionesTexto += `<option value="${tipos[i].id}">${tipos[i].name}</option>`;
        }
        const htmlModal = `
            <div class="explicacion modal">
                <p class="explicacion__titulo">Agregar Afección</p>
            </div>
            <div class="form">
                <div class="form__inputBox modal-50">
                    <i class="ri-building-fill"></i>
                    <select class="form__input form__afeccion">
                    <option value="0" hidden>Seleccione una afeccion</option>
                    ${opcionesTexto}
                    </select>
                    </div>
                <div class="form__inputBox">
                    <i class="ri-syringe-fill"></i>
                    <input type="text" class="form__input form__nombreAfeccion" placeholder="Nombre de la afección" autocomplete="off">
                </div>
                <div class="form__inputBox">
                    <i class="ri-calendar-fill"></i>
                    <input type="text" class="form__input form__descripcion" placeholder="Descripción de dosis" autocomplete="off">
                </div>
            </div>`;

    const funcionModal = async () => {
        const afeccion = document.querySelector('.form__afeccion').value;
        const nombreAfeccion = document.querySelector('.form__nombreAfeccion').value;
        const descripcion = document.querySelector('.form__descripcion').value;

        if (!afeccion || !nombreAfeccion || !descripcion) {
            Swal.showValidationMessage('Por favor, rellena todos los campos');
            return false;
        }

        const datos = {
            member_id: integranteId,
            condition_type_id: afeccion,
            name: nombreAfeccion,
            dose: descripcion
            };
          
        try {
            const data = await api.post('conditionMembers',datos);
            if (data.success){
                await alerta.alertaOK(data.message)
                await cargarAfecciones();}
            else alerta.alertaWarning(data.message,data.errors)
            } catch (error) {console.log(error);
            alerta.alertaError(error.errors);}
        }
        alerta.mostrarModalEnfermedad(htmlModal,funcionModal);
    })

    contenedorAfeccioness.addEventListener('click',async (e) => {
        const id = e.target.closest('.gestionarAfecciones__afeccion').dataset.id;
        const obtenerInfo = await api.get(`conditionMembers/${id}`);
        console.log(obtenerInfo);
    });
}