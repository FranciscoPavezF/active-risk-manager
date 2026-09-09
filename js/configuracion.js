// ============================================================
// VIREON - CONFIGURACION.JS
// Configuración maestra:
// - Estructuras organizacionales
// - Usuarios y roles
// - Usuario activo / sesión MVP
// - Persistencia en localStorage
// ============================================================

console.log("CONFIGURACION.JS CARGADO");


// ============================================================
// SESIÓN GLOBAL VIREON
// Disponible para todas las páginas que carguen este archivo
// ============================================================

window.VireonSesion = {

    CLAVE_USUARIOS:
        "vireon_usuarios",

    CLAVE_USUARIO_ACTIVO:
        "vireon_usuario_activo",


    obtenerUsuarios() {

        try {

            const datos =
                JSON.parse(
                    localStorage.getItem(
                        this.CLAVE_USUARIOS
                    )
                );

            return Array.isArray(datos)
                ? datos
                : [];

        } catch (error) {

            console.error(
                "Error leyendo usuarios de VIREON:",
                error
            );

            return [];
        }
    },


    obtenerUsuarioActual() {

        const idUsuario =
            localStorage.getItem(
                this.CLAVE_USUARIO_ACTIVO
            );

        if (!idUsuario) {
            return null;
        }

        const usuarios =
            this.obtenerUsuarios();

        const usuario =
            usuarios.find(
                function (item) {

                    return (
                        item.id === idUsuario &&
                        item.estado === "Activo"
                    );
                }
            );

        if (!usuario) {

            localStorage.removeItem(
                this.CLAVE_USUARIO_ACTIVO
            );

            return null;
        }

        return usuario;
    },


    establecerUsuarioActual(idUsuario) {

        if (!idUsuario) {

            localStorage.removeItem(
                this.CLAVE_USUARIO_ACTIVO
            );

            return null;
        }

        const usuarios =
            this.obtenerUsuarios();

        const usuario =
            usuarios.find(
                function (item) {

                    return (
                        item.id === idUsuario &&
                        item.estado === "Activo"
                    );
                }
            );

        if (!usuario) {

            localStorage.removeItem(
                this.CLAVE_USUARIO_ACTIVO
            );

            return null;
        }

        localStorage.setItem(
            this.CLAVE_USUARIO_ACTIVO,
            usuario.id
        );

        return usuario;
    },


    cerrarSesion() {

        localStorage.removeItem(
            this.CLAVE_USUARIO_ACTIVO
        );
    }

};


document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ========================================================
        // CLAVES DE LOCALSTORAGE
        // ========================================================

        const CLAVE_ESTRUCTURAS =
            "vireon_estructuras";

        const CLAVE_USUARIOS =
            "vireon_usuarios";

        const CLAVE_USUARIO_ACTIVO =
            "vireon_usuario_activo";


        // ========================================================
        // ELEMENTOS - ESTRUCTURA ORGANIZACIONAL
        // ========================================================

        const configEmpresa =
            document.getElementById(
                "configEmpresa"
            );

        const configContrato =
            document.getElementById(
                "configContrato"
            );

        const configFaena =
            document.getElementById(
                "configFaena"
            );

        const configMoneda =
            document.getElementById(
                "configMoneda"
            );

        const btnAgregarEstructura =
            document.getElementById(
                "btnAgregarEstructura"
            );

        const tablaEstructuras =
            document.getElementById(
                "tablaEstructuras"
            );

        const contadorEstructuras =
            document.getElementById(
                "contadorEstructuras"
            );


        // ========================================================
        // ELEMENTOS - USUARIOS
        // ========================================================

        const usuarioIdEdicion =
            document.getElementById(
                "usuarioIdEdicion"
            );

        const usuarioNombre =
            document.getElementById(
                "usuarioNombre"
            );

        const usuarioRol =
            document.getElementById(
                "usuarioRol"
            );

        const usuarioEstado =
            document.getElementById(
                "usuarioEstado"
            );

        const btnGuardarUsuario =
            document.getElementById(
                "btnGuardarUsuario"
            );

        const btnCancelarEdicionUsuario =
            document.getElementById(
                "btnCancelarEdicionUsuario"
            );

        const tablaUsuarios =
            document.getElementById(
                "tablaUsuarios"
            );

        const contadorUsuarios =
            document.getElementById(
                "contadorUsuarios"
            );


        // ========================================================
        // ELEMENTOS - USUARIO ACTIVO
        // ========================================================

        const configUsuarioActivo =
            document.getElementById(
                "configUsuarioActivo"
            );

        const configUsuarioActivoNombre =
            document.getElementById(
                "configUsuarioActivoNombre"
            );

        const configUsuarioActivoRol =
            document.getElementById(
                "configUsuarioActivoRol"
            );


        // ========================================================
        // UTILIDADES
        // ========================================================

        function generarId(prefijo) {

            return (
                prefijo +
                "-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8)
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


        // ========================================================
        // ESTRUCTURAS
        // ========================================================

        function obtenerEstructuras() {

            try {

                const datos =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_ESTRUCTURAS
                        )
                    );

                return Array.isArray(datos)
                    ? datos
                    : [];

            } catch (error) {

                console.error(
                    "Error leyendo estructuras:",
                    error
                );

                return [];
            }
        }


        function guardarEstructuras(
            estructuras
        ) {

            localStorage.setItem(
                CLAVE_ESTRUCTURAS,
                JSON.stringify(
                    estructuras
                )
            );
        }


        function renderizarEstructuras() {

            if (!tablaEstructuras) {
                return;
            }

            const estructuras =
                obtenerEstructuras();


            if (contadorEstructuras) {

                contadorEstructuras.textContent =
                    estructuras.length === 1
                        ? "1 registro"
                        : `${estructuras.length} registros`;
            }


            if (
                estructuras.length === 0
            ) {

                tablaEstructuras.innerHTML = `
                    <tr>

                        <td
                            colspan="5"
                            class="
                                px-3
                                py-6
                                text-center
                                text-slate-400
                            "
                        >
                            No hay estructuras registradas.
                        </td>

                    </tr>
                `;

                return;
            }


            tablaEstructuras.innerHTML =
                estructuras
                    .map(
                        function (
                            estructura
                        ) {

                            return `
                                <tr>

                                    <td
                                        class="
                                            px-3
                                            py-3
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        ${escaparHTML(
                                            estructura.empresa
                                        )}
                                    </td>


                                    <td
                                        class="
                                            px-3
                                            py-3
                                            text-slate-700
                                        "
                                    >
                                        ${escaparHTML(
                                            estructura.contrato
                                        )}
                                    </td>


                                    <td
                                        class="
                                            px-3
                                            py-3
                                            text-slate-700
                                        "
                                    >
                                        ${escaparHTML(
                                            estructura.faena
                                        )}
                                    </td>


                                    <td
                                        class="
                                            px-3
                                            py-3
                                            text-slate-700
                                        "
                                    >
                                        ${escaparHTML(
                                            estructura.moneda
                                        )}
                                    </td>


                                    <td
                                        class="
                                            px-3
                                            py-3
                                            text-right
                                        "
                                    >

                                        <button
                                            type="button"
                                            class="
                                                text-red-600
                                                hover:text-red-700
                                                font-semibold
                                            "
                                            onclick="
                                                eliminarEstructura(
                                                    '${estructura.id}'
                                                )
                                            "
                                        >
                                            Eliminar
                                        </button>

                                    </td>

                                </tr>
                            `;
                        }
                    )
                    .join("");
        }


        function agregarEstructura() {

            if (
                !configEmpresa ||
                !configContrato ||
                !configFaena ||
                !configMoneda
            ) {

                console.error(
                    "No se encontraron los campos de estructura."
                );

                return;
            }


            const empresa =
                configEmpresa
                    .value
                    .trim();

            const contrato =
                configContrato
                    .value
                    .trim();

            const faena =
                configFaena
                    .value
                    .trim();

            const moneda =
                configMoneda.value;


            if (!empresa) {

                alert(
                    "Debes ingresar una empresa u organización."
                );

                configEmpresa.focus();

                return;
            }


            if (!contrato) {

                alert(
                    "Debes ingresar un contrato."
                );

                configContrato.focus();

                return;
            }


            if (!faena) {

                alert(
                    "Debes ingresar una faena."
                );

                configFaena.focus();

                return;
            }


            const estructuras =
                obtenerEstructuras();


            const duplicada =
                estructuras.some(
                    function (
                        estructura
                    ) {

                        return (
                            String(
                                estructura.empresa
                            )
                                .toLowerCase() ===
                                empresa.toLowerCase() &&

                            String(
                                estructura.contrato
                            )
                                .toLowerCase() ===
                                contrato.toLowerCase() &&

                            String(
                                estructura.faena
                            )
                                .toLowerCase() ===
                                faena.toLowerCase()
                        );
                    }
                );


            if (duplicada) {

                alert(
                    "Esta combinación de empresa, contrato y faena ya está registrada."
                );

                return;
            }


            const nuevaEstructura = {

                id:
                    generarId("EST"),

                empresa:
                    empresa,

                contrato:
                    contrato,

                faena:
                    faena,

                moneda:
                    moneda
            };


            estructuras.push(
                nuevaEstructura
            );


            guardarEstructuras(
                estructuras
            );


            configEmpresa.value =
                "";

            configContrato.value =
                "";

            configFaena.value =
                "";

            configMoneda.value =
                "USD";


            renderizarEstructuras();


            console.log(
                "Estructura agregada:",
                nuevaEstructura
            );
        }


        window.eliminarEstructura =
            function (id) {

                const estructuras =
                    obtenerEstructuras();

                const estructura =
                    estructuras.find(
                        function (item) {

                            return (
                                item.id === id
                            );
                        }
                    );


                if (!estructura) {

                    alert(
                        "No se encontró la estructura."
                    );

                    return;
                }


                const confirmar =
                    confirm(
                        `¿Eliminar la estructura?\n\n` +
                        `${estructura.empresa} / ` +
                        `${estructura.contrato} / ` +
                        `${estructura.faena}`
                    );


                if (!confirmar) {
                    return;
                }


                const nuevasEstructuras =
                    estructuras.filter(
                        function (item) {

                            return (
                                item.id !== id
                            );
                        }
                    );


                guardarEstructuras(
                    nuevasEstructuras
                );


                renderizarEstructuras();


                console.log(
                    "Estructura eliminada:",
                    estructura
                );
            };


        // ========================================================
        // USUARIOS
        // ========================================================

        function obtenerUsuarios() {

            try {

                const datos =
                    JSON.parse(
                        localStorage.getItem(
                            CLAVE_USUARIOS
                        )
                    );

                return Array.isArray(datos)
                    ? datos
                    : [];

            } catch (error) {

                console.error(
                    "Error leyendo usuarios:",
                    error
                );

                return [];
            }
        }


        function guardarUsuarios(
            usuarios
        ) {

            localStorage.setItem(
                CLAVE_USUARIOS,
                JSON.stringify(
                    usuarios
                )
            );
        }


        // ========================================================
        // USUARIO ACTIVO
        // ========================================================

        function obtenerUsuarioActivo() {

            return (
                window.VireonSesion
                    .obtenerUsuarioActual()
            );
        }


        function actualizarResumenUsuarioActivo() {

            const usuario =
                obtenerUsuarioActivo();


            if (
                configUsuarioActivoNombre
            ) {

                configUsuarioActivoNombre
                    .textContent =
                    usuario
                        ? usuario.nombre
                        : "Sin usuario seleccionado";
            }


            if (
                configUsuarioActivoRol
            ) {

                configUsuarioActivoRol
                    .textContent =
                    usuario
                        ? usuario.rol
                        : "—";
            }
        }


        function renderizarSelectorUsuarioActivo() {

            if (!configUsuarioActivo) {
                return;
            }


            const usuarios =
                obtenerUsuarios();

            const usuariosActivos =
                usuarios.filter(
                    function (usuario) {

                        return (
                            usuario.estado ===
                            "Activo"
                        );
                    }
                );


            const usuarioActivo =
                obtenerUsuarioActivo();


            configUsuarioActivo.innerHTML = `
                <option value="">
                    Selecciona un usuario activo
                </option>

                ${
                    usuariosActivos
                        .map(
                            function (
                                usuario
                            ) {

                                const seleccionado =
                                    (
                                        usuarioActivo &&
                                        usuarioActivo.id ===
                                            usuario.id
                                    )
                                        ? "selected"
                                        : "";

                                return `
                                    <option
                                        value="${escaparHTML(
                                            usuario.id
                                        )}"
                                        ${seleccionado}
                                    >
                                        ${escaparHTML(
                                            usuario.nombre
                                        )}
                                        — 
                                        ${escaparHTML(
                                            usuario.rol
                                        )}
                                    </option>
                                `;
                            }
                        )
                        .join("")
                }
            `;


            actualizarResumenUsuarioActivo();
        }


        function seleccionarUsuarioActivo() {

            if (!configUsuarioActivo) {
                return;
            }


            const idUsuario =
                configUsuarioActivo.value;


            const usuario =
                window.VireonSesion
                    .establecerUsuarioActual(
                        idUsuario
                    );


            actualizarResumenUsuarioActivo();


            if (usuario) {

                console.log(
                    "Usuario activo VIREON:",
                    usuario
                );

            } else {

                console.log(
                    "VIREON sin usuario activo."
                );
            }


            actualizarUsuarioHeader();
        }


        // ========================================================
        // ACTUALIZAR USUARIO EN HEADER
        // ========================================================

        function actualizarUsuarioHeader() {

            const usuario =
                obtenerUsuarioActivo();


            /*
             * El header actual tiene:
             *
             * VD
             * VIREON Demo
             * Gestor de Riesgos
             *
             * Aquí lo actualizamos sin exigir IDs nuevos.
             */

            const header =
                document.querySelector(
                    "header"
                );

            if (!header) {
                return;
            }


            const bloques =
                Array.from(
                    header.querySelectorAll(
                        "span"
                    )
                );


            const nombreHeader =
                bloques.find(
                    function (elemento) {

                        return (
                            elemento
                                .textContent
                                .trim() ===
                            "VIREON Demo"
                        );
                    }
                );


            const rolHeader =
                bloques.find(
                    function (elemento) {

                        return (
                            elemento
                                .textContent
                                .trim() ===
                            "Gestor de Riesgos"
                        );
                    }
                );


            if (nombreHeader) {

                nombreHeader.textContent =
                    usuario
                        ? usuario.nombre
                        : "VIREON Demo";
            }


            if (rolHeader) {

                rolHeader.textContent =
                    usuario
                        ? usuario.rol
                        : "Gestor de Riesgos";
            }


            const avatar =
                header.querySelector(
                    ".rounded-full.bg-slate-800"
                );


            if (avatar && usuario) {

                const partes =
                    String(
                        usuario.nombre ||
                        ""
                    )
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean);


                const iniciales =
                    partes
                        .slice(0, 2)
                        .map(
                            function (parte) {

                                return parte
                                    .charAt(0)
                                    .toUpperCase();
                            }
                        )
                        .join("");


                avatar.textContent =
                    iniciales || "VU";
            }
        }


        // ========================================================
        // RENDERIZAR USUARIOS
        // ========================================================

        function renderizarUsuarios() {

            if (!tablaUsuarios) {

                renderizarSelectorUsuarioActivo();

                return;
            }


            const usuarios =
                obtenerUsuarios();


            if (contadorUsuarios) {

                contadorUsuarios.textContent =
                    usuarios.length === 1
                        ? "1 usuario"
                        : `${usuarios.length} usuarios`;
            }


            if (
                usuarios.length === 0
            ) {

                tablaUsuarios.innerHTML = `
                    <tr>

                        <td
                            colspan="4"
                            class="
                                px-4
                                py-6
                                text-center
                                text-slate-400
                            "
                        >
                            No hay usuarios registrados.
                        </td>

                    </tr>
                `;


                window.VireonSesion
                    .cerrarSesion();


                renderizarSelectorUsuarioActivo();

                actualizarUsuarioHeader();

                return;
            }


            const usuarioActivo =
                obtenerUsuarioActivo();


            tablaUsuarios.innerHTML =
                usuarios
                    .map(
                        function (
                            usuario
                        ) {

                            const claseEstado =
                                usuario.estado ===
                                    "Activo"
                                    ? "text-emerald-600"
                                    : "text-slate-400";


                            const esUsuarioActivo =
                                (
                                    usuarioActivo &&
                                    usuarioActivo.id ===
                                        usuario.id
                                );


                            return `
                                <tr>

                                    <td
                                        class="
                                            px-4
                                            py-3
                                            font-semibold
                                            text-slate-800
                                        "
                                    >
                                        ${escaparHTML(
                                            usuario.nombre
                                        )}

                                        ${
                                            esUsuarioActivo
                                                ? `
                                                    <span
                                                        class="
                                                            ml-2
                                                            px-2
                                                            py-0.5
                                                            rounded-full
                                                            bg-blue-50
                                                            text-blue-600
                                                            text-[9px]
                                                            font-bold
                                                        "
                                                    >
                                                        ACTIVO EN SESIÓN
                                                    </span>
                                                  `
                                                : ""
                                        }
                                    </td>


                                    <td
                                        class="
                                            px-4
                                            py-3
                                            text-slate-700
                                        "
                                    >
                                        ${escaparHTML(
                                            usuario.rol
                                        )}
                                    </td>


                                    <td
                                        class="
                                            px-4
                                            py-3
                                            font-semibold
                                            ${claseEstado}
                                        "
                                    >
                                        ${escaparHTML(
                                            usuario.estado
                                        )}
                                    </td>


                                    <td
                                        class="
                                            px-4
                                            py-3
                                            text-right
                                        "
                                    >

                                        <div
                                            class="
                                                flex
                                                justify-end
                                                gap-3
                                            "
                                        >

                                            <button
                                                type="button"
                                                class="
                                                    text-blue-600
                                                    hover:text-blue-700
                                                    font-semibold
                                                "
                                                onclick="
                                                    editarUsuario(
                                                        '${usuario.id}'
                                                    )
                                                "
                                            >
                                                Editar
                                            </button>


                                            <button
                                                type="button"
                                                class="
                                                    text-red-600
                                                    hover:text-red-700
                                                    font-semibold
                                                "
                                                onclick="
                                                    eliminarUsuario(
                                                        '${usuario.id}'
                                                    )
                                                "
                                            >
                                                Eliminar
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            `;
                        }
                    )
                    .join("");


            renderizarSelectorUsuarioActivo();

            actualizarUsuarioHeader();
        }


        // ========================================================
        // LIMPIAR FORMULARIO USUARIO
        // ========================================================

        function limpiarFormularioUsuario() {

            if (usuarioIdEdicion) {

                usuarioIdEdicion.value =
                    "";
            }


            if (usuarioNombre) {

                usuarioNombre.value =
                    "";
            }


            if (usuarioRol) {

                usuarioRol.value =
                    "Gestor de Riesgos";
            }


            if (usuarioEstado) {

                usuarioEstado.value =
                    "Activo";
            }


            if (btnGuardarUsuario) {

                btnGuardarUsuario.textContent =
                    "+ Agregar usuario";
            }


            if (
                btnCancelarEdicionUsuario
            ) {

                btnCancelarEdicionUsuario
                    .classList
                    .add("hidden");
            }
        }


        // ========================================================
        // GUARDAR USUARIO
        // ========================================================

        function guardarUsuario() {

            if (
                !usuarioNombre ||
                !usuarioRol ||
                !usuarioEstado
            ) {

                console.error(
                    "No se encontraron los campos de usuario."
                );

                return;
            }


            const nombre =
                usuarioNombre
                    .value
                    .trim();

            const rol =
                usuarioRol.value;

            const estado =
                usuarioEstado.value;

            const idEdicion =
                usuarioIdEdicion
                    ? usuarioIdEdicion.value
                    : "";


            if (!nombre) {

                alert(
                    "Debes ingresar el nombre del usuario."
                );

                usuarioNombre.focus();

                return;
            }


            const usuarios =
                obtenerUsuarios();


            // ====================================================
            // EDITAR USUARIO
            // ====================================================

            if (idEdicion) {

                const indice =
                    usuarios.findIndex(
                        function (
                            usuario
                        ) {

                            return (
                                usuario.id ===
                                idEdicion
                            );
                        }
                    );


                if (indice === -1) {

                    alert(
                        "No se encontró el usuario que estás editando."
                    );

                    limpiarFormularioUsuario();

                    return;
                }


                const nombreDuplicado =
                    usuarios.some(
                        function (
                            usuario
                        ) {

                            return (
                                usuario.id !==
                                    idEdicion &&

                                usuario.nombre
                                    .toLowerCase() ===
                                nombre.toLowerCase()
                            );
                        }
                    );


                if (nombreDuplicado) {

                    alert(
                        "Ya existe otro usuario con ese nombre."
                    );

                    return;
                }


                const eraUsuarioActivo =
                    (
                        localStorage.getItem(
                            CLAVE_USUARIO_ACTIVO
                        ) === idEdicion
                    );


                usuarios[indice] = {

                    ...usuarios[indice],

                    nombre:
                        nombre,

                    rol:
                        rol,

                    estado:
                        estado
                };


                guardarUsuarios(
                    usuarios
                );


                /*
                 * Si el usuario que estaba utilizando
                 * VIREON pasa a Inactivo, la sesión
                 * se cierra automáticamente.
                 */

                if (
                    eraUsuarioActivo &&
                    estado !== "Activo"
                ) {

                    window.VireonSesion
                        .cerrarSesion();
                }


                console.log(
                    "Usuario actualizado:",
                    usuarios[indice]
                );


            } else {

                // =================================================
                // NUEVO USUARIO
                // =================================================

                const nombreDuplicado =
                    usuarios.some(
                        function (
                            usuario
                        ) {

                            return (
                                usuario.nombre
                                    .toLowerCase() ===
                                nombre.toLowerCase()
                            );
                        }
                    );


                if (nombreDuplicado) {

                    alert(
                        "Ya existe un usuario con ese nombre."
                    );

                    return;
                }


                const nuevoUsuario = {

                    id:
                        generarId("USR"),

                    nombre:
                        nombre,

                    rol:
                        rol,

                    estado:
                        estado
                };


                usuarios.push(
                    nuevoUsuario
                );


                guardarUsuarios(
                    usuarios
                );


                console.log(
                    "Usuario agregado:",
                    nuevoUsuario
                );
            }


            limpiarFormularioUsuario();

            renderizarUsuarios();
        }


        // ========================================================
        // EDITAR USUARIO
        // ========================================================

        window.editarUsuario =
            function (id) {

                const usuarios =
                    obtenerUsuarios();


                const usuario =
                    usuarios.find(
                        function (item) {

                            return (
                                item.id === id
                            );
                        }
                    );


                if (!usuario) {

                    alert(
                        "No se encontró el usuario."
                    );

                    return;
                }


                if (usuarioIdEdicion) {

                    usuarioIdEdicion.value =
                        usuario.id;
                }


                if (usuarioNombre) {

                    usuarioNombre.value =
                        usuario.nombre;
                }


                if (usuarioRol) {

                    usuarioRol.value =
                        usuario.rol;
                }


                if (usuarioEstado) {

                    usuarioEstado.value =
                        usuario.estado;
                }


                if (btnGuardarUsuario) {

                    btnGuardarUsuario.textContent =
                        "Guardar cambios";
                }


                if (
                    btnCancelarEdicionUsuario
                ) {

                    btnCancelarEdicionUsuario
                        .classList
                        .remove("hidden");
                }


                if (usuarioNombre) {

                    usuarioNombre.focus();
                }
            };


        // ========================================================
        // ELIMINAR USUARIO
        // ========================================================

        window.eliminarUsuario =
            function (id) {

                const usuarios =
                    obtenerUsuarios();


                const usuario =
                    usuarios.find(
                        function (item) {

                            return (
                                item.id === id
                            );
                        }
                    );


                if (!usuario) {

                    alert(
                        "No se encontró el usuario."
                    );

                    return;
                }


                const confirmar =
                    confirm(
                        `¿Eliminar al usuario "${usuario.nombre}"?`
                    );


                if (!confirmar) {
                    return;
                }


                const eraUsuarioActivo =
                    (
                        localStorage.getItem(
                            CLAVE_USUARIO_ACTIVO
                        ) === id
                    );


                const nuevosUsuarios =
                    usuarios.filter(
                        function (item) {

                            return (
                                item.id !== id
                            );
                        }
                    );


                guardarUsuarios(
                    nuevosUsuarios
                );


                if (eraUsuarioActivo) {

                    window.VireonSesion
                        .cerrarSesion();
                }


                renderizarUsuarios();


                if (
                    usuarioIdEdicion &&
                    usuarioIdEdicion.value ===
                        id
                ) {

                    limpiarFormularioUsuario();
                }


                console.log(
                    "Usuario eliminado:",
                    usuario
                );
            };


        // ========================================================
        // EVENTOS
        // ========================================================

        if (btnAgregarEstructura) {

            btnAgregarEstructura
                .addEventListener(
                    "click",
                    agregarEstructura
                );
        }


        if (btnGuardarUsuario) {

            btnGuardarUsuario
                .addEventListener(
                    "click",
                    guardarUsuario
                );
        }


        if (
            btnCancelarEdicionUsuario
        ) {

            btnCancelarEdicionUsuario
                .addEventListener(
                    "click",
                    limpiarFormularioUsuario
                );
        }


        if (configUsuarioActivo) {

            configUsuarioActivo
                .addEventListener(
                    "change",
                    seleccionarUsuarioActivo
                );
        }


        // ========================================================
        // INICIALIZACIÓN
        // ========================================================

        renderizarEstructuras();

        renderizarUsuarios();

        renderizarSelectorUsuarioActivo();

        actualizarResumenUsuarioActivo();

        actualizarUsuarioHeader();


        console.log(
            "Configuración VIREON inicializada correctamente."
        );


        console.log(
            "Usuario activo:",
            window.VireonSesion
                .obtenerUsuarioActual()
        );

    }
);