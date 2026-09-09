console.log("ACCIONES-STORAGE.JS CARGADO");

class AccionesStorage {

    static KEY = "vireon_acciones";


    // =====================================================
    // OBTENER TODAS
    // =====================================================

    static async obtenerTodas() {

        const guardadas =
            localStorage.getItem(this.KEY);

        if (guardadas) {

            try {

                const acciones =
                    JSON.parse(guardadas);

                return Array.isArray(acciones)
                    ? acciones
                    : [];

            }
            catch (error) {

                console.error(
                    "Error leyendo acciones desde localStorage:",
                    error
                );

            }

        }


        // Primera carga desde acciones.json

        const acciones =
            await DataService.obtenerAcciones();


        const lista =
            Array.isArray(acciones)
                ? acciones
                : [];


        localStorage.setItem(
            this.KEY,
            JSON.stringify(lista)
        );


        return lista;

    }


    // =====================================================
    // GUARDAR TODAS
    // =====================================================

    static async guardarTodas(acciones) {

        localStorage.setItem(
            this.KEY,
            JSON.stringify(acciones)
        );

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    static async obtenerPorId(id) {

        const acciones =
            await this.obtenerTodas();


        return acciones.find(
            accion => accion.id === id
        ) || null;

    }


    // =====================================================
    // OBTENER POR RIESGO
    // =====================================================

    static async obtenerPorRiesgo(riesgoId) {

        const acciones =
            await this.obtenerTodas();


        return acciones.filter(
            accion =>
                accion.riesgoId === riesgoId
        );

    }


    // =====================================================
    // AGREGAR
    // =====================================================

    static async agregar(accionNueva) {

        const acciones =
            await this.obtenerTodas();


        const existe =
            acciones.some(
                accion =>
                    accion.id === accionNueva.id
            );


        if (existe) {

            throw new Error(
                `Ya existe la acción ${accionNueva.id}`
            );

        }


        acciones.push(accionNueva);


        await this.guardarTodas(
            acciones
        );


        return accionNueva;

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    static async actualizar(id, datos) {

        const acciones =
            await this.obtenerTodas();


        const indice =
            acciones.findIndex(
                accion => accion.id === id
            );


        if (indice === -1) {

            throw new Error(
                `No se encontró la acción ${id}`
            );

        }


        acciones[indice] = {

            ...acciones[indice],

            ...datos,

            id: acciones[indice].id

        };


        await this.guardarTodas(
            acciones
        );


        return acciones[indice];

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    static async eliminar(id) {

        const acciones =
            await this.obtenerTodas();


        const existe =
            acciones.some(
                accion => accion.id === id
            );


        if (!existe) {

            throw new Error(
                `No se encontró la acción ${id}`
            );

        }


        const nuevasAcciones =
            acciones.filter(
                accion => accion.id !== id
            );


        await this.guardarTodas(
            nuevasAcciones
        );


        return true;

    }

}