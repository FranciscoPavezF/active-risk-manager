console.log("RIESGO-DETALLE.JS CARGADO");

document.addEventListener("DOMContentLoaded", async () => {

    try {

        // =====================================================
        // OBTENER ID DESDE LA URL
        // =====================================================

        const parametros = new URLSearchParams(window.location.search);
        const id = parametros.get("id");

        console.log("ID recibido:", id);

        if (!id) {
            console.warn("No se recibió ningún ID de riesgo.");
            return;
        }


        // =====================================================
        // CARGAR RIESGOS
        // =====================================================

        const riesgos = await DataService.obtenerRiesgos();

        const riesgo = riesgos.find(r => r.id === id);

        if (!riesgo) {
            console.error("No existe el riesgo:", id);
            return;
        }

        console.log("Riesgo encontrado:", riesgo);


        // =====================================================
        // UTILIDAD
        // =====================================================

        function elemento(idElemento) {
            return document.getElementById(idElemento);
        }


        // =====================================================
        // ESTRELLAS
        // =====================================================

        function generarEstrellas(valor) {

            const numero = Math.max(
                0,
                Math.min(5, Number(valor) || 0)
            );

            const llenas = Array(numero)
                .fill("★")
                .join(" ");

            const vacias = Array(5 - numero)
                .fill("☆")
                .join(" ");

            const separador =
                llenas && vacias ? " " : "";

            return `${numero} / 5   ${llenas}${separador}${vacias}`;
        }


        // =====================================================
        // COLOR DE CRITICIDAD
        // =====================================================

        function obtenerEstiloCriticidad(valor) {

            const nivel =
                String(valor || "").toLowerCase();

            if (
                nivel === "baja" ||
                nivel === "bajo"
            ) {
                return {
                    fondo: [
                        "bg-emerald-50",
                        "text-emerald-700",
                        "border-emerald-200"
                    ],
                    texto: "text-emerald-600",
                    borde: "border-l-emerald-500",
                    icono: "●"
                };
            }

            if (
                nivel === "media" ||
                nivel === "medio" ||
                nivel === "moderada" ||
                nivel === "moderado"
            ) {
                return {
                    fondo: [
                        "bg-blue-50",
                        "text-blue-700",
                        "border-blue-200"
                    ],
                    texto: "text-blue-600",
                    borde: "border-l-blue-500",
                    icono: "◆"
                };
            }

            if (
                nivel === "alta" ||
                nivel === "alto"
            ) {
                return {
                    fondo: [
                        "bg-amber-50",
                        "text-amber-700",
                        "border-amber-200"
                    ],
                    texto: "text-amber-600",
                    borde: "border-l-amber-500",
                    icono: "▲"
                };
            }

            return {
                fondo: [
                    "bg-red-50",
                    "text-red-700",
                    "border-red-200"
                ],
                texto: "text-red-600",
                borde: "border-l-red-500",
                icono: "⚠"
            };
        }


        // =====================================================
        // COLOR DE ESTADO
        // =====================================================

        function obtenerEstiloEstado(valor) {

            const estado =
                String(valor || "").toLowerCase();

            if (
                estado === "cerrado" ||
                estado === "cerrada" ||
                estado === "completado" ||
                estado === "completada"
            ) {
                return [
                    "bg-emerald-50",
                    "text-emerald-700",
                    "border-emerald-200"
                ];
            }

            if (
                estado === "en proceso" ||
                estado === "en progreso"
            ) {
                return [
                    "bg-blue-50",
                    "text-blue-700",
                    "border-blue-200"
                ];
            }

            if (
                estado === "abierto" ||
                estado === "abierta" ||
                estado === "pendiente"
            ) {
                return [
                    "bg-amber-50",
                    "text-amber-700",
                    "border-amber-200"
                ];
            }

            if (
                estado === "vencido" ||
                estado === "vencida"
            ) {
                return [
                    "bg-red-50",
                    "text-red-700",
                    "border-red-200"
                ];
            }

            return [
                "bg-slate-50",
                "text-slate-700",
                "border-slate-200"
            ];
        }


        // =====================================================
        // ELEMENTOS HTML
        // =====================================================

        const titulo =
            elemento("detalleTitulo");

        const descripcion =
            elemento("detalleDescripcion");

        const categoria =
            elemento("detalleCategoria");

        const categoriaCard =
            elemento("detalleCategoriaCard");

        const criticidad =
            elemento("detalleCriticidad");

        const criticidadCard =
            elemento("detalleCriticidadCard");

        const probabilidad =
            elemento("detalleProbabilidad");

        const impacto =
            elemento("detalleImpacto");

        const responsable =
            elemento("detalleResponsable");

        const estado =
            elemento("detalleEstado");

        const fecha =
            elemento("detalleFecha");

        const planAccion =
            elemento("detallePlanAccion");

        const cabecera =
            elemento("cabeceraRiesgo");


        // =====================================================
        // DATOS GENERALES
        // =====================================================

        if (titulo) {
            titulo.textContent =
                `${riesgo.id}: ${riesgo.titulo}`;
        }

        if (descripcion) {
            descripcion.textContent =
                riesgo.descripcion ||
                "Sin descripción registrada.";
        }

        if (fecha) {
            fecha.textContent =
                riesgo.fecha || "-";
        }

        if (responsable) {
            responsable.textContent =
                riesgo.responsable ||
                "Sin asignar";
        }


        // =====================================================
        // CATEGORÍA
        // =====================================================

        if (categoria) {
            categoria.textContent =
                riesgo.categoria || "-";
        }

        if (categoriaCard) {
            categoriaCard.textContent =
                riesgo.categoria || "-";
        }


        // =====================================================
        // CRITICIDAD
        // =====================================================

        const estiloCriticidad =
            obtenerEstiloCriticidad(
                riesgo.criticidad
            );

        if (criticidad) {

            criticidad.textContent =
                riesgo.criticidad || "-";

            criticidad.classList.remove(
                "bg-emerald-50",
                "text-emerald-700",
                "border-emerald-200",
                "bg-blue-50",
                "text-blue-700",
                "border-blue-200",
                "bg-amber-50",
                "text-amber-700",
                "border-amber-200",
                "bg-red-50",
                "text-red-700",
                "border-red-200"
            );

            criticidad.classList.add(
                ...estiloCriticidad.fondo
            );
        }


        if (criticidadCard) {

            criticidadCard.textContent =
                `${estiloCriticidad.icono} ${riesgo.criticidad}`;

            criticidadCard.classList.remove(
                "text-emerald-600",
                "text-blue-600",
                "text-amber-600",
                "text-red-600"
            );

            criticidadCard.classList.add(
                estiloCriticidad.texto
            );
        }


        // =====================================================
        // BORDE DE LA FICHA SEGÚN CRITICIDAD
        // =====================================================

        if (cabecera) {

            cabecera.classList.remove(
                "border-l-emerald-500",
                "border-l-blue-500",
                "border-l-amber-500",
                "border-l-red-500"
            );

            cabecera.classList.add(
                estiloCriticidad.borde
            );
        }


        // =====================================================
        // ESTADO
        // =====================================================

        if (estado) {

            estado.textContent =
                riesgo.estado || "-";

            estado.classList.remove(
                "bg-emerald-50",
                "text-emerald-700",
                "border-emerald-200",
                "bg-blue-50",
                "text-blue-700",
                "border-blue-200",
                "bg-amber-50",
                "text-amber-700",
                "border-amber-200",
                "bg-red-50",
                "text-red-700",
                "border-red-200",
                "bg-slate-50",
                "text-slate-700",
                "border-slate-200"
            );

            estado.classList.add(
                ...obtenerEstiloEstado(
                    riesgo.estado
                )
            );
        }


        // =====================================================
        // PROBABILIDAD E IMPACTO
        // =====================================================

        if (probabilidad) {
            probabilidad.textContent =
                generarEstrellas(
                    riesgo.probabilidad
                );
        }

        if (impacto) {
            impacto.textContent =
                generarEstrellas(
                    riesgo.impacto
                );
        }


        // =====================================================
        // PLAN DE ACCIÓN
        // =====================================================

        if (planAccion) {
            planAccion.textContent =
                riesgo.planAccion ||
                "No existe un plan de acción registrado.";
        }


        // =====================================================
        // TÍTULO DEL NAVEGADOR
        // =====================================================

        document.title =
            `VIREON - ${riesgo.id} - ${riesgo.titulo}`;


        console.log(
            "Detalle del riesgo cargado correctamente."
        );

    }

    catch (error) {

        console.error(
            "ERROR AL CARGAR EL DETALLE DEL RIESGO:",
            error
        );

    }

});