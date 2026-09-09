console.log("RIESGOS.JS CARGADO");

let registroVisualizado = null;

document.addEventListener("DOMContentLoaded", async () => {

    const tabla = document.getElementById("tablaRiesgos");

    let riesgos = [];
let oportunidades = [];
let acciones = [];
let portafolio = [];

    try {

        // =====================================================
        // 1. OBTENER RIESGOS
        // =====================================================

        riesgos = await RiesgosStorage.obtenerTodos();

        if (!Array.isArray(riesgos)) {
            riesgos = [];
        }

        console.log("Riesgos recibidos:", riesgos);


        // =====================================================
        // 2. OBTENER OPORTUNIDADES
        // =====================================================

        if (typeof OportunidadesStorage !== "undefined") {

            oportunidades =
                await OportunidadesStorage.obtenerTodas();

            if (!Array.isArray(oportunidades)) {
                oportunidades = [];
            }

        } else {

            console.warn(
                "OportunidadesStorage no está disponible."
            );

            oportunidades = [];
        }

        console.log(
            "Oportunidades recibidas:",
            oportunidades
        );

// =====================================================
// 3. OBTENER ACCIONES
// =====================================================

if (typeof AccionesStorage !== "undefined") {

    acciones =
        await AccionesStorage.obtenerTodas();

    if (!Array.isArray(acciones)) {
        acciones = [];
    }

} else {

    console.warn(
        "AccionesStorage no está disponible."
    );

    acciones = [];
}

console.log(
    "Acciones recibidas:",
    acciones
);


        // =====================================================
        // 3. NORMALIZAR RIESGOS
        // =====================================================

        const riesgosNormalizados =
            riesgos.map(riesgo => ({

                ...riesgo,

                tipo: "Riesgo",

                nivel:
                    riesgo.criticidad ||
                    riesgo.nivel ||
                    "Sin evaluar",

                fecha:
                    riesgo.fecha ||
                    riesgo.ultimaActualizacion ||
                    "-"

            }));


        // =====================================================
        // 4. NORMALIZAR OPORTUNIDADES
        // =====================================================

        const oportunidadesNormalizadas =
            oportunidades.map(oportunidad => ({

                ...oportunidad,

                tipo: "Oportunidad",

                nivel:
                    oportunidad.nivel ||
                    oportunidad.criticidad ||
                    obtenerNivelOportunidad(
                        oportunidad.probabilidad,
                        oportunidad.impacto
                    ),

                fecha:
                    oportunidad.fecha ||
                    oportunidad.ultimaActualizacion ||
                    "-"

            }));


        // =====================================================
        // 5. CREAR PORTAFOLIO ÚNICO
        // =====================================================

        portafolio = [
            ...riesgosNormalizados,
            ...oportunidadesNormalizadas
        ];

        console.log(
            "Portafolio completo:",
            portafolio
        );


        // =====================================================
        // 6. CARGAR TABLA
        // =====================================================

        renderizarTabla(portafolio);
actualizarKPIsPortafolio();

        // =====================================================
        // 7. LIMPIAR BADGES DE LA MATRIZ
        // =====================================================

        document
            .querySelectorAll("[data-celda-riesgo]")
            .forEach(celda => {

                const antiguos =
                    celda.querySelectorAll(
                        ".riesgo-matriz"
                    );

                antiguos.forEach(
                    elemento => elemento.remove()
                );

            });


        // =====================================================
        // 8. CARGAR SOLO RIESGOS EN MATRIZ 5x5
        // =====================================================

        riesgos.forEach(riesgo => {

            const probabilidad =
                Number(riesgo.probabilidad);

            const impacto =
                Number(riesgo.impacto);


            if (!probabilidad || !impacto) {

                console.warn(
                    "Riesgo sin P/I válida:",
                    riesgo.id
                );

                return;
            }


            const selector =
                `[data-impacto="${impacto}"][data-probabilidad="${probabilidad}"]`;

            const celda =
                document.querySelector(selector);


            if (!celda) {

                console.warn(
                    "No existe celda para:",
                    riesgo.id,
                    "P:",
                    probabilidad,
                    "I:",
                    impacto
                );

                return;
            }


            const badge =
                document.createElement("button");

            badge.type = "button";

            badge.textContent =
                riesgo.id;

            badge.className =
                obtenerClaseBadge(
                    riesgo.criticidad
                );

            badge.classList.add(
                "riesgo-matriz"
            );

            badge.addEventListener(
                "click",
                () => verRegistro(
                    "Riesgo",
                    riesgo.id
                )
            );

            celda.appendChild(
                badge
            );

        });


        console.log(
            "Matriz 5x5 actualizada correctamente"
        );


        // =====================================================
        // 9. ACTIVAR FILTROS
        // =====================================================

        configurarFiltros();


        // =====================================================
        // 10. ACTIVAR MODAL VER
        // =====================================================

        configurarModalVer();


        console.log(
            "RIESGOS.JS inicializado correctamente"
        );

    }

    catch (error) {

        console.error(
            "ERROR AL CARGAR PORTAFOLIO:",
            error
        );

    }

    function actualizarKPIsPortafolio() {

    const riesgosCriticos = riesgos.filter(riesgo => {
        const criticidad = String(
            riesgo.criticidadCalculada ||
            riesgo.criticidad ||
            riesgo.nivel ||
            ""
        ).toLowerCase().trim();

        return criticidad === "crítica" || criticidad === "critica";
    }).length;

const contadorAlertasCriticas =
    document.getElementById("contadorAlertasCriticas");

if (contadorAlertasCriticas) {
    contadorAlertasCriticas.textContent =
        `${riesgosCriticos} ${riesgosCriticos === 1 ? "Urgente" : "Urgentes"}`;
}

    const oportunidadesActivas = oportunidades.filter(oportunidad => {
        const estado = String(oportunidad.estado || "")
            .toLowerCase()
            .trim();

        return ![
            "cerrada",
            "cerrado",
            "descartada",
            "descartado",
            "completada",
            "completado"
        ].includes(estado);
    });

    const beneficioPotencial = oportunidadesActivas.reduce(
        (total, oportunidad) =>
            total + Number(
                oportunidad.beneficioPotencial ||
                oportunidad.beneficio ||
                0
            ),
        0
    );

    const accionesPendientes = acciones.filter(accion => {
        const estado = String(accion.estado || "")
            .toLowerCase()
            .trim();

        return ![
            "cerrada",
            "cerrado",
            "completada",
            "completado"
        ].includes(estado);
    }).length;

const accionesAtencion = acciones.filter((accion) => {
    const estado = String(accion.estado || "")
        .toLowerCase()
        .trim();

    if (["cerrada", "cerrado", "completada", "completado"].includes(estado)) {
        return false;
    }

    if (!accion.fechaCompromiso) return false;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaCompromiso = new Date(`${accion.fechaCompromiso}T00:00:00`);

    return fechaCompromiso < hoy;
}).length;

const contenedorAlertas =
    document.getElementById("alertasCriticasPortafolio");

if (contenedorAlertas) {
    const alertas = [];

    riesgos.forEach((riesgo) => {
        const criticidad = String(
            riesgo.criticidadCalculada ||
            riesgo.criticidad ||
            riesgo.nivel ||
            ""
        ).toLowerCase().trim();

        if (criticidad === "crítica" || criticidad === "critica") {
            alertas.push(`
                <div class="flex items-start space-x-3 p-3 rounded-lg bg-red-50/60 border border-red-100">
                    <span class="w-2.5 h-2.5 rounded-full bg-red-600 mt-1 shrink-0"></span>
                    <div>
                        <span class="font-bold text-slate-900 block">
                            ALERTA CRÍTICA: ${escaparHTML(riesgo.id)} permanece en condición crítica.
                        </span>
                        <span class="text-slate-500 text-[11px]">
                            Requiere seguimiento prioritario.
                        </span>
                    </div>
                </div>
            `);
        }
    });

    oportunidadesActivas.forEach((oportunidad) => {
        alertas.push(`
            <div class="flex items-start space-x-3 p-3 rounded-lg bg-emerald-50/40 border border-emerald-100">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
                <div>
                    <span class="font-bold text-slate-900 block">
                        ALERTA DE OPORTUNIDAD: ${escaparHTML(oportunidad.id)} requiere evaluación.
                    </span>
                    <span class="text-slate-500 text-[11px]">
                        Potencial de captura relevante.
                    </span>
                </div>
            </div>
        `);
    });

    if (alertas.length === 0) {
        contenedorAlertas.innerHTML = `
            <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500">
                No existen alertas críticas activas en el portafolio.
            </div>
        `;
    } else {
        contenedorAlertas.innerHTML = alertas.join("");
    }
}

    const accionesCompletadas = acciones.length - accionesPendientes;

    const cumplimientoGlobal =
        acciones.length > 0
            ? Math.round(
                (accionesCompletadas / acciones.length) * 100
            )
            : 0;

    const elementoRiesgos =
        document.getElementById("kpiRiesgosCriticos");

    const elementoOportunidades =
        document.getElementById("kpiOportunidadesActivas");

    const elementoBeneficio =
        document.getElementById("kpiBeneficioPotencial");

    const elementoAcciones =
        document.getElementById("kpiAccionesPendientes");

    const elementoCumplimiento =
        document.getElementById("kpiCumplimientoGlobal");

    if (elementoRiesgos) {
        elementoRiesgos.textContent = riesgosCriticos;
    }

    if (elementoOportunidades) {
        elementoOportunidades.textContent =
            oportunidadesActivas.length;
    }

    if (elementoBeneficio) {
        elementoBeneficio.textContent =
            "US$ " +
            beneficioPotencial.toLocaleString("es-CL");
    }

    if (elementoAcciones) {
        elementoAcciones.textContent = accionesPendientes;
    }

const elementoAccionesAtencion =
    document.getElementById("textoAccionesAtencion");

if (elementoAccionesAtencion) {
    elementoAccionesAtencion.textContent =
        `${accionesAtencion} requieren atención inmediata`;
}

    
    if (elementoCumplimiento) {
        elementoCumplimiento.textContent =
            `${cumplimientoGlobal}%`;
    }

    const barraCumplimiento =
    document.getElementById("barraCumplimientoGlobal");

if (barraCumplimiento) {
    barraCumplimiento.style.width =
        `${cumplimientoGlobal}%`;
}
const elementoExposicion =
    document.getElementById("kpiExposicionEconomica");

const exposicionEconomica = riesgos.reduce((total, riesgo) => {
    const valor = Number(
        riesgo.exposicionEconomica ||
        riesgo.exposicion ||
        riesgo.impactoEconomico ||
        0
    );

    return total + (Number.isFinite(valor) ? valor : 0);
}, 0);

if (elementoExposicion) {
    elementoExposicion.textContent =
        "US$ " + exposicionEconomica.toLocaleString("es-CL");
}

const elementoResumenEjecutivo =
    document.getElementById("resumenEjecutivoPortafolio");

if (elementoResumenEjecutivo) {

    let textoResumen =
        `El portafolio mantiene una exposición económica de US$ ${exposicionEconomica.toLocaleString("es-CL")}. `;

    if (riesgosCriticos > 0) {
        textoResumen +=
            `Existen ${riesgosCriticos} riesgo${riesgosCriticos === 1 ? "" : "s"} crítico${riesgosCriticos === 1 ? "" : "s"} que requieren intervención prioritaria. `;
    } else {
        textoResumen +=
            "No existen riesgos críticos activos. ";
    }

    if (oportunidadesActivas.length > 0) {
        textoResumen +=
            `Se registran ${oportunidadesActivas.length} oportunidad${oportunidadesActivas.length === 1 ? "" : "es"} activa${oportunidadesActivas.length === 1 ? "" : "s"} con un beneficio potencial de US$ ${beneficioPotencial.toLocaleString("es-CL")}. `;
    } else {
        textoResumen +=
            "No existen oportunidades activas actualmente. ";
    }

    textoResumen +=
        `Se mantienen ${accionesPendientes} acción${accionesPendientes === 1 ? "" : "es"} pendiente${accionesPendientes === 1 ? "" : "s"}, de las cuales ${accionesAtencion} requieren atención inmediata.`;

    elementoResumenEjecutivo.textContent = textoResumen;
}

const textoPrincipalesPreocupaciones =
    document.getElementById("textoPrincipalesPreocupaciones");

const textoDecisionesRecomendadas =
    document.getElementById("textoDecisionesRecomendadas");

const textoOportunidadesPrioritarias =
    document.getElementById("textoOportunidadesPrioritarias");

const textoImpactoEconomico =
    document.getElementById("textoImpactoEconomico");

if (textoPrincipalesPreocupaciones) {
    if (riesgosCriticos > 0) {
        textoPrincipalesPreocupaciones.textContent =
            `${riesgosCriticos} riesgo${riesgosCriticos === 1 ? "" : "s"} crítico${riesgosCriticos === 1 ? "" : "s"} requieren seguimiento prioritario.`;
    } else if (accionesAtencion > 0) {
        textoPrincipalesPreocupaciones.textContent =
            `${accionesAtencion} acción${accionesAtencion === 1 ? "" : "es"} requieren atención inmediata.`;
    } else {
        textoPrincipalesPreocupaciones.textContent =
            "No se identifican preocupaciones críticas inmediatas.";
    }
}

if (textoDecisionesRecomendadas) {
    if (accionesAtencion > 0) {
        textoDecisionesRecomendadas.textContent =
            "Priorizar el cierre de acciones vencidas y revisar responsables y plazos.";
    } else if (riesgosCriticos > 0) {
        textoDecisionesRecomendadas.textContent =
            "Definir y ejecutar medidas de tratamiento para los riesgos críticos.";
    } else {
        textoDecisionesRecomendadas.textContent =
            "Mantener seguimiento periódico del portafolio y sus compromisos.";
    }
}

if (textoOportunidadesPrioritarias) {
    if (oportunidadesActivas.length > 0) {
        textoOportunidadesPrioritarias.textContent =
            `Evaluar ${oportunidadesActivas.length} oportunidad${oportunidadesActivas.length === 1 ? "" : "es"} activa${oportunidadesActivas.length === 1 ? "" : "s"} y priorizar su captura de valor.`;
    } else {
        textoOportunidadesPrioritarias.textContent =
            "No existen oportunidades activas que requieran priorización.";
    }
}

if (textoImpactoEconomico) {
    textoImpactoEconomico.textContent =
        `Exposición: US$ ${exposicionEconomica.toLocaleString("es-CL")} · Beneficio potencial: US$ ${beneficioPotencial.toLocaleString("es-CL")}.`;
}

const elementoEstadoGeneral =
    document.getElementById("estadoGeneralPortafolio");

if (elementoEstadoGeneral) {
    if (
        riesgosCriticos === 0 &&
        oportunidadesActivas.length === 0 &&
        accionesPendientes === 0
    ) {
        elementoEstadoGeneral.textContent =
            "El portafolio no presenta riesgos críticos, oportunidades activas ni acciones pendientes.";
    } else {
        elementoEstadoGeneral.textContent =
            `El portafolio registra ${riesgosCriticos} riesgo${riesgosCriticos === 1 ? "" : "s"} crítico${riesgosCriticos === 1 ? "" : "s"}, ` +
            `${oportunidadesActivas.length} oportunidad${oportunidadesActivas.length === 1 ? "" : "es"} activa${oportunidadesActivas.length === 1 ? "" : "s"} ` +
            `y ${accionesPendientes} acción${accionesPendientes === 1 ? "" : "es"} pendiente${accionesPendientes === 1 ? "" : "s"}.`;
    }
}

const elementoSalud =
    document.getElementById("saludPortafolio");

if (elementoSalud) {

    const saludPortafolio = Math.max(
        0,
        Math.min(
            100,
            100
            - (riesgosCriticos * 15)
            - (accionesPendientes * 5)
        )
    );

    let estadoSalud = "Saludable";

    if (saludPortafolio < 50) {
        estadoSalud = "Crítico";
    } else if (saludPortafolio < 75) {
        estadoSalud = "Atención";
    }

    elementoSalud.innerHTML =
        `${saludPortafolio} / 100 ` +
        `<span class="text-xs font-semibold">${estadoSalud}</span>`;
}
}


    // =========================================================
    // RENDERIZAR TABLA
    // =========================================================

    function renderizarTabla(registros) {

        if (!tabla) {

            console.warn(
                "No se encontró tablaRiesgos"
            );

            return;
        }


        tabla.innerHTML = "";


        if (!registros.length) {

            tabla.innerHTML = `
                <tr>
                    <td
                        colspan="10"
                        class="p-8 text-center text-slate-400"
                    >
                        No existen registros para mostrar.
                    </td>
                </tr>
            `;

            actualizarTextoCantidad(0);

            return;
        }


        registros.forEach(registro => {

            const esRiesgo =
                registro.tipo === "Riesgo";


            const tipoHTML =
                obtenerBadgeTipo(
                    registro.tipo
                );


            const probabilidad =
                Number(
                    registro.probabilidad || 0
                );


            const impacto =
                Number(
                    registro.impacto || 0
                );


            const probImpactoHTML = `
                <span class="text-blue-600 font-semibold">
                    P ${probabilidad || "-"}/5
                </span>

                <span class="text-slate-400 mx-1">
                    •
                </span>

                <span class="${
                    esRiesgo
                        ? "text-red-600"
                        : "text-emerald-600"
                } font-semibold">
                    ${
                        esRiesgo
                            ? "I"
                            : "I+"
                    } ${impacto || "-"}/5
                </span>
            `;


            const nivelHTML =
                esRiesgo
                    ? obtenerBadgeCriticidad(
                        registro.criticidad ||
                        registro.nivel
                    )
                    : obtenerBadgeOportunidad(
                        registro.nivel
                    );


            const botonVer = `
                <button
                    type="button"
                    onclick="verRegistro('${escaparJS(registro.tipo)}', '${escaparJS(registro.id)}')"
                    class="px-3 py-1 rounded-lg ${
                        esRiesgo
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                    } text-white text-xs font-semibold transition"
                >
                    Ver
                </button>
            `;


            const botonEditar =
                esRiesgo

                    ? `
                        <button
                            type="button"
                            onclick="editarRiesgo('${escaparJS(registro.id)}')"
                            class="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition"
                        >
                            Editar
                        </button>
                    `

                    : `
                        <button
                            type="button"
                            onclick="editarOportunidad('${escaparJS(registro.id)}')"
                            class="px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition"
                        >
                            Editar
                        </button>
                    `;


            const botonEliminar =
                esRiesgo

                    ? `
                        <button
                            type="button"
                            onclick="eliminarRiesgo('${escaparJS(registro.id)}')"
                            class="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                        >
                            Eliminar
                        </button>
                    `

                    : `
                        <button
                            type="button"
                            onclick="eliminarOportunidad('${escaparJS(registro.id)}')"
                            class="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                        >
                            Eliminar
                        </button>
                    `;


            tabla.innerHTML += `
                <tr
                    class="hover:bg-slate-50 transition-colors"
                    data-tipo="${escaparHTML(registro.tipo)}"
                    data-id="${escaparHTML(registro.id)}"
                >

                    <td class="p-4 font-bold text-slate-800">
                        ${escaparHTML(registro.id || "-")}
                    </td>

                    <td class="p-4">
                        ${tipoHTML}
                    </td>

                    <td class="p-4">
                        <div class="font-medium text-slate-800">
                            ${escaparHTML(
                                registro.titulo ||
                                registro.descripcion ||
                                "-"
                            )}
                        </div>
                    </td>

                    <td class="p-4">
                        ${obtenerBadgeCategoria(
                            registro.categoria ||
                            "General"
                        )}
                    </td>

                    <td class="p-4 whitespace-nowrap">
                        ${probImpactoHTML}
                    </td>

                    <td class="p-4">
                        ${nivelHTML}
                    </td>

                    <td class="p-4">
                        ${escaparHTML(
                            registro.responsable ||
                            "Sin asignar"
                        )}
                    </td>

                    <td class="p-4">
                        ${obtenerBadgeEstado(
                            registro.estado ||
                            "-"
                        )}
                    </td>

                    <td class="p-4 whitespace-nowrap">
                        ${escaparHTML(
                            registro.fecha ||
                            "-"
                        )}
                    </td>

                    <td class="p-4">
                        <div class="flex justify-end gap-2">
                            ${botonVer}
                            ${botonEditar}
                            ${botonEliminar}
                        </div>
                    </td>

                </tr>
            `;

        });


        actualizarTextoCantidad(
            registros.length
        );


        console.log(
            "Tabla del portafolio cargada:",
            registros.length,
            "registros"
        );
    }


    // =========================================================
    // CONFIGURAR FILTROS
    // =========================================================

    function configurarFiltros() {

        const selects =
            Array.from(
                document.querySelectorAll("select")
            );


        const filtroTipo =
            encontrarSelectPorPrimeraOpcion(
                selects,
                "Tipo:"
            );


        const filtroCriticidad =
            encontrarSelectPorPrimeraOpcion(
                selects,
                "Criticidad:"
            );


        const filtroEstado =
            encontrarSelectPorPrimeraOpcion(
                selects,
                "Estado:"
            );


        const filtroResponsable =
            encontrarSelectPorPrimeraOpcion(
                selects,
                "Responsable:"
            );


        const filtroCategoria =
            encontrarSelectPorPrimeraOpcion(
                selects,
                "Categoría:"
            );


        const buscador =
            encontrarBuscadorPortafolio();


        if (filtroTipo) {

            filtroTipo.innerHTML = `
                <option value="">
                    Tipo: Todos
                </option>

                <option value="Riesgo">
                    Riesgos
                </option>

                <option value="Oportunidad">
                    Oportunidades
                </option>
            `;
        }


        if (filtroResponsable) {

            const responsables =
                [
                    ...new Set(
                        portafolio
                            .map(
                                registro =>
                                    String(
                                        registro.responsable ||
                                        ""
                                    ).trim()
                            )
                            .filter(Boolean)
                    )
                ]
                .sort(
                    (a, b) =>
                        a.localeCompare(
                            b,
                            "es"
                        )
                );


            filtroResponsable.innerHTML = `
                <option value="">
                    Responsable: Todos
                </option>
            `;


            responsables.forEach(
                responsable => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        responsable;

                    option.textContent =
                        responsable;

                    filtroResponsable
                        .appendChild(
                            option
                        );
                }
            );
        }


        if (filtroCategoria) {

            const categorias =
                [
                    ...new Set(
                        portafolio
                            .map(
                                registro =>
                                    String(
                                        registro.categoria ||
                                        ""
                                    ).trim()
                            )
                            .filter(Boolean)
                    )
                ]
                .sort(
                    (a, b) =>
                        a.localeCompare(
                            b,
                            "es"
                        )
                );


            filtroCategoria.innerHTML = `
                <option value="">
                    Categoría: Todas
                </option>
            `;


            categorias.forEach(
                categoria => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        categoria;

                    option.textContent =
                        categoria;

                    filtroCategoria
                        .appendChild(
                            option
                        );
                }
            );
        }


        [
            filtroTipo,
            filtroCriticidad,
            filtroEstado,
            filtroResponsable,
            filtroCategoria
        ]
        .filter(Boolean)
        .forEach(
            filtro => {

                filtro.addEventListener(
                    "change",
                    aplicarFiltros
                );

            }
        );


        if (buscador) {

            buscador.addEventListener(
                "input",
                aplicarFiltros
            );
        }


        function aplicarFiltros() {

            const tipo =
                filtroTipo
                    ? filtroTipo.value
                    : "";


            const criticidad =
                filtroCriticidad
                    ? limpiarValorFiltro(
                        filtroCriticidad.value
                    )
                    : "";


            const estado =
                filtroEstado
                    ? limpiarValorFiltro(
                        filtroEstado.value
                    )
                    : "";


            const responsable =
                filtroResponsable
                    ? filtroResponsable.value
                    : "";


            const categoria =
                filtroCategoria
                    ? filtroCategoria.value
                    : "";


            const texto =
                buscador
                    ? normalizar(
                        buscador.value
                    )
                    : "";


            const filtrados =
                portafolio.filter(
                    registro => {

                        const coincideTipo =
                            !tipo ||
                            registro.tipo === tipo;


                        const nivelRegistro =
                            normalizar(
                                registro.criticidad ||
                                registro.nivel ||
                                ""
                            );


                        const coincideCriticidad =
                            !criticidad ||
                            nivelRegistro.includes(
                                normalizar(
                                    criticidad
                                )
                            );


                        const coincideEstado =
                            !estado ||
                            normalizar(
                                registro.estado
                            ).includes(
                                normalizar(
                                    estado
                                )
                            );


                        const coincideResponsable =
                            !responsable ||
                            registro.responsable ===
                            responsable;


                        const coincideCategoria =
                            !categoria ||
                            registro.categoria ===
                            categoria;


                        const textoRegistro =
                            normalizar(
                                [
                                    registro.id,
                                    registro.titulo,
                                    registro.descripcion,
                                    registro.tipo,
                                    registro.categoria,
                                    registro.responsable,
                                    registro.estado
                                ]
                                .filter(Boolean)
                                .join(" ")
                            );


                        const coincideTexto =
                            !texto ||
                            textoRegistro.includes(
                                texto
                            );


                        return (
                            coincideTipo &&
                            coincideCriticidad &&
                            coincideEstado &&
                            coincideResponsable &&
                            coincideCategoria &&
                            coincideTexto
                        );
                    }
                );


            renderizarTabla(
                filtrados
            );
        }
    }


    // =========================================================
    // CONFIGURAR EVENTOS DEL MODAL VER
    // =========================================================

    function configurarModalVer() {

        const modal =
            document.getElementById(
                "modalVerRegistro"
            );

        const cerrarSuperior =
            document.getElementById(
                "cerrarVerRegistro"
            );

        const cerrarFooter =
            document.getElementById(
                "cerrarVerRegistroFooter"
            );

        const editar =
            document.getElementById(
                "editarDesdeVer"
            );


        if (!modal) {

            console.warn(
                "No se encontró modalVerRegistro."
            );

            return;
        }


        if (cerrarSuperior) {

            cerrarSuperior.addEventListener(
                "click",
                cerrarModalVer
            );
        }


        if (cerrarFooter) {

            cerrarFooter.addEventListener(
                "click",
                cerrarModalVer
            );
        }


        modal.addEventListener(
            "click",
            evento => {

                if (evento.target === modal) {

                    cerrarModalVer();
                }
            }
        );


        if (editar) {

            editar.addEventListener(
                "click",
                async () => {

                    if (!registroVisualizado) {
                        return;
                    }


                    const {
                        tipo,
                        id
                    } = registroVisualizado;


                    cerrarModalVer();


                    if (
                        tipo === "Riesgo" &&
                        typeof window.editarRiesgo ===
                        "function"
                    ) {

                        await window.editarRiesgo(id);

                    } else if (
                        tipo === "Oportunidad" &&
                        typeof window.editarOportunidad ===
                        "function"
                    ) {

                        await window.editarOportunidad(id);
                    }
                }
            );
        }


        document.addEventListener(
            "keydown",
            evento => {

                if (
                    evento.key === "Escape" &&
                    !modal.classList.contains("hidden")
                ) {

                    cerrarModalVer();
                }
            }
        );
    }

});


// =========================================================
// VER REGISTRO EN MODAL PROFESIONAL
// =========================================================

async function verRegistro(tipo, id) {

    try {

        let registro = null;


        if (tipo === "Riesgo") {

            registro =
                await RiesgosStorage.obtenerPorId(id);

        } else {

            if (
                typeof OportunidadesStorage ===
                "undefined"
            ) {

                alert(
                    "OportunidadesStorage no está disponible."
                );

                return;
            }


            registro =
                await OportunidadesStorage.obtenerPorId(id);
        }


        if (!registro) {

            alert(
                `No se encontró el registro ${id}.`
            );

            return;
        }

        const todasLasAcciones =
    typeof AccionesStorage !== "undefined"
        ? await AccionesStorage.obtenerTodas()
        : [];

const accionesAsociadas =
    todasLasAcciones.filter(accion =>
        accion.registroId === id ||
        accion.riesgoId === id ||
        accion.oportunidadId === id
    );

        registroVisualizado = {
            tipo,
            id
        };


        const modal =
            document.getElementById(
                "modalVerRegistro"
            );


        if (!modal) {

            console.error(
                "No se encontró modalVerRegistro."
            );

            return;
        }


        const esRiesgo =
            tipo === "Riesgo";


        setTexto(
            "verTituloModal",
            `${esRiesgo ? "Detalle de Riesgo" : "Detalle de Oportunidad"} ${id}`
        );


        setTexto(
            "verSubtituloModal",
            esRiesgo
                ? "Información completa del riesgo registrado."
                : "Información completa de la oportunidad registrada."
        );


        const badgeTipo =
            document.getElementById(
                "verBadgeTipo"
            );


        if (badgeTipo) {

            badgeTipo.textContent =
                esRiesgo
                    ? "⚠ Riesgo"
                    : "💡 Oportunidad";


            badgeTipo.className =
                esRiesgo

                    ? "px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700"

                    : "px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
        }


        setTexto(
            "verEmpresa",
            registro.empresa ||
            "Sin información"
        );


        setTexto(
            "verContrato",
            registro.contrato ||
            "Sin información"
        );


        setTexto(
            "verFaena",
            registro.faena ||
            "Sin información"
        );


        setTexto(
            "verId",
            registro.id ||
            "-"
        );


        setTexto(
            "verResponsable",
            registro.responsable ||
            "Sin asignar"
        );


        setTexto(
            "verFecha",
            registro.fecha ||
            registro.ultimaActualizacion ||
            "-"
        );


        setTexto(
            "verTitulo",
            registro.titulo ||
            "-"
        );


        setTexto(
            "verDescripcion",
            registro.descripcion ||
            "-"
        );


        setTexto(
            "verCategoria",
            registro.categoria ||
            "General"
        );


        setTexto(
            "verEstado",
            registro.estado ||
            "-"
        );


        setTexto(
            "verProbabilidad",
            formatearProbabilidad(
                registro.probabilidad
            )
        );


        setTexto(
            "verImpacto",
            formatearImpacto(
                registro.impacto
            )
        );


        const labelImpacto =
            document.getElementById(
                "verLabelImpacto"
            );


        if (labelImpacto) {

            labelImpacto.textContent =
                esRiesgo
                    ? "Impacto"
                    : "Impacto Positivo";
        }


        const nivel =
            esRiesgo
                ? (
                    registro.criticidad ||
                    registro.nivel ||
                    "Sin evaluar"
                )
                : (
                    registro.nivel ||
                    registro.criticidad ||
                    obtenerNivelOportunidad(
                        registro.probabilidad,
                        registro.impacto
                    )
                );


        setTexto(
            "verNivel",
            nivel
        );


        const labelNivel =
            document.getElementById(
                "verLabelNivel"
            );


        if (labelNivel) {

            labelNivel.textContent =
                esRiesgo
                    ? "Criticidad"
                    : "Nivel de Oportunidad";
        }


        const labelPlan =
            document.getElementById(
                "verLabelPlan"
            );


        if (labelPlan) {

            labelPlan.textContent =
                esRiesgo
                    ? "Plan de Acción"
                    : "Plan de Captura";
        }


      setTexto(
    "verPlan",
    accionesAsociadas.length
        ? accionesAsociadas
            .map(accion =>
                `${accion.id} — ${accion.accion || "Sin descripción"} | ${accion.estado || "Sin estado"} | ${accion.responsable || "Sin asignar"} | ${Number(accion.avance || 0)}%`
            )
            .join("\n")
        : (
            esRiesgo
                ? (
                    registro.planAccion ||
                    "Sin acciones asociadas."
                )
                : (
                    registro.planCaptura ||
                    registro.planAccion ||
                    "Sin acciones asociadas."
                )
        )
);


        const grupoBeneficio =
            document.getElementById(
                "verGrupoBeneficio"
            );

        const resumenOportunidad =
            document.getElementById(
                "verResumenOportunidad"
            );


        if (esRiesgo) {

            grupoBeneficio
                ?.classList
                .add("hidden");

            resumenOportunidad
                ?.classList
                .add("hidden");


        } else {

            grupoBeneficio
                ?.classList
                .remove("hidden");

            resumenOportunidad
                ?.classList
                .remove("hidden");


            const beneficio =
                formatearDinero(
                    registro.beneficioPotencial
                );


            setTexto(
                "verBeneficioPotencial",
                beneficio
            );


            setTexto(
                "verBeneficioDestacado",
                beneficio
            );
        }


        setTexto(
            "verTextoTipoRegistro",
            `${tipo} ${id} · VIREON`
        );
// Cargar trazabilidad del registro
if (typeof renderizarTrazabilidad === "function") {
    renderizarTrazabilidad(tipo, registro);
}

        modal.classList
            .remove("hidden");

        modal.classList
            .add("flex");


    } catch (error) {

        console.error(
            "ERROR AL VER REGISTRO:",
            error
        );


        alert(
            "No fue posible abrir el detalle del registro."
        );
    }
}


// =========================================================
// COMPATIBILIDAD VER OPORTUNIDAD
// =========================================================

async function verOportunidad(id) {

    return verRegistro(
        "Oportunidad",
        id
    );
}


// =========================================================
// CERRAR MODAL VER
// =========================================================

function cerrarModalVer() {

    const modal =
        document.getElementById(
            "modalVerRegistro"
        );


    if (!modal) {
        return;
    }


    modal.classList
        .remove("flex");

    modal.classList
        .add("hidden");
}


// =========================================================
// NIVEL DE OPORTUNIDAD
// =========================================================

function obtenerNivelOportunidad(
    probabilidad,
    impacto
) {

    const p =
        Number(probabilidad || 0);

    const i =
        Number(impacto || 0);

    const resultado =
        p * i;


    if (resultado >= 16) {
        return "Muy Alta";
    }


    if (resultado >= 10) {
        return "Alta";
    }


    if (resultado >= 5) {
        return "Moderada";
    }


    if (resultado > 0) {
        return "Baja";
    }


    return "Sin evaluar";
}


// =========================================================
// BADGE PARA MATRIZ
// =========================================================

function obtenerClaseBadge(criticidad) {

    const nivel =
        String(criticidad || "")
            .toLowerCase();


    const base =
        "riesgo-matriz inline-block mt-1 mx-0.5 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm hover:opacity-80 transition-opacity";


    if (
        nivel === "baja" ||
        nivel === "bajo"
    ) {

        return `${base} bg-emerald-600`;
    }


    if (
        nivel === "moderada" ||
        nivel === "moderado" ||
        nivel === "media" ||
        nivel === "medio"
    ) {

        return `${base} bg-blue-600`;
    }


    if (
        nivel === "alta" ||
        nivel === "alto"
    ) {

        return `${base} bg-amber-600`;
    }


    return `${base} bg-red-600`;
}


// =========================================================
// BADGE CRITICIDAD PARA TABLA
// =========================================================

function obtenerBadgeCriticidad(criticidad) {

    const nivel =
        String(criticidad || "")
            .toLowerCase();


    if (
        nivel === "baja" ||
        nivel === "bajo"
    ) {

        return `
            <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                ● Baja
            </span>
        `;
    }


    if (
        nivel === "moderada" ||
        nivel === "moderado" ||
        nivel === "media" ||
        nivel === "medio"
    ) {

        return `
            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                ● Moderada
            </span>
        `;
    }


    if (
        nivel === "alta" ||
        nivel === "alto"
    ) {

        return `
            <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                ● Alta
            </span>
        `;
    }


    if (nivel === "sin evaluar") {

        return `
            <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                ● Sin evaluar
            </span>
        `;
    }


    return `
        <span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
            ● Crítica
        </span>
    `;
}


// =========================================================
// BADGE NIVEL OPORTUNIDAD
// =========================================================

function obtenerBadgeOportunidad(nivel) {

    const valor =
        String(nivel || "")
            .toLowerCase();


    if (
        valor === "muy alta" ||
        valor === "muy alto"
    ) {

        return `
            <span class="px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold">
                ◆ Muy Alta
            </span>
        `;
    }


    if (
        valor === "alta" ||
        valor === "alto"
    ) {

        return `
            <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                ◆ Alta
            </span>
        `;
    }


    if (
        valor === "moderada" ||
        valor === "moderado" ||
        valor === "media"
    ) {

        return `
            <span class="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                ◆ Moderada
            </span>
        `;
    }


    if (
        valor === "baja" ||
        valor === "bajo"
    ) {

        return `
            <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                ◆ Baja
            </span>
        `;
    }


    return `
        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
            ◆ Sin evaluar
        </span>
    `;
}


// =========================================================
// BADGE TIPO
// =========================================================

function obtenerBadgeTipo(tipo) {

    if (tipo === "Oportunidad") {

        return `
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                💡 Oportunidad
            </span>
        `;
    }


    return `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
            ⚠ Riesgo
        </span>
    `;
}


// =========================================================
// BADGE ESTADO
// =========================================================

function obtenerBadgeEstado(estado) {

    const valor =
        String(estado || "")
            .toLowerCase();


    if (
        valor === "capturada" ||
        valor === "cerrado"
    ) {

        return `
            <span class="font-semibold text-emerald-600">
                ${escaparHTML(estado)}
            </span>
        `;
    }


    if (
        valor === "en aprovechamiento" ||
        valor === "en proceso"
    ) {

        return `
            <span class="font-semibold text-blue-600">
                ${escaparHTML(estado)}
            </span>
        `;
    }


    if (valor === "descartada") {

        return `
            <span class="font-semibold text-slate-500">
                ${escaparHTML(estado)}
            </span>
        `;
    }


    return `
        <span class="text-slate-700">
            ${escaparHTML(estado)}
        </span>
    `;
}


// =========================================================
// BADGE CATEGORÍA
// =========================================================

function obtenerBadgeCategoria(categoria) {

    switch (categoria) {

        case "Plazo":

            return `
                <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    📅 Plazo
                </span>
            `;


        case "Costo":

            return `
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    💰 Costo
                </span>
            `;


        case "Calidad":

            return `
                <span class="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                    ⭐ Calidad
                </span>
            `;


        case "Seguridad":

            return `
                <span class="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                    🦺 Seguridad
                </span>
            `;


        case "Ambiental":

            return `
                <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    🌱 Ambiental
                </span>
            `;


        default:

            return `
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    ${escaparHTML(categoria || "General")}
                </span>
            `;
    }
}


// =========================================================
// ELIMINAR RIESGO
// =========================================================

async function eliminarRiesgo(id) {

    const confirmar =
        confirm(
            `¿Estás seguro de que deseas eliminar el riesgo ${id}?\n\nEsta acción no se puede deshacer.`
        );


    if (!confirmar) {
        return;
    }


    try {

        await RiesgosStorage.eliminar(id);
localStorage.removeItem(`vireon_trazabilidad_${id}`);

        console.log(
            `Riesgo ${id} eliminado correctamente`
        );


        alert(
            `El riesgo ${id} fue eliminado correctamente.`
        );


        window.location.reload();


    } catch (error) {

        console.error(
            "ERROR AL ELIMINAR RIESGO:",
            error
        );


        alert(
            "No fue posible eliminar el riesgo."
        );
    }
}


// =========================================================
// ELIMINAR OPORTUNIDAD
// =========================================================

async function eliminarOportunidad(id) {

    const confirmar =
        confirm(
            `¿Estás seguro de que deseas eliminar la oportunidad ${id}?\n\nEsta acción no se puede deshacer.`
        );


    if (!confirmar) {
        return;
    }


    try {

        if (
            typeof OportunidadesStorage ===
            "undefined"
        ) {

            alert(
                "OportunidadesStorage no está disponible."
            );

            return;
        }


        await OportunidadesStorage.eliminar(id);

        localStorage.removeItem(`vireon_trazabilidad_${id}`);

        console.log(
            `Oportunidad ${id} eliminada correctamente`
        );


        alert(
            `La oportunidad ${id} fue eliminada correctamente.`
        );


        window.location.reload();


    } catch (error) {

        console.error(
            "ERROR AL ELIMINAR OPORTUNIDAD:",
            error
        );


        alert(
            "No fue posible eliminar la oportunidad."
        );
    }
}


// =========================================================
// UTILIDADES DE FILTROS
// =========================================================

function encontrarSelectPorPrimeraOpcion(
    selects,
    texto
) {

    return selects.find(
        select => {

            const primera =
                select.options[0]
                    ?.textContent ||
                "";

            return primera
                .trim()
                .startsWith(texto);
        }
    );
}


function encontrarBuscadorPortafolio() {

    const inputs =
        Array.from(
            document.querySelectorAll(
                'input[type="text"], input[type="search"]'
            )
        );


    return inputs.find(
        input => {

            const placeholder =
                String(
                    input.placeholder ||
                    ""
                )
                .toLowerCase();

            return (
                placeholder.includes("id") &&
                (
                    placeholder.includes("descripción") ||
                    placeholder.includes("descripcion")
                )
            );
        }
    ) || null;
}


function limpiarValorFiltro(valor) {

    const texto =
        String(valor || "")
            .trim();


    if (
        !texto ||
        texto.toLowerCase() === "todos" ||
        texto.toLowerCase() === "todas"
    ) {

        return "";
    }


    return texto;
}


function normalizar(valor) {

    return String(valor || "")
        .trim()
        .toLocaleLowerCase("es");
}


// =========================================================
// ACTUALIZAR TEXTO DE CANTIDAD
// =========================================================

function actualizarTextoCantidad(cantidad) {

    const textos =
        Array.from(
            document.querySelectorAll(
                "span, p, div"
            )
        );


    const elemento =
        textos.find(
            item => {

                const texto =
                    String(
                        item.textContent ||
                        ""
                    )
                    .trim()
                    .toLowerCase();

                return (
                    texto ===
                    "mostrando registros activos" ||
                    texto.includes("registro mostrado") ||
                    texto.includes("registros mostrados")
                );
            }
        );


    if (elemento) {

        elemento.textContent =
            `${cantidad} registro${
                cantidad === 1
                    ? ""
                    : "s"
            } mostrado${
                cantidad === 1
                    ? ""
                    : "s"
            }`;
    }
}


// =========================================================
// FORMATEO MODAL VER
// =========================================================

function setTexto(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            valor ?? "-";
    }
}


function formatearProbabilidad(valor) {

    const numero =
        Number(valor);


    const etiquetas = {
        1: "1 - Muy baja",
        2: "2 - Baja",
        3: "3 - Media",
        4: "4 - Alta",
        5: "5 - Muy alta"
    };


    return etiquetas[numero] || "-";
}


function formatearImpacto(valor) {

    const numero =
        Number(valor);


    const etiquetas = {
        1: "1 - Menor",
        2: "2 - Bajo",
        3: "3 - Moderado",
        4: "4 - Mayor",
        5: "5 - Crítico"
    };


    return etiquetas[numero] || "-";
}


function formatearDinero(valor) {

    const numero =
        Number(valor || 0);


    return numero.toLocaleString(
        "es-CL",
        {
            maximumFractionDigits: 0
        }
    );
}


// =========================================================
// SEGURIDAD BÁSICA PARA TEXTO HTML
// =========================================================

function escaparHTML(valor) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// =========================================================
// ESCAPAR VALORES PARA ONCLICK
// =========================================================

function escaparJS(valor) {

    return String(valor ?? "")
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");
}
// ============================================================
// TRAZABILIDAD DEL REGISTRO
// ============================================================

function renderizarTrazabilidad(tipo, registro) {

    const contenedor =
        document.getElementById("verTrazabilidad");

    if (!contenedor) {
        return;
    }

    const responsable =
        registro.responsable ||
        "Sistema VIREON";

    const fecha =
        registro.ultimaActualizacion ||
        registro.fechaActualizacion ||
        registro.fecha ||
        "Sin fecha";

    const nombreTipo =
        tipo === "Oportunidad"
            ? "Oportunidad"
            : "Riesgo";

      const claveTrazabilidad =
    `vireon_trazabilidad_${registro.id}`;

let historial = [];

try {
    historial =
        JSON.parse(
            localStorage.getItem(claveTrazabilidad)
        ) || [];
} catch (error) {
    historial = [];
}

const historialHTML =
    historial.map(evento => `
        <div class="relative pl-6 border-l border-slate-200">

            <span class="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-violet-500"></span>

            <p class="text-xs font-semibold text-slate-800">
                ${escaparHTML(evento.titulo || "Actualización")}
            </p>

            <p class="text-xs text-slate-500 mt-1">
                ${escaparHTML(evento.descripcion || "")}
            </p>

            <p class="text-[11px] text-violet-600 mt-2 font-medium">
                ${escaparHTML(evento.responsable || "Sistema VIREON")}
            </p>

            <p class="text-[10px] text-slate-400 mt-1">
                ${escaparHTML(evento.fecha || "Sin fecha")}
            </p>

        </div>
    `).join("");      
    contenedor.innerHTML = `
        <div class="space-y-5">

            <div class="relative pl-6 border-l border-slate-200">

                <span class="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600"></span>

                <p class="text-xs font-semibold text-slate-800">
                    Registro creado
                </p>

                <p class="text-xs text-slate-500 mt-1">
                    ${nombreTipo} incorporado al portafolio.
                </p>

                <p class="text-[11px] text-blue-600 mt-2 font-medium">
                    ${escaparHTML(registro.creadoPor || responsable)}
                </p>

                <p class="text-[10px] text-slate-400 mt-1">
                    ${escaparHTML(fecha)}
                </p>

            </div>

            <div class="relative pl-6 border-l border-slate-200">

                <span class="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-amber-500"></span>

                <p class="text-xs font-semibold text-slate-800">
                    Plan de acción definido
                </p>

                <p class="text-xs text-slate-500 mt-1">
                    Se establece tratamiento y seguimiento del registro.
                </p>

                <p class="text-[11px] text-slate-600 mt-2 font-medium">
                    ${escaparHTML(registro.creadoPor || responsable)}
                </p>

            </div>

            
${historialHTML}
        </div>
    `;
}