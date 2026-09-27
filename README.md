# Joysfarm Website

Sitio web para Joysfarm, una tienda virtual de productos naturales.

## Estructura del Proyecto

- `index.html`: Página principal con secciones de productos, ordenes y reseñas
- `css/style.css`: Estilos CSS para el diseño responsive
- `js/main.js`: Script JavaScript para la lógica del frontend y conexión con Supabase

## Configuración de Supabase

Para conectar el sitio web con Supabase:

1. Crea una cuenta en [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Obtén las credenciales:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Reemplaza los valores en `js/main.js`:

```javascript
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
```

## Estructura de Base de Datos Supabase

Necesitas crear las siguientes tablas en Supabase:

### Tabla `productos`
- id (integer, primary key)
- nombre (text)
- descripcion (text)
- precio (numeric)
- imagen_url (text)

### Tabla `ordenes`
- id (integer, primary key)
- cliente_nombre (text)
- cliente_email (text)
- producto_id (integer)
- cantidad (integer)
- estado (text)
- created_at (timestamp)

### Tabla `resenas`
- id (integer, primary key)
- cliente_nombre (text)
- comentario (text)
- created_at (timestamp)

## Deploy

El sitio se puede desplegar en Vercel:

1. Sube el código a un repositorio de GitHub
2. Conecta tu repositorio a Vercel
3. Configura las variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Desarrollo Local

1. Abre `index.html` en un navegador
2. Para pruebas con Supabase, necesitas un servidor web local