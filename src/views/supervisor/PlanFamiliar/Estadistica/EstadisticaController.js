import * as alerta from "../../../../helpers/alertas";
import * as api from "../../../../helpers/api";
import * as canva from "../../../../helpers/canvas";


export default async () => {
    const botonBack = document.getElementById("botonBack");

    if (window.procesoPeticion === undefined) {
        window.procesoPeticion = false;
    }
    window.procesoPeticion = false;

    botonBack.onclick = async () => {
        if (window.procesoPeticion) return;
        location.href = `#/supervisor-home`;
    };

    const dashBoard = await api.get('audits/dashBoardSupervisor');
    const estadosPlanFamiliar = document.getElementById('estadosPlanFamiliar')
    
    canva.dona(estadosPlanFamiliar,"Estados de plan familiar","Aprobados","Rechazados","Pendientes",dashBoard.approved_plans,dashBoard.rejected_plans,dashBoard.pending_plans);
}