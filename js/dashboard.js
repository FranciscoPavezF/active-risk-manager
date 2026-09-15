console.log("DASHBOARD.JS CARGADO");

document.addEventListener("DOMContentLoaded", async () => {

    try {

        // =====================================================
        // 1. OBTENER DATOS
        // =====================================================

        const riesgos =
            await RiesgosStorage.obtenerTodos();

        const acciones =
            await AccionesStorage.obtenerTodas();

        const oportunidades =
            await OportunidadesStorage.obtenerTodas();


        console.log(
            "Riesgos recibidos para dashboard:",
            riesgos
        );

        console.log(
            "Acciones recibidas para dashboard:",
            acciones
        );

        console.log(
            "Oportunidades recibidas para dashboard:",
            oportunidades
        );


        // =====================================================
        // 2. FUNCIONES AUXILIARES
        // =====================================================

        function normalizar(texto) {

            return String(texto || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();

        }


        function calcularCriticidad(
            probabilidad,
            impacto
        ) {

            const resultado =
                Number(probabilidad) *
                Number(impacto);


            if (resultado >= 16) {
                return "Crítica";
            }

            if (resultado >= 10) {
                return "Alta";
            }

            if (resultado >= 5) {
                return "Moderada";
            }

            return "Baja";

        }


        function obtenerPuntaje(riesgo) {

            return (
                Number(riesgo.probabilidad || 0) *
                Number(riesgo.impacto || 0)
            );

        }


        function porcentaje(
            cantidad,
            total
        ) {

            if (total === 0) {
                return 0;
            }

            return Math.round(
                (cantidad / total) * 100
            );

        }


        function escaparHTML(valor) {

            return String(valor ?? "")
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#039;");

        }


        function formatearMoneda(valor) {

            const numero =
                Number(valor || 0);

            return (
                "US$ " +
                numero.toLocaleString("es-CL")
            );

        }


        // =====================================================
        // 3. FUNCIONES PARA ACCIONES
        // =====================================================

        function esAccionCerrada(accion) {

            const estado =
                normalizar(accion.estado);


            return (
                estado === "cerrada" ||
                estado === "cerrado" ||
                estado === "completada" ||
                estado === "completado"
            );

        }


        function accionVencida(accion) {

            if (esAccionCerrada(accion)) {
                return false;
            }


            if (!accion.fechaCompromiso) {
                return false;
            }


            const hoy =
                new Date();


            hoy.setHours(
                0,
                0,
                0,
                0
            );


            const fecha =
                new Date(
                    `${accion.fechaCompromiso}T00:00:00`
                );


            return fecha < hoy;

        }


        function esAccionPendienteOProceso(accion) {

            if (esAccionCerrada(accion)) {
                return false;
            }


            if (accionVencida(accion)) {
                return false;
            }


            const estado =
                normalizar(accion.estado);


            return (
                estado === "pendiente" ||
                estado === "en proceso" ||
                estado === "en evaluacion"
            );

        }


        // =====================================================
        // 4. FUNCIONES PARA OPORTUNIDADES
        // =====================================================

        function oportunidadCapturada(oportunidad) {

            const estado =
                normalizar(
                    oportunidad.estado
                );


            return (
                estado === "capturada" ||
                estado === "capturado" ||
                estado === "cerrada" ||
                estado === "cerrado"
            );

        }


        function oportunidadEnAprovechamiento(
            oportunidad
        ) {

            return (
                normalizar(
                    oportunidad.estado
                ) === "en aprovechamiento"
            );

        }


        function oportunidadEnEvaluacion(
            oportunidad
        ) {

            const estado =
                normalizar(
                    oportunidad.estado
                );


            return (
                estado === "en evaluacion" ||
                estado === "identificada" ||
                estado === "identificado"
            );

        }


        function oportunidadActiva(
            oportunidad
        ) {

            const estado =
                normalizar(
                    oportunidad.estado
                );


            return !(
                estado === "capturada" ||
                estado === "capturado" ||
                estado === "cerrada" ||
                estado === "cerrado" ||
                estado === "descartada" ||
                estado === "descartado"
            );

        }


        // =====================================================
        // 5. EVALUAR RIESGOS
        // =====================================================

        const riesgosEvaluados =
            riesgos.map(
                riesgo => ({

                    ...riesgo,

                    criticidadCalculada:
                        calcularCriticidad(
                            riesgo.probabilidad,
                            riesgo.impacto
                        ),

                    puntaje:
                        obtenerPuntaje(
                            riesgo
                        )

                })
            );


        // =====================================================
        // 6. INDICADORES DE RIESGO
        // =====================================================

        const totalRiesgos =
            riesgosEvaluados.length;


        const riesgosCriticos =
            riesgosEvaluados.filter(
                riesgo =>
                    normalizar(
                        riesgo.criticidadCalculada
                    ) === "critica"
            ).length;


        const riesgosAltos =
            riesgosEvaluados.filter(
                riesgo =>
                    normalizar(
                        riesgo.criticidadCalculada
                    ) === "alta"
            ).length;


        const riesgosModerados =
            riesgosEvaluados.filter(
                riesgo =>
                    normalizar(
                        riesgo.criticidadCalculada
                    ) === "moderada"
            ).length;


        const riesgosBajos =
            riesgosEvaluados.filter(
                riesgo =>
                    normalizar(
                        riesgo.criticidadCalculada
                    ) === "baja"
            ).length;


        const porcentajeCriticos =
            porcentaje(
                riesgosCriticos,
                totalRiesgos
            );


        const porcentajeAltos =
            porcentaje(
                riesgosAltos,
                totalRiesgos
            );


        const porcentajeModerados =
            porcentaje(
                riesgosModerados,
                totalRiesgos
            );


        const porcentajeBajos =
            porcentaje(
                riesgosBajos,
                totalRiesgos
            );


        // =====================================================
        // 7. INDICADORES DE ACCIONES
        // =====================================================

        const totalAcciones =
            acciones.length;


        const accionesCompletadas =
            acciones.filter(
                accion =>
                    esAccionCerrada(
                        accion
                    )
            ).length;


        const accionesVencidas =
            acciones.filter(
                accion =>
                    accionVencida(
                        accion
                    )
            ).length;


        const accionesPendientesProceso =
            acciones.filter(
                accion =>
                    esAccionPendienteOProceso(
                        accion
                    )
            ).length;


        const cumplimientoGlobal =
            totalAcciones === 0
                ? 0
                : Math.round(
                    (
                        accionesCompletadas /
                        totalAcciones
                    ) * 100
                );


        const porcentajeAccionesCompletadas =
            porcentaje(
                accionesCompletadas,
                totalAcciones
            );


        const porcentajeAccionesPendientes =
            porcentaje(
                accionesPendientesProceso,
                totalAcciones
            );


        const porcentajeAccionesVencidas =
            porcentaje(
                accionesVencidas,
                totalAcciones
            );


        // =====================================================
        // 8. INDICADORES DE OPORTUNIDADES
        // =====================================================

        const totalOportunidades =
            oportunidades.length;


        const oportunidadesCapturadas =
            oportunidades.filter(
                oportunidad =>
                    oportunidadCapturada(
                        oportunidad
                    )
            ).length;


        const oportunidadesAprovechamiento =
            oportunidades.filter(
                oportunidad =>
                    oportunidadEnAprovechamiento(
                        oportunidad
                    )
            ).length;


        const oportunidadesEvaluacion =
            oportunidades.filter(
                oportunidad =>
                    oportunidadEnEvaluacion(
                        oportunidad
                    )
            ).length;


        const oportunidadesActivasLista =
            oportunidades.filter(
                oportunidad =>
                    oportunidadActiva(
                        oportunidad
                    )
            );


        const oportunidadesActivas =
            oportunidadesActivasLista.length;


        const beneficioPotencial =
            oportunidadesActivasLista.reduce(
                (
                    acumulado,
                    oportunidad
                ) => {

                    return (
                        acumulado +
                        Number(
                            oportunidad
                                .beneficioPotencial ||
                            0
                        )
                    );

                },
                0
            );


        const porcentajeOportunidadesCapturadas =
            porcentaje(
                oportunidadesCapturadas,
                totalOportunidades
            );


        const porcentajeOportunidadesAprovechamiento =
            porcentaje(
                oportunidadesAprovechamiento,
                totalOportunidades
            );


        const porcentajeOportunidadesEvaluacion =
            porcentaje(
                oportunidadesEvaluacion,
                totalOportunidades
            );


        // =====================================================
        // 9. SALUD DEL PORTAFOLIO
        // =====================================================

        let saludPortafolio =
            100
            - (riesgosCriticos * 15)
            - (riesgosAltos * 8)
            - (riesgosModerados * 3)
            - (riesgosBajos * 1)
            - (accionesVencidas * 3);


        saludPortafolio =
            Math.max(
                0,
                Math.min(
                    100,
                    saludPortafolio
                )
            );


        let estadoSalud = "";
        let claseSalud = "";


        if (
            saludPortafolio >= 90
        ) {

            estadoSalud =
                "Óptimo";

            claseSalud =
                "text-emerald-600";

        }

        else if (
            saludPortafolio >= 75
        ) {

            estadoSalud =
                "Estable";

            claseSalud =
                "text-blue-600";

        }

        else if (
            saludPortafolio >= 50
        ) {

            estadoSalud =
                "Atención";

            claseSalud =
                "text-amber-600";

        }

        else {

            estadoSalud =
                "Crítico";

            claseSalud =
                "text-red-600";

        }


        // =====================================================
        // 10. KPI PRINCIPALES
        // =====================================================

        const kpiRiesgosCriticos =
            document.getElementById(
                "kpiRiesgosCriticos"
            );


        const kpiAccionesVencidas =
            document.getElementById(
                "kpiAccionesVencidas"
            );


        const kpiCumplimientoGlobal =
            document.getElementById(
                "kpiCumplimientoGlobal"
            );


        const kpiOportunidades =
            document.getElementById(
                "kpiOportunidades"
            );


        const kpiBeneficioPotencial =
            document.getElementById(
                "kpiBeneficioPotencial"
            );


        const kpiSaludPortafolio =
            document.getElementById(
                "kpiSaludPortafolio"
            );


        const kpiSaludEstado =
            document.getElementById(
                "kpiSaludEstado"
            );


        if (
            kpiRiesgosCriticos
        ) {

            kpiRiesgosCriticos.textContent =
                riesgosCriticos;

        }


        if (
            kpiAccionesVencidas
        ) {

            kpiAccionesVencidas.textContent =
                accionesVencidas;

        }


        if (
            kpiCumplimientoGlobal
        ) {

            kpiCumplimientoGlobal.textContent =
                `${cumplimientoGlobal}%`;

        }


        if (
            kpiOportunidades
        ) {

            kpiOportunidades.textContent =
                oportunidadesActivas;

        }


        if (
            kpiBeneficioPotencial
        ) {

            kpiBeneficioPotencial.textContent =
                formatearMoneda(
                    beneficioPotencial
                );

        }


        if (
            kpiSaludPortafolio
        ) {

            kpiSaludPortafolio.textContent =
                `${saludPortafolio} / 100`;

        }


        if (
            kpiSaludEstado
        ) {

            kpiSaludEstado.textContent =
                estadoSalud;


            kpiSaludEstado.className =
                `text-xs font-semibold ${claseSalud}`;

        }


        // =====================================================
        // 11. GRÁFICO DE RIESGOS
        // =====================================================

        const datosCriticidad = [

            {
                texto:
                    "criticidadCriticaTexto",

                barra:
                    "criticidadCriticaBarra",

                cantidad:
                    riesgosCriticos,

                porcentaje:
                    porcentajeCriticos
            },

            {
                texto:
                    "criticidadAltaTexto",

                barra:
                    "criticidadAltaBarra",

                cantidad:
                    riesgosAltos,

                porcentaje:
                    porcentajeAltos
            },

            {
                texto:
                    "criticidadModeradaTexto",

                barra:
                    "criticidadModeradaBarra",

                cantidad:
                    riesgosModerados,

                porcentaje:
                    porcentajeModerados
            },

            {
                texto:
                    "criticidadBajaTexto",

                barra:
                    "criticidadBajaBarra",

                cantidad:
                    riesgosBajos,

                porcentaje:
                    porcentajeBajos
            }

        ];


        datosCriticidad.forEach(
            item => {

                const texto =
                    document.getElementById(
                        item.texto
                    );


                const barra =
                    document.getElementById(
                        item.barra
                    );


                if (texto) {

                    texto.textContent =
                        `${item.cantidad} (${item.porcentaje}%)`;

                }


                if (barra) {

                    barra.style.width =
                        `${item.porcentaje}%`;

                }

            }
        );


        // =====================================================
        // 12. GRÁFICO DE ACCIONES
        // =====================================================

        const tarjetaAcciones =
            Array.from(
                document.querySelectorAll(
                    ".saas-card"
                )
            ).find(
                tarjeta =>
                    tarjeta
                        .textContent
                        .includes(
                            "Acciones por Estado"
                        )
            );


        if (
            tarjetaAcciones
        ) {

            const encabezadoTotal =
                tarjetaAcciones
                    .querySelector(
                        ".text-slate-400.font-medium"
                    );


            if (
                encabezadoTotal
            ) {

                encabezadoTotal.textContent =
                    `Total: ${totalAcciones}`;

            }


            const filas =
                tarjetaAcciones
                    .querySelectorAll(
                        ".space-y-3 > div"
                    );


            if (
                filas.length >= 3
            ) {

                // COMPLETADAS

                const textosCompletadas =
                    filas[0]
                        .querySelectorAll(
                            "span"
                        );


                if (
                    textosCompletadas.length >= 2
                ) {

                    textosCompletadas[1]
                        .textContent =
                        `${accionesCompletadas} (${porcentajeAccionesCompletadas}%)`;

                }


                const barraCompletadas =
                    filas[0]
                        .querySelector(
                            ".bg-emerald-500"
                        );


                if (
                    barraCompletadas
                ) {

                    barraCompletadas.style.width =
                        `${porcentajeAccionesCompletadas}%`;

                }


                // PENDIENTES / EN PROCESO

                const textosPendientes =
                    filas[1]
                        .querySelectorAll(
                            "span"
                        );


                if (
                    textosPendientes.length >= 2
                ) {

                    textosPendientes[1]
                        .textContent =
                        `${accionesPendientesProceso} (${porcentajeAccionesPendientes}%)`;

                }


                const barraPendientes =
                    filas[1]
                        .querySelector(
                            ".bg-blue-600"
                        );


                if (
                    barraPendientes
                ) {

                    barraPendientes.style.width =
                        `${porcentajeAccionesPendientes}%`;

                }


                // VENCIDAS

                const textosVencidas =
                    filas[2]
                        .querySelectorAll(
                            "span"
                        );


                if (
                    textosVencidas.length >= 2
                ) {

                    textosVencidas[1]
                        .textContent =
                        `${accionesVencidas} (${porcentajeAccionesVencidas}%)`;

                }


                const barraVencidas =
                    filas[2]
                        .querySelector(
                            ".bg-red-600"
                        );


                if (
                    barraVencidas
                ) {

                    barraVencidas.style.width =
                        `${porcentajeAccionesVencidas}%`;

                }

            }

        }


        // =====================================================
        // 13. GRÁFICO DE OPORTUNIDADES
        // =====================================================

        const tarjetaOportunidades =
            Array.from(
                document.querySelectorAll(
                    ".saas-card"
                )
            ).find(
                tarjeta =>
                    tarjeta
                        .textContent
                        .includes(
                            "Oportunidades por Estado"
                        )
            );


        if (
            tarjetaOportunidades
        ) {

            const encabezadoTotal =
                tarjetaOportunidades
                    .querySelector(
                        ".text-slate-400.font-medium"
                    );


            if (
                encabezadoTotal
            ) {

                encabezadoTotal.textContent =
                    `Total: ${totalOportunidades}`;

            }


            const filas =
                tarjetaOportunidades
                    .querySelectorAll(
                        ".space-y-3 > div"
                    );


            if (
                filas.length >= 3
            ) {

                // CAPTURADAS

                const textosCapturadas =
                    filas[0]
                        .querySelectorAll(
                            "span"
                        );


                if (
                    textosCapturadas.length >= 2
                ) {

                    textosCapturadas[1]
                        .textContent =
                        `${oportunidadesCapturadas} (${porcentajeOportunidadesCapturadas}%)`;

                }


                const barraCapturadas =
                    filas[0]
                        .querySelector(
                            ".bg-emerald-600"
                        );


                if (
                    barraCapturadas
                ) {

                    barraCapturadas.style.width =
                        `${porcentajeOportunidadesCapturadas}%`;

                }


                // EN APROVECHAMIENTO

                const textosAprovechamiento =
                    filas[1]
                        .querySelectorAll(
                            "span"
                        );


                if (
                    textosAprovechamiento.length >= 2
                ) {

                    textosAprovechamiento[1]
                        .textContent =
                        `${oportunidadesAprovechamiento} (${porcentajeOportunidadesAprovechamiento}%)`;

                }


                const barraAprovechamiento =
                    filas[1]
                        .querySelector(
                            ".bg-blue-600"
                        );


                if (
                    barraAprovechamiento
                ) {

                    barraAprovechamiento.style.width =
                        `${porcentajeOportunidadesAprovechamiento}%`;

                }


                // EN EVALUACIÓN

                const textosEvaluacion =
                    filas[2]
                        .querySelectorAll(
                            "span"
                        );


                if (
                    textosEvaluacion.length >= 2
                ) {

                    textosEvaluacion[1]
                        .textContent =
                        `${oportunidadesEvaluacion} (${porcentajeOportunidadesEvaluacion}%)`;

                }


                const barraEvaluacion =
                    filas[2]
                        .querySelector(
                            ".bg-amber-500"
                        );


                if (
                    barraEvaluacion
                ) {

                    barraEvaluacion.style.width =
                        `${porcentajeOportunidadesEvaluacion}%`;

                }

            }

        }


        // =====================================================
        // 14. OPORTUNIDADES DESTACADAS
        // =====================================================

        const tarjetaDestacadas =
            Array.from(
                document.querySelectorAll(
                    ".saas-card"
                )
            ).find(
                tarjeta =>
                    tarjeta
                        .textContent
                        .includes(
                            "Oportunidades Destacadas"
                        )
            );


        if (
            tarjetaDestacadas
        ) {

            const contenedor =
                tarjetaDestacadas
                    .querySelector(
                        ".space-y-2\\.5"
                    );


            const destacadas =
                [
                    ...oportunidadesActivasLista
                ]
                    .sort(
                        (
                            a,
                            b
                        ) => {

                            return (
                                Number(
                                    b.beneficioPotencial ||
                                    0
                                ) -
                                Number(
                                    a.beneficioPotencial ||
                                    0
                                )
                            );

                        }
                    )
                    .slice(
                        0,
                        3
                    );


            if (
                contenedor
            ) {

                contenedor.innerHTML =
                    "";


                if (
                    destacadas.length === 0
                ) {

                    contenedor.innerHTML = `

                        <div
                            class="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500"
                        >
                            No existen oportunidades activas.
                        </div>

                    `;

                }


                destacadas.forEach(
                    oportunidad => {

                        contenedor.innerHTML += `

                            <div
                                class="p-2.5 rounded-lg bg-emerald-50/30 border border-emerald-100 flex items-center justify-between"
                            >

                                <div class="min-w-0">

                                    <div
                                        class="flex items-center space-x-2 flex-wrap"
                                    >

                                        <span
                                            class="font-bold text-slate-900"
                                        >
                                            ${escaparHTML(oportunidad.id)}:
                                            ${escaparHTML(oportunidad.titulo)}
                                        </span>

                                        <span
                                            class="text-emerald-700 font-bold"
                                        >
                                            ${formatearMoneda(
                                                oportunidad.beneficioPotencial
                                            )}
                                        </span>

                                    </div>

                                    <p
                                        class="text-[11px] text-slate-500 mt-0.5"
                                    >

                                        Resp:
                                        ${escaparHTML(
                                            oportunidad.responsable ||
                                            "Sin asignar"
                                        )}

                                        • Estado:
                                        ${escaparHTML(
                                            oportunidad.estado
                                        )}

                                    </p>

                                </div>

                                <a
                                    href="riesgos-oportunidades.html"
                                    class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] shrink-0 ml-2"
                                >
                                    Evaluar
                                </a>

                            </div>

                        `;

                    }
                );

            }

        }


        // =====================================================
        // 15. ESTADO GENERAL
        // =====================================================

        const estadoGeneralTexto =
            document.getElementById(
                "estadoGeneralTexto"
            );


        if (
            estadoGeneralTexto
        ) {

            estadoGeneralTexto.textContent =

                `El portafolio contiene ${totalRiesgos} ` +
                `${totalRiesgos === 1 ? "riesgo registrado" : "riesgos registrados"}. ` +

                `${riesgosCriticos} ` +
                `${riesgosCriticos === 1 ? "corresponde" : "corresponden"} ` +
                `a criticidad crítica, ` +

                `${riesgosAltos} a nivel alto, ` +
                `${riesgosModerados} a nivel moderado y ` +
                `${riesgosBajos} a nivel bajo. ` +

                `Se registran ${totalAcciones} acciones: ` +
                `${accionesCompletadas} completadas, ` +
                `${accionesPendientesProceso} pendientes o en proceso y ` +
                `${accionesVencidas} vencidas. ` +

                `Existen ${oportunidadesActivas} oportunidades activas ` +
                `con un beneficio potencial de ` +
                `${formatearMoneda(beneficioPotencial)}. ` +

                `El cumplimiento global alcanza ${cumplimientoGlobal}% ` +
                `y la salud del portafolio es ` +
                `${saludPortafolio}/100 (${estadoSalud}).`;

        }


        // =====================================================
        // 16. PANEL DE ALERTAS
        // =====================================================

        const panelAlertas =
            document.getElementById(
                "panelAlertas"
            );


        const contadorAlertas =
            document.getElementById(
                "contadorAlertas"
            );


        const alertasRiesgos =
            riesgosEvaluados
                .filter(
                    riesgo => {

                        const nivel =
                            normalizar(
                                riesgo.criticidadCalculada
                            );


                        return (
                            normalizar(
                                riesgo.estado
                            ) !== "cerrado" &&
                            (
                                nivel === "critica" ||
                                nivel === "alta"
                            )
                        );

                    }
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.puntaje -
                        a.puntaje
                );


        const alertasAcciones =
            acciones.filter(
                accion =>
                    accionVencida(
                        accion
                    )
            );


        const totalAlertas =
            alertasRiesgos.length +
            alertasAcciones.length;


        if (
            contadorAlertas
        ) {

            contadorAlertas.textContent =
                `${totalAlertas} ${
                    totalAlertas === 1
                        ? "Activa"
                        : "Activas"
                }`;

        }


        if (
            panelAlertas
        ) {

            panelAlertas.innerHTML =
                "";


            // RIESGOS

            alertasRiesgos.forEach(
                riesgo => {

                    const esCritico =
                        normalizar(
                            riesgo.criticidadCalculada
                        ) === "critica";


                    const fondo =
                        esCritico
                            ? "bg-red-50/60 border-red-100"
                            : "bg-amber-50/60 border-amber-100";


                    const punto =
                        esCritico
                            ? "bg-red-600"
                            : "bg-amber-500";


                    const textoNivel =
                        esCritico
                            ? "text-red-600"
                            : "text-amber-600";


                    panelAlertas.innerHTML += `

                        <div
                            class="flex items-start gap-3 p-3 rounded-lg ${fondo} border"
                        >

                            <span
                                class="w-2 h-2 rounded-full ${punto} mt-1.5 shrink-0"
                            ></span>

                            <div
                                class="flex-1 min-w-0"
                            >

                                <div
                                    class="flex items-start justify-between gap-3"
                                >

                                    <div>

                                        <a
                                            href="riesgo-detalle.html?id=${encodeURIComponent(riesgo.id)}"
                                            class="font-bold text-slate-900 hover:text-blue-600"
                                        >
                                            ${escaparHTML(riesgo.id)}:
                                            ${escaparHTML(riesgo.titulo)}
                                        </a>

                                        <div
                                            class="text-[10px] text-slate-500 mt-1"
                                        >

                                            <span
                                                class="${textoNivel} font-bold"
                                            >
                                                ${escaparHTML(riesgo.criticidadCalculada)}
                                            </span>

                                            • P ${escaparHTML(riesgo.probabilidad)}/5
                                            • I ${escaparHTML(riesgo.impacto)}/5
                                            • Estado:
                                            ${escaparHTML(riesgo.estado)}

                                        </div>

                                        <div
                                            class="text-[10px] text-slate-500 mt-1"
                                        >

                                            Responsable:

                                            <strong>
                                                ${escaparHTML(
                                                    riesgo.responsable ||
                                                    "Sin asignar"
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    <a
                                        href="riesgo-detalle.html?id=${encodeURIComponent(riesgo.id)}"
                                        class="px-2.5 py-1 bg-white border border-slate-200 text-blue-600 font-semibold rounded hover:bg-blue-50 shrink-0"
                                    >
                                        Ver
                                    </a>

                                </div>

                            </div>

                        </div>

                    `;

                }
            );


            // ACCIONES VENCIDAS

            alertasAcciones.forEach(
                accion => {

                    panelAlertas.innerHTML += `

                        <div
                            class="flex items-start gap-3 p-3 rounded-lg bg-red-50/60 border border-red-100"
                        >

                            <span
                                class="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0"
                            ></span>

                            <div
                                class="flex-1 min-w-0"
                            >

                                <div
                                    class="flex items-start justify-between gap-3"
                                >

                                    <div>

                                        <div
                                            class="font-bold text-slate-900"
                                        >
                                            ${escaparHTML(accion.id)}:
                                            ${escaparHTML(accion.accion)}
                                        </div>

                                        <div
                                            class="text-[10px] text-slate-500 mt-1"
                                        >

                                            <span
                                                class="text-red-600 font-bold"
                                            >
                                                Acción vencida
                                            </span>

                                            • Riesgo:
                                            ${escaparHTML(accion.riesgoId)}

                                            • Avance:
                                            ${escaparHTML(accion.avance)}%

                                        </div>

                                        <div
                                            class="text-[10px] text-slate-500 mt-1"
                                        >

                                            Responsable:

                                            <strong>
                                                ${escaparHTML(
                                                    accion.responsable ||
                                                    "Sin asignar"
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    <a
                                        href="acciones.html"
                                        class="px-2.5 py-1 bg-white border border-slate-200 text-red-600 font-semibold rounded hover:bg-red-50 shrink-0"
                                    >
                                        Gestionar
                                    </a>

                                </div>

                            </div>

                        </div>

                    `;

                }
            );


            if (
                totalAlertas === 0
            ) {

                panelAlertas.innerHTML = `

                    <div
                        class="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700"
                    >
                        No existen riesgos altos/críticos ni acciones vencidas.
                    </div>

                `;

            }

        }


        // =====================================================
        // 17. DECISIÓN RECOMENDADA
        // =====================================================

        const decisionTexto =
            document.getElementById(
                "decisionRecomendadaTexto"
            );


        const decisionBoton =
            document.getElementById(
                "decisionRecomendadaBoton"
            );


        const prioridadPrincipal =
            [
                ...riesgosEvaluados
            ]
                .filter(
                    riesgo =>
                        normalizar(
                            riesgo.estado
                        ) !== "cerrado"
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.puntaje -
                        a.puntaje
                )[0];


        if (
            decisionTexto
        ) {

            if (
                accionesVencidas > 0
            ) {

                const accionPrioritaria =
                    acciones.find(
                        accion =>
                            accionVencida(
                                accion
                            )
                    );


                decisionTexto.textContent =

                    `Priorizar la acción ${accionPrioritaria.id}: ` +
                    `${accionPrioritaria.accion}. ` +
                    `Se encuentra vencida y presenta un avance de ` +
                    `${accionPrioritaria.avance}%. ` +
                    `Está asociada al riesgo ` +
                    `${accionPrioritaria.riesgoId}.`;

            }

            else if (
                prioridadPrincipal
            ) {

                decisionTexto.textContent =

                    `Priorizar ${prioridadPrincipal.id}: ` +
                    `${prioridadPrincipal.titulo}. ` +
                    `Presenta probabilidad ` +
                    `${prioridadPrincipal.probabilidad}/5 e impacto ` +
                    `${prioridadPrincipal.impacto}/5, ` +
                    `con nivel ` +
                    `${prioridadPrincipal.criticidadCalculada}.`;

            }

            else if (
                oportunidadesActivasLista.length > 0
            ) {

                const mejorOportunidad =
                    [
                        ...oportunidadesActivasLista
                    ]
                        .sort(
                            (
                                a,
                                b
                            ) =>
                                Number(
                                    b.beneficioPotencial ||
                                    0
                                ) -
                                Number(
                                    a.beneficioPotencial ||
                                    0
                                )
                        )[0];


                decisionTexto.textContent =

                    `Evaluar ${mejorOportunidad.id}: ` +
                    `${mejorOportunidad.titulo}, ` +
                    `con beneficio potencial de ` +
                    `${formatearMoneda(
                        mejorOportunidad.beneficioPotencial
                    )}.`;

            }

            else {

                decisionTexto.textContent =
                    "No existen elementos que requieran una decisión prioritaria.";

            }

        }


        if (
            decisionBoton
        ) {

            if (
                accionesVencidas > 0
            ) {

                decisionBoton.href =
                    "acciones.html";

            }

            else if (
                prioridadPrincipal
            ) {

                decisionBoton.href =
                    `riesgo-detalle.html?id=${encodeURIComponent(prioridadPrincipal.id)}`;

            }

            else {

                decisionBoton.href =
                    "riesgos-oportunidades.html";

            }

        }


        // =====================================================
        // 18. CONCLUSIONES EJECUTIVAS
        // =====================================================

        const conclusionTexto =
            document.getElementById(
                "conclusionEjecutivaTexto"
            );


        const conclusionPreocupaciones =
            document.getElementById(
                "conclusionPreocupaciones"
            );


        const conclusionDecisiones =
            document.getElementById(
                "conclusionDecisiones"
            );


        const conclusionOportunidades =
            document.getElementById(
                "conclusionOportunidades"
            );


        const conclusionImpacto =
            document.getElementById(
                "conclusionImpacto"
            );


        if (
            conclusionTexto
        ) {

            conclusionTexto.textContent =

                `El portafolio registra ` +
                `${totalRiesgos} riesgos, ` +
                `${totalAcciones} acciones y ` +
                `${totalOportunidades} oportunidades. ` +

                `${riesgosCriticos} riesgos son críticos. ` +

                `${accionesCompletadas} acciones están completadas, ` +
                `${accionesPendientesProceso} permanecen pendientes o en proceso y ` +
                `${accionesVencidas} se encuentran vencidas. ` +

                `Existen ${oportunidadesActivas} oportunidades activas ` +
                `con un beneficio potencial de ` +
                `${formatearMoneda(beneficioPotencial)}. ` +

                `El cumplimiento global alcanza ` +
                `${cumplimientoGlobal}% y ` +

                `la salud del portafolio es ` +
                `${saludPortafolio}/100 (${estadoSalud}).`;

        }


        if (
            conclusionPreocupaciones
        ) {

            if (
                riesgosCriticos > 0 ||
                accionesVencidas > 0
            ) {

                conclusionPreocupaciones.textContent =

                    `${riesgosCriticos} ` +
                    `riesgo${riesgosCriticos !== 1 ? "s" : ""} ` +
                    `crítico${riesgosCriticos !== 1 ? "s" : ""} y ` +

                    `${accionesVencidas} ` +
                    `acción${accionesVencidas !== 1 ? "es" : ""} ` +
                    `vencida${accionesVencidas !== 1 ? "s" : ""} ` +

                    `requieren atención prioritaria.`;

            }

            else {

                conclusionPreocupaciones.textContent =
                    "No existen alertas críticas activas.";

            }

        }


        if (
            conclusionDecisiones
        ) {

            if (
                accionesVencidas > 0
            ) {

                conclusionDecisiones.textContent =
                    "Gestionar primero las acciones vencidas y luego abordar los riesgos de mayor exposición.";

            }

            else if (
                prioridadPrincipal
            ) {

                conclusionDecisiones.textContent =
                    `Gestionar primero ${prioridadPrincipal.id} y verificar el avance de su plan de acción.`;

            }

            else {

                conclusionDecisiones.textContent =
                    "Mantener seguimiento preventivo del portafolio.";

            }

        }


        if (
            conclusionOportunidades
        ) {

            if (
                oportunidadesActivasLista.length > 0
            ) {

                const mejorOportunidad =
                    [
                        ...oportunidadesActivasLista
                    ]
                        .sort(
                            (
                                a,
                                b
                            ) =>
                                Number(
                                    b.beneficioPotencial ||
                                    0
                                ) -
                                Number(
                                    a.beneficioPotencial ||
                                    0
                                )
                        )[0];


                conclusionOportunidades.textContent =

                    `Priorizar ${mejorOportunidad.id} ` +
                    `(${mejorOportunidad.titulo}), ` +
                    `con beneficio potencial de ` +
                    `${formatearMoneda(
                        mejorOportunidad.beneficioPotencial
                    )}.`;

            }

            else {

                conclusionOportunidades.textContent =
                    "No existen oportunidades activas para priorizar.";

            }

        }


        if (
            conclusionImpacto
        ) {

            conclusionImpacto.textContent =

                `El beneficio potencial vigente alcanza ` +
                `${formatearMoneda(beneficioPotencial)}. ` +

                `El cumplimiento actual es ` +
                `${cumplimientoGlobal}% y ` +

                `la salud del portafolio alcanza ` +
                `${saludPortafolio}/100.`;

        }


        // =====================================================
        // 19. PRIORIDADES DEL DÍA
        // =====================================================

        const prioridadesRiesgos =
            document.getElementById(
                "prioridadesRiesgos"
            );


        if (
            prioridadesRiesgos
        ) {

            prioridadesRiesgos.innerHTML =
                "";


            // PRIORIDAD 1:
            // ACCIÓN VENCIDA

            const accionPrioritaria =
                acciones.find(
                    accion =>
                        accionVencida(
                            accion
                        )
                );


            if (
                accionPrioritaria
            ) {

                prioridadesRiesgos.innerHTML += `

                    <div
                        class="bg-white p-3.5 rounded-lg border border-red-200 shadow-sm flex flex-col justify-between"
                    >

                        <div>

                            <span
                                class="text-[10px] font-bold text-red-600 uppercase"
                            >
                                Prioridad #1 • Acción vencida
                            </span>

                            <h3
                                class="font-bold text-xs text-slate-900 mt-1"
                            >
                                ${escaparHTML(accionPrioritaria.id)}:
                                ${escaparHTML(accionPrioritaria.accion)}
                            </h3>

                            <p
                                class="text-[11px] text-slate-500 mt-1"
                            >
                                Riesgo:
                                ${escaparHTML(accionPrioritaria.riesgoId)}
                                • Avance:
                                ${escaparHTML(accionPrioritaria.avance)}%
                            </p>

                        </div>

                        <div
                            class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between"
                        >

                            <span
                                class="text-[10px] text-slate-400 font-semibold"
                            >
                                ${escaparHTML(
                                    accionPrioritaria.responsable ||
                                    "Sin asignar"
                                )}
                            </span>

                            <a
                                href="acciones.html"
                                class="bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold px-2.5 py-1 rounded"
                            >
                                Gestionar
                            </a>

                        </div>

                    </div>

                `;

            }


            // RIESGOS PRIORITARIOS

            const cantidadRiesgos =
                accionPrioritaria
                    ? 2
                    : 3;


            const riesgosPrioritarios =
                [
                    ...riesgosEvaluados
                ]
                    .filter(
                        riesgo =>
                            normalizar(
                                riesgo.estado
                            ) !== "cerrado"
                    )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            b.puntaje -
                            a.puntaje
                    )
                    .slice(
                        0,
                        cantidadRiesgos
                    );


            riesgosPrioritarios.forEach(
                (
                    riesgo,
                    indice
                ) => {

                    const numero =
                        accionPrioritaria
                            ? indice + 2
                            : indice + 1;


                    prioridadesRiesgos.innerHTML += `

                        <div
                            class="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between"
                        >

                            <div>

                                <span
                                    class="text-[10px] font-bold text-red-600 uppercase"
                                >
                                    Prioridad #${numero}
                                    •
                                    ${escaparHTML(
                                        riesgo.criticidadCalculada
                                    )}
                                </span>

                                <h3
                                    class="font-bold text-xs text-slate-900 mt-1"
                                >
                                    ${escaparHTML(riesgo.id)}:
                                    ${escaparHTML(riesgo.titulo)}
                                </h3>

                                <p
                                    class="text-[11px] text-slate-500 mt-1"
                                >
                                    P ${escaparHTML(riesgo.probabilidad)}/5
                                    •
                                    I ${escaparHTML(riesgo.impacto)}/5
                                    •
                                    Puntaje ${escaparHTML(riesgo.puntaje)}/25
                                </p>

                            </div>

                            <div
                                class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2"
                            >

                                <span
                                    class="text-[10px] text-slate-400 font-semibold truncate"
                                >
                                    ${escaparHTML(
                                        riesgo.responsable ||
                                        "Sin asignar"
                                    )}
                                </span>

                                <a
                                    href="riesgo-detalle.html?id=${encodeURIComponent(riesgo.id)}"
                                    class="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold px-2.5 py-1 rounded"
                                >
                                    Gestionar
                                </a>

                            </div>

                        </div>

                    `;

                }
            );


            // SI QUEDA ESPACIO:
            // MOSTRAR MEJOR OPORTUNIDAD

            const cantidadActual =
                (
                    accionPrioritaria
                        ? 1
                        : 0
                ) +
                riesgosPrioritarios.length;


            if (
                cantidadActual < 3 &&
                oportunidadesActivasLista.length > 0
            ) {

                const mejorOportunidad =
                    [
                        ...oportunidadesActivasLista
                    ]
                        .sort(
                            (
                                a,
                                b
                            ) =>
                                Number(
                                    b.beneficioPotencial ||
                                    0
                                ) -
                                Number(
                                    a.beneficioPotencial ||
                                    0
                                )
                        )[0];


                prioridadesRiesgos.innerHTML += `

                    <div
                        class="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-sm flex flex-col justify-between"
                    >

                        <div>

                            <span
                                class="text-[10px] font-bold text-emerald-600 uppercase"
                            >
                                Oportunidad prioritaria
                            </span>

                            <h3
                                class="font-bold text-xs text-slate-900 mt-1"
                            >
                                ${escaparHTML(mejorOportunidad.id)}:
                                ${escaparHTML(mejorOportunidad.titulo)}
                            </h3>

                            <p
                                class="text-[11px] text-slate-500 mt-1"
                            >
                                Beneficio:
                                ${formatearMoneda(
                                    mejorOportunidad.beneficioPotencial
                                )}
                            </p>

                        </div>

                        <div
                            class="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2"
                        >

                            <span
                                class="text-[10px] text-slate-400 font-semibold truncate"
                            >
                                ${escaparHTML(
                                    mejorOportunidad.responsable ||
                                    "Sin asignar"
                                )}
                            </span>

                            <a
                                href="riesgos-oportunidades.html"
                                class="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold px-2.5 py-1 rounded"
                            >
                                Evaluar
                            </a>

                        </div>

                    </div>

                `;

            }

        }


        // =====================================================
        // 20. LOG FINAL
        // =====================================================

        console.log(
            "Dashboard Riesgos + Acciones + Oportunidades actualizado",
            {

                totalRiesgos,
                riesgosCriticos,
                riesgosAltos,
                riesgosModerados,
                riesgosBajos,

                totalAcciones,
                accionesCompletadas,
                accionesPendientesProceso,
                accionesVencidas,

                totalOportunidades,
                oportunidadesActivas,
                oportunidadesCapturadas,
                oportunidadesAprovechamiento,
                oportunidadesEvaluacion,

                beneficioPotencial,

                cumplimientoGlobal,
                saludPortafolio

            }
        );

    }

    catch (error) {

        console.error(
            "ERROR AL CARGAR DASHBOARD:",
            error
        );

    }

});