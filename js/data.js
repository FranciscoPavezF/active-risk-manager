class DataService {

    static async obtenerRiesgos() {
        const respuesta = await fetch("data/riesgos.json");
        return await respuesta.json();
    }

    static async obtenerAcciones() {
        const respuesta = await fetch("data/acciones.json");
        return await respuesta.json();
    }

    static async obtenerIndicadores() {
        const respuesta = await fetch("data/indicadores.json");
        return await respuesta.json();
    }

    static async obtenerUsuarios() {
        const respuesta = await fetch("data/usuarios.json");
        return await respuesta.json();
    }

}