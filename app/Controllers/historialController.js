// Controlador para manejar el historial de órdenes en /historial
class HistorialController {
    constructor() {
        this.historialEndpoint = '/api/historial';
        this.contenedorHistorial = document.querySelector('.contenedorHistorial');
        this.init();
    }

    async init() {
        await this.loadHistorial();
    }

    async loadHistorial() {
        try {
            const response = await fetch(this.historialEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const historial = await response.json();
            this.displayHistorial(historial);
        } catch (error) {
            console.error('Error cargando el historial:', error);
            this.showError('Error al cargar el historial');
        }
    }

    displayHistorial(historial) {
        if (!this.contenedorHistorial) {
            console.error('No se encontró el contenedor del historial');
            return;
        }

        this.contenedorHistorial.innerHTML = '';

        if (historial.length === 0) {
            this.showEmptyState();
            return;
        }

        historial.forEach(orden => {
            const mesaElement = this.createMesaElement(orden);
            this.contenedorHistorial.appendChild(mesaElement);
        });
    }

    createMesaElement(orden) {
        if (!orden || typeof orden !== 'object') {
            console.error('Orden inválida:', orden);
            return document.createTextNode('Error al cargar esta orden.');
        }

        const { tableNumber, date, products } = orden;

        // Crear contenedor para la mesa
        const mesaDiv = document.createElement('div');
        mesaDiv.classList.add('Mesa');
        mesaDiv.style = "display: flex; flex-direction: row; background-color:rgba(255, 255, 255, 0.226); border-radius: 10px; padding: 2%; width: 100%; margin: 3%";

        // Información de la mesa
        const mesaInfoDiv = document.createElement('div');
        mesaInfoDiv.style = "display: flex; flex-direction: column; width: 70%";
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
        productListDiv.style = "margin-top: 10px;";
        const productArray = Object.values(products);
        productArray.forEach((product) => {
            const productItem = document.createElement('p');
            productItem.textContent = `${product.title} - $${product.price} x ${product.quantity}`;
            productItem.style = "color: white; font-family: 'Alfa Slab One', serif; font-size: 1.5vw;";
            productListDiv.appendChild(productItem);
        });

        mesaInfoDiv.appendChild(productListDiv);

        // Total de la orden
        const totalDiv = document.createElement('p');
        totalDiv.textContent = `Total: $${this.calculateTotal(products)}`;
        totalDiv.style = "color: white; font-family: 'Alfa Slab One', serif; font-size: 2vw; margin-top: 10px;";
        mesaInfoDiv.appendChild(totalDiv);

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
        return Object.values(products).reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }

    createProductSummary(products) {
        return Object.values(products)
            .map(product => `${product.title} (${product.quantity})`)
            .join(', ');
    }

    showEmptyState() {
        this.contenedorHistorial.innerHTML = `
            <div style="text-align: center; padding: 20px; color: white;">
                <p style="font-family: 'Alfa Slab One', serif; font-size: 2vw;">
                    No hay órdenes en el historial
                </p>
            </div>
        `;
    }

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