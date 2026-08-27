console.log("EVIDENCIAS.JS CARGADO");

document.addEventListener("DOMContentLoaded", function () {

    const btnAgregarEvidencia =
        document.getElementById("btnAgregarEvidencia");

    const modalEvidencia =
        document.getElementById("modalEvidencia");

    const cancelarEvidencia =
        document.getElementById("cancelarEvidencia");

    const cerrarModalEvidencia =
        document.getElementById("cerrarModalEvidencia");

    const guardarEvidencia =
        document.getElementById("guardarEvidencia");


    // =========================================================
    // CAMPOS DEL FORMULARIO
    // =========================================================

    const archivoEvidencia =
        document.getElementById("archivoEvidencia");

    const descripcionEvidencia =
        document.getElementById("descripcionEvidencia");

    const responsableEvidencia =
        document.getElementById("responsableEvidencia");

    const fechaEvidencia =
        document.getElementById("fechaEvidencia");


    // =========================================================
    // OBTENER REGISTRO ACTUAL
    // =========================================================

    function obtenerRegistroActual() {

        const textoRegistro =
            document.getElementById(
                "verTextoTipoRegistro"
            );

        if (!textoRegistro) {
            return null;
        }

        const texto =
            textoRegistro.textContent.trim();

        const coincidencia =
            texto.match(
                /(Riesgo|Oportunidad)\s+([RO]-\d+)/i
            );

        if (!coincidencia) {
            return null;
        }

        return {

            tipoRegistro:
                coincidencia[1],

            registroId:
                coincidencia[2]

        };
    }


    // =========================================================
    // ESCAPAR HTML
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
    // FORMATEAR FECHA
    // =========================================================

    function formatearFecha(fecha) {

        if (!fecha) {
            return "Sin fecha";
        }

        const partes =
            String(fecha).split("-");

        if (partes.length === 3) {

            return (
                partes[2] +
                "-" +
                partes[1] +
                "-" +
                partes[0]
            );
        }

        return fecha;
    }


    // =========================================================
    // FORMATEAR TAMAÑO
    // =========================================================

    function formatearTamano(bytes) {

        const numero =
            Number(bytes || 0);

        if (numero < 1024) {
            return numero + " B";
        }

        if (numero < 1024 * 1024) {

            return (
                (numero / 1024)
                    .toFixed(1) +
                " KB"
            );
        }

        return (
            (numero / (1024 * 1024))
                .toFixed(1) +
            " MB"
        );
    }


    // =========================================================
    // TRAZABILIDAD DE EVIDENCIAS
    // =========================================================

    function registrarEventoTrazabilidad(
        registroId,
        evento
    ) {

        if (!registroId) {
            return;
        }

        if (
            window.VireonTrazabilidad &&
            typeof window.VireonTrazabilidad.agregar ===
                "function"
        ) {

            window.VireonTrazabilidad.agregar(
                registroId,
                evento
            );

            return;
        }

        // Compatibilidad si el helper compartido aún no existe.
        const clave =
            `vireon_trazabilidad_${registroId}`;

        let historial = [];

        try {

            historial =
                JSON.parse(
                    localStorage.getItem(clave)
                ) || [];

            if (!Array.isArray(historial)) {
                historial = [];
            }

        } catch (error) {

            historial = [];
        }

        historial.push({
            ...evento,
            fechaHora:
                evento.fechaHora ||
                new Date().toISOString()
        });

        localStorage.setItem(
            clave,
            JSON.stringify(historial)
        );
    }


    async function actualizarTrazabilidadVisible(
        registro
    ) {

        if (
            !registro ||
            typeof renderizarTrazabilidad !==
                "function"
        ) {
            return;
        }

        try {

            let datosRegistro = null;

            if (
                registro.tipoRegistro ===
                    "Riesgo" &&
                typeof RiesgosStorage !==
                    "undefined"
            ) {

                datosRegistro =
                    await RiesgosStorage
                        .obtenerPorId(
                            registro.registroId
                        );

            } else if (
                registro.tipoRegistro ===
                    "Oportunidad" &&
                typeof OportunidadesStorage !==
                    "undefined"
            ) {

                datosRegistro =
                    await OportunidadesStorage
                        .obtenerPorId(
                            registro.registroId
                        );
            }

            if (datosRegistro) {

                renderizarTrazabilidad(
                    registro.tipoRegistro,
                    datosRegistro
                );
            }

        } catch (error) {

            console.warn(
                "No fue posible refrescar la trazabilidad visible:",
                error
            );
        }
    }


    // =========================================================
    // RENDERIZAR EVIDENCIAS
    // =========================================================

    async function renderizarEvidenciasRegistro() {

        const contenedor =
            document.getElementById(
                "verEvidencias"
            );

        if (!contenedor) {
            return;
        }

        const registro =
            obtenerRegistroActual();

        if (!registro) {

            contenedor.className =
                "mt-3 p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center";

            contenedor.innerHTML = `
                <span class="text-xs text-slate-400">
                    No fue posible identificar el registro.
                </span>
            `;

            return;
        }

        try {

            const evidencias =
                await EvidenciasStorage
                    .obtenerPorRegistro(
                        registro.registroId
                    );

            if (
                !Array.isArray(evidencias) ||
                evidencias.length === 0
            ) {

                contenedor.className =
                    "mt-3 p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center";

                contenedor.innerHTML = `
                    <span class="text-xs text-slate-400">
                        Este registro todavía no tiene evidencias disponibles.
                    </span>
                `;

                return;
            }

            contenedor.className =
                "mt-3 space-y-3";

            contenedor.innerHTML =
                evidencias
                    .map(evidencia => {

                        const id =
                            escaparHTML(
                                evidencia.id
                            );

                        const nombre =
                            escaparHTML(
                                evidencia.nombre ||
                                "Evidencia"
                            );

                        const descripcion =
                            escaparHTML(
                                evidencia.descripcion ||
                                "Sin comentario"
                            );

                        const responsable =
                            escaparHTML(
                                evidencia.responsable ||
                                "Sin responsable"
                            );

                        const fecha =
                            escaparHTML(
                                formatearFecha(
                                    evidencia.fecha
                                )
                            );

                        const tamano =
                            escaparHTML(
                                formatearTamano(
                                    evidencia.tamano
                                )
                            );

                        return `
                            <div
                                class="p-4 bg-white border border-slate-200 rounded-xl text-left shadow-sm"
                            >

                                <div
                                    class="flex items-start justify-between gap-4"
                                >

                                    <div class="min-w-0 flex-1">

                                        <div
                                            class="flex items-center gap-2"
                                        >

                                            <span
                                                class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"
                                            >
                                                📎
                                            </span>

                                            <div class="min-w-0">

                                                <p
                                                    class="text-sm font-semibold text-slate-800 truncate"
                                                >
                                                    ${nombre}
                                                </p>

                                                <p
                                                    class="text-[10px] text-slate-400 mt-0.5"
                                                >
                                                    ${tamano}
                                                </p>

                                            </div>

                                        </div>


                                        <p
                                            class="text-xs text-slate-500 mt-3 leading-relaxed"
                                        >
                                            ${descripcion}
                                        </p>


                                        <div
                                            class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-500"
                                        >

                                            <span>
                                                Responsable:
                                                <strong class="text-slate-700">
                                                    ${responsable}
                                                </strong>
                                            </span>

                                            <span>
                                                Fecha:
                                                <strong class="text-slate-700">
                                                    ${fecha}
                                                </strong>
                                            </span>

                                        </div>

                                    </div>


                                    <div
                                        class="flex flex-col sm:flex-row gap-2 shrink-0"
                                    >

                                        <button
                                            type="button"
                                            data-ver-evidencia="${id}"
                                            class="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100"
                                        >
                                            Ver
                                        </button>

                                        <button
                                            type="button"
                                            data-descargar-evidencia="${id}"
                                            class="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                                        >
                                            Descargar
                                        </button>

                                        <button
                                            type="button"
                                            data-eliminar-evidencia="${id}"
                                            data-nombre-evidencia="${nombre}"
                                            class="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                                        >
                                            Eliminar
                                        </button>

                                    </div>

                                </div>

                            </div>
                        `;

                    })
                    .join("");

        } catch (error) {

            console.error(
                "Error al cargar evidencias:",
                error
            );

            contenedor.className =
                "mt-3 p-4 rounded-lg border border-dashed border-red-200 bg-red-50 text-center";

            contenedor.innerHTML = `
                <span class="text-xs text-red-500">
                    No fue posible cargar las evidencias.
                </span>
            `;
        }
    }


    // =========================================================
    // LIMPIAR FORMULARIO
    // =========================================================

    function limpiarFormulario() {

        if (archivoEvidencia) {
            archivoEvidencia.value = "";
        }

        if (descripcionEvidencia) {
            descripcionEvidencia.value = "";
        }

        if (responsableEvidencia) {
            responsableEvidencia.value = "";
        }

        if (fechaEvidencia) {
            fechaEvidencia.value = "";
        }
    }


    // =========================================================
    // CERRAR MODAL
    // =========================================================

    function cerrarModal() {

        if (!modalEvidencia) {
            return;
        }

        modalEvidencia.classList.add(
            "hidden"
        );
    }


    // =========================================================
    // ABRIR MODAL
    // =========================================================

    if (
        btnAgregarEvidencia &&
        modalEvidencia
    ) {

        btnAgregarEvidencia.addEventListener(
            "click",
            function () {

                modalEvidencia.classList.remove(
                    "hidden"
                );

                if (
                    fechaEvidencia &&
                    !fechaEvidencia.value
                ) {

                    fechaEvidencia.value =
                        new Date()
                            .toISOString()
                            .slice(0, 10);
                }

            }
        );
    }


    // =========================================================
    // CANCELAR
    // =========================================================

    if (cancelarEvidencia) {

        cancelarEvidencia.addEventListener(
            "click",
            function () {

                cerrarModal();
                limpiarFormulario();

            }
        );
    }


    // =========================================================
    // CERRAR CON X
    // =========================================================

    if (cerrarModalEvidencia) {

        cerrarModalEvidencia.addEventListener(
            "click",
            function () {

                cerrarModal();
                limpiarFormulario();

            }
        );
    }


    // =========================================================
    // CERRAR HACIENDO CLICK FUERA
    // =========================================================

    if (modalEvidencia) {

        modalEvidencia.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modalEvidencia
                ) {

                    cerrarModal();
                }

            }
        );
    }


    // =========================================================
    // GUARDAR EVIDENCIA
    // =========================================================

    if (guardarEvidencia) {

        guardarEvidencia.addEventListener(
            "click",
            async function () {

                try {

                    const registro =
                        obtenerRegistroActual();

                    if (!registro) {

                        alert(
                            "No fue posible identificar el riesgo u oportunidad."
                        );

                        return;
                    }

                    const archivo =
                        archivoEvidencia
                            ?.files?.[0];

                    if (!archivo) {

                        alert(
                            "Selecciona un archivo o fotografía."
                        );

                        archivoEvidencia?.focus();

                        return;
                    }

                    guardarEvidencia.disabled =
                        true;

                    guardarEvidencia.textContent =
                        "Guardando...";

                    const evidenciaGuardada =
                        await EvidenciasStorage
                            .guardarRegistro({

                                registroId:
                                    registro.registroId,

                                tipoRegistro:
                                    registro.tipoRegistro,

                                archivo:
                                    archivo,

                                descripcion:
                                    descripcionEvidencia
                                        ?.value || "",

                                responsable:
                                    responsableEvidencia
                                        ?.value || "",

                                fecha:
                                    fechaEvidencia
                                        ?.value || ""

                            });

                    const usuarioActivo =
    window.VireonSesion &&
    typeof window.VireonSesion.obtenerUsuarioActual === "function"
        ? window.VireonSesion.obtenerUsuarioActual()
        : null;

const responsableEvento =
    usuarioActivo?.nombre ||
    "Sistema VIREON";

                    const fechaEvento =
                        fechaEvidencia
                            ?.value ||
                        new Date()
                            .toISOString()
                            .split("T")[0];

                    registrarEventoTrazabilidad(
                        registro.registroId,
                        {
                            tipo:
                                "evidencia_agregada",
                            titulo:
                                "Evidencia agregada",
                            descripcion:
                                `Se adjuntó "${evidenciaGuardada?.nombre || archivo.name || "Evidencia"}" al registro.`,
                            responsable:
                                responsableEvento,
                            fecha:
                                fechaEvento
                        }
                    );

                    console.log(
                        "Evidencia guardada:",
                        registro.registroId
                    );

                    await renderizarEvidenciasRegistro();

                    await actualizarTrazabilidadVisible(
                        registro
                    );

                    cerrarModal();

                    limpiarFormulario();

                    alert(
                        "Evidencia guardada correctamente."
                    );

                } catch (error) {

                    console.error(
                        "Error al guardar evidencia:",
                        error
                    );

                    alert(
                        "No fue posible guardar la evidencia."
                    );

                } finally {

                    guardarEvidencia.disabled =
                        false;

                    guardarEvidencia.textContent =
                        "Guardar evidencia";

                }

            }
        );
    }


    // =========================================================
    // VER ARCHIVO
    // =========================================================

    document.addEventListener(
        "click",
        async function (event) {

            const boton =
                event.target.closest(
                    "[data-ver-evidencia]"
                );

            if (!boton) {
                return;
            }

            try {

                const evidencia =
                    await EvidenciasStorage
                        .obtenerPorId(
                            boton.dataset.verEvidencia
                        );

                if (!evidencia) {

                    alert(
                        "No fue posible encontrar la evidencia."
                    );

                    return;
                }

                const url =
                    EvidenciasStorage
                        .crearURL(
                            evidencia
                        );

                if (!url) {

                    alert(
                        "No fue posible abrir el archivo."
                    );

                    return;
                }

                window.open(
                    url,
                    "_blank"
                );

                setTimeout(
                    function () {

                        URL.revokeObjectURL(
                            url
                        );

                    },
                    60000
                );

            } catch (error) {

                console.error(
                    "Error al abrir evidencia:",
                    error
                );

                alert(
                    "No fue posible abrir la evidencia."
                );
            }

        }
    );


    // =========================================================
    // DESCARGAR ARCHIVO
    // =========================================================

    document.addEventListener(
        "click",
        async function (event) {

            const boton =
                event.target.closest(
                    "[data-descargar-evidencia]"
                );

            if (!boton) {
                return;
            }

            try {

                const evidencia =
                    await EvidenciasStorage
                        .obtenerPorId(
                            boton.dataset
                                .descargarEvidencia
                        );

                if (
                    !evidencia ||
                    !evidencia.archivo
                ) {

                    alert(
                        "No fue posible encontrar el archivo."
                    );

                    return;
                }

                const url =
                    EvidenciasStorage
                        .crearURL(
                            evidencia
                        );

                if (!url) {

                    alert(
                        "No fue posible preparar la descarga."
                    );

                    return;
                }

                const enlace =
                    document.createElement(
                        "a"
                    );

                enlace.href =
                    url;

                enlace.download =
                    evidencia.nombre ||
                    "evidencia";

                document.body.appendChild(
                    enlace
                );

                enlace.click();

                enlace.remove();

                setTimeout(
                    function () {

                        URL.revokeObjectURL(
                            url
                        );

                    },
                    1000
                );

            } catch (error) {

                console.error(
                    "Error al descargar evidencia:",
                    error
                );

                alert(
                    "No fue posible descargar la evidencia."
                );
            }

        }
    );


    // =========================================================
    // ELIMINAR EVIDENCIA
    // =========================================================

    document.addEventListener(
        "click",
        async function (event) {

            const boton =
                event.target.closest(
                    "[data-eliminar-evidencia]"
                );

            if (!boton) {
                return;
            }

            const id =
                boton.dataset
                    .eliminarEvidencia;

            const nombre =
                boton.dataset
                    .nombreEvidencia ||
                "esta evidencia";

            const registro =
                obtenerRegistroActual();

            const confirmar =
                window.confirm(
                    `¿Seguro que deseas eliminar "${nombre}"?\n\nEsta acción no se puede deshacer.`
                );

            if (!confirmar) {
                return;
            }

            try {

                boton.disabled =
                    true;

                boton.textContent =
                    "Eliminando...";

                const evidenciaAnterior =
                    await EvidenciasStorage
                        .obtenerPorId(id);

                await EvidenciasStorage
                    .eliminar(
                        id
                    );

                if (registro) {

                    registrarEventoTrazabilidad(
                        registro.registroId,
                        {
                            tipo:
                                "evidencia_eliminada",
                            titulo:
                                "Evidencia eliminada",
                            descripcion:
                                `Se eliminó "${evidenciaAnterior?.nombre || nombre}" del registro.`,
                            responsable:
                                evidenciaAnterior
                                    ?.responsable ||
                                "Sistema VIREON",
                            fecha:
                                new Date()
                                    .toISOString()
                                    .split("T")[0]
                        }
                    );
                }

                console.log(
                    "Evidencia eliminada:",
                    id
                );

                await renderizarEvidenciasRegistro();

                if (registro) {

                    await actualizarTrazabilidadVisible(
                        registro
                    );
                }

            } catch (error) {

                console.error(
                    "Error al eliminar evidencia:",
                    error
                );

                alert(
                    "No fue posible eliminar la evidencia."
                );

                boton.disabled =
                    false;

                boton.textContent =
                    "Eliminar";
            }

        }
    );


    // =========================================================
    // CARGAR EVIDENCIAS AL ABRIR UN REGISTRO
    // =========================================================

    document.addEventListener(
        "click",
        function (event) {

            const boton =
                event.target.closest(
                    "button"
                );

            if (!boton) {
                return;
            }

            if (
                boton.textContent
                    .trim() === "Ver" &&
                !boton.hasAttribute(
                    "data-ver-evidencia"
                )
            ) {

                setTimeout(
                    function () {

                        renderizarEvidenciasRegistro();

                    },
                    200
                );
            }

        }
    );

});