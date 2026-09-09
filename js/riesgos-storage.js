console.log("RIESGOS-STORAGE.JS CARGADO");

class RiesgosStorage {

    static KEY = "vireon_riesgos";


    // =====================================================
    // OBTENER TODOS
    // =====================================================

    static async obtenerTodos() {

        const guardados = localStorage.getItem(this.KEY);

        if (guardados) {

            try {

                const riesgos = JSON.parse(guardados);

                return Array.isArray(riesgos)
                    ? riesgos
                    : [];

            } catch (error) {

                console.error(
                    "Error leyendo localStorage:",
                    error
                );

            }

        }


        // Si todavía no existe información guardada,
        // cargamos la base inicial desde riesgos.json

        const riesgos =
            await DataService.obtenerRiesgos();


        const lista =
            Array.isArray(riesgos)
                ? riesgos
                : [];


        localStorage.setItem(
            this.KEY,
            JSON.stringify(lista)
        );


        return lista;

    }


    // =====================================================
    // GUARDAR TODOS
    // =====================================================

    static async guardarTodos(riesgos) {

        localStorage.setItem(
            this.KEY,
            JSON.stringify(riesgos)
        );

    }


    // =====================================================
    // OBTENER POR ID
    // =====================================================

    static async obtenerPorId(id) {

        const riesgos =
            await this.obtenerTodos();


        return riesgos.find(
            riesgo => riesgo.id === id
        ) || null;

    }


    // =====================================================
    // AGREGAR
    // =====================================================

    static async agregar(riesgoNuevo) {

        const riesgos =
            await this.obtenerTodos();


        const existe =
            riesgos.some(
                riesgo =>
                    riesgo.id === riesgoNuevo.id
            );


        if (existe) {

            throw new Error(
                `Ya existe el riesgo ${riesgoNuevo.id}`
            );

        }


        riesgos.push(riesgoNuevo);


        await this.guardarTodos(
            riesgos
        );


        return riesgoNuevo;

    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    static async actualizar(id, datos) {

        const riesgos =
            await this.obtenerTodos();


        const indice =
            riesgos.findIndex(
                riesgo => riesgo.id === id
            );


        if (indice === -1) {

            throw new Error(
                `No se encontró el riesgo ${id}`
            );

        }


        riesgos[indice] = {

            ...riesgos[indice],

            ...datos,

            // El ID original siempre se mantiene
            id: riesgos[indice].id

        };


        await this.guardarTodos(
            riesgos
        );


        return riesgos[indice];

    }


    // =====================================================
    // ELIMINAR
    // =====================================================

    static async eliminar(id) {

        const riesgos =
            await this.obtenerTodos();


        const existe =
            riesgos.some(
                riesgo => riesgo.id === id
            );


        if (!existe) {

            throw new Error(
                `No se encontró el riesgo ${id}`
            );

        }


        const nuevosRiesgos =
            riesgos.filter(
                riesgo => riesgo.id !== id
            );


        await this.guardarTodos(
            nuevosRiesgos
        );


        return true;

    }

}