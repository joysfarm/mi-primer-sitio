// Configuración de Supabase
// Para entornos estáticos, cargamos las credenciales directamente del .env
const supabaseUrl = 'https://wwmenejssrcqcwtbcecz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bWVuZWpzc3JjcWN3dGJjZWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDQ1MDczNCwiZXhwIjoyMTA2MDI2NzM0fQ.B_7caZtsxQfEUZOE0z6TA1wQCWUp7YFyr2SGBWYjysk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Elementos del DOM
const listaProductos = document.getElementById('lista-productos');
const formularioOrden = document.getElementById('formulario-orden');
const productoSeleccionado = document.getElementById('producto-seleccionado');
const listaResenas = document.getElementById('lista-resenas');
const cartCount = document.querySelector('.cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModal = document.querySelector('.close-modal');
const closeCart = document.querySelector('.close-cart');
const quickViewModal = document.getElementById('quick-view-modal');
const quickViewProduct = document.getElementById('quick-view-product');

// Estado del carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    await cargarResenas();
    actualizarContadorCarrito();
    
    // Eventos para el carrito y modales
    document.getElementById('cart-button').addEventListener('click', abrirCarrito);
    closeCart.addEventListener('click', cerrarCarrito);
    cartDrawer.addEventListener('click', function(e) {
        if (e.target === this) cerrarCarrito();
    });
    
    checkoutBtn.addEventListener('click', procederAlPago);
    
    // Eventos para el modal
    closeModal.addEventListener('click', function() {
        quickViewModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === quickViewModal) quickViewModal.style.display = 'none';
    });
    
    // Add event listeners to "Agregar al Carrito" buttons after loading products
    listaProductos.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            
            agregarAlCarrito({id, name, price});
        }
    });
    
    // Añadir evento para el formulario de orden
    formularioOrden.addEventListener('submit', manejarEnvioOrden);
});

// Función para cargar productos
async function cargarProductos() {
    try {
        console.log('Iniciando carga de productos...');
        
        const { data, error } = await supabase
            .from('productos')
            .select('*');
            
        if (error) {
            console.error('Error de Supabase:', error);
            throw error;
        }
        
        console.log('Datos recibidos:', data);
        console.log('Número de productos:', data ? data.length : 0);
        
        listaProductos.innerHTML = '';
        productoSeleccionado.innerHTML = '<option value="">Selecciona un producto</option>';
        
        // Añadir mensaje si no hay productos
        if (!data || data.length === 0) {
            console.log('No hay productos para mostrar');
            listaProductos.innerHTML = '<p class="no-products">No hay productos disponibles actualmente.</p>';
            return;
        }
        
        // Create all elements at once for better performance
        const fragment = document.createDocumentFragment();
        
        data.forEach(producto => {
            console.log('Procesando producto:', producto.nombre);
            
            // Mostrar productos en la sección de productos
            const productoCard = document.createElement('div');
            productoCard.className = 'producto-card';
            productoCard.innerHTML = `
                <img src="${producto.imagen_url || 'https://via.placeholder.com/300x200?text=Producto'}" alt="${producto.nombre}" class="producto-imagen">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-precio">$${parseFloat(producto.precio).toFixed(2)}</p>
                <p class="producto-descripcion">${producto.descripcion || 'Sin descripción disponible'}</p>
                <button class="add-to-cart-btn" data-id="${producto.id}" data-name="${producto.nombre}" data-price="${producto.precio}">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
                <button class="quick-view-btn" data-id="${producto.id}">
                    <i class="fas fa-eye"></i> Vista Rápida
                </button>
            `;
            
            fragment.appendChild(productoCard);
            
            // Agregar al selector de productos en el formulario
            const opcion = document.createElement('option');
            opcion.value = producto.id;
            opcion.textContent = `${producto.nombre} - $${parseFloat(producto.precio).toFixed(2)}`;
            productoSeleccionado.appendChild(opcion);
        });
        
        listaProductos.appendChild(fragment);
        console.log('Productos añadidos al DOM');
        
        // Add event listeners for quick view buttons after loading
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                mostrarVistaRapida(id);
            });
        });
        
    } catch (error) {
        console.error('Error completo cargando productos:', error);
        listaProductos.innerHTML = '<p class="error-message">Error al cargar productos. Por favor inténtalo más tarde.</p>';
    }
}

// Función para cargar reseñas
async function cargarResenas() {
    try {
        const { data, error } = await supabase
            .from('resenas')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        listaResenas.innerHTML = '';
        
        if (data.length === 0) {
            listaResenas.innerHTML = '<p class="no-reviews">Aún no hay reseñas. ¡Sé el primero en escribir una!</p>';
            return;
        }
        
        data.forEach(resena => {
            const resenaCard = document.createElement('div');
            resenaCard.className = 'resena-card';
            resenaCard.innerHTML = `
                <p>${resena.comentario}</p>
                <p class="autor">- ${resena.cliente_nombre || 'Anónimo'}</p>
            `;
            
            listaResenas.appendChild(resenaCard);
        });
    } catch (error) {
        console.error('Error cargando reseñas:', error);
        listaResenas.innerHTML = '<p class="error-message">Error al cargar reseñas. Por favor inténtalo más tarde.</p>';
    }
}

// Función para manejar el envío del formulario de orden
async function manejarEnvioOrden(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const productoId = document.getElementById('producto-seleccionado').value;
    const cantidad = document.getElementById('cantidad').value;
    
    // Validación básica
    if (!nombre || !email || !productoId || !cantidad) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    try {
        // Insertar nueva orden
        const { data, error } = await supabase
            .from('ordenes')
            .insert([{
                cliente_nombre: nombre,
                cliente_email: email,
                producto_id: parseInt(productoId),
                cantidad: parseInt(cantidad),
                estado: 'pendiente'
            }]);
            
        if (error) throw error;
        
        alert('¡Orden realizada con éxito! Nos pondremos en contacto contigo pronto.');
        formularioOrden.reset();
        
        // Actualizar la lista de reseñas para mostrar el nuevo pedido
        await cargarResenas();
    } catch (error) {
        console.error('Error al realizar la orden:', error);
        alert('Error al realizar la orden. Inténtalo de nuevo.');
    }
}

// Función para agregar al carrito
function agregarAlCarrito(producto) {
    // Verificar si el producto ya está en el carrito
    const existingItem = carrito.find(item => item.id === producto.id);
    
    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    actualizarCarritoUI();
    
    // Mostrar notificación específica para el botón de agregar
    const addToCartBtn = event.target.closest('.add-to-cart-btn');
    if (addToCartBtn) {
        // Cambiamos temporalmente el texto del botón a "Agregado"
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Agregado';
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
        }, 1500);
    }
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    actualizarCarritoUI();
}

// Función para actualizar cantidad de producto en el carrito
function actualizarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad = nuevaCantidad;
        guardarCarritoEnLocalStorage();
        actualizarCarritoUI();
    }
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para calcular total del carrito
function calcularTotal() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Función para actualizar la interfaz del carrito
function actualizarCarritoUI() {
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    carrito.forEach(item => {
        const itemTotal = item.precio * item.cantidad;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <p>$${item.precio} x ${item.cantidad}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.cantidad}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <p class="item-total">$${itemTotal.toFixed(2)}</p>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total.toFixed(2);
    
    // Agregar eventos a los controles de cantidad y eliminación
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const item = carrito.find(item => item.id === id);
            if (item) {
                actualizarCantidad(id, item.cantidad - 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const item = carrito.find(item => item.id === id);
            if (item) {
                actualizarCantidad(id, item.cantidad + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            eliminarDelCarrito(id);
        });
    });
}

// Función para abrir carrito
function abrirCarrito() {
    actualizarCarritoUI();
    cartDrawer.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Función para cerrar carrito
function cerrarCarrito() {
    cartDrawer.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Función para proceder al pago
function procederAlPago() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Mostrar lista de productos en el carrito antes de finalizar orden
    let cartItems = 'Productos en tu carrito:\n\n';
    carrito.forEach(item => {
        cartItems += `- ${item.name} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    cartItems += `\nTotal: $${calcularTotal().toFixed(2)}`;
    
    // Mostrar mensaje con productos antes de proceder al pago
    alert('¡Compra confirmada! Detalle de tu orden:\n\n' + cartItems);
    cerrarCarrito();
    
    // Limpiar el carrito después de compra
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    actualizarCarritoUI();
}

// Función para mostrar modal de vista rápida
async function mostrarVistaRapida(id) {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('id', id);
            
        if (error) throw error;
        
        if (data.length > 0) {
            const producto = data[0];
            quickViewProduct.innerHTML = `
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${producto.imagen_url || 'https://via.placeholder.com/400x300?text=Producto'}" alt="${producto.nombre}">
                    </div>
                    <div class="quick-view-details">
                        <h3>${producto.nombre}</h3>
                        <p class="quick-view-price">$${parseFloat(producto.precio).toFixed(2)}</p>
                        <p class="quick-view-description">${producto.descripcion || 'Sin descripción disponible'}</p>
                        <div class="quick-view-features">
                            <p><i class="fas fa-sun"></i> Lugar: ${producto.lugar || 'Sin especificar'}</p>
                            <p><i class="fas fa-tint"></i> Riego: ${producto.riego || 'Sin especificar'}</p>
                            <p><i class="fas fa-ruler"></i> Tamaño: ${producto.tamano || 'Sin especificar'}</p>
                        </div>
                        <button class="add-to-cart-btn quick-view-add-to-cart" data-id="${producto.id}" data-name="${producto.nombre}" data-price="${producto.precio}">
                            <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                        </button>
                    </div>
                </div>
            `;
            
            quickViewModal.style.display = 'block';
            
            // Añadir evento al botón de agregar del modal
            const addToCartBtn = document.querySelector('.quick-view-add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.getAttribute('data-name');
                    const price = parseFloat(this.getAttribute('data-price'));
                    agregarAlCarrito({id, name, price});
                    quickViewModal.style.display = 'none';
                    actualizarContadorCarrito();
                    mostrarNotificacion(`¡${name} agregado al carrito!`);
                });
            }
        }
    } catch (error) {
        console.error('Error cargando producto para vista rápida:', error);
        alert('Error al cargar la información del producto');
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = mensaje;
    
    // Añadir estilo al elemento
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out, fadeOut 0.5s 2.5s forwards;
        font-family: var(--font-primary);
        font-weight: 500;
        transform: translateX(100%);
    `;
    
    // Añadir animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Función para probar conexión con Supabase (opcional)
async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('count');
            
        if (error) throw error;
        
        console.log('Conexión a Supabase exitosa');
    } catch (error) {
        console.error('Error de conexión a Supabase:', error);
        // Mostrar mensaje al usuario si no se puede conectar
        const errorMsg = document.createElement('div');
        errorMsg.className = 'connection-error';
        errorMsg.textContent = 'Advertencia: No se pudo establecer conexión con la base de datos.';
        errorMsg.style.cssText = `
            background-color: #ffcdd2;
            color: #c62828;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            text-align: center;
            font-family: var(--font-primary);
        `;
        document.querySelector('main').prepend(errorMsg);
    }
}

// Probar conexión cuando se carga la página
testSupabaseConnection();

// Debug function to check what's in the database
async function debugProducts() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*');
            
        if (error) {
            console.error('Error en debug:', error);
            return;
        }
        
        console.log('Productos cargados:', data);
        console.log('Número de productos:', data.length);
    } catch (err) {
        console.error('Error en debug de productos:', err);
    }
}

// Call debug function for testing
setTimeout(debugProducts, 2000);