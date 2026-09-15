// ============================================================
// VIREON - SESION GLOBAL
// ============================================================

(function () {

    const CLAVE_USUARIOS = "vireon_usuarios";
    const CLAVE_USUARIO_ACTIVO = "vireon_usuario_activo";

    function obtenerUsuarios() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE_USUARIOS)
            );

            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            console.error("Error leyendo usuarios VIREON:", error);
            return [];
        }
    }

    function obtenerUsuarioActual() {
        const idUsuario = localStorage.getItem(CLAVE_USUARIO_ACTIVO);

        if (!idUsuario) return null;

        const usuario = obtenerUsuarios().find(
            item => item.id === idUsuario && item.estado === "Activo"
        );

        if (!usuario) {
            localStorage.removeItem(CLAVE_USUARIO_ACTIVO);
            return null;
        }

        return usuario;
    }

    function establecerUsuarioActual(idUsuario) {
        if (!idUsuario) {
            localStorage.removeItem(CLAVE_USUARIO_ACTIVO);
            actualizarHeaderUsuario();
            return null;
        }

        const usuario = obtenerUsuarios().find(
            item => item.id === idUsuario && item.estado === "Activo"
        );

        if (!usuario) {
            localStorage.removeItem(CLAVE_USUARIO_ACTIVO);
            actualizarHeaderUsuario();
            return null;
        }

        localStorage.setItem(CLAVE_USUARIO_ACTIVO, usuario.id);
        actualizarHeaderUsuario();

        return usuario;
    }

    function cerrarSesion() {
        localStorage.removeItem(CLAVE_USUARIO_ACTIVO);
        actualizarHeaderUsuario();
    }

    function obtenerIniciales(nombre) {
        const partes = String(nombre || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        return partes
            .slice(0, 2)
            .map(parte => parte.charAt(0).toUpperCase())
            .join("");
    }

    function actualizarHeaderUsuario() {
        const usuario = obtenerUsuarioActual();
        const header = document.querySelector("header");

        if (!header) return;

        const spans = Array.from(header.querySelectorAll("span"));

        const nombreHeader = spans.find(elemento => {
            const texto = elemento.textContent.trim();

            return (
                texto === "VIREON Demo" ||
                elemento.dataset.vireonUsuario === "nombre"
            );
        });

        const rolHeader = spans.find(elemento => {
            const texto = elemento.textContent.trim();

            return (
                texto === "Gestor de Riesgos" ||
                elemento.dataset.vireonUsuario === "rol"
            );
        });

        if (nombreHeader) {
            nombreHeader.textContent =
                usuario ? usuario.nombre : "VIREON Demo";

            nombreHeader.dataset.vireonUsuario = "nombre";
        }

        if (rolHeader) {
            rolHeader.textContent =
                usuario ? usuario.rol : "Gestor de Riesgos";

            rolHeader.dataset.vireonUsuario = "rol";
        }

        const avatar = header.querySelector(".rounded-full.bg-slate-800");

        if (avatar) {
            avatar.textContent =
                usuario
                    ? obtenerIniciales(usuario.nombre) || "VU"
                    : "VD";
        }
    }

    window.VireonSesion = {
        CLAVE_USUARIOS,
        CLAVE_USUARIO_ACTIVO,
        obtenerUsuarios,
        obtenerUsuarioActual,
        establecerUsuarioActual,
        cerrarSesion,
        actualizarHeaderUsuario
    };

    document.addEventListener(
        "DOMContentLoaded",
        actualizarHeaderUsuario
    );

    window.addEventListener("storage", function (event) {
        if (
            event.key === CLAVE_USUARIO_ACTIVO ||
            event.key === CLAVE_USUARIOS
        ) {
            actualizarHeaderUsuario();
        }
    });

})();