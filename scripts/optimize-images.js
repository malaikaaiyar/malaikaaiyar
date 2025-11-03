import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const MAX_WIDTH = 1920; // Max width for web images
const MAX_HEIGHT = 1920; // Max height for web images
const WEBP_QUALITY = 85; // WebP quality (good balance between quality and size)
const PNG_QUALITY = 90; // PNG quality (for PNGs that need to stay PNG)

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG', '.webp', '.WEBP'];

async function getAllImageFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      await getAllImageFiles(filePath, fileList);
    } else {
      const ext = extname(file);
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}

async function optimizeImage(inputPath) {
  try {
    const ext = extname(inputPath).toLowerCase();
    const isPNG = ext === '.png';
    
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalSize = (await stat(inputPath)).size;
    
    // Determine if we should resize
    const shouldResize = metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT;
    
    let sharpInstance = sharp(inputPath);
    
    // Resize if needed, maintaining aspect ratio
    if (shouldResize) {
      sharpInstance = sharpInstance.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // For PNGs with transparency, convert to WebP (WebP supports transparency)
    // WebP typically provides better compression even for PNGs
    if (isPNG && metadata.hasAlpha) {
      const webpOutputPath = inputPath.replace(/\.(png|PNG)$/i, '.webp');
      
      await sharpInstance
        .webp({ 
          quality: WEBP_QUALITY,
          effort: 6,
          lossless: false // Use lossy compression for better file size
        })
        .toFile(webpOutputPath);
      
      const newSize = (await stat(webpOutputPath)).size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`✓ Optimized: ${basename(inputPath)} → ${basename(webpOutputPath)} (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB, ${savings}% smaller)`);
      
      return webpOutputPath;
    } else {
      // Convert to WebP - create alongside original
      const webpOutputPath = inputPath.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, '.webp');
      
      await sharpInstance
        .webp({ 
          quality: WEBP_QUALITY,
          effort: 6 // Higher effort = better compression but slower
        })
        .toFile(webpOutputPath);
      
      const newSize = (await stat(webpOutputPath)).size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`✓ Optimized: ${basename(inputPath)} → ${basename(webpOutputPath)} (${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB, ${savings}% smaller)`);
      
      return webpOutputPath;
    }
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  const imageFiles = await getAllImageFiles(PUBLIC_DIR);
  console.log(`Found ${imageFiles.length} images to optimize\n`);
  
  let optimized = 0;
  let failed = 0;
  
  for (const imagePath of imageFiles) {
    // Skip if already a .webp file (unless we want to re-optimize)
    const ext = extname(imagePath).toLowerCase();
    if (ext === '.webp') {
      console.log(`⊘ Skipping already WebP: ${basename(imagePath)}`);
      continue;
    }
    
    // Ensure output directory exists
    const outputDir = dirname(imagePath);
    await mkdir(outputDir, { recursive: true });
    
    const result = await optimizeImage(imagePath);
    
    if (result) {
      optimized++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n✨ Optimization complete!`);
  console.log(`   Optimized: ${optimized}`);
  console.log(`   Failed: ${failed}`);
  console.log(`\n💡 Note: WebP versions created alongside originals. PNGs with transparency are optimized in place.`);
  console.log(`   Consider updating image references in your code to use .webp files for better performance.`);
}

main().catch(console.error);

