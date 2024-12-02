class HistorialController {
    constructor() {
        this.historialEndpoint = '/api/historial';
        this.contenedorHistorial = document.querySelector('.contenedorHistorial');
        this.currentPage = 1; // Página actual para la paginación
        this.pageLimit = 10; // Límite de órdenes por página
        this.init();
    }

    async init() {
        // Carga inicial del historial y agrega los controles de paginación
        await this.loadHistorial(this.currentPage, this.pageLimit);
        this.addPaginationControls();
    }

    async loadHistorial(page = 1, limit = 10) {
        try {
            const response = await fetch(`${this.historialEndpoint}?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`Error de HTTP! Estatus: ${response.status}`);
            }
            const historial = await response.json();
            this.displayHistorial(historial);
        } catch (error) {
            console.error('Error cargando el historial:', error);
            this.showError('Error al cargar el historial');
        }
    }

    displayHistorial(historial) {
        // Limpia el contenedor y muestra el historial
        this.contenedorHistorial.innerHTML = '';

        if (!historial || historial.length === 0) {
            this.showEmptyState();
            return;
        }

        historial.forEach(orden => {
            const mesaElement = this.createMesaElement(orden);
            this.contenedorHistorial.appendChild(mesaElement);
        });
    }

    createMesaElement(orden) {
        const { tableNumber, date, products } = orden;

        const mesaDiv = document.createElement('div');
        mesaDiv.classList.add('Mesa');
        mesaDiv.id = `mesa-${tableNumber}`; // ID único para cada mesa
        mesaDiv.style = "display: flex; flex-direction: row; background-color: rgba(255, 255, 255, 0.226); border-radius: 10px; padding: 2%; width: 100%; margin: 3%;";

        const mesaInfoDiv = document.createElement('div');
        mesaInfoDiv.style = "display: flex; flex-direction: column; width: 70%;";
        mesaInfoDiv.innerHTML = `
            <div style="display: flex; flex-direction: row;">
                <p style="font-family: 'Alfa Slab One', serif; font-size: 5vw; color: white;">Mesa: </p>
                <p style="font-family: 'Alfa Slab One', serif; font-size: 3vw; color: white; padding: 0.5vw;">${tableNumber}</p>
            </div>
            <div style="display: flex; flex-direction: row;">
                <p style="font-family: 'Alfa Slab One', serif; font-size: 3vw; color: #ef4545;">Fecha: </p>
                <p style="font-family: 'Alfa Slab One', serif; font-size: 2vw; color: white; padding: 0.5vw;">${new Date(date).toLocaleString()}</p>
            </div>
        `;

        const productListDiv = document.createElement('div');
        productListDiv.style = "margin-top: 10px;";
        Object.values(products).forEach(product => {
            const productItem = document.createElement('p');
            productItem.textContent = `${product.title} - $${product.price} x ${product.quantity}`;
            productItem.style = "color: white; font-family: 'Alfa Slab One', serif; font-size: 1.5vw;";
            productListDiv.appendChild(productItem);
        });

        mesaInfoDiv.appendChild(productListDiv);

        const totalDiv = document.createElement('p');
        totalDiv.textContent = `Total: $${this.calculateTotal(products)}`;
        totalDiv.style = "color: white; font-family: 'Alfa Slab One', serif; font-size: 2vw; margin-top: 10px;";
        mesaInfoDiv.appendChild(totalDiv);

        mesaDiv.appendChild(mesaInfoDiv);

        const mesaStateDiv = document.createElement('div');
        mesaStateDiv.style = "display: flex; flex-direction: column; width: 30%;";
        mesaStateDiv.innerHTML = `
            <p style="font-family: 'Alfa Slab One', serif; text-align: center; font-size: 2vw; color: white;">Estado de mesa</p>
            <div style="background-color: rgba(255, 67, 67, 0.329); color: white; text-align: center; font-family: 'Alfa Slab One', serif; font-size: 1.5vw; padding: 10px;">
                Completada
            </div>
        `;
        mesaDiv.appendChild(mesaStateDiv);

        return mesaDiv;
    }

    calculateTotal(products) {
        return Object.values(products).reduce((total, product) => {
            return total + (parseFloat(product.price) * parseInt(product.quantity));
        }, 0).toFixed(2);
    }

    showEmptyState() {
        this.contenedorHistorial.innerHTML = `
            <div style="text-align: center; padding: 20px; color: white;">
                <p style="font-family: 'Alfa Slab One', serif; font-size: 2vw;">No hay órdenes en el historial</p>
            </div>
        `;
    }

    showError(message) {
        this.contenedorHistorial.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #ef4545;">
                <p style="font-family: 'Alfa Slab One', serif; font-size: 2vw;">${message}</p>
            </div>
        `;
    }

    
}

document.addEventListener('DOMContentLoaded', () => {
    new HistorialController();
});