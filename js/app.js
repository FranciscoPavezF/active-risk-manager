/* ========================================================================== */
/* VIREON - Executive Decision Platform (Script Global de Interacción MVP)    */
/* ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("VIREON MVP iniciado correctamente.");

    // Sincronizar estado activo del menú lateral según la página actual
    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
    const navLinks = document.querySelectorAll('aside nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentPage) {
            link.classList.remove(
                'text-slate-400',
                'hover:text-white',
                'hover:bg-slate-800/60'
            );
            link.classList.add(
                'bg-blue-600',
                'text-white',
                'font-semibold'
            );
        } else {
            link.classList.remove(
                'bg-blue-600',
                'text-white',
                'font-semibold'
            );
            link.classList.add(
                'text-slate-400',
                'hover:text-white',
                'hover:bg-slate-800/60'
            );
        }
    });
});

// Función global simulada para botones de acción del MVP
function simularAccion(mensaje) {
    alert(mensaje || "Operación simulada con éxito en el MVP de VIREON.");
}