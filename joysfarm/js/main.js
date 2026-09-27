// Configuración de Supabase
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Elementos del DOM
const listaProductos = document.getElementById('lista-productos');
const formularioOrden = document.getElementById('formulario-orden');
const productoSeleccionado = document.getElementById('producto-seleccionado');
const listaResenas = document.getElementById('lista-resenas');

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductos();
    await cargarResenas();
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
        
        data.forEach(producto => {
            // Mostrar productos en la sección de productos
            const productoCard = document.createElement('div');
            productoCard.className = 'producto-card';
            productoCard.innerHTML = `
                <img src="${producto.imagen_url}" alt="${producto.nombre}" class="producto-imagen">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>${producto.descripcion}</p>
            `;
            
            listaProductos.appendChild(productoCard);
            
            // Agregar al selector de productos en el formulario
            const opcion = document.createElement('option');
            opcion.value = producto.id;
            opcion.textContent = `${producto.nombre} - $${producto.precio}`;
            productoSeleccionado.appendChild(opcion);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
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
        
        data.forEach(resena => {
            const resenaCard = document.createElement('div');
            resenaCard.className = 'resena-card';
            resenaCard.innerHTML = `
                <p>${resena.comentario}</p>
                <p class="autor">- ${resena.cliente_nombre}</p>
            `;
            
            listaResenas.appendChild(resenaCard);
        });
    } catch (error) {
        console.error('Error cargando reseñas:', error);
    }
}

// Manejar envío del formulario de orden
formularioOrden.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const productoId = document.getElementById('producto-seleccionado').value;
    const cantidad = document.getElementById('cantidad').value;
    
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
        
        alert('Orden realizada con éxito!');
        formularioOrden.reset();
        
        // Actualizar la lista de órdenes
        await cargarResenas();
    } catch (error) {
        console.error('Error al realizar la orden:', error);
        alert('Error al realizar la orden. Inténtalo de nuevo.');
    }
});