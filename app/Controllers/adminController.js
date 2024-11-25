class AdminController {
    constructor() {
        this.productsEndpoint = '/api/products';
        this.productList = document.getElementById('productList');
        this.productForm = document.getElementById('productForm');
        this.newProductBtn = document.getElementById('newProductBtn');
        this.productModal = new bootstrap.Modal(document.getElementById('productModal'));
        this.modalTitle = document.getElementById('modalTitle');
        this.currentEditingId = null;
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.newProductBtn.addEventListener('click', () => {
            this.currentEditingId = null;
            this.modalTitle.textContent = 'Nuevo Producto';
            this.productForm.reset();
            this.productModal.show();
        });

        this.productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const productData = {
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                url: document.getElementById('url').value,
                description: document.getElementById('description').value,
                price: parseFloat(document.getElementById('price').value),
                stock: parseInt(document.getElementById('stock').value)
            };

            try {
                if (this.currentEditingId) {
                    await this.updateProduct(this.currentEditingId, productData);
                } else {
                    await this.createProduct(productData);
                }
                this.productModal.hide();
            } catch (error) {
                console.error('Error:', error);
                alert('Error al guardar el producto');
            }
        });
    }

    async loadProducts() {
        try {
            const response = await fetch(this.productsEndpoint);
            if (!response.ok) throw new Error('Error al cargar productos');
            const products = await response.json();
            this.displayProducts(products);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar productos');
        }
    }

    displayProducts(products) {
        this.productList.innerHTML = '';
        products.forEach(product => {
            const productElement = this.createProductElement(product);
            this.productList.appendChild(productElement);
        });
    }

    createProductElement(product) {
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

        productContainer.querySelector('.editProduct').addEventListener('click', () => {
            this.editProduct(product);
        });

        productContainer.querySelector('.deleteProduct').addEventListener('click', () => {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                this.deleteProduct(product._id);
            }
        });

        return productContainer;
    }

    editProduct(product) {
        this.currentEditingId = product._id;
        this.modalTitle.textContent = 'Editar Producto';
        
        document.getElementById('title').value = product.title;
        document.getElementById('category').value = product.category;
        document.getElementById('url').value = product.url;
        document.getElementById('description').value = product.description;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;

        this.productModal.show();
    }

    async createProduct(productData) {
        try {
            const response = await fetch(this.productsEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) throw new Error('Error al crear producto');
            
            this.productForm.reset();
            this.loadProducts();
            alert('Producto creado exitosamente');
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            const response = await fetch(`${this.productsEndpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) throw new Error('Error al actualizar producto');
            
            this.productForm.reset();
            this.currentEditingId = null;
            this.loadProducts();
            alert('Producto actualizado exitosamente');
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.productsEndpoint}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar producto');
            
            this.loadProducts();
            alert('Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el producto');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminController();
});