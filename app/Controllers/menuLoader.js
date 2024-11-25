// Mete los productos desde MongoDB a la página de menú

class MenuLoader {
    constructor() {
        // Endpoint para obtener los productos desde la API
        this.productsEndpoint = '/api/products';

        // Mapea las secciones del menú por categoría
        this.categorySections = new Map();

        // Carga el carrito actual
        this.cart = this.loadCart();

        // Inicia el mapeo de secciones del menú
        this.initializeCategorySections();
    }

    loadCart() {
        // Retorna el contenido del carrito
        return JSON.parse(sessionStorage.getItem('orderCart')) || {}; 
    }

    saveCart() {
        // Guarda el estado actual del carrito
        sessionStorage.setItem('orderCart', JSON.stringify(this.cart));
    }

    initializeCategorySections() {
        // Seleccionar todas las secciones del menú que tengan 'role="region"'
        const sections = document.querySelectorAll('[role="region"]');

        // Recorrer cada sección para asignar su ID como categoría y su contenedor para que todo esté donde debe estar
        sections.forEach(section => {
            const category = section.id; // El ID de la sección representa la categoría
            const productsContainer = section.querySelector('.contenedorProductos'); // Contenedor donde se agregarán los productos, ver HTML

            // Si existe un contenedor para los productos, lo añadimos al mapeo
            if (productsContainer) {
                this.categorySections.set(category, productsContainer);
            }
        });
    }

    // Método para cargar los productos desde el servidor
    async loadProducts() {
        try {
            // Hacer una solicitud fetch al endpoint configurado
            const response = await fetch(this.productsEndpoint);

            // Validar si la respuesta es válida (status 200 OK)
            if (!response.ok) {
                // Si no es válida, lanzar un error con el código de estado
                throw new Error(`Error de HTTP! status: ${response.status}`);
            }

            // Convertir la respuesta en un JSON
            const products = await response.json();

            // Llamar al método para mostrar los productos en el menú
            this.displayProducts(products);
        } catch (error) {
            // Capturar errores y mostrarlos en la consola
            console.error('Error cargando los productos:', error);
        }
    }

    // Método para mostrar los productos en sus categorías correspondientes del HTML
    displayProducts(products) {
        // Limpiar el contenido de cada contenedor de categoría antes de insertar los nuevos productos para evitar duplicados
        this.categorySections.forEach(container => {
            container.innerHTML = '';
        });

        // Agrupar los productos por categoría utilizando reduce
        const productsByCategory = products.reduce((acc, product) => {
            // Si la categoría aún no existe en el acumulador, inicializarla como un array vacío
            if (!acc[product.category]) {
                acc[product.category] = [];
            }

            // Añadir el producto al array al que corresponde
            acc[product.category].push(product);

            return acc; // Retornar el acumulador actualizado
        }, {});

        // Iterar sobre las categorías y sus productos agrupados
        for (const [category, categoryProducts] of Object.entries(productsByCategory)) {
            // Obtener el contenedor HTML correspondiente a la categoría
            const container = this.categorySections.get(category);

            // Si existe un contenedor para la categoría, agregar los productos (para eso lo creamos más arriba)
            if (container) { // Si el contenedor existe
                categoryProducts.forEach(product => { // Para cada producto
                    // Crear el elemento HTML del producto y añadirlo al contenedor
                    container.appendChild(this.createProductElement(product));
                });
            }
        }
    }

    // Método para crear un elemento HTML representando un producto
    createProductElement(product) {
        // Crear un contenedor div para el producto
        const productContainer = document.createElement('div');
        productContainer.className = 'ProductContainer'; // Clase que contiene los productos de cada categoría
        productContainer.setAttribute('data-product-id', product._productUuid); // Atributo único para identificar cada producto

        // Insertar el contenido HTML del producto, esta es la síntaxis que siguen todos los productos
        productContainer.innerHTML = `
            <div class="ProductImgContainer">
                <img src="${product.url}" alt="${product.title}" class="ProductImg">
            </div>
            <div class="ProductName">${product.title}</div>
            <div class="ProductDescription">${product.description}</div>
            <div class="ProductPrice">$${product.price.toFixed(2)}</div>
            <div class="ProductButtonsDiv">
                <button class="addToCart">+</button>
                <div class="InputQuantityContainer">
                    <input type="number" class="QuantityInput" value="0" min="0" max="${product.stock}">
                    <div class="QuantityControls">
                        <button class="QuantityAdd">+</button>
                        <button class="QuantitySub">-</button>
                    </div>
                </div>
            </div>`;

        // Event listeners para los botones de los productos
        const quantityInput = productContainer.querySelector('.QuantityInput');
        const addButton = productContainer.querySelector('.QuantityAdd');
        const subButton = productContainer.querySelector('.QuantitySub');
        const addToCartButton = productContainer.querySelector('.addToCart');

        // Cuando se aumente la cantidad a agregar de un producto
        addButton.addEventListener('click', () => {
            if (quantityInput.value < product.stock) { // Mientras el valor sea menor o igual al stock
                quantityInput.value = parseInt(quantityInput.value) + 1; // Aumentar el valor
            }
        });

        // Cuando se reduzca la cantidad a agregar de un producto
        subButton.addEventListener('click', () => {
            if (quantityInput.value > 0) { // Solo si el valor es mayor a 0
                quantityInput.value = parseInt(quantityInput.value) - 1; // Restar al valor
            }
        });

        // Cuando se presione el botón de añadir
        addToCartButton.addEventListener('click', () => {
            // Obtenemos la cantidad actual del input
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                // Verificar si el producto ya existe en el carrito
                if (this.cart[product._productUuid]) { // Si ya existe...
                    // Sumar la nueva cantidad a la existente
                    const newQuantity = this.cart[product._productUuid].quantity + quantity;
                    // Verificar que no exceda el stock actual
                    if (newQuantity <= product.stock) {
                        this.cart[product._productUuid].quantity = newQuantity;
                        this.saveCart();
                        quantityInput.value = 0;
                        alert(`Producto actualizado en la orden. Cantidad total: ${newQuantity}`);
                    } else {
                        alert(`No hay suficiente stock. Stock disponible: ${product.stock}`);
                    }
                } else {
                    // Si el producto no existe en carrito, crearlo normalmente
                    this.cart[product._productUuid] = {
                        title: product.title,
                        price: product.price,
                        quantity: quantity,
                        url: product.url,
                        description: product.description
                    };
                    this.saveCart();
                    quantityInput.value = 0;
                    alert('Producto agregado a la orden');
                }
            }
        });

        // Retornar el elemento del producto para añadirlo al DOM
        return productContainer;
    }
}

// 'Escuchar' el evento DOMContentLoaded para asegurarse de que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear una instancia de MenuLoader e iniciar la carga de productos
    const menuLoader = new MenuLoader();
    menuLoader.loadProducts();
});
