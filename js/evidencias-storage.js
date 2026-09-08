console.log("EVIDENCIAS-STORAGE.JS CARGADO");

class EvidenciasStorage {

    static DB_NAME = "vireon_evidencias_db";
    static DB_VERSION = 2;
    static STORE_NAME = "evidencias";


    // =========================================================
    // ABRIR BASE DE DATOS
    // =========================================================

    static abrirDB() {

        return new Promise((resolve, reject) => {

            const request =
                indexedDB.open(
                    EvidenciasStorage.DB_NAME,
                    EvidenciasStorage.DB_VERSION
                );


            request.onupgradeneeded = function (event) {

                const db =
                    event.target.result;

                let store;


                if (
                    !db.objectStoreNames.contains(
                        EvidenciasStorage.STORE_NAME
                    )
                ) {

                    store =
                        db.createObjectStore(
                            EvidenciasStorage.STORE_NAME,
                            {
                                keyPath: "id"
                            }
                        );

                } else {

                    store =
                        event.target.transaction.objectStore(
                            EvidenciasStorage.STORE_NAME
                        );
                }


                if (
                    !store.indexNames.contains(
                        "registroId"
                    )
                ) {

                    store.createIndex(
                        "registroId",
                        "registroId",
                        {
                            unique: false
                        }
                    );
                }


                if (
                    !store.indexNames.contains(
                        "tipoRegistro"
                    )
                ) {

                    store.createIndex(
                        "tipoRegistro",
                        "tipoRegistro",
                        {
                            unique: false
                        }
                    );
                }


                if (
                    !store.indexNames.contains(
                        "fechaCreacion"
                    )
                ) {

                    store.createIndex(
                        "fechaCreacion",
                        "fechaCreacion",
                        {
                            unique: false
                        }
                    );
                }

            };


            request.onsuccess = function () {

                resolve(
                    request.result
                );
            };


            request.onerror = function () {

                console.error(
                    "Error al abrir IndexedDB:",
                    request.error
                );

                reject(
                    request.error
                );
            };

        });
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
            "EV-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2, 10)
        );
    }


    // =========================================================
    // GUARDAR REGISTRO
    // =========================================================

    static async guardarRegistro({
        registroId,
        tipoRegistro,
        archivo,
        descripcion = "",
        responsable = "",
        fecha = ""
    }) {

        if (!registroId) {

            throw new Error(
                "El registroId es obligatorio."
            );
        }


        if (!archivo) {

            throw new Error(
                "El archivo es obligatorio."
            );
        }


        const db =
            await EvidenciasStorage.abrirDB();


        const evidencia = {

            id:
                EvidenciasStorage.generarId(),

            registroId:
                String(registroId),

            tipoRegistro:
                String(
                    tipoRegistro || ""
                ),

            nombre:
                archivo.name ||
                "evidencia",

            tipoArchivo:
                archivo.type ||
                "application/octet-stream",

            tamano:
                archivo.size || 0,

            archivo:
                archivo,

            descripcion:
                String(
                    descripcion || ""
                ).trim(),

            responsable:
                String(
                    responsable || ""
                ).trim(),

            fecha:
                fecha || "",

            fechaCreacion:
                new Date()
                    .toISOString()

        };


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        EvidenciasStorage.STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        EvidenciasStorage.STORE_NAME
                    );


                const request =
                    store.add(
                        evidencia
                    );


                request.onsuccess =
                    function () {

                        resolve(
                            evidencia
                        );
                    };


                request.onerror =
                    function () {

                        console.error(
                            "Error al guardar evidencia:",
                            request.error
                        );

                        reject(
                            request.error
                        );
                    };


                transaction.oncomplete =
                    function () {

                        db.close();
                    };


                transaction.onerror =
                    function () {

                        console.error(
                            "Error en transacción al guardar evidencia:",
                            transaction.error
                        );
                    };

            }
        );
    }


    // =========================================================
    // OBTENER TODAS
    // =========================================================

    static async obtenerTodas() {

        const db =
            await EvidenciasStorage.abrirDB();


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        EvidenciasStorage.STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        EvidenciasStorage.STORE_NAME
                    );


                const request =
                    store.getAll();


                request.onsuccess =
                    function () {

                        const resultados =
                            Array.isArray(
                                request.result
                            )
                                ? request.result
                                : [];


                        resultados.sort(
                            (a, b) =>
                                String(
                                    b.fechaCreacion || ""
                                ).localeCompare(
                                    String(
                                        a.fechaCreacion || ""
                                    )
                                )
                        );


                        resolve(
                            resultados
                        );
                    };


                request.onerror =
                    function () {

                        console.error(
                            "Error al obtener evidencias:",
                            request.error
                        );

                        reject(
                            request.error
                        );
                    };


                transaction.oncomplete =
                    function () {

                        db.close();
                    };

            }
        );
    }


    // =========================================================
    // OBTENER EVIDENCIAS DE UN REGISTRO
    // =========================================================

    static async obtenerPorRegistro(
        registroId
    ) {

        if (!registroId) {

            return [];
        }


        const db =
            await EvidenciasStorage.abrirDB();


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        EvidenciasStorage.STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        EvidenciasStorage.STORE_NAME
                    );


                let request;


                if (
                    store.indexNames.contains(
                        "registroId"
                    )
                ) {

                    const index =
                        store.index(
                            "registroId"
                        );


                    request =
                        index.getAll(
                            String(registroId)
                        );

                } else {

                    request =
                        store.getAll();
                }


                request.onsuccess =
                    function () {

                        let resultados =
                            Array.isArray(
                                request.result
                            )
                                ? request.result
                                : [];


                        if (
                            !store.indexNames.contains(
                                "registroId"
                            )
                        ) {

                            resultados =
                                resultados.filter(
                                    evidencia =>
                                        String(
                                            evidencia.registroId
                                        ) ===
                                        String(
                                            registroId
                                        )
                                );
                        }


                        resultados.sort(
                            (a, b) =>
                                String(
                                    b.fechaCreacion || ""
                                ).localeCompare(
                                    String(
                                        a.fechaCreacion || ""
                                    )
                                )
                        );


                        resolve(
                            resultados
                        );
                    };


                request.onerror =
                    function () {

                        console.error(
                            "Error al obtener evidencias del registro:",
                            request.error
                        );

                        reject(
                            request.error
                        );
                    };


                transaction.oncomplete =
                    function () {

                        db.close();
                    };

            }
        );
    }


    // =========================================================
    // OBTENER UNA EVIDENCIA POR ID
    // =========================================================

    static async obtenerPorId(id) {

        if (!id) {

            return null;
        }


        const db =
            await EvidenciasStorage.abrirDB();


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        EvidenciasStorage.STORE_NAME,
                        "readonly"
                    );


                const store =
                    transaction.objectStore(
                        EvidenciasStorage.STORE_NAME
                    );


                const request =
                    store.get(id);


                request.onsuccess =
                    function () {

                        resolve(
                            request.result ||
                            null
                        );
                    };


                request.onerror =
                    function () {

                        console.error(
                            "Error al obtener evidencia:",
                            request.error
                        );

                        reject(
                            request.error
                        );
                    };


                transaction.oncomplete =
                    function () {

                        db.close();
                    };

            }
        );
    }


    // =========================================================
    // CREAR URL TEMPORAL DEL ARCHIVO
    // =========================================================

    static crearURL(evidencia) {

        if (
            !evidencia ||
            !evidencia.archivo
        ) {

            return null;
        }


        try {

            let archivo =
                evidencia.archivo;


            if (
                archivo instanceof Blob
            ) {

                return URL.createObjectURL(
                    archivo
                );
            }


            if (
                archivo instanceof ArrayBuffer
            ) {

                archivo =
                    new Blob(
                        [archivo],
                        {
                            type:
                                evidencia.tipoArchivo ||
                                "application/octet-stream"
                        }
                    );


                return URL.createObjectURL(
                    archivo
                );
            }


            return null;


        } catch (error) {

            console.error(
                "Error al crear URL de evidencia:",
                error
            );

            return null;
        }
    }


    // =========================================================
    // ELIMINAR EVIDENCIA
    // =========================================================

    static async eliminar(id) {

        if (!id) {

            throw new Error(
                "El ID de la evidencia es obligatorio."
            );
        }


        const db =
            await EvidenciasStorage.abrirDB();


        return new Promise(
            (resolve, reject) => {

                const transaction =
                    db.transaction(
                        EvidenciasStorage.STORE_NAME,
                        "readwrite"
                    );


                const store =
                    transaction.objectStore(
                        EvidenciasStorage.STORE_NAME
                    );


                const request =
                    store.delete(id);


                request.onsuccess =
                    function () {

                        console.log(
                            "Evidencia eliminada de IndexedDB:",
                            id
                        );
                    };


                request.onerror =
                    function () {

                        console.error(
                            "Error al eliminar evidencia:",
                            request.error
                        );

                        reject(
                            request.error
                        );
                    };


                transaction.oncomplete =
                    function () {

                        db.close();

                        resolve(true);
                    };


                transaction.onerror =
                    function () {

                        console.error(
                            "Error en transacción al eliminar evidencia:",
                            transaction.error
                        );

                        reject(
                            transaction.error
                        );
                    };

            }
        );
    }


    // =========================================================
    // ELIMINAR TODAS LAS EVIDENCIAS DE UN REGISTRO
    // =========================================================

    static async eliminarPorRegistro(
        registroId
    ) {

        const evidencias =
            await EvidenciasStorage
                .obtenerPorRegistro(
                    registroId
                );


        for (
            const evidencia
            of evidencias
        ) {

            await EvidenciasStorage
                .eliminar(
                    evidencia.id
                );
        }


        return true;
    }


    // =========================================================
    // CONTAR EVIDENCIAS DE UN REGISTRO
    // =========================================================

    static async contarPorRegistro(
        registroId
    ) {

        const evidencias =
            await EvidenciasStorage
                .obtenerPorRegistro(
                    registroId
                );


        return evidencias.length;
    }

}


// =============================================================
// EXPONER STORAGE GLOBALMENTE
// =============================================================

window.EvidenciasStorage =
    EvidenciasStorage;


console.log(
    "EvidenciasStorage disponible:",
    typeof window.EvidenciasStorage
);