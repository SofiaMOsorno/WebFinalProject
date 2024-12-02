// ordersController.js

// Función para cargar las órdenes desde la API y mostrarlas en el contenedor
function loadOrdersInContainer() {
    fetch('http://localhost:3000/api/orders') // Cambiar la URL si es necesario
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .then((orders) => {
            const contenedorHistorial = document.getElementById('ApartadoMesas');
            contenedorHistorial.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas mesas

            orders.forEach((order) => {
                const mesaElement = createMesaElement(order);
                contenedorHistorial.appendChild(mesaElement);
            });
        })
        .catch((error) => {
            console.error('Error al obtener las órdenes:', error);
            alert('No se pudieron cargar las órdenes.');
        });
}

// Función para calcular el total de la orden
function calculateTotal(products) {
    if (typeof products !== 'object' || products === null) {
        console.warn('Products no es un objeto:', products);
        return 0;
    }

    // Convertir el objeto de productos a un arreglo
    const productArray = Object.values(products);

    return productArray.reduce((total, product) => {
        const price = product.price || 0;
        const quantity = product.quantity || 0;
        return total + price * quantity;
    }, 0).toFixed(2);
}

// Función para crear un elemento HTML de mesa basado en una orden
function createMesaElement(order) {
    if (!order || typeof order !== 'object') {
        console.error('Orden inválida:', order);
        return document.createTextNode('Error al cargar esta orden.');
    }

    const { tableNumber, date, products } = order;

    // Crear contenedor para la mesa
    const mesaDiv = document.createElement('div');
    mesaDiv.id = `mesa-${tableNumber}`; // Asignar ID único basado en el número de mesa
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
    totalDiv.textContent = `Total: $${calculateTotal(products)}`;
    totalDiv.style = "color: white; font-family: 'Alfa Slab One', serif; font-size: 2vw; margin-top: 10px;";
    mesaInfoDiv.appendChild(totalDiv);

    // Botón de cerrar pedido
    const closeButton = document.createElement('button');
    closeButton.textContent = "Cerrar Pedido";
    closeButton.style = "margin-top: 10px; background-color: #ef4545; color: white; font-family: 'Alfa Slab One', serif; font-size: 1.5vw; padding: 10px; border-radius: 5px; border: none;";
    closeButton.addEventListener('click', () => closeOrder(order)); // Llama a la función para cerrar pedido
    mesaInfoDiv.appendChild(closeButton);

    mesaDiv.appendChild(mesaInfoDiv);

    // Estado de la mesa (mismo código de antes)
    const mesaStateDiv = document.createElement('div');
    mesaStateDiv.style = "display: flex; flex-direction: column; width: 30%;";
    mesaStateDiv.innerHTML = `
        <p style="font-family: 'Alfa Slab One', serif; line-height: 15px; font-weight: 400; text-align: center; font-size: 2vw; color: white;">Estado de mesa</p>
        <div style="display: flex; flex-direction: row; width: auto; height: 70%;">
            <div id="StateController" class="pt-3" style="line-height: 100%; text-align: center; font-family: 'Alfa Slab One', serif; font-weight: 400; font-size: 1.5vw; color: white; background-color: rgba(143, 255, 92, 0.37); width: 100%; height: 30%;">
                En<br>Proceso
            </div>
        </div>
    `;
    mesaDiv.appendChild(mesaStateDiv);

    return mesaDiv;
}

async function closeOrder(order) {
    try {
        // Primero, cerramos la orden en el historial
        const responseHistorial = await fetch('/api/historial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });

        if (!responseHistorial.ok) {
            const error = await responseHistorial.text();
            throw new Error(`Error al guardar en el historial: ${error}`);
        }
        
        const tableElement = document.getElementById(`mesa-${order.tableNumber}`);
        if (tableElement) {
            tableElement.remove();
        } else {
            console.warn(`El contenedor de la mesa ${order.tableNumber} no se encuentra en el DOM.`);
        }
        // Luego, eliminamos la orden de la base de datos de órdenes usando el número de mesa
        const responseOrden = await fetch(`/api/orders/${order.tableNumber}`, {
            method: 'DELETE',
        });

        if (!responseOrden.ok) {
            const error = await responseOrden.text();
            throw new Error(`Error al eliminar la orden: ${error}`);
        }

        alert('¡Pedido cerrado con éxito y orden eliminada!');

        // Verificamos si el contenedor de la orden existe antes de intentar eliminarlo

    } catch (error) {
        console.error('Error al cerrar pedido:', error);
        alert('Hubo un problema al cerrar el pedido. Intenta nuevamente.');
    }
}
// Evento para cargar las órdenes al iniciar la página
document.addEventListener('DOMContentLoaded', loadOrdersInContainer);