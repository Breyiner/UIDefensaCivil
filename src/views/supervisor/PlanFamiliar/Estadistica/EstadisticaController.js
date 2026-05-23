/**
 * Controlador: Estadísticas Plan Familiar (EstadisticaController.js)
 * Renderiza el dashboard gráfico (Dona iterativa) que resume la cantidad de 
 * Planes Familiares según su estado (Aprobados, Rechazados, Pendientes).
 */
import * as alerta from "@/helpers/alertas";
import * as api from "@/helpers/api";
import * as canva from "@/helpers/canvas";

export default async () => {
    // Referencias al DOM para la interacción principal de la vista
    const botonBack = document.getElementById("botonBack"); // Botón para retroceder al hub del supervisor

    // Previene múltiples clics rápidos inicializando bandera
    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    // Regla de escape o vuelta atrás segura
    botonBack.onclick = async () => {
        if (window.procesoPeticion) return; // Cancela si hay carga a red
        location.href = `#/supervisor/`; // Redirección hash SPA
    };

    // Petición temprana y directa al endpoint consolidador de métricas para Supervisores
    const dashBoard = await api.get('audits/dashBoardSupervisor');
    
    // Captura el lienzo <canvas> destinado a alojar el gráfico de dona
    const estadosPlanFamiliar = document.getElementById('estadosPlanFamiliar')
    
    // Delega el pintado de la gráfica usando el adapter/helper 'canva'
    // Pasa (Contexto, Titulo, Etiqueta 1, Etiqueta 2, Etiqueta 3, Valor 1, Valor 2, Valor 3)
    canva.dona(estadosPlanFamiliar,"Estados de plan familiar","Aprobados","Rechazados","Pendientes",dashBoard.approved_plans,dashBoard.rejected_plans,dashBoard.pending_plans);
}