// Maneja el aspecto de la página de orden

class OrderView {
    constructor() {
        this.cart = JSON.parse(sessionStorage.getItem('orderCart')) || {}; // Obtiene el contenido del carrito del SessionStorage
        this.init(); // Inicializa el carrito mostrando ordenes y total
    }

    init() {
        this.displayOrders(); // Muestra las ordenes en pantalla con una funcion
        this.updateTotal(); // Actualiza el total
    }

    displayOrders() {
        const container = document.querySelector('.contenedorProductos'); // Busca el contenedor de productos
        if (!container) return; // Si el contenedor no existe regresamos

        container.innerHTML = ''; // Limpiamos el contenedor para evitar duplicados

        if (Object.keys(this.cart).length === 0) { // Si el carrito está vacío mostrar mensaje
            container.innerHTML = `
                <div style="text-align: center; width: 100%; padding: 20px; color: white; font-size: 1.2em;">
                    No hay productos en la orden actual
                </div>`;
            return;
        }
        
        for (const [productId, product] of Object.entries(this.cart)) { // Si no está vacío, metemos cada producto en carrito
            const productElement = this.createOrderElement(productId, product);
            container.appendChild(productElement); // Lo metemos al contenedor
        }
    }

    createOrderElement(productId, product) {
        const productContainer = document.createElement('div'); // Crea un div donde meteremos los productos
        productContainer.className = 'ProductContainer'; // Le pone nombre
        productContainer.setAttribute('data-product-id', productId); // Le da un atributo

        const subtotal = product.price * product.quantity;

        // Declara la sintaxis de cada producto
        productContainer.innerHTML = `
            <div class="ProductImgContainer">
                <img src="${product.url}" alt="${product.title}" class="ProductImg">
            </div>
            <div class="ProductName">${product.title}</div>
            <div class="ProductDescription">
                Cantidad: ${product.quantity}<br>
                Precio unitario: $${product.price.toFixed(2)}<br>
                Subtotal: $${(product.price * product.quantity).toFixed(2)}
            </div>
            <div class="ProductButtonsDiv">
                <button class="removeFromCart" style="background-color: #ef4545;">×</button>
            </div>`;

        // Agregar boton para eliminar producto
        const removeButton = productContainer.querySelector('.removeFromCart');
        
        // Lo ata al eventListener del click
        removeButton.addEventListener('click', () => {
            delete this.cart[productId];
            sessionStorage.setItem('orderCart', JSON.stringify(this.cart));
            this.displayOrders();
            this.updateTotal();
        });

        return productContainer;
    }

    updateTotal() {
        // Crea la variable del total de la orden
        const totalElement = document.getElementById('orderTotal');
        
        // Si es cero, regresamos
        if (!totalElement) return;

        // Hace calculo de precio * cantidad
        const total = Object.values(this.cart).reduce((sum, product) => {
            return sum + (product.price * product.quantity);
        }, 0);

        // Este es el HTML del total
        totalElement.innerHTML = `
            <div style="font-size: 1.3em;">
                <span style="color: white;">Total de la orden: </span>
                <span style="color: #ef4545; font-weight: bold;">$${total.toFixed(2)}</span>
            </div>`;
    }
}

// Inicializar OrderView cuando estemos en la página de orden
document.addEventListener('DOMContentLoaded', () => {
    new OrderView();

    // Agregar comportamiento al botón de "Enviar Orden"
    const enviarOrdenBtn = document.querySelector('a[href="meseros"]');
    if (enviarOrdenBtn) { // Boton de enviar orden
        enviarOrdenBtn.addEventListener('click', (e) => {
            const cart = JSON.parse(sessionStorage.getItem('orderCart') || '{}');
            if (Object.keys(cart).length === 0) { // Si no hay productos
                e.preventDefault();
                alert('No hay productos en la orden actual'); // Lanzar mensaje
            } else if (confirm('¿Deseas finalizar y enviar esta orden?')) { // Pide confirmación
                sessionStorage.removeItem('orderCart'); // Limpiar el carrito
            } else {
                e.preventDefault();
            }
        });
    }
});