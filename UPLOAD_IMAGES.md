# How to Upload Images Using Supabase CLI

## Prerequisites:
1. Install Supabase CLI: https://supabase.com/docs/guides/cli
2. Have your project URL and anon key ready (available from Supabase dashboard)

## Steps:

1. **Initialize Supabase CLI (if not already done):**
   ```bash
   supabase init
   ```

2. **Configure your project (if not already configured):**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Create a storage bucket:**
   ```sql
   -- Run this in Supabase SQL Editor
   insert into storage.buckets (id, name, public) values ('images', 'images', true);
   ```

4. **Upload images to storage:**
   ```bash
   supabase storage upload images imagenes/romero.jpeg
   supabase storage upload images imagenes/albahaca.jpeg
   supabase storage upload images imagenes/farm.webp
   ```

5. **Verify the upload worked:**
   - Check in Supabase Dashboard Storage section
   - Make sure each image shows as publicly accessible

6. **Update database records with new URLs:**
   ```sql
   UPDATE public.productos SET imagen_url = 'https://your-project.supabase.co/storage/v1/object/public/images/romero.jpeg' WHERE nombre = 'Romero';
   UPDATE public.productos SET imagen_url = 'https://your-project.supabase.co/storage/v1/object/public/images/albahaca.jpeg' WHERE nombre = 'Albahaca';
   UPDATE public.productos SET imagen_url = 'https://your-project.supabase.co/storage/v1/object/public/images/hierbas-varias.jpeg' WHERE nombre = 'Hierbas Variadas';
   ```

## Important Security Notes:
- Ensure your storage bucket has appropriate permissions
- Images in the "images" bucket should be publicly accessible for display on your website