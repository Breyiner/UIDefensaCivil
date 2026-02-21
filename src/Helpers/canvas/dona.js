export default (contenedor,titulo,nombre1,nombre2,nombre3,dato1,dato2,dato,) => {
    new Chart(contenedor, {
    type: "doughnut",
    data: {
      labels: [nombre1,nombre2,nombre3,],
      datasets: [{
        data: [dato1,dato2,dato],
        backgroundColor: ["#0770CC", "#FF0000", "#BDBDBD"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: titulo}
      }
    }
  });
}