class OrderView {
    constructor() {
        this.cart = JSON.parse(sessionStorage.getItem('orderCart')) || {};
        this.init();
    }

    init() {
        this.displayOrders();
        this.updateTotal();
    }

    displayOrders() {
        const container = document.querySelector('.contenedorProductos');
        if (!container) return;

        container.innerHTML = '';

        if (Object.keys(this.cart).length === 0) {
            container.innerHTML = `
                <div style="text-align: center; width: 100%; padding: 20px; color: white; font-size: 1.2em;">
                    No hay productos en la orden actual
                </div>`;
            return;
        }
        
        for (const [productId, product] of Object.entries(this.cart)) {
            const productElement = this.createOrderElement(productId, product);
            container.appendChild(productElement);
        }
    }

    createOrderElement(productId, product) {
        const productContainer = document.createElement('div');
        productContainer.className = 'ProductContainer';
        productContainer.setAttribute('data-product-id', productId);

        const subtotal = product.price * product.quantity;

        productContainer.innerHTML = `
            <div class="ProductImgContainer">
                <img src="${product.url}" alt="${product.title}" class="ProductImg">
            </div>
            <div class="ProductName">${product.title}</div>
            <div class="ProductDescription">
                Cantidad: 
                <input 
                    type="number" 
                    class="updateQuantity" 
                    min="1" 
                    value="${product.quantity}" 
                    style="width: 50px; text-align: center; margin: 5px;">
                <br>
                Precio unitario: $${product.price.toFixed(2)}<br>
                Subtotal: <span class="productSubtotal">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="ProductButtonsDiv">
                <button class="removeFromCart" style="background-color: #ef4545;">×</button>
            </div>`;

        // Evento para eliminar producto
        const removeButton = productContainer.querySelector('.removeFromCart');
        removeButton.addEventListener('click', () => {
            delete this.cart[productId];
            sessionStorage.setItem('orderCart', JSON.stringify(this.cart));
            this.displayOrders();
            this.updateTotal();
        });

        // Evento para actualizar la cantidad
        const quantityInput = productContainer.querySelector('.updateQuantity');
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            if (newQuantity < 1 || isNaN(newQuantity)) {
                e.target.value = product.quantity; // Revertir si el valor es inválido
                alert('La cantidad debe ser mayor o igual a 1');
                return;
            }
            this.updateQuantity(productId, newQuantity);
        });

        return productContainer;
    }

    updateQuantity(productId, newQuantity) {
        // Actualizar la cantidad en el carrito
        this.cart[productId].quantity = newQuantity;
        sessionStorage.setItem('orderCart', JSON.stringify(this.cart));

        // Actualizar el subtotal en el DOM
        const productContainer = document.querySelector(`.ProductContainer[data-product-id="${productId}"]`);
        const productSubtotalElement = productContainer.querySelector('.productSubtotal');
        const newSubtotal = this.cart[productId].price * newQuantity;
        productSubtotalElement.textContent = `$${newSubtotal.toFixed(2)}`;

        // Actualizar el total general
        this.updateTotal();
    }

    updateTotal() {
        const totalElement = document.getElementById('orderTotal');
        if (!totalElement) return;
    
        const total = Object.values(this.cart).reduce((sum, product) => {
            return sum + (product.price * product.quantity);
        }, 0);
    
        totalElement.innerHTML = `
            <div style="font-size: 1.3em;">
                <span style="color: white;">Total de la orden: </span>
                <span style="color: #ef4545; font-weight: bold;">$${total.toFixed(2)}</span>
            </div>
            <button id="placeOrderBtn" style="background-color: #28a745; color: white; font-weight: bold; padding: 10px; border: none; cursor: pointer; margin-top: 10px;">
                Pedir
            </button>
        `;

        const placeOrderBtn = document.getElementById('placeOrderBtn');
        placeOrderBtn.addEventListener('click', () => this.placeOrder());
    }

    async placeOrder() {
        if (Object.keys(this.cart).length === 0) {
            alert('El carrito está vacío. No puedes realizar una orden.');
            return;
        }
    
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: this.cart,
                    date: new Date().toISOString(),
                }),
            });
    
            if (!response.ok) {
                throw new Error('Error al enviar la orden');
            }
    
            const result = await response.json();
            alert('Orden enviada exitosamente. ID de orden: ' + result.orderId);
    
            // Limpiar el carrito después de enviar la orden
            sessionStorage.removeItem('orderCart');
            this.cart = {};
            this.displayOrders();
            this.updateTotal();
        } catch (error) {
            console.error('Error al enviar la orden:', error);
            alert('Hubo un problema al enviar la orden. Inténtalo de nuevo.');
        }
    }
}

// Inicializar OrderView cuando estemos en la página de orden
document.addEventListener('DOMContentLoaded', () => {
    new OrderView();

    // Agregar comportamiento al botón de "Enviar Orden"
    const enviarOrdenBtn = document.querySelector('a[href="meseros"]');
    if (enviarOrdenBtn) {
        enviarOrdenBtn.addEventListener('click', (e) => {
            const cart = JSON.parse(sessionStorage.getItem('orderCart') || '{}');
            if (Object.keys(cart).length === 0) {
                e.preventDefault();
                alert('No hay productos en la orden actual');
            } else if (confirm('¿Deseas finalizar y enviar esta orden?')) {
                sessionStorage.removeItem('orderCart'); // Limpiar el carrito
            } else {
                e.preventDefault();
            }
        });
    }
});