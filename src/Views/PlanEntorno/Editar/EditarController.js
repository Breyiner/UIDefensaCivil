import * as alerta from "../../../Helpers/alertas";
import * as api from "../../../Helpers/api"

export default () => {
    const ctx = document.getElementById('myChart')?.getContext('2d');
    
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Rojo', 'Azul', 'Amarillo'],
                datasets: [{
                    label: 'Ejemplo',
                    data: [12, 19, 3],
                    backgroundColor: ['red','blue','yellow']
                }]
            }
        });
    }  
}