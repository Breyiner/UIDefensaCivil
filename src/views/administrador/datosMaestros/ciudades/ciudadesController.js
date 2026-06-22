import { api } from "@/helpers/index.js";
import { ciudad } from "@/helpers/modales/index.js";
import { verEstado_select } from "@/componentes/ver_Estado/index.js";

const ciudadesController = async () => {

    const botonBack = document.getElementById("botonBack");

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/administrador/datos_maestros/`;
    };

    const botonCrear = document.querySelector('#crearCiudad');

    const recargar = async () => {
        
        const datosCiudades = await api.get("cities/");
        const datosDepartments = await api.get("departments/");
             
        const contenedor = document.querySelector(".listaDatos");
        contenedor.innerHTML = "";
        
        datosCiudades.forEach(dato => {

            const departamento = datosDepartments.find(dep => dep.id === dato.department_id);
            
            const urlHistorial = `#/administrador/datos_maestros/ciudades/historial?id=${dato.id}`;

            const boton = document.createElement("button");
            boton.classList.add("listaDatos__valor");
            if (!dato.is_active) boton.classList.add("listaDatos__Inactivo");
            boton.dataset.id = dato.id;
        
            const span = document.createElement("span");
            span.classList.add("listaDatos__nombre");
        
            const icono = document.createElement("i");
            icono.classList.add("ri-eye-line");
        
            const texto = document.createTextNode(
                ` ${dato.name} (${departamento.name}) - ${dato.is_active ? "Activo" : "Inactivo"}`
            );
        
            span.append(icono, texto);
            boton.append(span);

            const datoText = {
                nameDB: "name",
                subnameDB: "name",

                datoNombre: "Ciudad",
                subDatoNombre: "Departamento",

                urlDato: "cities",
                urlSubDato: "departments",

                campoSubDato: "department_id"
            };
        
            boton.addEventListener("click", () => {
                verEstado_select(dato, departamento, recargar, urlHistorial, datoText);
            });
        
            contenedor.append(boton);
        });
    };

    await recargar();

    botonCrear.addEventListener("click", () => {
        ciudad(recargar); // ✅ modal correcto
    });
};

export default ciudadesController;