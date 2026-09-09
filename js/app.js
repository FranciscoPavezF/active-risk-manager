/* ========================================================================== */
/* VIREON - Executive Decision Platform                                      */
/* Script Global de Interacción MVP                                          */
/* ========================================================================== */


/* ========================================================================== */
/* UTILIDADES                                                                 */
/* ========================================================================== */

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}


function escaparHTML(texto) {
    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ========================================================================== */
/* OBTENER DATOS PARA EL BUSCADOR GLOBAL                                      */
/* ========================================================================== */

async function obtenerDatosBusquedaGlobal() {

    let riesgos = [];
    let oportunidades = [];
    let acciones = [];


    /* ---------------------------------------------------------------------- */
    /* RIESGOS                                                                */
    /* ---------------------------------------------------------------------- */

    try {

        if (
            typeof RiesgosStorage !== "undefined" &&
            typeof RiesgosStorage.obtenerTodos === "function"
        ) {

            riesgos = await RiesgosStorage.obtenerTodos();

        } else {

            const respuesta = await fetch("data/riesgos.json");

            if (respuesta.ok) {
                riesgos = await respuesta.json();
            }

        }

    } catch (error) {

        console.warn(
            "VIREON: no fue posible cargar riesgos para el buscador global.",
            error
        );

    }


    /* ---------------------------------------------------------------------- */
    /* OPORTUNIDADES                                                           */
    /* ---------------------------------------------------------------------- */

    try {

        if (
            typeof OportunidadesStorage !== "undefined" &&
            typeof OportunidadesStorage.obtenerTodas === "function"
        ) {

            oportunidades = await OportunidadesStorage.obtenerTodas();

        } else if (
            typeof OportunidadesStorage !== "undefined" &&
            typeof OportunidadesStorage.obtenerTodos === "function"
        ) {

            oportunidades = await OportunidadesStorage.obtenerTodos();

        } else {

            /*
             * Algunas versiones del MVP gestionan las oportunidades junto
             * con los riesgos. Si existen dentro del arreglo de riesgos,
             * se detectan más abajo automáticamente.
             */

            try {

                const respuesta = await fetch("data/oportunidades.json");

                if (respuesta.ok) {
                    oportunidades = await respuesta.json();
                }

            } catch (_) {
                // El archivo puede no existir en algunas versiones del MVP.
            }

        }

    } catch (error) {

        console.warn(
            "VIREON: no fue posible cargar oportunidades para el buscador.",
            error
        );

    }


    /* ---------------------------------------------------------------------- */
    /* ACCIONES                                                                */
    /* ---------------------------------------------------------------------- */

    try {

        if (
            typeof AccionesStorage !== "undefined" &&
            typeof AccionesStorage.obtenerTodas === "function"
        ) {

            acciones = await AccionesStorage.obtenerTodas();

        } else {

            const respuesta = await fetch("data/acciones.json");

            if (respuesta.ok) {
                acciones = await respuesta.json();
            }

        }

    } catch (error) {

        console.warn(
            "VIREON: no fue posible cargar acciones para el buscador global.",
            error
        );

    }


    return {
        riesgos: Array.isArray(riesgos) ? riesgos : [],
        oportunidades: Array.isArray(oportunidades) ? oportunidades : [],
        acciones: Array.isArray(acciones) ? acciones : []
    };
}


/* ========================================================================== */
/* CONVERTIR LOS DATOS EN RESULTADOS BUSCABLES                                */
/* ========================================================================== */

function construirIndiceBusqueda(datos) {

    const resultados = [];


    /* ---------------------------------------------------------------------- */
    /* Riesgos y registros de riesgo                                          */
    /* ---------------------------------------------------------------------- */

    datos.riesgos.forEach((registro) => {

        const tipoOriginal = normalizarTexto(
            registro.tipo ||
            registro.tipoRegistro ||
            registro.clase
        );

        const esOportunidad =
            tipoOriginal.includes("oportunidad") ||
            String(registro.id || "")
                .toUpperCase()
                .startsWith("O-");

        const tipo = esOportunidad
            ? "Oportunidad"
            : "Riesgo";

        resultados.push({

            id: registro.id || "",

            tipo,

            titulo:
                registro.titulo ||
                registro.nombre ||
                registro.descripcion ||
                "Registro sin título",

            descripcion:
                registro.descripcion ||
                registro.detalle ||
                registro.categoria ||
                "",

            responsable:
                registro.responsable ||
                "Sin asignar",

            pagina: "riesgos-oportunidades.html"

        });

    });


    /* ---------------------------------------------------------------------- */
    /* Oportunidades                                                          */
    /* ---------------------------------------------------------------------- */

    datos.oportunidades.forEach((registro) => {

        /*
         * Evita duplicar oportunidades que ya estén incluidas
         * dentro de riesgos.
         */

        const existe = resultados.some(
            (resultado) =>
                String(resultado.id) === String(registro.id)
        );

        if (existe) {
            return;
        }

        resultados.push({

            id: registro.id || "",

            tipo: "Oportunidad",

            titulo:
                registro.titulo ||
                registro.nombre ||
                registro.descripcion ||
                "Oportunidad sin título",

            descripcion:
                registro.descripcion ||
                registro.detalle ||
                registro.categoria ||
                "",

            responsable:
                registro.responsable ||
                "Sin asignar",

            pagina: "riesgos-oportunidades.html"

        });

    });


    /* ---------------------------------------------------------------------- */
    /* Acciones                                                               */
    /* ---------------------------------------------------------------------- */

    datos.acciones.forEach((accion) => {

        resultados.push({

            id: accion.id || "",

            tipo: "Acción",

            titulo:
                accion.accion ||
                accion.titulo ||
                accion.descripcion ||
                "Acción sin título",

            descripcion:
                accion.riesgoId ||
                accion.registroAsociado ||
                accion.origenId ||
                "",

            responsable:
                accion.responsable ||
                "Sin asignar",

            pagina: "acciones.html"

        });

    });


    return resultados;
}


/* ========================================================================== */
/* CREAR PANEL DE RESULTADOS                                                  */
/* ========================================================================== */

function crearPanelBusqueda(input) {

    const contenedorPadre = input.parentElement;

    if (!contenedorPadre) {
        return null;
    }

    /*
     * El buscador necesita posicionamiento relativo para que el panel
     * aparezca inmediatamente debajo.
     */

    contenedorPadre.classList.add("relative");


    let panel = document.getElementById("panelBusquedaGlobal");


    if (!panel) {

        panel = document.createElement("div");

        panel.id = "panelBusquedaGlobal";

        panel.className = [
            "hidden",
            "absolute",
            "top-full",
            "left-0",
            "mt-2",
            "w-full",
            "min-w-[360px]",
            "max-w-[520px]",
            "bg-white",
            "border",
            "border-slate-200",
            "rounded-xl",
            "shadow-xl",
            "z-[100]",
            "overflow-hidden"
        ].join(" ");

        contenedorPadre.appendChild(panel);

    }


    return panel;
}


/* ========================================================================== */
/* MOSTRAR RESULTADOS                                                         */
/* ========================================================================== */

function mostrarResultadosBusqueda(
    panel,
    resultados,
    termino
) {

    if (!panel) {
        return;
    }


    if (!termino) {

        panel.classList.add("hidden");
        panel.innerHTML = "";

        return;
    }


    if (resultados.length === 0) {

        panel.innerHTML = `
            <div class="px-4 py-5 text-center">
                <p class="text-xs font-semibold text-slate-700">
                    Sin resultados
                </p>

                <p class="text-[11px] text-slate-500 mt-1">
                    No encontramos registros relacionados con
                    "${escaparHTML(termino)}".
                </p>
            </div>
        `;

        panel.classList.remove("hidden");

        return;
    }


    const resultadosVisibles = resultados.slice(0, 8);


    panel.innerHTML = `

        <div class="px-4 py-3 border-b border-slate-200">

            <div class="flex items-center justify-between">

                <div>

                    <p class="text-xs font-bold text-slate-900">
                        Resultados de búsqueda
                    </p>

                    <p class="text-[10px] text-slate-500 mt-0.5">
                        Riesgos, oportunidades y acciones
                    </p>

                </div>

                <span
                    class="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                    ${resultados.length}
                </span>

            </div>

        </div>


        <div class="max-h-80 overflow-y-auto">

            ${resultadosVisibles.map((resultado) => {

                let colorTipo = "text-blue-700 bg-blue-50";

                if (resultado.tipo === "Riesgo") {
                    colorTipo = "text-red-700 bg-red-50";
                }

                if (resultado.tipo === "Oportunidad") {
                    colorTipo = "text-emerald-700 bg-emerald-50";
                }

                return `

                    <button
                        type="button"
                        class="resultado-busqueda-global w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        data-id="${escaparHTML(resultado.id)}"
                        data-pagina="${escaparHTML(resultado.pagina)}"
                    >

                        <div class="flex items-start gap-3">

                            <span
                                class="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full ${colorTipo}"
                            >
                                ${escaparHTML(resultado.tipo)}
                            </span>


                            <div class="min-w-0 flex-1">

                                <div class="flex items-center gap-2">

                                    <span class="text-xs font-bold text-slate-900">
                                        ${escaparHTML(resultado.id)}
                                    </span>

                                    <span class="text-[10px] text-slate-400">
                                        ·
                                    </span>

                                    <span class="text-[10px] text-slate-500 truncate">
                                        ${escaparHTML(resultado.responsable)}
                                    </span>

                                </div>


                                <p class="text-xs text-slate-700 mt-1 line-clamp-2">
                                    ${escaparHTML(resultado.titulo)}
                                </p>


                                ${
                                    resultado.descripcion
                                        ? `
                                            <p class="text-[10px] text-slate-400 mt-1 truncate">
                                                ${escaparHTML(resultado.descripcion)}
                                            </p>
                                          `
                                        : ""
                                }

                            </div>

                        </div>

                    </button>

                `;

            }).join("")}

        </div>


        ${
            resultados.length > resultadosVisibles.length
                ? `
                    <div class="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-center">
                        <span class="text-[10px] text-slate-500">
                            Mostrando ${resultadosVisibles.length} de ${resultados.length} resultados
                        </span>
                    </div>
                  `
                : ""
        }
    `;


    panel.classList.remove("hidden");


    panel
        .querySelectorAll(".resultado-busqueda-global")
        .forEach((boton) => {

            boton.addEventListener("click", () => {

                const id = boton.dataset.id;
                const pagina = boton.dataset.pagina;

                if (!id || !pagina) {
                    return;
                }

                window.location.href =
                    `${pagina}?buscar=${encodeURIComponent(id)}`;

            });

        });

}


/* ========================================================================== */
/* ACTIVAR BUSCADOR GLOBAL                                                    */
/* ========================================================================== */

async function inicializarBuscadorGlobal() {

    /*
     * Se utiliza el input del header.
     * Así funciona incluso si cada página tiene un ID distinto.
     */

    const input = document.querySelector(
        'header input[type="text"]'
    );


    if (!input) {
        return;
    }


    /*
     * Mantiene el texto propio de Acciones y usa un texto global
     * en las demás vistas.
     */

    if (!input.id || input.id !== "buscarAcciones") {

        input.placeholder =
            "Buscar riesgos, oportunidades, acciones...";

    }


    const panel = crearPanelBusqueda(input);


    if (!panel) {
        return;
    }


    const datos = await obtenerDatosBusquedaGlobal();

    const indice = construirIndiceBusqueda(datos);


    input.addEventListener("input", () => {

        const terminoOriginal = input.value.trim();

        const termino = normalizarTexto(
            terminoOriginal
        );


        if (termino.length < 2) {

            panel.classList.add("hidden");
            panel.innerHTML = "";

            return;

        }


        const resultados = indice.filter((registro) => {

            const textoCompleto = normalizarTexto([

                registro.id,
                registro.tipo,
                registro.titulo,
                registro.descripcion,
                registro.responsable

            ].join(" "));


            return textoCompleto.includes(termino);

        });


        mostrarResultadosBusqueda(
            panel,
            resultados,
            terminoOriginal
        );

    });


    /*
     * ESC cierra el panel.
     */

    input.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            panel.classList.add("hidden");

            input.blur();

        }

    });


    /*
     * Cerrar al hacer clic fuera.
     */

    document.addEventListener("click", (event) => {

        if (
            !panel.contains(event.target) &&
            event.target !== input
        ) {

            panel.classList.add("hidden");

        }

    });


    /*
     * Si llegamos desde otro resultado:
     * acciones.html?buscar=AC-102
     */

    const parametros = new URLSearchParams(
        window.location.search
    );

    const buscar = parametros.get("buscar");


    if (buscar) {

        input.value = buscar;


        /*
         * Permite que los filtros propios de páginas como Acciones
         * también reaccionen al término recibido.
         */

           input.dispatchEvent(
        new Event("input", {
            bubbles: true
        })
    );

    // Ocultar automáticamente el panel de resultados
    setTimeout(() => {
        panel.classList.add("hidden");
    }, 300);

    /*
     * Espera a que las tablas dinámicas terminen de renderizar
     * y desplaza la vista hacia el registro encontrado.
     */

        setTimeout(() => {

            const elementos = Array.from(
                document.querySelectorAll(
                    "tbody tr, [data-id], [data-registro-id]"
                )
            );


            const objetivo = elementos.find((elemento) =>

                normalizarTexto(
                    elemento.textContent
                ).includes(
                    normalizarTexto(buscar)
                )

            );


            if (objetivo) {

                objetivo.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                objetivo.classList.add(
                    "ring-2",
                    "ring-blue-400",
                    "ring-offset-2"
                );


                setTimeout(() => {

                    objetivo.classList.remove(
                        "ring-2",
                        "ring-blue-400",
                        "ring-offset-2"
                    );

                }, 3000);

            }

        }, 700);

    }

}


/* ========================================================================== */
/* INICIALIZACIÓN GLOBAL                                                      */
/* ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "VIREON MVP iniciado correctamente."
    );


    /* ---------------------------------------------------------------------- */
    /* Sincronizar menú lateral                                               */
    /* ---------------------------------------------------------------------- */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() ||
        "dashboard.html";


    const navLinks =
        document.querySelectorAll(
            "aside nav a"
        );


    navLinks.forEach((link) => {

        const href =
            link.getAttribute("href");


        if (href === currentPage) {

            link.classList.remove(
                "text-slate-400",
                "hover:text-white",
                "hover:bg-slate-800/60"
            );

            link.classList.add(
                "bg-blue-600",
                "text-white",
                "font-semibold"
            );

        } else {

            link.classList.remove(
                "bg-blue-600",
                "text-white",
                "font-semibold"
            );

            link.classList.add(
                "text-slate-400",
                "hover:text-white",
                "hover:bg-slate-800/60"
            );

        }

    });


    /* ---------------------------------------------------------------------- */
    /* Buscador global                                                        */
    /* ---------------------------------------------------------------------- */

    inicializarBuscadorGlobal();

});


/* ========================================================================== */
/* FUNCIÓN GLOBAL SIMULADA DEL MVP                                            */
/* ========================================================================== */

function simularAccion(mensaje) {

    alert(
        mensaje ||
        "Operación simulada con éxito en el MVP de VIREON."
    );

}