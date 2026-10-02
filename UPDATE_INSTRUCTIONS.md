# Updating Image URLs in Supabase Database

To properly connect your local images to the website, you need to update the product image URLs in the database:

## Current Images:
- `romero.jpeg`
- `albahaca.jpeg` 
- `farm.webp`

## Steps to Update:

1. Upload your local images to Supabase Storage (using Supabase Dashboard or CLI)
2. Get new storage URLs for each image
3. Update the productos table with these new URLs

## SQL Commands to Update Images:
```sql
UPDATE public.productos 
SET imagen_url = 'https://your-project.supabase.co/storage/v1/object/public/images/romero.jpeg'
WHERE nombre = 'Romero';

UPDATE public.productos 
SET imagen_url = 'https://your-project.supabase.co/storage/v1/object/public/images/albahaca.jpeg'  
WHERE nombre = 'Albahaca';

UPDATE public.productos 
SET imagen_url = 'https://your-project.supabase.co/storage/v1/object/public/images/hierbas-varias.jpeg'
WHERE nombre = 'Hierbas Variadas';
```

## Additional Notes:
- The `farm.webp` image is already used as background in CSS (line 143 in style.css) - this doesn't need to be updated
- Ensure your Supabase Storage bucket is properly configured with public access for these images