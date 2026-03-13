/**
 * Renderizador de Gráfico de Barras (barra.js)
 * Función que instancia un gráfico Chart.js tipo 'bar' (barras verticales), comparando dos conjuntos de datos.
 */
export default (contenedor, titulo, nombre1, nombre2, dato1, dato2) => {
  new Chart(contenedor, {
    type: "bar", // Define el formato visual como barras 
    data: {
      labels: [nombre1, nombre2], // Textos o categorías en el eje X
      datasets: [{
        data: [dato1, dato2], // Valores numéricos en el eje Y
        backgroundColor: ["#FF6600", "#0770CC"] // Colores corporativos naranja y azul respectivamente
      }]
    },
    options: {
      responsive: true, // Se adapta al tamaño de la pantalla
      maintainAspectRatio: false, // 👈 Permite que el canvas use todo el largo/ancho de su contenedor padre
      plugins: {
        legend: {
          display: false // Oculta la leyenda superior flotante predeterminada
        },
        title: {
          display: true, // Habilita dibujar un título personalizado incrustado en el Canvas
          text: "     ● " + titulo,
          align: "start", // 👈 Alineado a la izquierda
          padding: {
            top: 15,
            bottom: 20
          }
        }
      }
    }
  });
}