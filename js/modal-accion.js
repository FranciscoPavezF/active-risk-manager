console.log("MODAL-ACCION.JS CARGADO");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM listo para modal de acción");

    // =========================================================
    // ESTADO INTERNO
    // =========================================================

    // null = acción nueva
    // ID = acción en edición
    let accionEnEdicion = null;


    // =========================================================
    // BOTÓN NUEVA ACCIÓN
    // =========================================================

    const botonNuevaAccion =
        document.getElementById("btnNuevaAccion");

    if (!botonNuevaAccion) {

        console.error(
            "No se encontró el botón btnNuevaAccion."
        );

        return;
    }


    // =========================================================
    // CREAR MODAL DINÁMICAMENTE
    // =========================================================

    const modalHTML = `

        <div
            id="modalNuevaAccion"
            class="
                hidden
                fixed
                inset-0
                z-50
                items-center
                justify-center
                bg-black/40
                p-4
            "
        >

            <div
                class="
                    bg-white
                    w-full
                    max-w-3xl
                    rounded-xl
                    shadow-2xl
                    border
                    border-slate-200
                    overflow-hidden
                    max-h-[92vh]
                    overflow-y-auto
                "
            >

                <!-- =================================================
                     HEADER
                ================================================== -->

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
                            id="tituloModalAccion"
                            class="
                                text-base
                                font-bold
                                text-slate-900
                            "
                        >
                            Nueva Acción
                        </h2>

                        <p
                            id="subtituloModalAccion"
                            class="
                                text-xs
                                text-slate-500
                                mt-0.5
                            "
                        >
                            Registrar una acción asociada a un riesgo u oportunidad.
                        </p>

                    </div>


                    <button
                        id="cerrarModalAccion"
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


                <!-- =================================================
                     CUERPO
                ================================================== -->

                <div class="p-6 space-y-5">

                    <div
                        class="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-4
                        "
                    >


                        <!-- =========================================
                             ID
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                ID de Acción
                            </label>

                            <input
                                id="nuevaAccionId"
                                type="text"
                                placeholder="Ej: AC-203"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-600/20
                                    focus:border-blue-600
                                "
                            >

                        </div>


                        <!-- =========================================
                             TIPO DE ORIGEN
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Tipo de origen
                            </label>

                            <select
                                id="nuevaAccionTipoOrigen"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-600/20
                                    focus:border-blue-600
                                "
                            >

                                <option value="Riesgo">
                                    Riesgo
                                </option>

                                <option value="Oportunidad">
                                    Oportunidad
                                </option>

                            </select>

                        </div>


                        <!-- =========================================
                             REGISTRO ASOCIADO
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Registro asociado
                            </label>

                            <select
                                id="nuevaAccionRegistro"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-600/20
                                    focus:border-blue-600
                                "
                            >

                                <option value="">
                                    Seleccionar...
                                </option>

                            </select>

                        </div>


                        <!-- =========================================
                             EMPRESA
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Empresa
                            </label>

                            <input
                                id="nuevaAccionEmpresa"
                                type="text"
                                readonly
                                placeholder="Se completa automáticamente"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    bg-slate-50
                                    text-slate-700
                                "
                            >

                        </div>


                        <!-- =========================================
                             CONTRATO
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Contrato
                            </label>

                            <input
                                id="nuevaAccionContrato"
                                type="text"
                                readonly
                                placeholder="Se completa automáticamente"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    bg-slate-50
                                    text-slate-700
                                "
                            >

                        </div>


                        <!-- =========================================
                             FAENA
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Faena
                            </label>

                            <input
                                id="nuevaAccionFaena"
                                type="text"
                                readonly
                                placeholder="Se completa automáticamente"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    bg-slate-50
                                    text-slate-700
                                "
                            >

                        </div>


                                               <!-- =========================================
                             RESPONSABLE
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Responsable
                            </label>

                            <select
                                id="nuevaAccionResponsable"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-600/20
                                    focus:border-blue-600
                                "
                            >
                                <option value="Sin asignar">
                                    Sin asignar
                                </option>
                            </select>

                        </div>
                        <!-- =========================================
                             FECHA
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Fecha compromiso
                            </label>

                            <input
                                id="nuevaAccionFecha"
                                type="date"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-600/20
                                    focus:border-blue-600
                                "
                            >

                        </div>

<!-- =====================================================
     PRIORIDAD
===================================================== -->

<div>

    <label
        class="
            block
            text-xs
            font-semibold
            text-slate-700
            mb-1.5
        "
    >
        Prioridad
    </label>

    <input
        id="accionPrioridad"
        type="text"
        readonly
        placeholder="Se calcula automáticamente"
        class="
            w-full
            border
            border-slate-300
            rounded-lg
            px-3
            py-2
            text-sm
            bg-slate-50
            text-slate-700
            cursor-default
        "
    >

    <p
        class="
            text-[11px]
            text-slate-400
            mt-1
        "
    >
        Se determina automáticamente según la criticidad del riesgo u oportunidad seleccionada.
    </p>

</div>

                        <!-- =========================================
                             ESTADO
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Estado
                            </label>

                            <select
                                id="nuevaAccionEstado"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-600/20
                                    focus:border-blue-600
                                "
                            >

                                <option value="Pendiente">
                                    Pendiente
                                </option>

                                <option value="En proceso">
                                    En proceso
                                </option>

                                <option value="Cerrada">
                                    Cerrada
                                </option>

                            </select>

                        </div>


                        <!-- =========================================
                             AVANCE
                        ========================================== -->

                        <div>

                            <label
                                class="
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    mb-1.5
                                "
                            >
                                Avance (%)
                            </label>

                            <input
                                id="nuevaAccionAvance"
                                type="number"
                                min="0"
                                max="100"
                                value="0"
                                class="
                                    w-full
                                    border
                                    border-slate-300
                                    rounded-lg
                                    px-3
                                    py-2
                                    text-sm
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-600/20
                                    focus:border-blue-600
                                "
                            >

                        </div>


                       <!-- =========================================
     EVIDENCIAS
========================================== -->

<div>

    <label
        class="
            block
            text-xs
            font-semibold
            text-slate-700
            mb-1.5
        "
    >
        Evidencias
    </label>

    <!-- Referencia textual compatible con el MVP actual -->
    <input
        id="nuevaAccionEvidencia"
        type="text"
        placeholder="Ej: Informe, minuta, fotografía..."
        class="
            w-full
            border
            border-slate-300
            rounded-lg
            px-3
            py-2
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-600/20
            focus:border-blue-600
        "
    >

    <p
        class="
            mt-1
            text-[10px]
            text-slate-400
        "
    >
        Puedes registrar una referencia y adjuntar archivos como respaldo.
    </p>


    <!-- ARCHIVOS -->
    <div
        class="
            mt-3
            border
            border-dashed
            border-slate-300
            rounded-lg
            p-4
            bg-slate-50
        "
    >

        <div
            class="
                flex
                items-start
                justify-between
                gap-3
            "
        >

            <div>

                <p
                    class="
                        text-xs
                        font-semibold
                        text-slate-700
                    "
                >
                    Adjuntar evidencias
                </p>

                <p
                    class="
                        text-[10px]
                        text-slate-400
                        mt-1
                    "
                >
                    Fotografías, PDF, documentos, planillas u otros respaldos.
                </p>

            </div>

            <span
                class="
                    text-[10px]
                    font-semibold
                    text-blue-600
                    bg-blue-50
                    border
                    border-blue-100
                    rounded-full
                    px-2
                    py-1
                    whitespace-nowrap
                "
            >
                MVP
            </span>

        </div>


        <input
            id="nuevaAccionArchivos"
            type="file"
            multiple
            accept="
                image/*,
                .pdf,
                .doc,
                .docx,
                .xls,
                .xlsx
            "
            class="
                mt-3
                block
                w-full
                text-xs
                text-slate-600
                file:mr-3
                file:py-2
                file:px-3
                file:rounded-lg
                file:border-0
                file:text-xs
                file:font-semibold
                file:bg-blue-600
                file:text-white
                hover:file:bg-blue-700
                cursor-pointer
            "
        >


        <!-- LISTADO / PREVISUALIZACIÓN -->
        <div
            id="listaEvidenciasSeleccionadas"
            class="
                hidden
                mt-3
                space-y-2
            "
        >
        </div>

    </div>


    <p
        class="
            mt-2
            text-[10px]
            text-slate-400
        "
    >
        Más adelante las evidencias se almacenarán de forma segura en la nube y podrán cargarse directamente desde terreno o desde un teléfono.
    </p>

</div>


                    <!-- =============================================
                         DESCRIPCIÓN
                    ============================================== -->

                    <div>

                        <label
                            class="
                                block
                                text-xs
                                font-semibold
                                text-slate-700
                                mb-1.5
                            "
                        >
                            Descripción de la acción
                        </label>

                        <textarea
                            id="nuevaAccionDescripcion"
                            rows="3"
                            placeholder="Describe la acción correctiva o de mejora..."
                            class="
                                w-full
                                border
                                border-slate-300
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                resize-none
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-600/20
                                focus:border-blue-600
                            "
                        ></textarea>

                    </div>

                </div>


                <!-- =================================================
                     FOOTER
                ================================================== -->

                <div
                    class="
                        px-6
                        py-4
                        border-t
                        border-slate-200
                        flex
                        items-center
                        justify-end
                        gap-2
                        bg-slate-50
                    "
                >

                    <button
                        id="cancelarModalAccion"
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
                        Cancelar
                    </button>


                    <button
                        id="guardarNuevaAccion"
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
                        Guardar Acción
                    </button>

                </div>

            </div>

        </div>
    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        modalHTML
    );


    // =========================================================
    // ELEMENTOS DEL MODAL
    // =========================================================

    const modal =
        document.getElementById(
            "modalNuevaAccion"
        );

    const botonCerrar =
        document.getElementById(
            "cerrarModalAccion"
        );

    const botonCancelar =
        document.getElementById(
            "cancelarModalAccion"
        );

    const botonGuardar =
        document.getElementById(
            "guardarNuevaAccion"
        );

    const campoId =
        document.getElementById(
            "nuevaAccionId"
        );

    const campoTipo =
        document.getElementById(
            "nuevaAccionTipoOrigen"
        );

    const campoRegistro =
        document.getElementById(
            "nuevaAccionRegistro"
        );

    const campoEmpresa =
        document.getElementById(
            "nuevaAccionEmpresa"
        );

    const campoContrato =
        document.getElementById(
            "nuevaAccionContrato"
        );

    const campoFaena =
        document.getElementById(
            "nuevaAccionFaena"
        );

    const campoResponsable =
        document.getElementById(
            "nuevaAccionResponsable"
        );

    const campoFecha =
        document.getElementById(
            "nuevaAccionFecha"
        );

    const campoEstado =
        document.getElementById(
            "nuevaAccionEstado"
        );

    const campoAvance =
        document.getElementById(
            "nuevaAccionAvance"
        );

    const campoEvidencia =
        document.getElementById(
            "nuevaAccionEvidencia"
        );

    const campoDescripcion =
        document.getElementById(
            "nuevaAccionDescripcion"
        );

    const tituloModal =
        document.getElementById(
            "tituloModalAccion"
        );

    const subtituloModal =
        document.getElementById(
            "subtituloModalAccion"
        );


    // =========================================================
    // UTILIDADES
    // =========================================================

    function escaparHTML(valor) {

        return String(valor ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }



function limpiarContexto() {

    campoEmpresa.value = "";
    campoContrato.value = "";
    campoFaena.value = "";

    const campoPrioridad =
        document.getElementById("accionPrioridad");

    if (campoPrioridad) {
        campoPrioridad.value = "";
    }
}

function calcularPrioridadAutomatica(tipo, registro) {

    if (!registro) {
        return "Sin evaluar";
    }

    // =====================================================
    // OBTENER NIVEL DEL REGISTRO
    // =====================================================

    let nivel =
        registro.nivel ||
        registro.nivelOportunidad ||
        registro.criticidad ||
        "";

    nivel = String(nivel)
        .trim()
        .toLowerCase();


    // =====================================================
    // SIN EVALUAR
    // =====================================================

    if (
        !nivel ||
        nivel.includes("sin evaluar") ||
        nivel.includes("no evaluad")
    ) {
        return "Sin evaluar";
    }


    // =====================================================
    // CRÍTICA
    // =====================================================

    if (
        nivel.includes("crítica") ||
        nivel.includes("critica") ||
        nivel.includes("muy alta")
    ) {
        return "Crítica";
    }


    // =====================================================
    // ALTA
    // =====================================================

    if (nivel.includes("alta")) {
        return "Alta";
    }


    // =====================================================
    // MEDIA
    // =====================================================

    if (
        nivel.includes("moderada") ||
        nivel.includes("moderado") ||
        nivel.includes("media") ||
        nivel.includes("medio")
    ) {
        return "Media";
    }


    // =====================================================
    // BAJA
    // =====================================================

    if (
        nivel.includes("baja") ||
        nivel.includes("bajo")
    ) {
        return "Baja";
    }


    // =====================================================
    // VALOR NO RECONOCIDO
    // =====================================================

    console.warn(
        "Nivel no reconocido para prioridad:",
        {
            tipo,
            id: registro.id,
            nivelOriginal:
                registro.nivel ||
                registro.nivelOportunidad ||
                registro.criticidad
        }
    );

    return "Sin evaluar";
}

// =========================================================
// CARGAR RESPONSABLES
// =========================================================

function cargarResponsables(seleccionado = "Sin asignar") {

    campoResponsable.innerHTML = "";

    const opcionSinAsignar = document.createElement("option");
    opcionSinAsignar.value = "Sin asignar";
    opcionSinAsignar.textContent = "Sin asignar";

    campoResponsable.appendChild(opcionSinAsignar);

    try {

        const usuariosGuardados =
            localStorage.getItem("vireon_usuarios");

        if (!usuariosGuardados) {
            console.warn(
                "No existen usuarios guardados en vireon_usuarios."
            );

            campoResponsable.value = "Sin asignar";
            return;
        }

        const datos = JSON.parse(usuariosGuardados);

        const usuarios =
            Array.isArray(datos)
                ? datos
                : Array.isArray(datos?.usuarios)
                    ? datos.usuarios
                    : [];

        const usuariosActivos =
            usuarios.filter(usuario => {

                const estado =
                    String(
                        usuario.estado ??
                        usuario.status ??
                        "Activo"
                    )
                    .trim()
                    .toLowerCase();

                return (
                    estado === "activo" ||
                    estado === "activa" ||
                    estado === "active" ||
                    usuario.activo === true
                );
            });

        usuariosActivos.forEach(usuario => {

            const nombre =
                usuario.nombreCompleto ||
                usuario.nombre ||
                usuario.name ||
                usuario.usuario ||
                usuario.email ||
                "";

            if (!nombre) return;

            const yaExiste =
                Array.from(campoResponsable.options)
                    .some(opcion => opcion.value === nombre);

            if (yaExiste) return;

            const opcion =
                document.createElement("option");

            opcion.value = nombre;
            opcion.textContent = nombre;

            campoResponsable.appendChild(opcion);
        });

        // Mantener responsable anterior al editar,
        // aunque actualmente no esté activo.
        if (
            seleccionado &&
            seleccionado !== "Sin asignar"
        ) {

            const existe =
                Array.from(campoResponsable.options)
                    .some(
                        opcion =>
                            opcion.value === seleccionado
                    );

            if (!existe) {

                const opcionAnterior =
                    document.createElement("option");

                opcionAnterior.value = seleccionado;
                opcionAnterior.textContent =
                    `${seleccionado} (registro anterior)`;

                campoResponsable.appendChild(opcionAnterior);
            }
        }

        campoResponsable.value =
            seleccionado || "Sin asignar";

    } catch (error) {

        console.error(
            "ERROR AL CARGAR RESPONSABLES:",
            error
        );

        campoResponsable.value = "Sin asignar";
    }
}


// =========================================================
// OBTENER REGISTRO
// =========================================================


    // =========================================================
    // OBTENER REGISTRO
    // =========================================================

    async function obtenerRegistro(
        tipo,
        id
    ) {

        if (!id) {
            return null;
        }


        if (tipo === "Riesgo") {

            return await RiesgosStorage
                .obtenerPorId(id);
        }


        if (
            typeof OportunidadesStorage ===
            "undefined"
        ) {

            console.error(
                "OportunidadesStorage no está disponible."
            );

            return null;
        }


        if (
            typeof OportunidadesStorage
                .obtenerPorId ===
            "function"
        ) {

            return await OportunidadesStorage
                .obtenerPorId(id);
        }


        // Compatibilidad

        const oportunidades =
            await OportunidadesStorage
                .obtenerTodas();


        return oportunidades.find(
            oportunidad =>
                oportunidad.id === id
        ) || null;
    }


    // =========================================================
    // CARGAR REGISTROS ASOCIADOS
    // =========================================================

    async function cargarRegistrosAsociados(
        seleccionado = ""
    ) {

        campoRegistro.innerHTML = `
            <option value="">
                Seleccionar...
            </option>
        `;


        try {

            if (
                campoTipo.value ===
                "Riesgo"
            ) {

                const riesgos =
                    await RiesgosStorage
                        .obtenerTodos();


                const lista =
                    Array.isArray(riesgos)
                        ? riesgos
                        : [];


                lista.forEach(
                    riesgo => {

                        const opcion =
                            document.createElement(
                                "option"
                            );

                        opcion.value =
                            riesgo.id;

                        opcion.textContent =
                            `${riesgo.id} - ${
                                riesgo.titulo ||
                                riesgo.descripcion ||
                                "Sin título"
                            }`;

                        campoRegistro
                            .appendChild(
                                opcion
                            );
                    }
                );


            } else {

                if (
                    typeof OportunidadesStorage ===
                    "undefined"
                ) {

                    console.error(
                        "OportunidadesStorage no está disponible."
                    );

                    return;
                }


                const oportunidades =
                    await OportunidadesStorage
                        .obtenerTodas();


                const lista =
                    Array.isArray(
                        oportunidades
                    )
                        ? oportunidades
                        : [];


                lista.forEach(
                    oportunidad => {

                        const opcion =
                            document.createElement(
                                "option"
                            );

                        opcion.value =
                            oportunidad.id;

                        opcion.textContent =
                            `${oportunidad.id} - ${
                                oportunidad.titulo ||
                                oportunidad.descripcion ||
                                "Sin título"
                            }`;

                        campoRegistro
                            .appendChild(
                                opcion
                            );
                    }
                );
            }


            if (seleccionado) {

                campoRegistro.value =
                    seleccionado;


                // Compatibilidad con una acción antigua
                // cuyo registro ya no exista.

                if (
                    campoRegistro.value !==
                    seleccionado
                ) {

                    const opcion =
                        document.createElement(
                            "option"
                        );

                    opcion.value =
                        seleccionado;

                    opcion.textContent =
                        `${seleccionado} - Registro anterior`;

                    campoRegistro
                        .appendChild(
                            opcion
                        );


                    campoRegistro.value =
                        seleccionado;
                }
            }


        } catch (error) {

            console.error(
                "ERROR AL CARGAR REGISTROS ASOCIADOS:",
                error
            );
        }
    }


    // =========================================================
    // CARGAR EMPRESA / CONTRATO / FAENA
    // =========================================================

   async function cargarContextoRegistro() {

    limpiarContexto();

    const registroId =
        campoRegistro.value;

    const campoPrioridad =
        document.getElementById("accionPrioridad");


    if (!registroId) {

        if (campoPrioridad) {
            campoPrioridad.value = "";
        }

        return;
    }


    try {

        const registro =
            await obtenerRegistro(
                campoTipo.value,
                registroId
            );


        if (!registro) {

            console.warn(
                "No se encontró el registro asociado:",
                registroId
            );

            if (campoPrioridad) {
                campoPrioridad.value =
                    "Sin prioridad";
            }

            return;
        }


        // =====================================================
        // EMPRESA
        // =====================================================

        campoEmpresa.value =
            registro.empresa ||
            "";


        // =====================================================
        // CONTRATO
        // =====================================================

        campoContrato.value =
            registro.contrato ||
            "";


        // =====================================================
        // FAENA
        // =====================================================

        campoFaena.value =
            registro.faena ||
            "";


        // =====================================================
        // PRIORIDAD AUTOMÁTICA
        // =====================================================

        const prioridad =
            calcularPrioridadAutomatica(
                campoTipo.value,
                registro
            );


        if (campoPrioridad) {

            campoPrioridad.value =
                prioridad;
        }


        console.log(
            "Contexto cargado:",
            {
                tipo:
                    campoTipo.value,

                registroId:
                    registroId,

                empresa:
                    campoEmpresa.value,

                contrato:
                    campoContrato.value,

                faena:
                    campoFaena.value,

                prioridad:
                    prioridad
            }
        );


    } catch (error) {

        console.error(
            "ERROR AL CARGAR CONTEXTO:",
            error
        );

        if (campoPrioridad) {
            campoPrioridad.value =
                "Sin prioridad";
        }
    }
}

    // =========================================================
    // CAMBIAR REGISTRO
    // =========================================================

    campoRegistro.addEventListener(
        "change",
        cargarContextoRegistro
    );


    // =========================================================
    // CAMBIAR TIPO DE ORIGEN
    // =========================================================

    campoTipo.addEventListener(
        "change",
        async function () {

            limpiarContexto();


            await cargarRegistrosAsociados();


            campoRegistro.value =
                "";
        }
    );


    // =========================================================
    // LIMPIAR FORMULARIO
    // =========================================================

    function limpiarFormulario() {

        accionEnEdicion =
            null;


        campoId.value =
            "";

        campoId.disabled =
            false;


        campoTipo.value =
            "Riesgo";


        campoRegistro.innerHTML = `
            <option value="">
                Seleccionar...
            </option>
        `;


        limpiarContexto();


                cargarResponsables(
            "Sin asignar"
        );

        campoFecha.value =
            "";

        campoEstado.value =
            "Pendiente";

        campoAvance.value =
            "0";

        campoEvidencia.value =
            "";

        campoDescripcion.value =
            "";


        if (tituloModal) {

            tituloModal.textContent =
                "Nueva Acción";
        }


        if (subtituloModal) {

            subtituloModal.textContent =
                "Registrar una acción asociada a un riesgo u oportunidad.";
        }


        botonGuardar.textContent =
            "Guardar Acción";
    }


    // =========================================================
    // ABRIR NUEVA ACCIÓN
    // =========================================================

    botonNuevaAccion.addEventListener(
        "click",
        async function () {

            limpiarFormulario();


            await cargarRegistrosAsociados();


            modal.classList
                .remove("hidden");

            modal.classList
                .add("flex");


            campoId.focus();
        }
    );


    // =========================================================
    // CERRAR MODAL
    // =========================================================

    function cerrarModal() {

        modal.classList
            .remove("flex");

        modal.classList
            .add("hidden");
    }


    botonCerrar.addEventListener(
        "click",
        cerrarModal
    );


    botonCancelar.addEventListener(
        "click",
        cerrarModal
    );


    modal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target ===
                modal
            ) {

                cerrarModal();
            }
        }
    );


    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key ===
                    "Escape" &&
                !modal.classList
                    .contains("hidden")
            ) {

                cerrarModal();
            }
        }
    );


    // =========================================================
    // ABRIR EN MODO EDICIÓN
    // =========================================================

    window.abrirEdicionAccion =
        async function (id) {

            try {

                const acciones =
                    await AccionesStorage
                        .obtenerTodas();


                const accion =
                    acciones.find(
                        item =>
                            item.id === id
                    );


                if (!accion) {

                    alert(
                        `No se encontró la acción ${id}.`
                    );

                    return;
                }


                accionEnEdicion =
                    accion.id;


                campoId.value =
                    accion.id ||
                    "";


                campoId.disabled =
                    true;


                // =============================================
                // TIPO
                // =============================================

                let tipo =
                    accion.tipoOrigen ||
                    "";


                // Compatibilidad con registros antiguos

                const registroAntiguo =
                    accion.registroId ||
                    accion.riesgoId ||
                    accion.oportunidadId ||
                    "";


                if (!tipo) {

                    tipo =
                        String(
                            registroAntiguo
                        )
                        .toUpperCase()
                        .startsWith("O-")

                            ? "Oportunidad"

                            : "Riesgo";
                }


                campoTipo.value =
                    tipo;


                // =============================================
                // REGISTRO ASOCIADO
                // =============================================

                await cargarRegistrosAsociados(
                    registroAntiguo
                );


                campoRegistro.value =
                    registroAntiguo;


                // =============================================
                // CONTEXTO
                // =============================================

                await cargarContextoRegistro();


                // Si el registro antiguo no existe,
                // conservar la información guardada.

                if (!campoEmpresa.value) {

                    campoEmpresa.value =
                        accion.empresa ||
                        "";
                }


                if (!campoContrato.value) {

                    campoContrato.value =
                        accion.contrato ||
                        "";
                }


                if (!campoFaena.value) {

                    campoFaena.value =
                        accion.faena ||
                        "";
                }


                // =============================================
                // RESTO DE CAMPOS
                // =============================================

                                cargarResponsables(
                    accion.responsable ||
                    "Sin asignar"
                );

                campoFecha.value =
                    accion.fechaCompromiso ||
                    "";


                campoEstado.value =
                    accion.estado ||
                    "Pendiente";


                campoAvance.value =
                    Number(
                        accion.avance ||
                        0
                    );


                campoEvidencia.value =
                    accion.evidencia ===
                    "Sin evidencia"

                        ? ""

                        : (
                            accion.evidencia ||
                            ""
                        );


                campoDescripcion.value =
                    accion.accion ||
                    "";


                // =============================================
                // TEXTO DEL MODAL
                // =============================================

                if (tituloModal) {

                    tituloModal.textContent =
                        `Editar Acción ${accion.id}`;
                }


                if (subtituloModal) {

                    subtituloModal.textContent =
                        "Modifica los antecedentes de la acción seleccionada.";
                }


                botonGuardar.textContent =
                    "Actualizar Acción";


                // =============================================
                // MOSTRAR
                // =============================================

                modal.classList
                    .remove("hidden");

                modal.classList
                    .add("flex");


            } catch (error) {

                console.error(
                    "ERROR AL ABRIR EDICIÓN DE ACCIÓN:",
                    error
                );


                alert(
                    "No fue posible cargar la acción para editar."
                );
            }
        };


    // =========================================================
    // GUARDAR / ACTUALIZAR
    // =========================================================

    botonGuardar.addEventListener(
        "click",
        async function () {

            try {

                // =============================================
                // LEER DATOS
                // =============================================

                const id =
                    campoId.value
                        .trim()
                        .toUpperCase();


                const tipoOrigen =
                    campoTipo.value;


                const registroId =
                    campoRegistro.value;


                const responsable =
                    campoResponsable.value
                        .trim();


                const fechaCompromiso =
                    campoFecha.value;


                let estado =
                    campoEstado.value;


                let avance =
                    Number(
                        campoAvance.value
                    );


                const evidencia =
                    campoEvidencia.value
                        .trim();


                const descripcion =
                    campoDescripcion.value
                        .trim();


                // =============================================
                // VALIDAR ID
                // =============================================

                if (!id) {

                    alert(
                        "Debes ingresar un ID para la acción."
                    );

                    campoId.focus();

                    return;
                }


                if (
                    !id.startsWith("AC-")
                ) {

                    alert(
                        "El ID debe comenzar con AC-. Ejemplo: AC-203"
                    );

                    campoId.focus();

                    return;
                }


                // =============================================
                // VALIDAR REGISTRO
                // =============================================

                if (!registroId) {

                    alert(
                        "Debes seleccionar un riesgo u oportunidad asociada."
                    );

                    campoRegistro.focus();

                    return;
                }


                // =============================================
                // VALIDAR DESCRIPCIÓN
                // =============================================

                if (!descripcion) {

                    alert(
                        "Debes ingresar la descripción de la acción."
                    );

                    campoDescripcion.focus();

                    return;
                }


                // =============================================
                // VALIDAR FECHA
                // =============================================

                if (!fechaCompromiso) {

                    alert(
                        "Debes ingresar una fecha de compromiso."
                    );

                    campoFecha.focus();

                    return;
                }


                // =============================================
                // VALIDAR AVANCE
                // =============================================

                if (
                    Number.isNaN(avance) ||
                    avance < 0 ||
                    avance > 100
                ) {

                    alert(
                        "El avance debe estar entre 0 y 100."
                    );

                    campoAvance.focus();

                    return;
                }


                // =============================================
                // COHERENCIA ESTADO / AVANCE
                // =============================================

                if (
                    estado === "Cerrada" &&
                    avance !== 100
                ) {

                    const confirmar =
                        confirm(
                            "La acción está marcada como Cerrada, pero su avance no es 100%.\n\n¿Deseas establecer automáticamente el avance en 100%?"
                        );


                    if (confirmar) {

                        avance =
                            100;

                        campoAvance.value =
                            "100";

                    } else {

                        return;
                    }
                }


                if (
                    avance === 100 &&
                    estado !== "Cerrada"
                ) {

                    const confirmar =
                        confirm(
                            "El avance es 100%, pero la acción no está marcada como Cerrada.\n\n¿Deseas cerrar automáticamente la acción?"
                        );


                    if (confirmar) {

                        estado =
                            "Cerrada";

                        campoEstado.value =
                            "Cerrada";

                    } else {

                        return;
                    }
                }


                // =============================================
                // OBTENER REGISTRO REAL
                // =============================================

                const registroAsociado =
                    await obtenerRegistro(
                        tipoOrigen,
                        registroId
                    );


                if (!registroAsociado) {

                    alert(
                        `No se encontró el ${tipoOrigen.toLowerCase()} ${registroId}.`
                    );

                    return;
                }


                // =============================================
                // DUPLICADOS
                // =============================================

                const accionesExistentes =
                    await AccionesStorage
                        .obtenerTodas();


                const existe =
                    accionesExistentes.some(
                        item =>
                            item.id === id
                    );


                if (
                    existe &&
                    !accionEnEdicion
                ) {

                    alert(
                        `Ya existe una acción con el ID ${id}.`
                    );

                    campoId.focus();

                    return;
                }


                // =============================================
                // OBJETO NORMALIZADO
                // =============================================

                const datosAccion = {

                    id:
                        id,

                    tipoOrigen:
                        tipoOrigen,

                    // VÍNCULO GENÉRICO CORRECTO
                    registroId:
                        registroId,

                    empresa:
                        registroAsociado.empresa ||
                        "",

                    contrato:
                        registroAsociado.contrato ||
                        "",

                    faena:
                        registroAsociado.faena ||
                        "",

prioridad:
    calcularPrioridadAutomatica(
        tipoOrigen,
        registroAsociado
    ),

                    accion:
                        descripcion,

                    responsable:
                        responsable ||
                        "Sin asignar",

                    fechaCompromiso:
                        fechaCompromiso,

                    estado:
                        estado,

                    avance:
                        avance,

                    evidencia:
                        evidencia ||
                        "Sin evidencia",

                    ultimaActualizacion:
                        new Date()
                            .toISOString()
                            .split("T")[0]

                };


                // =============================================
                // IMPORTANTE:
                // Ya NO guardamos:
                //
                // riesgoId: registroId
                //
                // porque una acción también puede provenir
                // de una oportunidad.
                // =============================================


                console.log(
                    "Acción preparada:",
                    datosAccion
                );


                // =============================================
                // ACTUALIZAR
                // =============================================

                if (accionEnEdicion) {

                    await AccionesStorage
                        .actualizar(
                            accionEnEdicion,
                            datosAccion
                        );


                    console.log(
                        `Acción ${accionEnEdicion} actualizada correctamente`
                    );


                } else {

                    // =========================================
                    // CREAR
                    // =========================================

                    await AccionesStorage
                        .agregar(
                            datosAccion
                        );


                        
                    console.log(
                        "Acción creada correctamente:",
                        datosAccion.id
                    );
                }


                cerrarModal();


                window.location.reload();


            } catch (error) {

                console.error(
                    "ERROR AL GUARDAR ACCIÓN:",
                    error
                );


                alert(
                    "No fue posible guardar la acción."
                );
            }
        }
    );

    // =========================================================
// PREVISUALIZACIÓN DE EVIDENCIAS SELECCIONADAS
// =========================================================

const inputArchivos =
    document.getElementById(
        "nuevaAccionArchivos"
    );

const listaEvidencias =
    document.getElementById(
        "listaEvidenciasSeleccionadas"
    );


// Archivos seleccionados actualmente
let archivosSeleccionados = [];


// =========================================================
// FORMATEAR TAMAÑO
// =========================================================

function formatearTamanoArchivo(bytes) {

    if (!bytes) {
        return "0 KB";
    }

    const kb =
        bytes / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    const mb =
        kb / 1024;

    return `${mb.toFixed(1)} MB`;
}


// =========================================================
// OBTENER ÍCONO SEGÚN ARCHIVO
// =========================================================

function obtenerIconoArchivo(archivo) {

    const tipo =
        archivo.type || "";

    const nombre =
        archivo.name
            .toLowerCase();

    if (
        tipo.startsWith("image/")
    ) {
        return "🖼️";
    }

    if (
        tipo === "application/pdf" ||
        nombre.endsWith(".pdf")
    ) {
        return "📄";
    }

    if (
        nombre.endsWith(".doc") ||
        nombre.endsWith(".docx")
    ) {
        return "📝";
    }

    if (
        nombre.endsWith(".xls") ||
        nombre.endsWith(".xlsx")
    ) {
        return "📊";
    }

    return "📎";
}


// =========================================================
// RENDERIZAR ARCHIVOS SELECCIONADOS
// =========================================================

function renderizarArchivosSeleccionados() {

    if (
        !listaEvidencias
    ) {
        return;
    }

    listaEvidencias.innerHTML = "";


    if (
        archivosSeleccionados.length === 0
    ) {

        listaEvidencias
            .classList
            .add("hidden");

        return;
    }


    listaEvidencias
        .classList
        .remove("hidden");


    archivosSeleccionados.forEach(
        (archivo, indice) => {

            const fila =
                document.createElement("div");

            fila.className = `
                flex
                items-center
                justify-between
                gap-3
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                py-2
            `;


            fila.innerHTML = `

                <div
                    class="
                        flex
                        items-center
                        gap-2
                        min-w-0
                    "
                >

                    <span
                        class="
                            text-lg
                            shrink-0
                        "
                    >
                        ${obtenerIconoArchivo(
                            archivo
                        )}
                    </span>

                    <div
                        class="
                            min-w-0
                        "
                    >

                        <p
                            class="
                                text-xs
                                font-semibold
                                text-slate-700
                                truncate
                            "
                            title="${archivo.name}"
                        >
                            ${archivo.name}
                        </p>

                        <p
                            class="
                                text-[10px]
                                text-slate-400
                            "
                        >
                            ${formatearTamanoArchivo(
                                archivo.size
                            )}
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    data-indice="${indice}"
                    class="
                        btnQuitarEvidencia
                        text-[11px]
                        font-semibold
                        text-red-600
                        hover:text-red-700
                        shrink-0
                    "
                >
                    Quitar
                </button>
            `;


            listaEvidencias
                .appendChild(
                    fila
                );
        }
    );


    // Botones quitar
    listaEvidencias
        .querySelectorAll(
            ".btnQuitarEvidencia"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    function () {

                        const indice =
                            Number(
                                this.dataset.indice
                            );


                        archivosSeleccionados
                            .splice(
                                indice,
                                1
                            );


                        renderizarArchivosSeleccionados();
                    }
                );
            }
        );
}


// =========================================================
// CAMBIO EN SELECTOR DE ARCHIVOS
// =========================================================

if (inputArchivos) {

    inputArchivos.addEventListener(
        "change",
        function () {

            const nuevosArchivos =
                Array.from(
                    this.files || []
                );


            archivosSeleccionados =
                nuevosArchivos;


            renderizarArchivosSeleccionados();
        }
    );
}

    console.log(
        "Modal de acciones inicializado correctamente"
    );

});