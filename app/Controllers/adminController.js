class AdminController {
    constructor() {
        // Endpoint de productos
        this.productsEndpoint = '/api/products';

        // Obtener lista de productos
        this.productList = document.getElementById('productList');

        // Obtener campo de productos
        this.productForm = document.getElementById('productForm');

        // Obtiene el boton de nuevo producto
        this.newProductBtn = document.getElementById('newProductBtn');

        // Obtiene el modal de producto
        this.productModal = new bootstrap.Modal(document.getElementById('productModal'));

        // Obtiene el título del modal
        this.modalTitle = document.getElementById('modalTitle');

        // Asigna el ID actual de edición a nulo
        this.currentEditingId = null;
        
        // Inicializa todo
        this.init();
    }

    init() {
        // Carga los productos
        this.loadProducts();

        // Alista los eventListeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.newProductBtn.addEventListener('click', () => {
            this.currentEditingId = null;
            this.modalTitle.textContent = 'Nuevo Producto'; // Titulo del modal cuando se crea un nuevo producto
            this.productForm.reset();
            this.productModal.show();
        });

        // EventListener de submit
        this.productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Asigna todos los datos
            const productData = {
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                url: document.getElementById('url').value,
                description: document.getElementById('description').value,
                price: parseFloat(document.getElementById('price').value),
                stock: parseInt(document.getElementById('stock').value)
            };

            try { // try/catch para manejar errores
                if (this.currentEditingId) {
                    await this.updateProduct(this.currentEditingId, productData);
                } else {
                    await this.createProduct(productData);
                }
                this.productModal.hide();
            } catch (error) { // En caso de haber error
                console.error('Error:', error);
                alert('Error al guardar el producto');
            }
        });
    }

    async loadProducts() { // Carga todos los productos
        try {
            const response = await fetch(this.productsEndpoint);
            if (!response.ok) throw new Error('Error al cargar productos');
            const products = await response.json();
            this.displayProducts(products); // Llama a la función que dibuja todos los productos en el HTML
        } catch (error) { // Si hay algún error
            console.error('Error:', error);
            alert('Error al cargar productos');
        }
    }

    displayProducts(products) { // Mostrar los productos en pantalla
        this.productList.innerHTML = ''; // Limpiar el contenedor para evitar duplicados
        products.forEach(product => { // Para cada producto crear un HTML e inyectarlo a la página
            const productElement = this.createProductElement(product);
            this.productList.appendChild(productElement);
        });
    }

    createProductElement(product) { // Crea la plantilla HTML de cada producto
        const productContainer = document.createElement('div');
        productContainer.className = 'ProductContainer';
        productContainer.innerHTML = `
            <div class="ProductImgContainer">
                <img src="${product.url}" alt="${product.title}" class="ProductImg">
            </div>
            <div class="ProductName">${product.title}</div>
            <div class="ProductDescription">${product.description}</div>
            <div class="ProductPrice">$${product.price.toFixed(2)}</div>
            <div class="ProductButtonsDiv">
                <button class="editProduct" style="background-color: var(--BrandGris);">✎</button>
                <button class="deleteProduct" style="background-color: #ef4545;">×</button>
            </div>
        `;

        // Cuando se edita un producto
        productContainer.querySelector('.editProduct').addEventListener('click', () => {
            this.editProduct(product); // Llama a la función de editar
        });

        // Cuando se quiere eliminar un producto de la base de datos
        productContainer.querySelector('.deleteProduct').addEventListener('click', () => {
            // Pide verificación
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                this.deleteProduct(product._id); // Borra el producto
            }
        });

        return productContainer;
    }

    // Editar un producto de la base de datos
    editProduct(product) {
        this.currentEditingId = product._id;
        this.modalTitle.textContent = 'Editar Producto';
        
        document.getElementById('title').value = product.title;
        document.getElementById('category').value = product.category;
        document.getElementById('url').value = product.url;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;

        this.productModal.show(); // Mostrar el modal con la información encontrada
    }

    // Crear un producto nuevo
    async createProduct(productData) {
        try {
            // Trata de crear un producto y hacerlo un JSON
            const response = await fetch(this.productsEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            // Si hay algún error
            if (!response.ok) throw new Error('Error al crear producto');
            
            // Limpiar el modal
            this.productForm.reset();

            // Cargar los productos de nuevo
            this.loadProducts();
            alert('Producto creado exitosamente');
        } catch (error) {
            throw error; // Lanzar error
        }
    }

    // Actualizar producto de la base de datos después de editarlo
    async updateProduct(id, productData) {
        try {
            // Convierte la nueva info a JSON
            const response = await fetch(`${this.productsEndpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            // Si hay error
            if (!response.ok) throw new Error('Error al actualizar producto');
            
            // Limpia el modal
            this.productForm.reset();

            // Cambia el id de edición a nulo
            this.currentEditingId = null;

            // Vuelve a cargar los productos
            this.loadProducts();

            // Lanza mensaje de confirmación
            alert('Producto actualizado exitosamente');
        } catch (error) {
            throw error;
        }
    }

    // Borrar un archivo de la base de datos
    async deleteProduct(id) {
        try {
            // Manda a borrar el producto con el id indicado
            const response = await fetch(`${this.productsEndpoint}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar producto');
            
            this.loadProducts();
            alert('Producto eliminado exitosamente');
        } catch (error) {
            // Lanza error si algo salió mal
            console.error('Error:', error);
            alert('Error al eliminar el producto');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminController();
});