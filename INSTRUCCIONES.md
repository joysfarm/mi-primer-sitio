# Instrucciones para agregar nuevos productos

## Agregar productos al catálogo

Para agregar los nuevos productos (albahaca y romero) en la aplicación:

1. **Acceder a Supabase:**
   - Ingrese al panel de administración de su proyecto Supabase
   - Navegue hasta "Table Editor" 
   - Seleccione la tabla `productos`

2. **Agregar registros:**
   - Haga clic en "Insert Row"
   - Agregue los siguientes productos manualmente:

### Producto 1: Albahaca
- nombre: "Albahaca"
- precio: 8.99
- descripcion: "Planta de hierbas aromáticas ideal para cocina mediterránea. Su aroma fresco y su sabor delicado la convierten en un ingrediente esencial para platos del sur de Europa."
- imagen_url: "https://images.unsplash.com/photo-1570634132888-96e1c32d2a1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
- lugar: "Interior"
- riego: "Moderado" 
- tamano: "Mediana"

### Producto 2: Romero
- nombre: "Romero"
- precio: 12.50
- descripcion: "Planta aromática con propiedades medicinales y culinarias. Su fragancia fuerte y su sabor intenso son ideales para acompañar carnes y platos grasos."
- imagen_url: "https://images.unsplash.com/photo-1604599408633-e0aef1303719?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
- lugar: "Interior/Exterior"
- riego: "Bajo"
- tamano: "Grande"

## Cambios en la interfaz

El sitio ya está configurado para mostrar productos automáticamente desde la base de datos. Cualquier nuevo producto insertado se mostrará automáticamente en la sección "Productos Destacados" del catálogo.

## Botones de carrito

La función actual del botón "Agregar al Carrito" ha sido mejorada para:
- Mostrar notificación de éxito
- Actualizar el contador del carrito automáticamente  
- Cambiar estado del botón a "Agregado"