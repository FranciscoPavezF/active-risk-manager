document.addEventListener("DOMContentLoaded", async () => {

    const boton = document.getElementById("btnNotificaciones");
    const panel = document.getElementById("panelNotificaciones");
    const lista = document.getElementById("listaNotificaciones");
    const contador = document.getElementById("contadorNotificaciones");
    const punto = document.getElementById("puntoNotificaciones");

    if (!boton || !panel || !lista || !contador || !punto) {
        return;
    }

    const CLAVE_LEIDAS = "vireon_notificaciones_leidas";

    let alertasActuales = [];

    function obtenerLeidas() {
        try {
            return JSON.parse(
                localStorage.getItem(CLAVE_LEIDAS)
            ) || [];
        } catch (error) {
            return [];
        }
    }

    function guardarLeidas(leidas) {
        localStorage.setItem(
            CLAVE_LEIDAS,
            JSON.stringify(leidas)
        );
    }

    function obtenerClaveAlerta(alerta) {
        return [
            alerta.id,
            alerta.tipo,
            alerta.fechaCompromiso
        ].join("|");
    }

    function esAlertaLeida(alerta) {
        const leidas = obtenerLeidas();
        const clave = obtenerClaveAlerta(alerta);

        return leidas.includes(clave);
    }

    function actualizarContador() {

        const leidas = obtenerLeidas();

        const noLeidas = alertasActuales.filter((alerta) => {

            const clave = obtenerClaveAlerta(alerta);

            return !leidas.includes(clave);
        });

        contador.textContent = noLeidas.length;

        if (noLeidas.length > 0) {
            punto.classList.remove("hidden");
            contador.classList.remove("hidden");
        } else {
            punto.classList.add("hidden");
            contador.classList.add("hidden");
        }
    }

    function marcarTodasComoLeidas() {

        const leidas = obtenerLeidas();

        alertasActuales.forEach((alerta) => {

            const clave = obtenerClaveAlerta(alerta);

            if (!leidas.includes(clave)) {
                leidas.push(clave);
            }
        });

        guardarLeidas(leidas);

        actualizarContador();
    }

    function ordenarAlertas(alertas) {

        const leidas = obtenerLeidas();

        return [...alertas].sort((a, b) => {

            const claveA = obtenerClaveAlerta(a);
            const claveB = obtenerClaveAlerta(b);

            const leidaA = leidas.includes(claveA);
            const leidaB = leidas.includes(claveB);

            /*
            ==================================================
            1. NO LEÍDAS PRIMERO
            ==================================================
            */

            if (leidaA !== leidaB) {
                return leidaA ? 1 : -1;
            }

            /*
            ==================================================
            2. ENTRE ALERTAS DEL MISMO GRUPO,
               LAS MÁS URGENTES PRIMERO
            ==================================================
            */

            return a.diferencia - b.diferencia;
        });
    }

    function renderizarAlertas() {

        if (alertasActuales.length === 0) {

            lista.innerHTML = `
                <div class="px-4 py-6 text-center">

                    <p class="text-sm font-semibold text-slate-700">
                        Sin alertas pendientes
                    </p>

                    <p class="text-xs text-slate-500 mt-1">
                        No existen acciones vencidas o próximas a vencer.
                    </p>

                </div>
            `;

            return;
        }

        const alertasOrdenadas =
            ordenarAlertas(alertasActuales);

        lista.innerHTML = alertasOrdenadas
            .slice(0, 5)
            .map((alerta) => {

                const indicador =
                    alerta.tipo === "vencida"
                        ? "bg-red-500"
                        : alerta.tipo === "hoy"
                        ? "bg-orange-500"
                        : "bg-amber-400";

                const responsable =
                    alerta.responsable ||
                    "Sin asignar";

                const leida =
                    esAlertaLeida(alerta);

                const claseFondo =
                    leida
                        ? ""
                        : "bg-blue-50/40";

                const etiquetaNueva =
                    leida
                        ? ""
                        : `
                            <span
                                class="
                                    text-[9px]
                                    font-semibold
                                    text-blue-600
                                    bg-blue-50
                                    px-1.5
                                    py-0.5
                                    rounded
                                    ml-2
                                "
                            >
                                Nueva
                            </span>
                        `;

                return `
                    <div
                        class="
                            px-4
                            py-3
                            border-b
                            border-slate-100
                            hover:bg-slate-50
                            ${claseFondo}
                        "
                    >

                        <div class="flex gap-3">

                            <span
                                class="
                                    mt-1.5
                                    w-2
                                    h-2
                                    ${indicador}
                                    rounded-full
                                    shrink-0
                                "
                            >
                            </span>

                            <div class="min-w-0 flex-1">

                                <div class="flex items-center">

                                    <p
                                        class="
                                            text-xs
                                            font-bold
                                            text-slate-900
                                        "
                                    >
                                        ${alerta.titulo}
                                    </p>

                                    ${etiquetaNueva}

                                </div>

                                <p
                                    class="
                                        text-xs
                                        text-slate-700
                                        mt-1
                                    "
                                >
                                    ${alerta.accion}
                                </p>

                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-between
                                        mt-2
                                        gap-2
                                    "
                                >

                                    <span
                                        class="
                                            text-[10px]
                                            text-slate-500
                                        "
                                    >
                                        ${alerta.id} · ${responsable}
                                    </span>

                                    <span
                                        class="
                                            text-[10px]
                                            font-medium
                                            text-slate-500
                                        "
                                    >
                                        ${alerta.fechaCompromiso}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>
                `;
            })
            .join("");
    }

    boton.addEventListener("click", (event) => {

        event.stopPropagation();

        const estabaOculto =
            panel.classList.contains("hidden");

        /*
        ==================================================
        PRIMERO RENDERIZAMOS

        Así las nuevas aparecen arriba antes de
        marcarlas como leídas.
        ==================================================
        */

        if (estabaOculto) {

            renderizarAlertas();

            panel.classList.remove("hidden");

            /*
            ==================================================
            SE MARCAN COMO LEÍDAS DESPUÉS DE MOSTRARLAS
            ==================================================
            */

            setTimeout(() => {

                marcarTodasComoLeidas();

            }, 300);

        } else {

            panel.classList.add("hidden");
        }
    });

    document.addEventListener("click", (event) => {

        if (
            !panel.contains(event.target) &&
            !boton.contains(event.target)
        ) {
            panel.classList.add("hidden");
        }
    });

    try {

        const acciones =
            await AccionesStorage.obtenerTodas();

        const hoy = new Date();

        hoy.setHours(0, 0, 0, 0);

        const alertas = [];

        acciones.forEach((accion) => {

            const estado = String(
                accion.estado || ""
            )
                .toLowerCase()
                .trim();

            if (
                estado === "cerrada" ||
                estado === "cerrado" ||
                estado === "completada" ||
                estado === "completado"
            ) {
                return;
            }

            if (!accion.fechaCompromiso) {
                return;
            }

            const fecha = new Date(
                `${accion.fechaCompromiso}T00:00:00`
            );

            const diferencia = Math.ceil(
                (fecha - hoy) /
                (1000 * 60 * 60 * 24)
            );

            let tipo = "";
            let titulo = "";

            if (diferencia < 0) {

                tipo = "vencida";

                const dias =
                    Math.abs(diferencia);

                titulo =
                    `Acción vencida hace ${dias} ` +
                    `${dias === 1 ? "día" : "días"}`;

            } else if (diferencia === 0) {

                tipo = "hoy";

                titulo =
                    "Acción vence hoy";

            } else if (diferencia <= 3) {

                tipo = "proxima";

                titulo =
                    `Acción vence en ${diferencia} ` +
                    `${diferencia === 1 ? "día" : "días"}`;
            }

            if (tipo) {

                alertas.push({
                    ...accion,
                    tipo,
                    titulo,
                    diferencia
                });
            }
        });

        alertasActuales = alertas;

        /*
        ==================================================
        LIMPIAR NOTIFICACIONES LEÍDAS QUE YA NO ESTÁN ACTIVAS
        ==================================================
        */

        const clavesActivas =
            alertasActuales.map(
                obtenerClaveAlerta
            );

        const leidasGuardadas =
            obtenerLeidas();

        const leidasVigentes =
            leidasGuardadas.filter(
                (clave) =>
                    clavesActivas.includes(clave)
            );

        guardarLeidas(leidasVigentes);

        /*
        ==================================================
        CONTADOR DE NO LEÍDAS
        ==================================================
        */

        actualizarContador();

        /*
        ==================================================
        CARGA INICIAL DEL PANEL
        ==================================================
        */

        renderizarAlertas();

    } catch (error) {

        console.error(
            "Error cargando notificaciones:",
            error
        );

        lista.innerHTML = `
            <div
                class="
                    px-4
                    py-6
                    text-center
                    text-xs
                    text-red-500
                "
            >
                No fue posible cargar las alertas.
            </div>
        `;
    }

});