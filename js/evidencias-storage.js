console.log("EVIDENCIAS-STORAGE.JS CARGADO");

class EvidenciasStorage {

    static DB_NAME = "vireon_evidencias_db";
    static DB_VERSION = 1;
    static STORE_NAME = "evidencias";


    // =========================================================
    // ABRIR BASE DE DATOS
    // =========================================================

    static abrirDB() {

        return new Promise(
            (resolve, reject) => {

                const request =
                    indexedDB.open(
                        this.DB_NAME,
                        this.DB_VERSION
                    );


                request.onupgradeneeded =
                    function (event) {

                        const db =
                            event.target.result;


                        if (
                            !db.objectStoreNames.contains(
                                EvidenciasStorage.STORE_NAME
                            )
                        ) {

                            const store =
                                db.createObjectStore(
                                    EvidenciasStorage.STORE_NAME,
                                    {
                                        keyPath: "id"
                                    }
                                );


                            store.createIndex(
                                "accionId",
                                "accionId",
                                {
                                    unique: false
                                }
                            );
                        }
                    };


                request.onsuccess =
                    function (event) {

                        resolve(
                            event.target.result
                        );
                    };


                request.onerror =
                    function (event) {

                        reject(
                            event.target.error
                        );
                    };
            }
        );
    }


    // =========================================================
    // GENERAR ID
    // =========================================================

    static generarId() {

        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {

            return crypto.randomUUID();
        }


        return (
            "EVD-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );
    }


    // =========================================================
    // GUARDAR ARCHIVOS DE UNA ACCIÓN
    // =========================================================

    static async guardarArchivos(
        accionId,
        archivos
    ) {

        if (
            !accionId ||
            !Array.isArray(archivos) ||
            archivos.length === 0
        ) {

            return [];
        }


        const db =
            await this.abrirDB();


        const idsGuardados = [];


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        this.STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        this.STORE_NAME
                    );


                archivos.forEach(
                    archivo => {

                        const id =
                            this.generarId();


                        const registro = {

                            id:
                                id,

                            accionId:
                                accionId,

                            nombre:
                                archivo.name,

                            tipo:
                                archivo.type,

                            tamano:
                                archivo.size,

                            fechaCarga:
                                new Date()
                                    .toISOString(),

                            archivo:
                                archivo

                        };


                        store.add(
                            registro
                        );


                        idsGuardados.push(
                            id
                        );
                    }
                );


                transaction.oncomplete =
                    function () {

                        resolve(
                            idsGuardados
                        );
                    };


                transaction.onerror =
                    function (event) {

                        reject(
                            event.target.error
                        );
                    };
            }
        );
    }


    // =========================================================
    // OBTENER EVIDENCIAS POR ACCIÓN
    // =========================================================

    static async obtenerPorAccion(
        accionId
    ) {

        const db =
            await this.abrirDB();


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        this.STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        this.STORE_NAME
                    );


                const index =
                    store.index(
                        "accionId"
                    );


                const request =
                    index.getAll(
                        accionId
                    );


                request.onsuccess =
                    function () {

                        resolve(
                            request.result || []
                        );
                    };


                request.onerror =
                    function (event) {

                        reject(
                            event.target.error
                        );
                    };
            }
        );
    }


    // =========================================================
    // OBTENER UNA EVIDENCIA
    // =========================================================

    static async obtenerPorId(
        id
    ) {

        const db =
            await this.abrirDB();


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        this.STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        this.STORE_NAME
                    );


                const request =
                    store.get(
                        id
                    );


                request.onsuccess =
                    function () {

                        resolve(
                            request.result || null
                        );
                    };


                request.onerror =
                    function (event) {

                        reject(
                            event.target.error
                        );
                    };
            }
        );
    }


    // =========================================================
    // ELIMINAR EVIDENCIA
    // =========================================================

    static async eliminar(
        id
    ) {

        const db =
            await this.abrirDB();


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        this.STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        this.STORE_NAME
                    );


                store.delete(
                    id
                );


                transaction.oncomplete =
                    function () {

                        resolve(true);
                    };


                transaction.onerror =
                    function (event) {

                        reject(
                            event.target.error
                        );
                    };
            }
        );
    }


    // =========================================================
    // ELIMINAR TODAS LAS EVIDENCIAS DE UNA ACCIÓN
    // =========================================================

    static async eliminarPorAccion(
        accionId
    ) {

        const evidencias =
            await this.obtenerPorAccion(
                accionId
            );


        for (
            const evidencia
            of evidencias
        ) {

            await this.eliminar(
                evidencia.id
            );
        }


        return true;
    }


    // =========================================================
    // CREAR URL TEMPORAL
    // =========================================================

    static crearURL(
        evidencia
    ) {

        if (
            !evidencia ||
            !evidencia.archivo
        ) {

            return null;
        }


        return URL.createObjectURL(
            evidencia.archivo
        );
    }

}