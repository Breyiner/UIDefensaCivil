export default (contenedor, titulo, nombre1, nombre2, dato1, dato2) => {
  new Chart(contenedor, {
    type: "bar",
    data: {
      labels: [nombre1, nombre2],
      datasets: [{
        data: [dato1, dato2],
        backgroundColor: ["#FF6600", "#0770CC"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 👈 usa todo el espacio
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "     ● " + titulo,
          align: "start", // 👈 izquierda
          padding: {
            top: 15,
            bottom: 20
          }
        }
      }
    }
  });
}