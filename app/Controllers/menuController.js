// Clase para manejar el estado y la lógica de la página del menú
class MenuController {
    constructor() {
        this.products = new Map(); // Almacena las cantidades por producto
        this.initializeProducts();
        this.setupEventListeners();
    }

    initializeProducts() {
        // Inicializar todos los productos con cantidad 0
        document.querySelectorAll('.ProductContainer').forEach((container, index) => {
            const productId = `product-${index}`;
            container.setAttribute('data-product-id', productId);
            this.products.set(productId, 0);
        });
    }

    setupEventListeners() {
        // Configurar los event listeners para los botones de cada producto
        document.querySelectorAll('.ProductContainer').forEach(container => {
            const productId = container.getAttribute('data-product-id');
            
            // Botón de añadir al carrito
            const addToCartBtn = container.querySelector('.addToCart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => this.addToCart(productId));
            }

            // Botones de incremento/decremento
            const incrementBtn = container.querySelector('.QuantityAdd');
            const decrementBtn = container.querySelector('.QuantitySub');
            const quantityInput = container.querySelector('.QuantityInput');

            if (incrementBtn) {
                incrementBtn.addEventListener('click', () => this.updateQuantity(productId, 1, quantityInput));
            }
            if (decrementBtn) {
                decrementBtn.addEventListener('click', () => this.updateQuantity(productId, -1, quantityInput));
            }
            if (quantityInput) {
                quantityInput.addEventListener('change', (e) => this.setQuantity(productId, e.target.value));
            }
        });
    }

    updateQuantity(productId, change, inputElement) {
        let currentQuantity = this.products.get(productId) || 0;
        let newQuantity = Math.max(0, currentQuantity + change);
        this.products.set(productId, newQuantity);
        
        if (inputElement) {
            inputElement.value = newQuantity;
        }
    }

    setQuantity(productId, value) {
        const quantity = Math.max(0, parseInt(value) || 0);
        this.products.set(productId, quantity);
    }

    addToCart(productId) {
        const quantity = this.products.get(productId);
        if (quantity > 0) {
            // Lógica para añadir al carrito
            console.log(`Añadiendo ${quantity} unidades del producto ${productId} al carrito`);
            // Resetear la cantidad después de añadir al carrito
            this.products.set(productId, 0);
            const container = document.querySelector(`[data-product-id="${productId}"]`);
            const quantityInput = container.querySelector('.QuantityInput');
            if (quantityInput) {
                quantityInput.value = "0";
            }
        }
    }
}

// Inicializar el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuController = new MenuController();
});