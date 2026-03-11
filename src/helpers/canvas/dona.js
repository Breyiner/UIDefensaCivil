/**
 * Renderizador de Gráfico Doughnut/Dona (dona.js)
 * Función que instancia un Chart.js tipo 'doughnut' para representar proporciones respecto a un total.
 * Destaca por inyectar un plugin manual que dibuja texto crudo (el total) dentro del hueco gráfico.
 */
export default (
    contenedor,
    titulo,
    nombre1,
    nombre2,
    nombre3,
    dato1,
    dato2,
    dato // 👈 "dato" representa usualmente "El resto / Otro / Faltante"
) => {

    // 🔹 Plugin personalizado local para renderizar texto en el centro vacío
    const centerTextPlugin = {
        id: 'centerText',
        // afterDraw es un hook de Chart.js ejecutado cada frame después de dibujar los arcos
        afterDraw(chart) {
            const { ctx } = chart; // Contexto 2D del Canvas
            const meta = chart.getDatasetMeta(0); // Información de geoposición del primer conjunto de datos
            const centerX = meta.data[0].x; // Busca la coordenada central X del anillo
            const centerY = meta.data[0].y; // Busca la coordenada central Y del anillo

            // Extrae el arreglo numérico inyectado abajo
            const dataset = chart.data.datasets[0].data;
            // Suma todas las rebanadas en un sólo número "total" acumulado
            const total = dataset.reduce((acc, value) => acc + value, 0);

            ctx.save();

            // 🔹 Renderizado del Número grande
            ctx.font = "bold 44px sans-serif";
            ctx.fillStyle = "#0770CC"; // Color corporativo azul
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(total, centerX, centerY - 10); // Escribe el total un poquito arriba del centro puro

            // 🔹 Renderizado del Texto "Total" abajo en gris para describir la cifra
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#888";
            ctx.fillText("Total", centerX, centerY + 25);

            ctx.restore();
        }
    };

    new Chart(contenedor, {
        type: "doughnut", // Define estilo tipo anillo/dona
        data: {
            labels: [nombre1, nombre2, nombre3], // 3 pedazos por defecto
            datasets: [{
                data: [dato1, dato2, dato],
                backgroundColor: ["#0770CC", "#FF0000", "#BDBDBD"] // Azul, Rojo y Gris
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%", // 👈 Esculpe el tamaño del hueco interior dejándolo 70% vacío
            plugins: {
                legend: {
                    position: "right" // Mueve los cuadritos de colores de la leyenda a la orilla derecha
                },
                title: {
                    display: true,
                    text: "     ● " + titulo,
                    align: "start",
                    padding: {
                        top: 15,
                        bottom: 20
                    }
                }
            }
        },
        plugins: [centerTextPlugin] // 👈 Registra y activamos nuestro plugin de texto en este canvas en específico
    });
}