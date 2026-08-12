console.log("MODAL-RIESGO.JS CARGADO");

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM listo para modal");


    // =========================================================
    // 1. ELEMENTOS GENERALES
    // =========================================================

    const botonNuevo =
        document.getElementById("btnNuevoRegistro");

    const modalTipo =
        document.getElementById("modalTipoRegistro");

    const botonElegirRiesgo =
        document.getElementById("btnElegirRiesgo");

    const botonElegirOportunidad =
        document.getElementById("btnElegirOportunidad");

    const cerrarTipoRegistro =
        document.getElementById("cerrarTipoRegistro");


    const modal =
        document.getElementById("modalNuevoRiesgo");

    const botonCerrar =
        document.getElementById("cerrarModal");

    const botonCancelar =
        document.getElementById("cancelarModal");

    const botonGuardar =
        document.getElementById("guardarRiesgo");


    const tituloModal =
        document.getElementById("tituloModal");

    const subtituloModal =
        document.getElementById("subtituloModal");


    // =========================================================
    // 2. CAMPOS
    // =========================================================

    const campoEmpresa =
        document.getElementById("campoEmpresa");

    const campoContrato =
        document.getElementById("campoContrato");

    const campoFaena =
        document.getElementById("campoFaena");

    const campoId =
        document.getElementById("nuevoId");

    let campoResponsable =
        document.getElementById("nuevoResponsable");

    const campoTitulo =
        document.getElementById("nuevoTitulo");

    const campoDescripcion =
        document.getElementById("nuevaDescripcion");

    const campoCategoria =
        document.getElementById("nuevaCategoria");

    const campoEstado =
        document.getElementById("nuevoEstado");

    const campoProbabilidad =
        document.getElementById("nuevaProbabilidad");

    const campoImpacto =
        document.getElementById("nuevoImpacto");

    const campoPlan =
        document.getElementById("nuevoPlan");


    // =========================================================
    // 3. ELEMENTOS ESPECÍFICOS DE OPORTUNIDAD
    // =========================================================

    const grupoBeneficioPotencial =
        document.getElementById(
            "grupoBeneficioPotencial"
        );

    const campoBeneficioPotencial =
        document.getElementById(
            "nuevoBeneficioPotencial"
        );

    const labelImpacto =
        document.getElementById(
            "labelImpacto"
        );

    const labelPlan =
        document.getElementById(
            "labelPlan"
        );


    if (!modal) {

        console.error(
            "No se encontró modalNuevoRiesgo"
        );

        return;
    }


    // =========================================================
    // 4. ESTADO INTERNO
    // =========================================================

    let tipoRegistroActual = "Riesgo";

    let idEnEdicion = null;

    let tipoEnEdicion = null;


    // =========================================================
    // 5. STORAGE CONFIGURACIÓN
    // =========================================================

    const STORAGE_ESTRUCTURAS =
        "vireon_estructuras";

    const STORAGE_USUARIOS =
        "vireon_usuarios";


    // =========================================================
    // 6. UTILIDADES
    // =========================================================

    function normalizar(valor) {

        return String(valor || "")
            .trim()
            .toLocaleLowerCase("es");
    }


    function obtenerEstructuras() {

        try {

            const datos =
                localStorage.getItem(
                    STORAGE_ESTRUCTURAS
                );

            if (!datos) {

                return [];
            }

            const estructuras =
                JSON.parse(datos);

            return Array.isArray(estructuras)
                ? estructuras
                : [];

        } catch (error) {

            console.error(
                "Error leyendo estructuras:",
                error
            );

            return [];
        }
    }


    function obtenerUsuarios() {

        try {

            const datos =
                localStorage.getItem(
                    STORAGE_USUARIOS
                );

            if (datos) {

                const usuarios =
                    JSON.parse(datos);

                if (Array.isArray(usuarios)) {

                    return usuarios;
                }
            }

        } catch (error) {

            console.error(
                "Error leyendo usuarios:",
                error
            );
        }


        // Respaldo temporal del MVP

        return [

            {
                id: "USR-001",
                nombre: "Miguel González",
                rol: "Gestor de Riesgos",
                estado: "Activo"
            },

            {
                id: "USR-002",
                nombre: "J. Soto",
                rol: "Responsable de Terreno",
                estado: "Activo"
            }

        ];
    }


    // =========================================================
    // 7. RESPONSABLE COMO SELECT
    // =========================================================

    function convertirResponsableASelect() {

        if (!campoResponsable) {

            return;
        }


        if (
            campoResponsable
                .tagName
                .toLowerCase() === "select"
        ) {

            return;
        }


        const select =
            document.createElement("select");


        select.id =
            campoResponsable.id;

        select.className =
            campoResponsable.className;


        campoResponsable.replaceWith(
            select
        );


        campoResponsable =
            select;
    }


    convertirResponsableASelect();


    // =========================================================
    // 8. CARGAR RESPONSABLES
    // =========================================================

    function cargarResponsables(
        seleccionado = ""
    ) {

        if (!campoResponsable) {

            return;
        }


        campoResponsable.innerHTML = `
            <option value="">
                Seleccionar responsable...
            </option>

            <option value="Sin asignar">
                Sin asignar
            </option>
        `;


        const usuarios =
            obtenerUsuarios();


        const nombres =
            [
                ...new Set(

                    usuarios

                        .filter(
                            usuario =>

                                normalizar(
                                    usuario.estado ||
                                    "Activo"
                                ) === "activo"
                        )

                        .map(
                            usuario =>
                                String(
                                    usuario.nombre ||
                                    usuario.usuario ||
                                    usuario.nombreCompleto ||
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


        nombres.forEach(
            nombre => {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    nombre;

                opcion.textContent =
                    nombre;

                campoResponsable
                    .appendChild(
                        opcion
                    );
            }
        );


        // Compatibilidad con registros antiguos

        if (
            seleccionado &&
            !Array
                .from(
                    campoResponsable.options
                )
                .some(
                    opcion =>
                        opcion.value ===
                        seleccionado
                )
        ) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                seleccionado;

            opcion.textContent =
                seleccionado +
                " (registro antiguo)";

            campoResponsable
                .appendChild(
                    opcion
                );
        }


        if (seleccionado) {

            campoResponsable.value =
                seleccionado;
        }
    }


    // =========================================================
    // 9. CARGAR EMPRESAS
    // =========================================================

    function cargarEmpresas(
        seleccionada = ""
    ) {

        const estructuras =
            obtenerEstructuras();


        const empresas =
            [
                ...new Set(

                    estructuras

                        .map(
                            item =>
                                String(
                                    item.empresa ||
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


        campoEmpresa.innerHTML = `
            <option value="">
                Seleccionar empresa...
            </option>
        `;


        empresas.forEach(
            empresa => {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    empresa;

                opcion.textContent =
                    empresa;

                campoEmpresa
                    .appendChild(
                        opcion
                    );
            }
        );


        // Compatibilidad con registros antiguos

        if (
            seleccionada &&
            !Array
                .from(
                    campoEmpresa.options
                )
                .some(
                    opcion =>
                        opcion.value ===
                        seleccionada
                )
        ) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                seleccionada;

            opcion.textContent =
                seleccionada +
                " (registro antiguo)";

            campoEmpresa
                .appendChild(
                    opcion
                );
        }


        if (seleccionada) {

            campoEmpresa.value =
                seleccionada;
        }
    }


    // =========================================================
    // 10. CARGAR CONTRATOS
    // =========================================================

    function cargarContratos(
        seleccionado = ""
    ) {

        campoContrato.innerHTML = `
            <option value="">
                Seleccionar contrato...
            </option>
        `;


        campoFaena.innerHTML = `
            <option value="">
                Seleccionar faena...
            </option>
        `;


        const empresa =
            normalizar(
                campoEmpresa.value
            );


        if (!empresa) {

            return;
        }


        const estructuras =
            obtenerEstructuras();


        const contratos =
            [
                ...new Set(

                    estructuras

                        .filter(
                            item =>
                                normalizar(
                                    item.empresa
                                ) ===
                                empresa
                        )

                        .map(
                            item =>
                                String(
                                    item.contrato ||
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


        contratos.forEach(
            contrato => {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    contrato;

                opcion.textContent =
                    contrato;

                campoContrato
                    .appendChild(
                        opcion
                    );
            }
        );


        if (
            seleccionado &&
            !Array
                .from(
                    campoContrato.options
                )
                .some(
                    opcion =>
                        opcion.value ===
                        seleccionado
                )
        ) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                seleccionado;

            opcion.textContent =
                seleccionado +
                " (registro antiguo)";

            campoContrato
                .appendChild(
                    opcion
                );
        }


        if (seleccionado) {

            campoContrato.value =
                seleccionado;
        }
    }


    // =========================================================
    // 11. CARGAR FAENAS
    // =========================================================

    function cargarFaenas(
        seleccionada = ""
    ) {

        campoFaena.innerHTML = `
            <option value="">
                Seleccionar faena...
            </option>
        `;


        const empresa =
            normalizar(
                campoEmpresa.value
            );

        const contrato =
            normalizar(
                campoContrato.value
            );


        if (
            !empresa ||
            !contrato
        ) {

            return;
        }


        const estructuras =
            obtenerEstructuras();


        const faenas =
            [
                ...new Set(

                    estructuras

                        .filter(
                            item =>

                                normalizar(
                                    item.empresa
                                ) ===
                                empresa

                                &&

                                normalizar(
                                    item.contrato
                                ) ===
                                contrato
                        )

                        .map(
                            item =>
                                String(
                                    item.faena ||
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


        faenas.forEach(
            faena => {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    faena;

                opcion.textContent =
                    faena;

                campoFaena
                    .appendChild(
                        opcion
                    );
            }
        );


        if (
            seleccionada &&
            !Array
                .from(
                    campoFaena.options
                )
                .some(
                    opcion =>
                        opcion.value ===
                        seleccionada
                )
        ) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                seleccionada;

            opcion.textContent =
                seleccionada +
                " (registro antiguo)";

            campoFaena
                .appendChild(
                    opcion
                );
        }


        if (seleccionada) {

            campoFaena.value =
                seleccionada;
        }
    }


    // =========================================================
    // 12. EMPRESA → CONTRATO → FAENA
    // =========================================================

    campoEmpresa.addEventListener(
        "change",
        function () {

            cargarContratos();

            cargarFaenas();
        }
    );


    campoContrato.addEventListener(
        "change",
        function () {

            cargarFaenas();
        }
    );


    // =========================================================
    // 13. MODAL DE SELECCIÓN DE TIPO
    // =========================================================

    function abrirModalTipo() {

        if (!modalTipo) {

            console.error(
                "No se encontró modalTipoRegistro"
            );

            return;
        }


        modalTipo.classList
            .remove("hidden");

        modalTipo.classList
            .add("flex");
    }


    function cerrarModalTipo() {

        if (!modalTipo) {

            return;
        }


        modalTipo.classList
            .remove("flex");

        modalTipo.classList
            .add("hidden");
    }


    // =========================================================
    // 14. MODAL DE FORMULARIO
    // =========================================================

    function abrirModal() {

        modal.classList
            .remove("hidden");

        modal.classList
            .add("flex");
    }


    function cerrarModal() {

        modal.classList
            .remove("flex");

        modal.classList
            .add("hidden");


        idEnEdicion =
            null;

        tipoEnEdicion =
            null;


        if (campoId) {

            campoId.disabled =
                false;
        }
    }


    // =========================================================
    // 15. ESTADOS SEGÚN TIPO
    // =========================================================

    function cargarEstadosPorTipo(
        valorSeleccionado = ""
    ) {

        if (
            tipoRegistroActual ===
            "Oportunidad"
        ) {

            campoEstado.innerHTML = `

                <option value="En evaluación">
                    En evaluación
                </option>

                <option value="En aprovechamiento">
                    En aprovechamiento
                </option>

                <option value="Capturada">
                    Capturada
                </option>

                <option value="Descartada">
                    Descartada
                </option>
            `;

        } else {

            campoEstado.innerHTML = `

                <option value="Abierto">
                    Abierto
                </option>

                <option value="En proceso">
                    En proceso
                </option>

                <option value="Cerrado">
                    Cerrado
                </option>
            `;
        }


        if (
            valorSeleccionado &&
            !Array
                .from(
                    campoEstado.options
                )
                .some(
                    opcion =>
                        opcion.value ===
                        valorSeleccionado
                )
        ) {

            const opcion =
                document.createElement(
                    "option"
                );

            opcion.value =
                valorSeleccionado;

            opcion.textContent =
                valorSeleccionado;

            campoEstado
                .appendChild(
                    opcion
                );
        }


        if (valorSeleccionado) {

            campoEstado.value =
                valorSeleccionado;
        }
    }


    // =========================================================
    // 16. CONFIGURAR FORMULARIO SEGÚN TIPO
    // =========================================================

    function configurarFormularioPorTipo() {

        if (
            tipoRegistroActual ===
            "Oportunidad"
        ) {

            if (tituloModal) {

                tituloModal.textContent =
                    idEnEdicion
                        ? `Editar Oportunidad ${idEnEdicion}`
                        : "Nueva Oportunidad";
            }


            if (subtituloModal) {

                subtituloModal.textContent =
                    "Complete los antecedentes principales de la oportunidad.";
            }


            campoId.placeholder =
                "Ej: O-008";


            campoTitulo.placeholder =
                "Título breve de la oportunidad";


            campoDescripcion.placeholder =
                "Describa la oportunidad identificada...";


            if (labelImpacto) {

                labelImpacto.textContent =
                    "Impacto Positivo";
            }


            if (labelPlan) {

                labelPlan.textContent =
                    "Plan de Captura";
            }


            campoPlan.placeholder =
                "Indique las medidas para capturar el beneficio...";


            if (grupoBeneficioPotencial) {

                grupoBeneficioPotencial
                    .classList
                    .remove("hidden");
            }


            if (botonGuardar) {

                botonGuardar.textContent =
                    idEnEdicion
                        ? "Guardar Cambios"
                        : "Guardar Oportunidad";
            }


        } else {

            if (tituloModal) {

                tituloModal.textContent =
                    idEnEdicion
                        ? `Editar Riesgo ${idEnEdicion}`
                        : "Nuevo Riesgo";
            }


            if (subtituloModal) {

                subtituloModal.textContent =
                    "Complete los antecedentes principales del riesgo.";
            }


            campoId.placeholder =
                "Ej: R-004";


            campoTitulo.placeholder =
                "Título breve del riesgo";


            campoDescripcion.placeholder =
                "Describa el evento de riesgo...";


            if (labelImpacto) {

                labelImpacto.textContent =
                    "Impacto";
            }


            if (labelPlan) {

                labelPlan.textContent =
                    "Plan de Acción";
            }


            campoPlan.placeholder =
                "Indique las medidas de tratamiento propuestas...";


            if (grupoBeneficioPotencial) {

                grupoBeneficioPotencial
                    .classList
                    .add("hidden");
            }


            if (botonGuardar) {

                botonGuardar.textContent =
                    idEnEdicion
                        ? "Guardar Cambios"
                        : "Guardar Riesgo";
            }
        }


        cargarEstadosPorTipo();
    }


    // =========================================================
    // 17. LIMPIAR FORMULARIO
    // =========================================================

    function limpiarFormulario() {

        campoId.value =
            "";


        cargarEmpresas();

        campoEmpresa.value =
            "";


        cargarContratos();

        campoContrato.value =
            "";


        cargarFaenas();

        campoFaena.value =
            "";


        cargarResponsables();

        campoResponsable.value =
            "";


        campoTitulo.value =
            "";


        campoDescripcion.value =
            "";


        campoCategoria.value =
            "Plazo";


        campoProbabilidad.value =
            "3";


        campoImpacto.value =
            "3";


        campoPlan.value =
            "";


        if (campoBeneficioPotencial) {

            campoBeneficioPotencial.value =
                "";
        }


        cargarEstadosPorTipo();


        campoId.disabled =
            false;
    }


    // =========================================================
    // 18. INICIAR NUEVO REGISTRO
    // =========================================================

    function iniciarNuevoRegistro(
        tipo
    ) {

        tipoRegistroActual =
            tipo;

        idEnEdicion =
            null;

        tipoEnEdicion =
            null;


        cerrarModalTipo();


        limpiarFormulario();


        configurarFormularioPorTipo();


        abrirModal();


        campoId.focus();
    }


    // =========================================================
    // 19. BOTÓN + NUEVO REGISTRO
    // =========================================================

    if (botonNuevo) {

        botonNuevo.addEventListener(
            "click",
            function () {

                abrirModalTipo();
            }
        );
    }


    // =========================================================
    // 20. ELEGIR RIESGO
    // =========================================================

    if (botonElegirRiesgo) {

        botonElegirRiesgo.addEventListener(
            "click",
            function () {

                iniciarNuevoRegistro(
                    "Riesgo"
                );
            }
        );
    }


    // =========================================================
    // 21. ELEGIR OPORTUNIDAD
    // =========================================================

    if (botonElegirOportunidad) {

        botonElegirOportunidad
            .addEventListener(
                "click",
                function () {

                    iniciarNuevoRegistro(
                        "Oportunidad"
                    );
                }
            );
    }


    // =========================================================
    // 22. CERRAR MODAL DE TIPO
    // =========================================================

    if (cerrarTipoRegistro) {

        cerrarTipoRegistro
            .addEventListener(
                "click",
                cerrarModalTipo
            );
    }


    if (modalTipo) {

        modalTipo.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target ===
                    modalTipo
                ) {

                    cerrarModalTipo();
                }
            }
        );
    }


    // =========================================================
    // 23. EDITAR RIESGO
    // =========================================================

    window.editarRiesgo =
        async function (id) {

            try {

                const riesgo =
                    await RiesgosStorage
                        .obtenerPorId(id);


                if (!riesgo) {

                    alert(
                        `No se encontró el riesgo ${id}.`
                    );

                    return;
                }


                tipoRegistroActual =
                    "Riesgo";

                tipoEnEdicion =
                    "Riesgo";

                idEnEdicion =
                    riesgo.id;


                cargarEmpresas(
                    riesgo.empresa || ""
                );


                cargarContratos(
                    riesgo.contrato || ""
                );


                cargarFaenas(
                    riesgo.faena || ""
                );


                cargarResponsables(
                    riesgo.responsable || ""
                );


                campoId.value =
                    riesgo.id || "";

                campoTitulo.value =
                    riesgo.titulo || "";

                campoDescripcion.value =
                    riesgo.descripcion || "";

                campoCategoria.value =
                    riesgo.categoria ||
                    "Plazo";

                campoProbabilidad.value =
                    String(
                        riesgo.probabilidad ||
                        3
                    );

                campoImpacto.value =
                    String(
                        riesgo.impacto ||
                        3
                    );

                campoPlan.value =
                    riesgo.planAccion ||
                    "";


                configurarFormularioPorTipo();


                cargarEstadosPorTipo(
                    riesgo.estado ||
                    "Abierto"
                );


                campoId.disabled =
                    true;


                abrirModal();


                campoTitulo.focus();


            } catch (error) {

                console.error(
                    "ERROR AL EDITAR RIESGO:",
                    error
                );

                alert(
                    "No fue posible cargar el riesgo."
                );
            }
        };


    // =========================================================
    // 24. EDITAR OPORTUNIDAD
    // =========================================================

    window.editarOportunidad =
        async function (id) {

            try {

                if (
                    typeof OportunidadesStorage ===
                    "undefined"
                ) {

                    alert(
                        "No está cargado OportunidadesStorage."
                    );

                    return;
                }


                const oportunidad =
                    await OportunidadesStorage
                        .obtenerPorId(id);


                if (!oportunidad) {

                    alert(
                        `No se encontró la oportunidad ${id}.`
                    );

                    return;
                }


                tipoRegistroActual =
                    "Oportunidad";

                tipoEnEdicion =
                    "Oportunidad";

                idEnEdicion =
                    oportunidad.id;


                cargarEmpresas(
                    oportunidad.empresa ||
                    ""
                );


                cargarContratos(
                    oportunidad.contrato ||
                    ""
                );


                cargarFaenas(
                    oportunidad.faena ||
                    ""
                );


                cargarResponsables(
                    oportunidad.responsable ||
                    ""
                );


                campoId.value =
                    oportunidad.id ||
                    "";

                campoTitulo.value =
                    oportunidad.titulo ||
                    "";

                campoDescripcion.value =
                    oportunidad.descripcion ||
                    "";

                campoCategoria.value =
                    oportunidad.categoria ||
                    "Costo";

                campoProbabilidad.value =
                    String(
                        oportunidad.probabilidad ||
                        3
                    );

                campoImpacto.value =
                    String(
                        oportunidad.impacto ||
                        3
                    );

                campoPlan.value =
                    oportunidad.planCaptura ||
                    oportunidad.planAccion ||
                    "";


                if (campoBeneficioPotencial) {

                    campoBeneficioPotencial.value =
                        oportunidad.beneficioPotencial ||
                        "";
                }


                configurarFormularioPorTipo();


                cargarEstadosPorTipo(
                    oportunidad.estado ||
                    "En evaluación"
                );


                campoId.disabled =
                    true;


                abrirModal();


                campoTitulo.focus();


            } catch (error) {

                console.error(
                    "ERROR AL EDITAR OPORTUNIDAD:",
                    error
                );

                alert(
                    "No fue posible cargar la oportunidad."
                );
            }
        };


    // =========================================================
    // 25. CERRAR FORMULARIO
    // =========================================================

    if (botonCerrar) {

        botonCerrar.addEventListener(
            "click",
            cerrarModal
        );
    }


    if (botonCancelar) {

        botonCancelar.addEventListener(
            "click",
            cerrarModal
        );
    }


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


    // =========================================================
    // 26. ESC
    // =========================================================

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key !==
                "Escape"
            ) {

                return;
            }


            if (
                modalTipo &&
                !modalTipo
                    .classList
                    .contains("hidden")
            ) {

                cerrarModalTipo();

                return;
            }


            if (
                !modal
                    .classList
                    .contains("hidden")
            ) {

                cerrarModal();
            }
        }
    );


    // =========================================================
    // 27. CALCULAR NIVEL
    // =========================================================

    function calcularCriticidad(
        probabilidad,
        impacto
    ) {

        const resultado =
            probabilidad *
            impacto;


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


    // =========================================================
    // 28. GUARDAR
    // =========================================================

    if (botonGuardar) {

        botonGuardar.addEventListener(
            "click",
            async function () {

                try {

                    // =========================================
                    // DATOS DEL FORMULARIO
                    // =========================================

                    const id =
                        campoId.value
                            .trim()
                            .toUpperCase();


                    const empresa =
                        campoEmpresa.value
                            .trim();


                    const contrato =
                        campoContrato.value
                            .trim();


                    const faena =
                        campoFaena.value
                            .trim();


                    const responsable =
                        campoResponsable.value
                            .trim();


                    const titulo =
                        campoTitulo.value
                            .trim();


                    const descripcion =
                        campoDescripcion.value
                            .trim();


                    const categoria =
                        campoCategoria.value;


                    const estado =
                        campoEstado.value;


                    const probabilidad =
                        Number(
                            campoProbabilidad.value
                        );


                    const impacto =
                        Number(
                            campoImpacto.value
                        );


                    const plan =
                        campoPlan.value
                            .trim();


                    const beneficioPotencial =
                        Number(
                            campoBeneficioPotencial
                                ?.value ||
                            0
                        );


                    // =========================================
                    // VALIDACIONES COMUNES
                    // =========================================

                    if (!id) {

                        alert(
                            "Debes ingresar un ID."
                        );

                        campoId.focus();

                        return;
                    }


                    if (!empresa) {

                        alert(
                            "Debes seleccionar una Empresa."
                        );

                        campoEmpresa.focus();

                        return;
                    }


                    if (!contrato) {

                        alert(
                            "Debes seleccionar un Contrato."
                        );

                        campoContrato.focus();

                        return;
                    }


                    if (!faena) {

                        alert(
                            "Debes seleccionar una Faena."
                        );

                        campoFaena.focus();

                        return;
                    }


                    if (!titulo) {

                        alert(
                            "Debes ingresar un título."
                        );

                        campoTitulo.focus();

                        return;
                    }


                    if (!descripcion) {

                        alert(
                            "Debes ingresar una descripción."
                        );

                        campoDescripcion.focus();

                        return;
                    }


                    const criticidad =
                        calcularCriticidad(
                            probabilidad,
                            impacto
                        );


                    const fechaActual =
                        new Date()
                            .toISOString()
                            .split("T")[0];


                    // =================================================
                    // 29. GUARDAR RIESGO
                    // =================================================

                    if (
                        tipoRegistroActual ===
                        "Riesgo"
                    ) {

                        if (
                            !id.startsWith("R-")
                        ) {

                            alert(
                                "El ID del riesgo debe comenzar con R-. Ejemplo: R-004"
                            );

                            campoId.focus();

                            return;
                        }


                        const datosRiesgo = {

                            empresa:
                                empresa,

                            contrato:
                                contrato,

                            faena:
                                faena,

                            titulo:
                                titulo,

                            descripcion:
                                descripcion,

                            categoria:
                                categoria,

                            criticidad:
                                criticidad,

                            probabilidad:
                                probabilidad,

                            impacto:
                                impacto,

                            responsable:
                                responsable ||
                                "Sin asignar",

                            estado:
                                estado,

                            fecha:
                                fechaActual,

                            planAccion:
                                plan ||
                                "Sin plan de acción definido."
                        };


                        // EDITAR

                        if (
                            idEnEdicion &&
                            tipoEnEdicion ===
                            "Riesgo"
                        ) {

                            await RiesgosStorage
                                .actualizar(
                                    idEnEdicion,
                                    datosRiesgo
                                );


                            console.log(
                                "Riesgo actualizado:",
                                idEnEdicion
                            );


                        } else {

                            // NUEVO

                            const riesgos =
                                await RiesgosStorage
                                    .obtenerTodos();


                            const existe =
                                riesgos.some(
                                    riesgo =>
                                        riesgo.id === id
                                );


                            if (existe) {

                                alert(
                                    `Ya existe un riesgo con el ID ${id}.`
                                );

                                campoId.focus();

                                return;
                            }


                            await RiesgosStorage
                                .agregar({

                                    id:
                                        id,

                                    ...datosRiesgo
                                });


                            console.log(
                                "Riesgo creado:",
                                id
                            );
                        }
                    }


                    // =================================================
                    // 30. GUARDAR OPORTUNIDAD
                    // =================================================

                    else {

                        if (
                            typeof OportunidadesStorage ===
                            "undefined"
                        ) {

                            alert(
                                "OportunidadesStorage no está disponible."
                            );

                            console.error(
                                "OportunidadesStorage no fue cargado."
                            );

                            return;
                        }


                        if (
                            !id.startsWith("O-")
                        ) {

                            alert(
                                "El ID de la oportunidad debe comenzar con O-. Ejemplo: O-008"
                            );

                            campoId.focus();

                            return;
                        }


                        if (
                            beneficioPotencial < 0
                        ) {

                            alert(
                                "El beneficio potencial no puede ser negativo."
                            );

                            campoBeneficioPotencial.focus();

                            return;
                        }


                        const datosOportunidad = {

                            empresa:
                                empresa,

                            contrato:
                                contrato,

                            faena:
                                faena,

                            titulo:
                                titulo,

                            descripcion:
                                descripcion,

                            categoria:
                                categoria,

                            probabilidad:
                                probabilidad,

                            impacto:
                                impacto,

                            nivel:
                                criticidad,

                            criticidad:
                                criticidad,

                            beneficioPotencial:
                                beneficioPotencial,

                            responsable:
                                responsable ||
                                "Sin asignar",

                            estado:
                                estado,

                            fecha:
                                fechaActual,

                            planCaptura:
                                plan ||
                                "Sin plan de captura definido.",

                            planAccion:
                                plan ||
                                "Sin plan de captura definido."
                        };


                        // EDITAR

                        if (
                            idEnEdicion &&
                            tipoEnEdicion ===
                            "Oportunidad"
                        ) {

                            await OportunidadesStorage
                                .actualizar(
                                    idEnEdicion,
                                    datosOportunidad
                                );


                            console.log(
                                "Oportunidad actualizada:",
                                idEnEdicion
                            );


                        } else {

                            // NUEVA

                            const oportunidades =
                                await OportunidadesStorage
                                    .obtenerTodas();


                            const existe =
                                oportunidades.some(
                                    oportunidad =>
                                        oportunidad.id ===
                                        id
                                );


                            if (existe) {

                                alert(
                                    `Ya existe una oportunidad con el ID ${id}.`
                                );

                                campoId.focus();

                                return;
                            }


                            await OportunidadesStorage
                                .agregar({

                                    id:
                                        id,

                                    ...datosOportunidad
                                });


                            console.log(
                                "Oportunidad creada:",
                                id
                            );
                        }
                    }


                    // =================================================
                    // TERMINAR
                    // =================================================

                    cerrarModal();


                    window.location.reload();


                } catch (error) {

                    console.error(
                        "ERROR AL GUARDAR REGISTRO:",
                        error
                    );


                    alert(
                        "Ocurrió un error al guardar el registro."
                    );
                }
            }
        );
    }


    // =========================================================
    // 31. INICIALIZACIÓN
    // =========================================================

    cargarEmpresas();

    cargarResponsables();


    console.log(
        "Modal Riesgo/Oportunidad inicializado correctamente"
    );

});