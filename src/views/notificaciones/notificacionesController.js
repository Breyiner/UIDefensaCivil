import * as api from "../../helpers/api";
import paginacion from "../../helpers/paginacion";
import tiempoRelativo from "../../componentes/tiempos/tiempoRelativo";

const notificacionesController = async () => {

    const esSupervisor = location.hash.includes("supervisor/");
    const base = esSupervisor ? "supervisor" : "voluntario";

    const userId = localStorage.getItem('id');

    const NotificacionesCont = document.querySelector(".NotificacionesCont");
    const paginadorCont = document.querySelector(".container__paginador");

    let AllNotify = [];
    let paginaActual = 1;

    // Función callback para el cambio de página

    const cambiarPagina = async (numeroPagina) => {
        paginaActual = numeroPagina;
        await cargarNotificaciones();
        carta();
    };

    // Se cargan datos de notificaciones con paginación

    const cargarNotificaciones = async () => {
        try {
            const endpoint = `notifications/user/${userId}?page=${paginaActual}`;
            const paginado = await api.getPaginacion(endpoint);

            console.log('Notificaciones:', paginado);
            AllNotify = paginado?.data ?? [];
            carta();

            // Paginador manual
            if (paginadorCont && paginado.paginate) {
                renderizarPaginador(paginado.paginate);
            }
        } catch (error) {
            console.error("Error cargando notificaciones:", error);
        }
    };

    // Se renderiza(crea) el paginador(dots)

    const renderizarPaginador = (paginate) => {
        paginadorCont.innerHTML = "";
        for (let i = 1; i <= paginate.last_page; i++) {
            const btn = document.createElement("button");
            btn.classList.add("paginador__numero");
            if (i === paginaActual) btn.classList.add("paginador__numero--activo");
            btn.textContent = i;
            btn.addEventListener("click", () => {
                paginaActual = i;
                cargarNotificaciones();
            });
            paginadorCont.append(btn);
        }
    };

    // Renderizador de las tarjetas de notificación en el DOM

    function carta() {
        NotificacionesCont.innerHTML = "";

        if (AllNotify.length === 0) {
            NotificacionesCont.textContent = 'No tienes ninguna notificación.';
            return;
        }

        AllNotify.forEach(notificacion => {
            const notificacionCont = document.createElement("div");
            notificacionCont.classList.add("tarjeta", "tarjeta--notificacion");

            if (!notificacion.is_read) {
                notificacionCont.classList.add("tarjeta--notificacion__noread");
            }

            const header = document.createElement("div");
            header.classList.add("tarjeta__header");

            const iconoCont = document.createElement("div");
            iconoCont.classList.add("tarjeta__icono-contenedor", "tarjeta__icono-contenedor--azul");

            let icono = document.createElement("i");

            let infoCont = document.createElement("div");
            infoCont.classList.add("tarjeta__info");

            let titulo = document.createElement("p");
            titulo.classList.add("tarjeta__titulo-notificacion");

            const estadoCont = document.createElement("div");
            estadoCont.classList.add("tarjeta__estado");

            const tiempo = document.createElement("p");
            tiempo.classList.add("tarjeta__tiempo");
            tiempo.textContent = tiempoRelativo(notificacion.created_at);

            let estado = document.createElement("p");
            estado.classList.add("badge");

            let tarjetaCuerpo = "";

            // --- CASO: PLAN FAMILIAR ---
            if (notificacion.entidad.tipo === "Plan Familiar") {

                icono.classList.add('ri-parent-fill');
                titulo.textContent = "Familia " + notificacion.entidad.apellidos;

                const tituloItem = document.createElement("div");
                tituloItem.classList.add("tarjeta__iconoItem");

                const iconoUbicacion = document.createElement("i");
                iconoUbicacion.classList.add("ri-map-pin-fill");

                const textoUbicacion = document.createElement("p");
                textoUbicacion.textContent = notificacion.entidad.direccion;

                tituloItem.append(iconoUbicacion, textoUbicacion);

                const usuarioCont = document.createElement("div");
                usuarioCont.classList.add("tarjeta__iconoItem");

                const usuarioIcono = document.createElement("i");
                usuarioIcono.classList.add("ri-user-line");

                const usuarioNombre = document.createElement("p");
                usuarioNombre.textContent = `${notificacion.audit.user} (${notificacion.audit.role})`;

                usuarioCont.append(usuarioIcono, usuarioNombre);
                infoCont.append(titulo, tituloItem, usuarioCont);

                estado.textContent = notificacion.entidad.estado;

                if (notificacion.entidad.estado_id === 4) {
                    estado.classList.add("badge--enviado");
                } else if (notificacion.entidad.estado_id === 5) {
                    estado.classList.add("badge--devuelto");
                } else if (notificacion.entidad.estado_id === 6) {
                    estado.classList.add("badge--rechazado");
                } else if (notificacion.entidad.estado_id === 7) {
                    estado.classList.add("badge--aprobado");
                }

                notificacionCont.addEventListener("click", async () => {
                    try {
                        await api.patch(`notifications/${notificacion.id}`, {
                            is_read: true
                        });

                        if (esSupervisor) {
                            location.href = `#/supervisor/plan_familiar/revision?familia_id=${notificacion.entidad.id}`;
                        } else {
                            location.href = `#/voluntario/plan_familiar/familia?id=${notificacion.entidad.id}`;
                        }
                    } catch (error) {
                        console.error("Error al actualizar la notificación:", error);
                    }
                });

                if (notificacion.entidad.comentario !== null) {
                    tarjetaCuerpo = document.createElement("div");
                    tarjetaCuerpo.classList.add("tarjeta__cuerpo");

                    const iconoComentario = document.createElement("i");
                    iconoComentario.classList.add("ri-message-2-line");

                    const mensajeComentario = document.createElement("div");
                    mensajeComentario.classList.add("tarjeta__mensaje-texto");

                    const mensajeTitulo = document.createElement("span");
                    mensajeTitulo.classList.add("tarjeta__mensaje-titulo");
                    mensajeTitulo.textContent = 'Motivo de devolución';

                    const mensajeContenido = document.createElement("p");
                    mensajeContenido.classList.add("tarjeta__mensaje-contenido");
                    mensajeContenido.textContent = notificacion.entidad.comentario;

                    mensajeComentario.append(mensajeTitulo, mensajeContenido);
                    tarjetaCuerpo.append(iconoComentario, mensajeComentario);
                }
                
            // --- CASO: USUARIO ---
            } else if (notificacion.entidad.tipo === "Usuario") {

                icono.classList.add('ri-user-settings-line');
                titulo.textContent = notificacion.entidad.nombre;
                estado.textContent = notificacion.audit.status_change;

                const tituloItem = document.createElement("div");
                tituloItem.classList.add("tarjeta__iconoItem");
                
                if (notificacion.audit.status_change.includes("Inactivo → Activo") || notificacion.audit.status_change.includes("Peticion → Activo")) {
                    tituloItem.textContent = `El usuario a sido activado`;
                    estado.classList.add("badge--aprobado");
                } else if (notificacion.audit.status_change.includes("Activo → Inactivo")) {
                    tituloItem.textContent = `El usuario a sido inactivado`;
                    estado.classList.add("badge--rechazado");
                } else if (notificacion.audit.status_change.includes("→ Peticion")) {
                    tituloItem.textContent = `Nuevo usuario pendiente a ser aprobado`;
                    estado.classList.add("badge--pendiente");
                }

                let usuarioCont = '';

                if (!notificacion.audit.status_change.includes("→ Peticion")){
                    
                    usuarioCont = document.createElement("div");
                    usuarioCont.classList.add("tarjeta__iconoItem");
    
                    const usuarioIcono = document.createElement("i");
                    usuarioIcono.classList.add("ri-user-line");
    
                    const usuarioNombre = document.createElement("p");
                    usuarioNombre.textContent = `Acción por: ${notificacion.audit.user} (${notificacion.audit.role})`;

                    usuarioCont.append(usuarioIcono,usuarioNombre);
                }

                notificacionCont.addEventListener("click", async () => {
                    try {
                        await api.patch(`notifications/${notificacion.id}`, {
                            is_read: true
                        });

                        const esGestionUsuarios = notificacion.entidad.estado_id === 1 || notificacion.entidad.estado_id === 2;
                        
                        if (esSupervisor) {
                            if (esGestionUsuarios) {
                                location.href = `#/supervisor/usuarios/gestion`;
                                return;
                            }
                            location.href = `#/supervisor/usuarios/peticiones`;
                        } else {
                            if (esGestionUsuarios) {
                                location.href = `#/administrador/usuarios/gestion`;
                                return;
                            }
                            location.href = `#/administrador/usuarios/peticiones`;
                        }
                    } catch (error) {
                        console.error("Error al actualizar la notificación:", error);
                    }
                });

                infoCont.append(titulo, tituloItem, usuarioCont);
            }

            iconoCont.append(icono);
            estadoCont.append(tiempo, estado);
            header.append(iconoCont, infoCont, estadoCont);
            notificacionCont.append(header, tarjetaCuerpo);
            NotificacionesCont.append(notificacionCont);
        });
    }

    
    await cargarNotificaciones();
};

export default notificacionesController;