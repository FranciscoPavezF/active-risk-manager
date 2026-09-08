console.log("ACCIONES.JS CARGADO");

document.addEventListener("DOMContentLoaded", async () => {

    try {

        // =====================================================
        // 1. ELEMENTOS
        // =====================================================

        const tablaAcciones =
            document.getElementById("tablaAcciones");

        const buscarAcciones =
            document.getElementById("buscarAcciones");

        const filtroTipoOrigen =
            document.getElementById("filtroTipoOrigen");

            const filtroEmpresa =
    document.getElementById("filtroEmpresa");

const filtroContrato =
    document.getElementById("filtroContrato");

const filtroFaena =
    document.getElementById("filtroFaena");
    
        const filtroResponsable =
            document.getElementById("filtroResponsable");

        const filtroEstado =
            document.getElementById("filtroEstado");
            const filtroPrioridad =
    document.getElementById("filtroPrioridad");


        // KPI

        const kpiAccionesAbiertas =
            document.getElementById(
                "kpiAccionesAbiertas"
            );

        const kpiAccionesVencidas =
            document.getElementById(
                "kpiAccionesVencidas"
            );

        const kpiAccionesCompletadas =
            document.getElementById(
                "kpiAccionesCompletadas"
            );

        const kpiCumplimientoAcciones =
            document.getElementById(
                "kpiCumplimientoAcciones"
            );

        const barraCumplimientoAcciones =
            document.getElementById(
                "barraCumplimientoAcciones"
            );

        const kpiAccionesOportunidades =
            document.getElementById(
                "kpiAccionesOportunidades"
            );

        const textoTotalAcciones =
            document.getElementById(
                "textoTotalAcciones"
            );

        const textoListadoAcciones =
            document.getElementById(
                "textoListadoAcciones"
            );


        // =====================================================
        // 2. OBTENER DATOS
        // =====================================================

        const acciones =
            await AccionesStorage.obtenerTodas();
            const riesgos =
    await RiesgosStorage.obtenerTodos();

        console.log(
            "Acciones recibidas:",
            acciones
        );


        // =====================================================
        // 3. FUNCIONES AUXILIARES
        // =====================================================

        function normalizar(texto) {

            return String(texto || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
        }


        function escaparHTML(valor) {

            return String(valor ?? "")
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&#039;");
        }


        function esCerrada(accion) {

            const estado =
                normalizar(accion.estado);

            return (
                estado === "cerrada" ||
                estado === "cerrado" ||
                estado === "completada" ||
                estado === "completado"
            );
        }


        function estaVencida(accion) {

            if (esCerrada(accion)) {
                return false;
            }

            if (!accion.fechaCompromiso) {
                return false;
            }

            const hoy = new Date();

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


        function tipoOrigen(accion) {

            // Primero usar el dato explícito si existe
            if (accion.tipoOrigen) {

                const tipo =
                    normalizar(
                        accion.tipoOrigen
                    );

                if (tipo === "oportunidad") {
                    return "Oportunidad";
                }

                if (tipo === "riesgo") {
                    return "Riesgo";
                }
            }


            // Compatibilidad con registros anteriores

            const registro =
                String(
                    accion.riesgoId ||
                    accion.registroId ||
                    ""
                )
                    .toUpperCase()
                    .trim();


            if (registro.startsWith("O-")) {
                return "Oportunidad";
            }

            return "Riesgo";
        }


        function obtenerRegistroAsociado(accion) {

            return (
                accion.riesgoId ||
                accion.registroId ||
                accion.oportunidadId ||
                "Sin registro"
            );
        }
function obtenerPrioridadAccion(accion) {

    // Primero usar la prioridad que ya viene
    // guardada en la propia acción.
    if (
        accion.prioridad &&
        normalizar(accion.prioridad) !== "oportunidad"
    ) {
        return accion.prioridad;
    }


    const origen =
        tipoOrigen(accion);

    const registro =
        obtenerRegistroAsociado(accion);


    // =====================================================
    // OPORTUNIDAD
    // =====================================================

    if (origen === "Oportunidad") {

        // Compatibilidad con acciones antiguas.
        // Si todavía no tienen prioridad válida,
        // se consideran sin evaluar.
        return "Sin evaluar";
    }


    // =====================================================
    // RIESGO
    // =====================================================

    const riesgo =
        riesgos.find(
            item =>
                item.id === registro
        );


    if (!riesgo) {
        return "Sin prioridad";
    }


    return (
        riesgo.nivel ||
        riesgo.criticidad ||
        "Sin prioridad"
    );
}


        function obtenerEstadoVisual(accion) {

            if (estaVencida(accion)) {
                return "Vencida";
            }

            return (
                accion.estado ||
                "Pendiente"
            );
        }


        function claseEstado(estado) {

            const valor =
                normalizar(estado);


            if (
                valor === "cerrada" ||
                valor === "cerrado" ||
                valor === "completada" ||
                valor === "completado"
            ) {

                return (
                    "bg-emerald-100 " +
                    "text-emerald-700"
                );
            }


            if (valor === "vencida") {

                return (
                    "bg-red-100 " +
                    "text-red-700"
                );
            }


            if (
                valor === "en proceso" ||
                valor === "en evaluacion"
            ) {

                return (
                    "bg-blue-100 " +
                    "text-blue-700"
                );
            }


            return (
                "bg-amber-100 " +
                "text-amber-700"
            );
        }


        function claseFila(accion) {

            if (estaVencida(accion)) {

                return (
                    "bg-red-50/40 " +
                    "hover:bg-red-50/70"
                );
            }

            return "hover:bg-slate-50/50";
        }


        function claseBarra(accion) {

            if (esCerrada(accion)) {
                return "bg-emerald-500";
            }

            if (estaVencida(accion)) {
                return "bg-red-500";
            }

            return "bg-blue-600";
        }


        function formatearFecha(fecha) {

            if (!fecha) {
                return "Sin fecha";
            }

            const partes =
                fecha.split("-");

            if (partes.length !== 3) {
                return fecha;
            }

            return (
                `${partes[2]}-` +
                `${partes[1]}-` +
                `${partes[0]}`
            );
        }


        // =====================================================
// CARGAR RESPONSABLES DINÁMICAMENTE
// =====================================================

function cargarFiltroResponsables() {

    if (!filtroResponsable) {
        return;
    }

    const responsables = [
        ...new Set(
            acciones
                .map(accion =>
                    String(accion.responsable || "").trim()
                )
                .filter(responsable =>
                    responsable &&
                    normalizar(responsable) !== "sin asignar"
                )
        )
    ].sort((a, b) =>
        a.localeCompare(b, "es")
    );


    filtroResponsable.innerHTML =
        `<option value="Todos">Todos</option>`;


    responsables.forEach(responsable => {

        const opcion =
            document.createElement("option");

        opcion.value = responsable;
        opcion.textContent = responsable;

        filtroResponsable.appendChild(opcion);

    });


    const opcionSinAsignar =
        document.createElement("option");

    opcionSinAsignar.value = "Sin asignar";
    opcionSinAsignar.textContent = "Sin asignar";

    filtroResponsable.appendChild(
        opcionSinAsignar
    );
 }
    // =====================================================
// CARGAR EMPRESAS DINÁMICAMENTE
// =====================================================

function cargarFiltroEmpresas() {

    if (!filtroEmpresa) {
        return;
    }

    const empresas = [
        ...new Set(
            acciones
                .map(accion =>
                    String(
                        accion.empresa || ""
                    ).trim()
                )
                .filter(empresa => empresa)
        )
    ].sort((a, b) =>
        a.localeCompare(b, "es")
    );

    filtroEmpresa.innerHTML =
        `<option value="Todas">Todas</option>`;

    empresas.forEach(empresa => {

        const opcion =
            document.createElement("option");

        opcion.value = empresa;
        opcion.textContent = empresa;

        filtroEmpresa.appendChild(opcion);
    });
}
// =====================================================
        // 4. KPI
        // =====================================================

        function actualizarKPI(lista) {

            const total =
                lista.length;


            const completadas =
                lista.filter(
                    accion =>
                        esCerrada(accion)
                ).length;


            const vencidas =
                lista.filter(
                    accion =>
                        estaVencida(accion)
                ).length;


            const abiertas =
                lista.filter(
                    accion =>
                        !esCerrada(accion)
                ).length;


            const oportunidades =
                lista.filter(
                    accion =>
                        tipoOrigen(accion) ===
                        "Oportunidad"
                ).length;


            const cumplimiento =
                total === 0
                    ? 0
                    : Math.round(
                        (
                            completadas /
                            total
                        ) * 100
                    );


            if (kpiAccionesAbiertas) {

                kpiAccionesAbiertas
                    .textContent =
                    abiertas;
            }


            if (kpiAccionesVencidas) {

                kpiAccionesVencidas
                    .textContent =
                    vencidas;
            }


            if (kpiAccionesCompletadas) {

                kpiAccionesCompletadas
                    .textContent =
                    completadas;
            }


            if (kpiCumplimientoAcciones) {

                kpiCumplimientoAcciones
                    .textContent =
                    `${cumplimiento}%`;
            }


            if (barraCumplimientoAcciones) {

                barraCumplimientoAcciones
                    .style
                    .width =
                    `${cumplimiento}%`;
            }


            if (kpiAccionesOportunidades) {

                kpiAccionesOportunidades
                    .textContent =
                    oportunidades;
            }


            if (textoTotalAcciones) {

                textoTotalAcciones
                    .textContent =
                    `De ${total} acciones registradas en el período`;
            }


            if (textoListadoAcciones) {

                textoListadoAcciones
                    .textContent =
                    `${total} acciones registradas · mostrando registros activos`;
            }
        }


        // =====================================================
        // 5. RENDERIZAR TABLA
        // =====================================================

        function renderizarTabla(lista) {

            if (!tablaAcciones) {
                return;
            }


            tablaAcciones.innerHTML = "";


            if (lista.length === 0) {

                tablaAcciones.innerHTML = `

                    <tr>

                        <td
                            colspan="12"
                            class="py-8 px-3 text-center text-slate-400"
                        >
                            No existen acciones que coincidan con los filtros.
                        </td>

                    </tr>

                `;

                return;
            }


            lista.forEach(accion => {

                const estadoVisual =
                    obtenerEstadoVisual(
                        accion
                    );


                const avance =
                    Number(
                        accion.avance || 0
                    );


                const origen =
                    tipoOrigen(
                        accion
                    );


                const registro =
                    obtenerRegistroAsociado(
                        accion
                    );


                let enlaceRegistro = "#";


                if (
                    origen === "Riesgo" &&
                    registro !== "Sin registro"
                ) {

                    enlaceRegistro =
                        `riesgo-detalle.html?id=${encodeURIComponent(registro)}`;
                }


                tablaAcciones.innerHTML += `

                    <tr
                        class="${claseFila(accion)} transition-colors"
                    >

                        <!-- ID -->

                        <td
                            class="py-3 px-3 font-bold text-slate-900"
                        >
                            ${escaparHTML(accion.id)}
                        </td>


                        <!-- TIPO DE ORIGEN -->

                        <td class="py-3 px-3">

                            <span
                                class="
                                    px-2
                                    py-0.5
                                    rounded
                                    text-[9px]
                                    font-bold

                                    ${
                                        origen === "Riesgo"

                                            ? "bg-red-100 text-red-700"

                                            : "bg-emerald-100 text-emerald-700"
                                    }
                                "
                            >
                                ${origen}
                            </span>

                        </td>


                        <!-- ACCIÓN -->

                        <td
                            class="py-3 px-3 font-medium"
                        >
                            ${escaparHTML(
                                accion.accion
                            )}
                        </td>


                        <!-- REGISTRO ASOCIADO -->

                        <td class="py-3 px-3">

                            <a
                                href="${enlaceRegistro}"
                                class="text-blue-600 font-semibold hover:underline"
                            >
                                ${escaparHTML(
                                    registro
                                )}
                            </a>

                        </td>


                        <!-- RESPONSABLE -->

                        <td
                            class="py-3 px-3 text-slate-800 font-medium"
                        >

                            ${
                                normalizar(
                                    accion.responsable
                                ) ===
                                "sin asignar"

                                    ? `

                                        <span
                                            class="text-red-500 italic font-semibold"
                                        >
                                            Sin asignar
                                        </span>

                                    `

                                    : escaparHTML(
                                        accion.responsable ||
                                        "Sin asignar"
                                    )
                            }

                        </td>


                        <!-- FECHA -->

                        <td
                            class="
                                py-3
                                px-3
                                font-semibold

                                ${
                                    estaVencida(accion)

                                        ? "text-red-600"

                                        : "text-slate-600"
                                }
                            "
                        >

                            ${formatearFecha(
                                accion.fechaCompromiso
                            )}

                        </td>


                        <!-- PRIORIDAD -->

                        <td class="py-3 px-3">

                            <span
                                class="text-slate-500 font-semibold"
                            >

                                ${escaparHTML(
    obtenerPrioridadAccion(accion)
)}

                            </span>

                        </td>


                        <!-- ESTADO -->

                        <td class="py-3 px-3">

                            <span
                                class="
                                    px-2.5
                                    py-1
                                    rounded-full
                                    text-[10px]
                                    font-bold
                                    ${claseEstado(estadoVisual)}
                                "
                            >
                                ${escaparHTML(
                                    estadoVisual
                                )}
                            </span>

                        </td>


                        <!-- AVANCE -->

                        <td class="py-3 px-3">

                            <div
                                class="flex items-center space-x-1.5"
                            >

                                <span
                                    class="font-semibold text-[11px]"
                                >
                                    ${avance}%
                                </span>

                                <div
                                    class="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden"
                                >

                                    <div
                                        class="${claseBarra(accion)} h-full rounded-full"

                                        style="
                                            width:
                                            ${Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    avance
                                                )
                                            )}%
                                        "
                                    ></div>

                                </div>

                            </div>

                        </td>


                        <!-- EVIDENCIA -->

                        <td
                            class="py-3 px-3 text-slate-500"
                        >

                            ${escaparHTML(
                                accion.evidencia ||
                                "Sin evidencia"
                            )}

                        </td>


                        <!-- ÚLTIMA ACTUALIZACIÓN -->

                        <td
                            class="py-3 px-3 text-slate-400"
                        >

                            ${formatearFecha(
                                accion.fechaCompromiso
                            )}

                        </td>


                        <!-- GESTIÓN -->

                        <td
                            class="py-3 px-3 text-right"
                        >

                            <div
                                class="flex justify-end gap-1"
                            >

                                <button
                                    type="button"

                                    onclick="
                                        verAccion(
                                            '${accion.id}'
                                        )
                                    "

                                    class="
                                        px-2.5
                                        py-1
                                        bg-blue-600
                                        hover:bg-blue-700
                                        text-white
                                        rounded
                                        text-[11px]
                                        font-semibold
                                    "
                                >
                                    Ver
                                </button>


                                <button
                                    type="button"

                                    onclick="
                                        editarAccion(
                                            '${accion.id}'
                                        )
                                    "

                                    class="
                                        px-2.5
                                        py-1
                                        bg-slate-100
                                        hover:bg-slate-200
                                        text-slate-700
                                        rounded
                                        text-[11px]
                                        font-medium
                                        border
                                        border-slate-200
                                    "
                                >
                                    Editar
                                </button>


                                <button
                                    type="button"

                                    onclick="
                                        eliminarAccion(
                                            '${accion.id}'
                                        )
                                    "

                                    class="
                                        px-2.5
                                        py-1
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                        rounded
                                        text-[11px]
                                        font-medium
                                    "
                                >
                                    Eliminar
                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            });

        }



// =====================================================
// CARGAR CONTRATOS DINÁMICAMENTE
// =====================================================

function cargarFiltroContratos() {

    if (!filtroContrato) {
        return;
    }

    const empresaSeleccionada =
        normalizar(
            filtroEmpresa?.value
        );

    const contratos = [
        ...new Set(
            acciones
                .filter(accion => {

                    if (
                        !empresaSeleccionada ||
                        empresaSeleccionada === "todas"
                    ) {
                        return true;
                    }

                    return (
                        normalizar(
                            accion.empresa
                        ) === empresaSeleccionada
                    );
                })
                .map(accion =>
                    String(
                        accion.contrato || ""
                    ).trim()
                )
                .filter(contrato => contrato)
        )
    ].sort((a, b) =>
        a.localeCompare(b, "es")
    );

    filtroContrato.innerHTML =
        `<option value="Todos">Todos</option>`;

    contratos.forEach(contrato => {

        const opcion =
            document.createElement("option");

        opcion.value = contrato;
        opcion.textContent = contrato;

        filtroContrato.appendChild(opcion);
    });
}

// =====================================================
// CARGAR FAENAS DINÁMICAMENTE
// =====================================================
function cargarFiltroFaenas() {

    if (!filtroFaena) {
        return;
    }

    const empresaSeleccionada =
        normalizar(
            filtroEmpresa?.value
        );

    const contratoSeleccionado =
        normalizar(
            filtroContrato?.value
        );

    const faenas = [
        ...new Set(
            acciones
                .filter(accion => {

                    const coincideEmpresa =
                        !empresaSeleccionada ||
                        empresaSeleccionada === "todas" ||
                        normalizar(
                            accion.empresa
                        ) === empresaSeleccionada;

                    const coincideContrato =
                        !contratoSeleccionado ||
                        contratoSeleccionado === "todos" ||
                        normalizar(
                            accion.contrato
                        ) === contratoSeleccionado;

                    return (
                        coincideEmpresa &&
                        coincideContrato
                    );
                })
                .map(accion =>
                    String(
                        accion.faena || ""
                    ).trim()
                )
                .filter(faena => faena)
        )
    ].sort((a, b) =>
        a.localeCompare(b, "es")
    );

    filtroFaena.innerHTML =
        `<option value="Todas">Todas</option>`;

    faenas.forEach(faena => {

        const opcion =
            document.createElement("option");

        opcion.value = faena;
        opcion.textContent = faena;

        filtroFaena.appendChild(opcion);
    });
}

        // =====================================================
        // 6. FILTROS
        // =====================================================

        function aplicarFiltros() {

            const texto =
    normalizar(
        buscarAcciones?.value
    );
            const tipo =
    normalizar(
        filtroTipoOrigen?.value
    );

const empresa =
    normalizar(
        filtroEmpresa?.value
    );

const contrato =
    normalizar(
        filtroContrato?.value
    );

const faena =
    normalizar(
        filtroFaena?.value
    );

const responsable =
    normalizar(
        filtroResponsable?.value
    );

            const estado =
                normalizar(
                    filtroEstado?.value
                );
            const prioridad =
                 normalizar(
                    filtroPrioridad?.value
               );

            const filtradas =
                acciones.filter(accion => {
const coincideEmpresa =
    !empresa ||
    empresa === "todas" ||
    normalizar(
        accion.empresa
    ) === empresa;

const coincideContrato =
    !contrato ||
    contrato === "todos" ||
    normalizar(
        accion.contrato
    ) === contrato;

    const coincideFaena =
    !faena ||
    faena === "todas" ||
    normalizar(
        accion.faena
    ) === faena;
                    const origen =
                        normalizar(
                            tipoOrigen(
                                accion
                            )
                        );


                    const estadoVisual =
                        normalizar(
                            obtenerEstadoVisual(
                                accion
                            )
                        );
const prioridadAccion =
    normalizar(
        obtenerPrioridadAccion(
            accion
        )
    );

                    const registro =
                        normalizar(
                            obtenerRegistroAsociado(
                                accion
                            )
                        );


                    const coincideTexto =
                        !texto ||

                        normalizar(
                            accion.id
                        ).includes(texto) ||

                        normalizar(
                            accion.accion
                        ).includes(texto) ||

                        registro.includes(texto) ||

                        normalizar(
                            accion.responsable
                        ).includes(texto);


                    const coincideTipo =
                        !tipo ||
                        tipo === "todos" ||
                        origen === tipo;


                    const coincideResponsable =
                        !responsable ||
                        responsable === "todos" ||

                        normalizar(
                            accion.responsable
                        ) === responsable;


                    const coincideEstado =
                        !estado ||
                        estado === "todos" ||
                        estadoVisual === estado;
const coincidePrioridad =
    !prioridad ||
    prioridad === "todas" ||
    prioridadAccion === prioridad;

                    return (
    coincideTexto &&
    coincideTipo &&
    coincideEmpresa &&
    coincideContrato &&
    coincideFaena &&
    coincideResponsable &&
    coincideEstado &&
    coincidePrioridad
);
                });


            renderizarTabla(
                filtradas
            );
        }


        // =====================================================
       // 7. EVENTOS DE FILTRO
      // =====================================================


    // BUSCADOR
          if (buscarAcciones) {

          buscarAcciones.addEventListener(
           "input",
            aplicarFiltros
          );
        }


// TIPO DE ORIGEN
if (filtroTipoOrigen) {

    filtroTipoOrigen.addEventListener(
        "change",
        aplicarFiltros
    );
}


// EMPRESA
if (filtroEmpresa) {

    filtroEmpresa.addEventListener(
        "change",
        () => {

            // Reiniciar filtros dependientes
            filtroContrato.value = "Todos";
            filtroFaena.value = "Todas";

            cargarFiltroContratos();

            filtroContrato.value = "Todos";

            cargarFiltroFaenas();

            filtroFaena.value = "Todas";

            aplicarFiltros();
        }
    );
}


// CONTRATO
if (filtroContrato) {

    filtroContrato.addEventListener(
        "change",
        () => {

            // Reiniciar faena
            filtroFaena.value = "Todas";

            cargarFiltroFaenas();

            filtroFaena.value = "Todas";

            aplicarFiltros();
        }
    );
}


// FAENA
if (filtroFaena) {

    filtroFaena.addEventListener(
        "change",
        aplicarFiltros
    );
}


// RESPONSABLE
if (filtroResponsable) {

    filtroResponsable.addEventListener(
        "change",
        aplicarFiltros
    );
}


// ESTADO
if (filtroEstado) {

    filtroEstado.addEventListener(
        "change",
        aplicarFiltros
    );
}


// PRIORIDAD
if (filtroPrioridad) {

    filtroPrioridad.addEventListener(
        "change",
        aplicarFiltros
    );
}

        // =====================================================
        // 8. VER ACCIÓN
        // =====================================================

        window.verAccion =
            async function (id) {

                try {

                    const accion =
                        await AccionesStorage.obtenerPorId(
                            id
                        );


                    if (!accion) {

                        alert(
                            `No se encontró la acción ${id}.`
                        );

                        return;
                    }


                    // Evitar duplicar modal

                    const anterior =
                        document.getElementById(
                            "modalDetalleAccion"
                        );

                    if (anterior) {
                        anterior.remove();
                    }


                    const estadoVisual =
                        obtenerEstadoVisual(
                            accion
                        );


                    const origen =
                        tipoOrigen(
                            accion
                        );


                    const registro =
                        obtenerRegistroAsociado(
                            accion
                        );


                    const avance =
                        Number(
                            accion.avance || 0
                        );


                    const modalDetalle =
                        document.createElement(
                            "div"
                        );


                    modalDetalle.id =
                        "modalDetalleAccion";


                    modalDetalle.className =
                        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4";


                    modalDetalle.innerHTML = `

                        <div
                            class="
                                bg-white
                                w-full
                                max-w-2xl
                                rounded-xl
                                shadow-2xl
                                border
                                border-slate-200
                                overflow-hidden
                            "
                        >

                            <!-- HEADER -->

                            <div
                                class="
                                    px-6
                                    py-4
                                    border-b
                                    border-slate-200
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <h2
                                        class="
                                            text-base
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        Detalle de Acción
                                    </h2>

                                    <p
                                        class="
                                            text-xs
                                            text-slate-500
                                            mt-0.5
                                        "
                                    >
                                        ${escaparHTML(
                                            accion.id
                                        )}
                                    </p>

                                </div>


                                <button
                                    id="cerrarDetalleAccion"
                                    type="button"

                                    class="
                                        text-slate-400
                                        hover:text-slate-700
                                        text-xl
                                        leading-none
                                    "
                                >
                                    ×
                                </button>

                            </div>


                            <!-- CUERPO -->

                            <div
                                class="p-6 space-y-5"
                            >

                                <div
                                    class="
                                        grid
                                        grid-cols-1
                                        md:grid-cols-2
                                        gap-4
                                    "
                                >

                                    <!-- ID -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            ID
                                        </p>

                                        <p
                                            class="
                                                text-sm
                                                font-bold
                                                text-slate-900
                                                mt-1
                                            "
                                        >
                                            ${escaparHTML(
                                                accion.id
                                            )}
                                        </p>

                                    </div>


                                    <!-- ORIGEN -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            Tipo de origen
                                        </p>

                                        <p
                                            class="
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                                mt-1
                                            "
                                        >
                                            ${escaparHTML(
                                                origen
                                            )}
                                        </p>

                                    </div>


                                    <!-- REGISTRO -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            Registro asociado
                                        </p>

                                        <p
                                            class="
                                                text-sm
                                                font-semibold
                                                text-blue-600
                                                mt-1
                                            "
                                        >
                                            ${escaparHTML(
                                                registro
                                            )}
                                        </p>

                                    </div>

                                    <!-- EMPRESA -->

<div>
    <p
        class="
            text-[10px]
            uppercase
            tracking-wide
            text-slate-400
            font-semibold
        "
    >
        Empresa
    </p>

    <p
        class="
            text-sm
            font-semibold
            text-slate-800
            mt-1
        "
    >
        ${escaparHTML(
            accion.empresa ||
            "Sin empresa"
        )}
    </p>
</div>


<!-- CONTRATO -->

<div>
    <p
        class="
            text-[10px]
            uppercase
            tracking-wide
            text-slate-400
            font-semibold
        "
    >
        Contrato
    </p>

    <p
        class="
            text-sm
            font-semibold
            text-slate-800
            mt-1
        "
    >
        ${escaparHTML(
            accion.contrato ||
            "Sin contrato"
        )}
    </p>
</div>


<!-- FAENA -->

<div>
    <p
        class="
            text-[10px]
            uppercase
            tracking-wide
            text-slate-400
            font-semibold
        "
    >
        Faena
    </p>

    <p
        class="
            text-sm
            font-semibold
            text-slate-800
            mt-1
        "
    >
        ${escaparHTML(
            accion.faena ||
            "Sin faena"
        )}
    </p>
</div>

                                    <!-- RESPONSABLE -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            Responsable
                                        </p>

                                        <p
                                            class="
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                                mt-1
                                            "
                                        >
                                            ${escaparHTML(
                                                accion.responsable ||
                                                "Sin asignar"
                                            )}
                                        </p>

                                    </div>


                                    <!-- FECHA -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            Fecha compromiso
                                        </p>

                                        <p
                                            class="
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                                mt-1
                                            "
                                        >
                                            ${formatearFecha(
                                                accion.fechaCompromiso
                                            )}
                                        </p>

                                    </div>


                                    <!-- ESTADO -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            Estado
                                        </p>

                                        <div
                                            class="mt-1"
                                        >

                                            <span
                                                class="
                                                    inline-flex
                                                    px-2.5
                                                    py-1
                                                    rounded-full
                                                    text-[10px]
                                                    font-bold
                                                    ${claseEstado(
                                                        estadoVisual
                                                    )}
                                                "
                                            >
                                                ${escaparHTML(
                                                    estadoVisual
                                                )}
                                            </span>

                                        </div>

                                    </div>


                                    <!-- AVANCE -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            Avance
                                        </p>


                                        <div
                                            class="
                                                flex
                                                items-center
                                                gap-2
                                                mt-2
                                            "
                                        >

                                            <span
                                                class="
                                                    text-sm
                                                    font-bold
                                                    text-slate-900
                                                "
                                            >
                                                ${avance}%
                                            </span>


                                            <div
                                                class="
                                                    flex-1
                                                    bg-slate-100
                                                    h-2
                                                    rounded-full
                                                    overflow-hidden
                                                "
                                            >

                                                <div
                                                    class="
                                                        ${claseBarra(accion)}
                                                        h-full
                                                        rounded-full
                                                    "

                                                    style="
                                                        width:
                                                        ${Math.min(
                                                            100,
                                                            Math.max(
                                                                0,
                                                                avance
                                                            )
                                                        )}%
                                                    "
                                                ></div>

                                            </div>

                                        </div>

                                    </div>


                                    <!-- EVIDENCIA -->

                                    <div>

                                        <p
                                            class="
                                                text-[10px]
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                                font-semibold
                                            "
                                        >
                                            Evidencia
                                        </p>

                                        <p
                                            class="
                                                text-sm
                                                font-semibold
                                                text-slate-800
                                                mt-1
                                            "
                                        >
                                            ${escaparHTML(
                                                accion.evidencia ||
                                                "Sin evidencia"
                                            )}
                                        </p>

                                    </div>

                                </div>


                                <!-- DESCRIPCIÓN -->

                                <div>

                                    <p
                                        class="
                                            text-[10px]
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                            font-semibold
                                        "
                                    >
                                        Descripción de la acción
                                    </p>


                                    <div
                                        class="
                                            mt-2
                                            p-4
                                            rounded-lg
                                            bg-slate-50
                                            border
                                            border-slate-200
                                            text-sm
                                            text-slate-700
                                        "
                                    >
                                        ${escaparHTML(
                                            accion.accion ||
                                            "Sin descripción"
                                        )}
                                    </div>

                                </div>

                            </div>


                            <!-- FOOTER -->

                            <div
                                class="
                                    px-6
                                    py-4
                                    border-t
                                    border-slate-200
                                    bg-slate-50
                                    flex
                                    justify-end
                                    gap-2
                                "
                            >

                                <button
                                    id="cerrarDetalleAccionFooter"

                                    type="button"

                                    class="
                                        px-4
                                        py-2
                                        rounded-lg
                                        bg-white
                                        border
                                        border-slate-300
                                        text-slate-700
                                        text-xs
                                        font-semibold
                                        hover:bg-slate-100
                                    "
                                >
                                    Cerrar
                                </button>


                                <button
                                    id="editarDesdeDetalle"

                                    type="button"

                                    class="
                                        px-4
                                        py-2
                                        rounded-lg
                                        bg-blue-600
                                        text-white
                                        text-xs
                                        font-semibold
                                        hover:bg-blue-700
                                    "
                                >
                                    Editar Acción
                                </button>

                            </div>

                        </div>

                    `;


                    document.body.appendChild(
                        modalDetalle
                    );


                    function cerrarDetalle() {

                        if (
                            modalDetalle &&
                            modalDetalle.parentNode
                        ) {

                            modalDetalle.remove();
                        }
                    }


                    document
                        .getElementById(
                            "cerrarDetalleAccion"
                        )
                        ?.addEventListener(
                            "click",
                            cerrarDetalle
                        );


                    document
                        .getElementById(
                            "cerrarDetalleAccionFooter"
                        )
                        ?.addEventListener(
                            "click",
                            cerrarDetalle
                        );


                    document
                        .getElementById(
                            "editarDesdeDetalle"
                        )
                        ?.addEventListener(
                            "click",
                            function () {

                                cerrarDetalle();

                                window.editarAccion(
                                    accion.id
                                );
                            }
                        );


                    modalDetalle.addEventListener(
                        "click",
                        function (evento) {

                            if (
                                evento.target ===
                                modalDetalle
                            ) {

                                cerrarDetalle();
                            }
                        }
                    );


                    const cerrarConEscape =
                        function (evento) {

                            if (
                                evento.key ===
                                "Escape"
                            ) {

                                cerrarDetalle();

                                document
                                    .removeEventListener(
                                        "keydown",
                                        cerrarConEscape
                                    );
                            }
                        };


                    document.addEventListener(
                        "keydown",
                        cerrarConEscape
                    );

                }

                catch (error) {

                    console.error(
                        "ERROR AL MOSTRAR DETALLE DE ACCIÓN:",
                        error
                    );

                    alert(
                        "No fue posible mostrar el detalle de la acción."
                    );
                }
            };


        // =====================================================
        // 9. EDITAR ACCIÓN
        // =====================================================

        window.editarAccion =
            function (id) {

                if (
                    typeof window
                        .abrirEdicionAccion ===
                    "function"
                ) {

                    window.abrirEdicionAccion(
                        id
                    );

                }

                else {

                    console.error(
                        "No se encontró la función abrirEdicionAccion."
                    );

                    alert(
                        "No fue posible abrir la edición de la acción."
                    );
                }
            };


        // =====================================================
        // 10. ELIMINAR ACCIÓN
        // =====================================================

        window.eliminarAccion =
            async function (id) {

                const confirmar =
                    confirm(
                        `¿Estás seguro de que deseas eliminar la acción ${id}?\n\nEsta acción no se puede deshacer.`
                    );


                if (!confirmar) {
                    return;
                }


                try {

                    await AccionesStorage.eliminar(
                        id
                    );


                    console.log(
                        `Acción ${id} eliminada correctamente`
                    );


                    alert(
                        `La acción ${id} fue eliminada correctamente.`
                    );


                    window.location.reload();

                }

                catch (error) {

                    console.error(
                        "ERROR AL ELIMINAR ACCIÓN:",
                        error
                    );


                    alert(
                        "No fue posible eliminar la acción."
                    );
                }
            };


        // =====================================================
// 11. PRIMER RENDER
// =====================================================

cargarFiltroResponsables();
cargarFiltroEmpresas();
cargarFiltroContratos();
cargarFiltroFaenas();

actualizarKPI(
    acciones
);

renderizarTabla(
    acciones
);

        console.log(
            "Acciones cargadas correctamente",
            {

                total:
                    acciones.length,

                vencidas:
                    acciones.filter(
                        accion =>
                            estaVencida(
                                accion
                            )
                    ).length

            }
        );

    }

    catch (error) {

        console.error(
            "ERROR AL CARGAR ACCIONES:",
            error
        );

    }

});