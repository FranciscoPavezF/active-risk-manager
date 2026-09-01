console.log("OPORTUNIDADES-STORAGE.JS CARGADO");

class OportunidadesStorage {

    static KEY = "vireon_oportunidades";

    static async obtenerTodas() {

        const guardadas = localStorage.getItem(this.KEY);

        if (guardadas) {
            return JSON.parse(guardadas);
        }

        // Datos iniciales de demostración.
        // Después podremos moverlos a oportunidades.json.
        const oportunidadesIniciales = [
            {
                id: "O-001",
                titulo: "Optimización del mantenimiento preventivo",
                descripcion: "Optimización del mantenimiento preventivo para reducir costos y tiempos de intervención.",
                beneficioPotencial: 180000,
                responsable: "M. Gómez",
                estado: "En aprovechamiento"
            },
            {
                id: "O-004",
                titulo: "Reutilización de componentes",
                descripcion: "Reutilización de componentes recuperables para disminuir costos.",
                beneficioPotencial: 95000,
                responsable: "J. Soto",
                estado: "Capturada"
            },
            {
                id: "O-007",
                titulo: "Mejora logística en Faena Norte",
                descripcion: "Mejora de la coordinación logística y disponibilidad de recursos.",
                beneficioPotencial: 205000,
                responsable: "C. Riquelme",
                estado: "En evaluación"
            }
        ];

        await this.guardarTodas(
            oportunidadesIniciales
        );

        return oportunidadesIniciales;
    }


    static async guardarTodas(oportunidades) {

        localStorage.setItem(
            this.KEY,
            JSON.stringify(oportunidades)
        );

    }


    static async obtenerPorId(id) {

        const oportunidades =
            await this.obtenerTodas();

        return oportunidades.find(
            oportunidad =>
                oportunidad.id === id
        );

    }


    static async agregar(oportunidadNueva) {

        const oportunidades =
            await this.obtenerTodas();

        oportunidades.push(
            oportunidadNueva
        );

        await this.guardarTodas(
            oportunidades
        );

    }


    static async actualizar(id, datos) {

        const oportunidades =
            await this.obtenerTodas();

        const indice =
            oportunidades.findIndex(
                oportunidad =>
                    oportunidad.id === id
            );

        if (indice >= 0) {

            oportunidades[indice] = {
                ...oportunidades[indice],
                ...datos
            };

            await this.guardarTodas(
                oportunidades
            );

            return true;
        }

        return false;
    }


    static async eliminar(id) {

        const oportunidades =
            await this.obtenerTodas();

        const nuevas =
            oportunidades.filter(
                oportunidad =>
                    oportunidad.id !== id
            );

        await this.guardarTodas(
            nuevas
        );

    }

}