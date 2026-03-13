/**
 * Renderizador de Gráfico de Línea Temporal (lineaTemporal.js)
 * Función constructora que instancia un Chart.js tipo 'line' para trazar 
 * subidas o bajadas estadísticas (Tendencias) distribuidas en 6 puntos rígidos (meses).
 */
export default (
  contenedor,
  titulo,
  mes1, mes2, mes3, mes4, mes5, mes6, // Ejes X estacionales
  dato1, dato2, dato3, dato4, dato5, dato6 // Valores interconectados Y
) => {
  new Chart(contenedor, {
    type: "line", // Define vista como línea continua
    data: {
      labels: [mes1, mes2, mes3, mes4, mes5, mes6],
      datasets: [
        {
          data: [dato1, dato2, dato3, dato4, dato5, dato6],
          borderColor: "#0770CC", // Línea fuerte azul
          backgroundColor: "rgba(6, 112, 204, 0.1)", // Efecto de color de pintura translucida desparramándose debajo
          tension: 0.3, // 👈 Suaviza la línea haciendo ondas redondeadas en las uniones en vez de picos (Bézier curvo)
          fill: true // 👈 Rellena con el backgroundColor la zona por debajo de la onda hasta el suelo
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 👈 usa todo el espacio
      layout: {
        padding: 0 // 👈 elimina espacio extra de los bordes del canvas
      },
      plugins: {
        legend: {
          display: false // Oculta leyenda
        },
        title: {
          display: true,
          text: "     ● " + titulo,
          align: "start" // 👈 izquierda
        }
      },
      // scales permite modificar la rotulación o formato numérico de las coordenadas
      scales: {
        y: {
          beginAtZero: true, // Empuja el gráfico al piso siempre
          title: {
            display: true,
            text: "Cantidad" // Subtítulo vertical
          }
        },
        x: {
          title: {
            display: true,
            text: "Mes" // Subtítulo horizontal
          }
        }
      }
    }
  });
}