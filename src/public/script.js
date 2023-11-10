



document.addEventListener("DOMContentLoaded", function() {
    // Datos de ingresos y egresos mensuales
    var meses = ["Julio", "Agosto", "Septiembre", "Octubre"];
    var ingresos = [2500000,3800000, 4200000, 4900000];
    var egresos = [1200000, 1400000, 1600000, 1500000];

    // Gráfica de Ingresos
    var ctxIngresos = document.getElementById('ingresosChart').getContext('2d');
    var ingresosChart = new Chart(ctxIngresos, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Ingresos',
                data: ingresos,
                backgroundColor: 'rgba(0, 102, 102, 0.6)',  // Cambia el color de fondo a un verde oscuro
                borderColor: 'rgba(0, 102, 102, 1)',      // Cambia el color del borde a un verde oscuro
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        fontSize: 46  // Aumenta el tamaño de la letra de las etiquetas en el eje X
                    }
                }
            }
        }
    });

    // Gráfica de Egresos
    var ctxEgresos = document.getElementById('egresosChart').getContext('2d');
    var egresosChart = new Chart(ctxEgresos, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Egresos',
                data: egresos,
                backgroundColor: 'rgba(153, 0, 0, 0.6)',  // Cambia el color de fondo a un rojo oscuro
                borderColor: 'rgba(153, 0, 0, 1)',      // Cambia el color del borde a un rojo oscuro
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    ticks: {
                        fontSize: 39  // Aumenta el tamaño de la letra de las etiquetas en el eje X
                    }
                }
            }
        }
    });
});


// Grafica de puntos

document.addEventListener("DOMContentLoaded", function() {
    // Datos de ventas mensuales
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"];
    var ventas = [50, 90, 150, 200, 250, 339, 421, 532, 601, 876];

    // Configuración de la gráfica de puntos
    var ctx = document.getElementById('ventasChart').getContext('2d');
    var ventasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Total Productos vendidos',
                data: ventas,
                fill: true, // Rellena el área bajo la línea
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color del área debajo de la línea
                pointRadius: 5, // Tamaño de los puntos
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Color de los puntos
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});


// Grafica ciudades

document.addEventListener("DOMContentLoaded", function() {
    // Datos de ventas por ciudad
    var ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];
    var ventas = [220, 421, 128, 90, 60]; // Reemplaza con tus datos reales

    // Crear un gráfico de pastel
    var ctx = document.getElementById('ventasPorCiudadChart').getContext('2d');
    var ventasPorCiudadChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ciudades,
            datasets: [{
                data: ventas,
                backgroundColor: [
                    '#11FFD7',
                    '#34F47D',
                    '#021673',
                    '#20B5FF',
                    '#781CFC',
                ] // Cambia los colores a tu elección
            }]
        }
    });
});