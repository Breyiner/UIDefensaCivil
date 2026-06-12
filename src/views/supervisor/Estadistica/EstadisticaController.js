import { api } from "@/helpers/index.js";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

let donaChartInstance = null;

export default async () => {
    const loading = document.getElementById("statsLoading");
    const error = document.getElementById("statsError");
    const errorMsg = document.getElementById("statsErrorMsg");
    const content = document.getElementById("statsContent");

    const mostrar = (el) => el.classList.remove("invisible");
    const ocultar = (el) => el.classList.add("invisible");

    const botonBack = document.getElementById("botonBack");
    if (botonBack) {
        botonBack.onclick = () => {
            if (window.procesoPeticion) return;
            location.href = "#/supervisor";
        };
    }

    ocultar(error);
    ocultar(content);
    mostrar(loading);

    const sectionalId = localStorage.getItem("sectional_id");

    if (!sectionalId) {
        ocultar(loading);
        errorMsg.textContent = "No se encontró el ID de la seccional. Inicia sesión nuevamente.";
        mostrar(error);
        return;
    }

    try {
        const res = await api.get(`sectionals/${sectionalId}/stats_supervisor`);

        if (!res) {
            ocultar(loading);
            errorMsg.textContent = "Error de conexión con el servidor. Intenta nuevamente.";
            mostrar(error);
            return;
        }

        console.log(" Datos recibidos del endpoint:", res);

       // Mock para visualizacion a falta de datos, descomentar 
       // cuando desee usarlo, si hay planes, deja de funcionar. 

        // if (res.total_planes === 0 && res.voluntarios_activos === 1 && res.total_aprobados === 0) {
        //     console.log(" Datos vacíos — inyectando mock para visualización");
        //     res.total_planes = 12;
        //     res.total_aprobados = 8;
        //     res.voluntarios_activos = 5;
        //     res.promedio_planes_por_voluntario = 2.4;
        //     res.dona = { aprobados: 8, pendientes: 3, rechazados: 1 };
        //     res.familias_registradas["Familias Vulnerables"] = 4;
        //     res.familias_registradas["Familias no Vulnerables"] = 8;
        //     res.por_ciudad = [
        //         { city: "Villavicencio", total: 7, aprobados: 5 },
        //         { city: "Acacías", total: 3, aprobados: 2 },
        //         { city: "Granada", total: 2, aprobados: 1 },
        //     ];
        // }

        ocultar(loading);
        mostrar(content);

        try { renderResumenCards(res); } catch (e) { console.error("renderResumenCards:", e); }
        try { renderDonutChart(res.dona); } catch (e) { console.error(" renderDonutChart:", e); }
        try { renderFamilias(res.familias_registradas); } catch (e) { console.error("renderFamilias:", e); }
        try { renderTablaCiudades(res.por_ciudad); } catch (e) { console.error("renderTablaCiudades:", e); }

    } catch (err) {
        console.error("Error en EstadisticaController:", err);
        ocultar(loading);
        errorMsg.textContent = err?.message || "Ocurrió un error al obtener las estadísticas.";
        mostrar(error);
    }
};

function renderResumenCards(data) {
    const container = document.getElementById("statsCards");
    if (!container) return;

    const cards = [
        { icono: "ri-file-list-3-line",     color: "azul",   titulo: "Total Planes Familiares",      valor: data.total_planes ?? 0 },
        { icono: "ri-checkbox-circle-line",  color: "verde",  titulo: "Planes Aprobados",             valor: data.total_aprobados ?? 0 },
        { icono: "ri-group-line",            color: "naranja",titulo: "Voluntarios Activos",          valor: data.voluntarios_activos ?? 0 },
        { icono: "ri-bar-chart-2-line",      color: "morado", titulo: "Promedio Planes / Voluntario", valor: data.promedio_planes_por_voluntario ?? 0 },
    ];

    cards.forEach((c) => {
        const card = document.createElement("div");
        card.className = "stats-card";

        const icono = document.createElement("div");
        icono.className = `stats-card__icono stats-card__icono--${c.color}`;
        const i = document.createElement("i");
        i.className = c.icono;
        icono.appendChild(i);

        const info = document.createElement("div");
        info.className = "stats-card__info";

        const titulo = document.createElement("p");
        titulo.className = "stats-card__titulo";
        titulo.textContent = c.titulo;

        const valor = document.createElement("p");
        valor.className = "stats-card__valor";
        valor.textContent = c.valor;

        info.appendChild(titulo);
        info.appendChild(valor);
        card.appendChild(icono);
        card.appendChild(info);
        container.appendChild(card);
    });
}

function renderDonutChart(dona) {
    const canvas = document.getElementById("donaChart");
    if (!canvas) return;

    if (donaChartInstance) {
        donaChartInstance.destroy();
    }

    const labels = ["Aprobados", "Pendientes", "Rechazados"];
    const datos = [dona?.aprobados ?? 0, dona?.pendientes ?? 0, dona?.rechazados ?? 0];
    const colores = ["#36BD36", "#f1b100", "#d80000"];

    const total = datos.reduce((a, b) => a + b, 0);

    const centerTextPlugin = {
        id: "centerText",
        afterDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);
            if (!meta.data || !meta.data.length) return;
            const centerX = meta.data[0].x;
            const centerY = meta.data[0].y;

            ctx.save();
            ctx.font = "bold 40px sans-serif";
            ctx.fillStyle = "#2b2a29";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(total, centerX, centerY - 8);

            ctx.font = "14px sans-serif";
            ctx.fillStyle = "#787878";
            ctx.fillText("Total", centerX, centerY + 24);
            ctx.restore();
        },
    };

    donaChartInstance = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels,
            datasets: [
                {
                    data: datos,
                    backgroundColor: colores,
                    borderWidth: 2,
                    borderColor: "#f8f8f8",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        font: { size: 13 },
                    },
                },
            },
        },
        plugins: [centerTextPlugin],
    });
}

function renderFamilias(familias) {
    const container = document.getElementById("statsFamilies");
    if (!container) return;

    const vulnerables = familias?.["Familias Vulnerables"] ?? 0;
    const noVulnerables = familias?.["Familias no Vulnerables"] ?? 0;

    const titulo = document.createElement("h3");
    titulo.className = "stats-chart__titulo";
    titulo.textContent = "Familias Registradas";

    const grid = document.createElement("div");
    grid.className = "stats-families__grid";

    const crearCard = (iconoClase, label, valor, variante) => {
        const card = document.createElement("div");
        card.className = `stats-family-card stats-family-card--${variante}`;

        const i = document.createElement("i");
        i.className = `ri-${iconoClase} stats-family-card__icono`;

        const pLabel = document.createElement("p");
        pLabel.className = "stats-family-card__label";
        pLabel.textContent = label;

        const pValor = document.createElement("p");
        pValor.className = "stats-family-card__valor";
        pValor.textContent = valor;

        card.appendChild(i);
        card.appendChild(pLabel);
        card.appendChild(pValor);
        return card;
    };

    grid.appendChild(crearCard("alert-line", "Familias Vulnerables", vulnerables, "vulnerable"));
    grid.appendChild(crearCard("shield-check-line", "Familias no Vulnerables", noVulnerables, "no-vulnerable"));

    container.appendChild(titulo);
    container.appendChild(grid);
}

function renderTablaCiudades(porCiudad) {
    const container = document.getElementById("statsTable");
    if (!container) return;

    if (!porCiudad || porCiudad.length === 0) {
        const vacio = document.createElement("div");
        vacio.className = "stats-table__vacio";

        const i = document.createElement("i");
        i.className = "ri-map-pin-line";

        const p = document.createElement("p");
        p.textContent = "Sin datos por ciudad aún";

        vacio.appendChild(i);
        vacio.appendChild(p);
        container.appendChild(vacio);
        return;
    }

    const titulo = document.createElement("h3");
    titulo.className = "stats-chart__titulo";
    titulo.textContent = "Planes por Ciudad";

    const wrapper = document.createElement("div");
    wrapper.className = "stats-table__wrapper";

    const tabla = document.createElement("table");
    tabla.className = "stats-table__tabla";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    const thCiudad = document.createElement("th");
    thCiudad.textContent = "Ciudad";
    const thCantidad = document.createElement("th");
    thCantidad.textContent = "Cantidad";
    const thAprobados = document.createElement("th");
    thAprobados.textContent = "Aprobados";
    trHead.appendChild(thCiudad);
    trHead.appendChild(thCantidad);
    trHead.appendChild(thAprobados);
    thead.appendChild(trHead);

    const tbody = document.createElement("tbody");

    porCiudad.forEach((item) => {
        const tr = document.createElement("tr");

        const tdCiudad = document.createElement("td");
        tdCiudad.textContent = item.city || item.ciudad || "—";

        const tdCantidad = document.createElement("td");
        tdCantidad.className = "stats-table__cantidad";
        tdCantidad.textContent = item.total || item.cantidad || 0;

        const tdAprobados = document.createElement("td");
        tdAprobados.className = "stats-table__cantidad";
        tdAprobados.textContent = item.aprobados ?? 0;

        tr.appendChild(tdCiudad);
        tr.appendChild(tdCantidad);
        tr.appendChild(tdAprobados);
        tbody.appendChild(tr);
    });

    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    wrapper.appendChild(tabla);
    container.appendChild(titulo);
    container.appendChild(wrapper);
}
