// Controlador para manejar el historial de órdenes en /historial
class HistorialController {
    constructor() {
        // Endpoint del historial
        this.historialEndpoint = '/api/historial';

        // Inicializa el contenedor del historial
        this.contenedorHistorial = document.querySelector('.contenedorHistorial');

        // Inicializa el historial
        this.init();
    }

    async init() {
        // Se ejecuta al inicio y llama a la función que carga el historial
        await this.loadHistorial();
    }

    async loadHistorial() {
        try {
            // Intenta cargar el historial
            const response = await fetch(this.historialEndpoint);
            if (!response.ok) {
                throw new Error(`Error de HTTP! Estatus: ${response.status}`);
            }
            const historial = await response.json();
            this.displayHistorial(historial); // Muestra el historial resultante
        } catch (error) { // Lanza error si algo sale mal
            console.error('Error cargando el historial:', error);
            this.showError('Error al cargar el historial');
        }
    }

    displayHistorial(historial) {
        // Muestra el historial en pantalla
        if (!this.contenedorHistorial) { // Si no tenemos el contenedor en el archivo HTML
            console.error('No se encontró el contenedor del historial');
            return;
        }

        // Limpiamos el contenedor para evitar duplicados
        this.contenedorHistorial.innerHTML = '';

        // Si no hay órdenes en el historial
        if (historial.length === 0) {
            this.showEmptyState(); // Mostramos el historial vacío
            return;
        }

        // Si sí hay órdenes en el historial, mostramos cada una
        historial.forEach(orden => {
            const mesaElement = this.createMesaElement(orden);
            this.contenedorHistorial.appendChild(mesaElement); // Las vamos poniendo con appendChild
        });
    }

    createMesaElement(orden) {
        // Crea un elemento HTML de mesa 
        if (!orden || typeof orden !== 'object') { // Si la orden no existe o no es un objeto
            console.error('Orden inválida:', orden);
            return document.createTextNode('Error al cargar esta orden.');
        }

        // Asignamos las variables de la orden
        const { tableNumber, date, products } = orden;

        // Crear contenedor para la mesa
        const mesaDiv = document.createElement('div');
        mesaDiv.classList.add('Mesa');
        mesaDiv.style = "display: flex; flex-direction: row; background-color:rgba(255, 255, 255, 0.226); border-radius: 10px; padding: 2%; width: 100%; margin: 3%";

        // Información de la mesa
        const mesaInfoDiv = document.createElement('div');
        mesaInfoDiv.style = "display: flex; flex-direction: column; width: 70%";
        // Declaramos la plantilla HTML
        mesaInfoDiv.innerHTML = `
            <div style="display: flex; flex-direction: row;">
                <p class="bold mt-4" style="font-family: 'Alfa Slab One', serif; font-weight: 400; font-size: 5vw; color: white;">Mesa: </p>
                <p class="bold mt-4" style="font-family: 'Alfa Slab One', serif; font-weight: 400; font-size: 3vw; color: white; padding: .5vw">${tableNumber}</p>
            </div>
            <div class="mt-4" style="display: flex; flex-direction: row;">
                <p class="bold mt-3" style="font-family: 'Alfa Slab One', serif; font-weight: 400; font-size: 3vw; color: #ef4545;">Fecha: </p>
                <p class="bold mt-2" style="font-family: 'Alfa Slab One', serif; font-weight: 400; font-size: 2vw; color: white; padding: .5vw">${new Date(date).toLocaleString()}</p>
            </div>
        `;

        // Crear listado de productos
        const productListDiv = document.createElement('div');
        // Asignamos un estilo
        productListDiv.style = "margin-top: 10px;";
        // Creamos un array de productos
        const productArray = Object.values(products);
        // Para cada producto asignamos info
        productArray.forEach((product) => {
            const productItem = document.createElement('p');
            productItem.textContent = `${product.title} - $${product.price} x ${product.quantity}`;
            productItem.style = "color: white; font-family: 'Alfa Slab One', serif; font-size: 1.5vw;";
            productListDiv.appendChild(productItem);
        });

        // Metemos la lista de productsos
        mesaInfoDiv.appendChild(productListDiv);

        // Mostrar total de la orden
        const totalDiv = document.createElement('p');
        totalDiv.textContent = `Total: $${this.calculateTotal(products)}`;
        totalDiv.style = "color: white; font-family: 'Alfa Slab One', serif; font-size: 2vw; margin-top: 10px;";
        mesaInfoDiv.appendChild(totalDiv);

        // Metemos el total de la mesa
        mesaDiv.appendChild(mesaInfoDiv);

        // Estado completado (para el historial)
        const mesaStateDiv = document.createElement('div');
        mesaStateDiv.style = "display: flex; flex-direction: column; width: 30%;";
        mesaStateDiv.innerHTML = `
            <p style="font-family: 'Alfa Slab One', serif; line-height: 15px; font-weight: 400; text-align: center; font-size: 2vw; color: white;">Estado de mesa</p>
            <div style="display: flex; flex-direction: row; width: auto; height: 70%;">
                <div class="pt-3" style="line-height: 100%; text-align: center; font-family: 'Alfa Slab One', serif; font-weight: 400; font-size: 1.5vw; color: white; background-color: rgba(255, 67, 67, 0.329); width: 100%; height: 30%;">
                    Completada
                </div>
            </div>
        `;
        mesaDiv.appendChild(mesaStateDiv);

        return mesaDiv;
    }

    calculateTotal(products) {
        // Calcula el precio total de la orden a partir de un array de productos
        if (typeof products !== 'object' || products === null) { // Maneja errores
            console.warn('Products no es un objeto:', products);
            return "0.00";
        }
    
        // Hace un array de productos
        const productArray = Object.values(products);
        // Creamos un total que es la suma de todos los precios
        const total = productArray.reduce((total, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseInt(product.quantity) || 0;
            return total + (price * quantity);
        }, 0);
        
        return total.toFixed(2); // Muestra solo 2 decimales para evitar fallos en la precisión de punto flotante
    }

    createProductSummary(products) {
        // Crea el resumen de cada producto
        return Object.values(products)
            .map(product => `${product.title} (${product.quantity})`)
            .join(', ');
    }

    showEmptyState() {
        // Cuando no hay órdenes en historial
        this.contenedorHistorial.innerHTML = `
            <div style="text-align: center; padding: 20px; color: white;">
                <p style="font-family: 'Alfa Slab One', serif; font-size: 2vw;">
                    No hay órdenes en el historial
                </p>
            </div>
        `;
    }

    // Muestra mensaje de error
    showError(message) {
        this.contenedorHistorial.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #ef4545;">
                <p style="font-family: 'Alfa Slab One', serif; font-size: 2vw;">
                    ${message}
                </p>
            </div>
        `;
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HistorialController();
});