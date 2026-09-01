document.addEventListener("DOMContentLoaded", async () => {

    const boton = document.getElementById("btnNotificaciones");
    const panel = document.getElementById("panelNotificaciones");
    const lista = document.getElementById("listaNotificaciones");
    const contador = document.getElementById("contadorNotificaciones");
    const punto = document.getElementById("puntoNotificaciones");

    if (!boton || !panel || !lista || !contador || !punto) {
        return;
    }

    boton.addEventListener("click", (event) => {
        event.stopPropagation();
        panel.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
        if (!panel.contains(event.target) && !boton.contains(event.target)) {
            panel.classList.add("hidden");
        }
    });

    try {
        const acciones = await AccionesStorage.obtenerTodas();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const alertas = [];

        acciones.forEach((accion) => {

            const estado = String(accion.estado || "")
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
                (fecha - hoy) / (1000 * 60 * 60 * 24)
            );

            let tipo = "";
            let titulo = "";

            if (diferencia < 0) {
                tipo = "vencida";

                const dias = Math.abs(diferencia);

                titulo =
                    `Acción vencida hace ${dias} ` +
                    `${dias === 1 ? "día" : "días"}`;

            } else if (diferencia === 0) {

                tipo = "hoy";
                titulo = "Acción vence hoy";

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

        alertas.sort(
            (a, b) => a.diferencia - b.diferencia
        );

        contador.textContent = alertas.length;

        if (alertas.length === 0) {

            punto.classList.add("hidden");

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

        punto.classList.remove("hidden");

        lista.innerHTML = alertas
            .slice(0, 5)
            .map((alerta) => {

                const indicador =
                    alerta.tipo === "vencida"
                        ? "bg-red-500"
                        : alerta.tipo === "hoy"
                        ? "bg-orange-500"
                        : "bg-amber-400";

                const responsable =
                    alerta.responsable || "Sin asignar";

                return `
                    <div class="px-4 py-3 border-b border-slate-100 hover:bg-slate-50">

                        <div class="flex gap-3">

                            <span
                                class="mt-1.5 w-2 h-2 ${indicador} rounded-full shrink-0">
                            </span>

                            <div class="min-w-0 flex-1">

                                <p class="text-xs font-bold text-slate-900">
                                    ${alerta.titulo}
                                </p>

                                <p class="text-xs text-slate-700 mt-1">
                                    ${alerta.accion}
                                </p>

                                <div class="flex items-center justify-between mt-2 gap-2">

                                    <span class="text-[10px] text-slate-500">
                                        ${alerta.id} · ${responsable}
                                    </span>

                                    <span class="text-[10px] font-medium text-slate-500">
                                        ${alerta.fechaCompromiso}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>
                `;
            })
            .join("");

    } catch (error) {

        console.error(
            "Error cargando notificaciones:",
            error
        );

        lista.innerHTML = `
            <div class="px-4 py-6 text-center text-xs text-red-500">
                No fue posible cargar las alertas.
            </div>
        `;
    }

});