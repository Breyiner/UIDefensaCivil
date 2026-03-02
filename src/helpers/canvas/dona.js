export default (
    contenedor,
    titulo,
    nombre1,
    nombre2,
    nombre3,
    dato1,
    dato2,
    dato
) => {

    // 🔹 Plugin para texto en el centro
    const centerTextPlugin = {
        id: 'centerText',
        afterDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            const centerX = meta.data[0].x;
            const centerY = meta.data[0].y;

            const dataset = chart.data.datasets[0].data;
            const total = dataset.reduce((acc, value) => acc + value, 0);

            ctx.save();

            // 🔹 Número grande
            ctx.font = "bold 44px sans-serif";
            ctx.fillStyle = "#0770CC";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(total, centerX, centerY - 10);

            // 🔹 Texto "Total" abajo en gris
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#888";
            ctx.fillText("Total", centerX, centerY + 25);

            ctx.restore();
        }
    };

    new Chart(contenedor, {
        type: "doughnut",
        data: {
            labels: [nombre1, nombre2, nombre3],
            datasets: [{
                data: [dato1, dato2, dato],
                backgroundColor: ["#0770CC", "#FF0000", "#BDBDBD"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%", // 👈 tamaño del hueco
            plugins: {
                legend: {
                    position: "right"
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
        plugins: [centerTextPlugin] // 👈 activamos el plugin
    });
}