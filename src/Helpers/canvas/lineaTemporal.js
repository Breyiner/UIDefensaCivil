export default (
  contenedor,
  titulo,
  mes1, mes2, mes3, mes4, mes5, mes6,
  dato1, dato2, dato3, dato4, dato5, dato6
) => {
  new Chart(contenedor, {
    type: "line",
    data: {
      labels: [mes1, mes2, mes3, mes4, mes5, mes6],
      datasets: [
        {
          data: [dato1, dato2, dato3, dato4, dato5, dato6],
          borderColor: "#0770CC",
          backgroundColor: "rgba(6, 112, 204, 0.1)",
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 👈 usa todo el espacio
      layout: {
        padding: 0 // 👈 elimina espacio extra
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "     ● " + titulo,
          align: "start" // 👈 izquierda
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Cantidad"
          }
        },
        x: {
          title: {
            display: true,
            text: "Mes"
          }
        }
      }
    }
  });
}