// Configuración de Supabase
// En producción, estas variables se deberían cargar desde variables de entorno
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseKey = 'tu-anon-key-aqui';
const supabase = createClient(supabaseUrl, supabaseKey);

// Elementos del DOM
const listaProductos = document.getElementById('lista-productos');
const formularioOrden = document.getElementById('formulario-orden');
const productoSeleccionado = document.getElementById('producto-seleccionado');
const listaResenas = document.getElementById('lista-resenas');
const cartCount = document.querySelector('.cart-count');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    await cargarResenas();
    actualizarContadorCarrito();
    
    // Añadir evento para el formulario de orden
    formularioOrden.addEventListener('submit', manejarEnvioOrden);
});

// Función para cargar productos
async function cargarProductos() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*');
            
        if (error) throw error;
        
        listaProductos.innerHTML = '';
        productoSeleccionado.innerHTML = '<option value="">Selecciona un producto</option>';
        
        // Añadir mensaje si no hay productos
        if (data.length === 0) {
            listaProductos.innerHTML = '<p class="no-products">No hay productos disponibles actualmente.</p>';
            return;
        }
        
        data.forEach(producto => {
            // Mostrar productos en la sección de productos
            const productoCard = document.createElement('div');
            productoCard.className = 'producto-card';
            productoCard.innerHTML = `
                <img src="${producto.imagen_url || 'https://via.placeholder.com/300x200?text=Producto'}" alt="${producto.nombre}" class="producto-imagen">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <p class="producto-descripcion">${producto.descripcion || 'Sin descripción disponible'}</p>
                <button class="add-to-cart-btn" data-id="${producto.id}" data-name="${producto.nombre}" data-price="${producto.precio}">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            `;
            
            listaProductos.appendChild(productoCard);
            
            // Agregar al selector de productos en el formulario
            const opcion = document.createElement('option');
            opcion.value = producto.id;
            opcion.textContent = `${producto.nombre} - $${producto.precio}`;
            productoSeleccionado.appendChild(opcion);
        });
        
        // Añadir eventos a los botones de agregar al carrito
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = this.getAttribute('data-price');
                agregarAlCarrito({id, name, price});
                actualizarContadorCarrito();
            });
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
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

// Función para agregar al carrito (simulación)
function agregarAlCarrito(producto) {
    // Esto es una simulación. En una implementación real, se usaría localStorage o un sistema más complejo
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar notificación
    mostrarNotificacion(`¡${producto.name} agregado al carrito!`);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    cartCount.textContent = carrito.length;
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
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s, fadeOut 0.5s 2.5s forwards;
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
        `;
        document.querySelector('main').prepend(errorMsg);
    }
}

// Probar conexión cuando se carga la página
testSupabaseConnection();