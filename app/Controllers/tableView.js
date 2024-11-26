document.addEventListener('DOMContentLoaded', () => {
    const switchStateRight = document.getElementById('switchStateRight');
    const stateController = document.getElementById('StateController');
    const cerrarMesaModal = document.getElementById('CerrarMesa');

    // Estados posibles para el controlador
    const states = [
        { 
            color: 'rgba(143, 255, 92, 0.37)', 
            text: 'En<br>Proceso' 
        },
        { 
            color: 'rgba(255, 252, 67, 0.459)', 
            text: 'Comida<br>entregada' 
        },
        { 
            color: 'rgba(255, 67, 67, 0.329)', 
            text: 'pagada' 
        }
    ];

    let currentStateIndex = 0;

    switchStateRight.addEventListener('click', () => {
        // Incrementar el índice de estado
        currentStateIndex++;

        // Si pasamos del último estado, abrir el modal de Cerrar Mesa
        if (currentStateIndex >= states.length) {
            // Abrir modal de Cerrar Mesa
            const modal = new bootstrap.Modal(cerrarMesaModal);
            modal.show();

            // Reiniciar al estado inicial
            currentStateIndex = 0;
            stateController.style.backgroundColor = states[currentStateIndex].color;
            stateController.innerHTML = states[currentStateIndex].text;
        } else {
            // Cambiar color y texto del StateController
            stateController.style.backgroundColor = states[currentStateIndex].color;
            stateController.innerHTML = states[currentStateIndex].text;
        }
    });
});