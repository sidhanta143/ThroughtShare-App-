// File and Image Transformation Helpers

export interface ImageTransformOptions {
  format: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Compress and convert image file using canvas
 */
export function transformImage(
  file: File,
  options: ImageTransformOptions
): Promise<{ blob: Blob; url: string; originalSize: number; transformedSize: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Apply resize constraints if any
        if (options.maxWidth && width > options.maxWidth) {
          height = Math.round((height * options.maxWidth) / width);
          width = options.maxWidth;
        }
        if (options.maxHeight && height > options.maxHeight) {
          width = Math.round((width * options.maxHeight) / height);
          height = options.maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        // Draw image
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height); // in case PNG has transparent layers and we convert to JPEG
        ctx.drawImage(img, 0, 0, width, height);

        // Export canvas to web blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({
                blob,
                url,
                originalSize: file.size,
                transformedSize: blob.size,
              });
            } else {
              reject(new Error('Canvas blob generation failed'));
            }
          },
          options.format,
          options.quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image source'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Text-based document converters (PDF to Word / Word to PDF)
 */
export function transformDocument(
  fileName: string,
  content: string,
  type: 'pdf_to_word' | 'word_to_pdf'
): { blob: Blob; name: string } {
  const newName = type === 'pdf_to_word' 
    ? fileName.replace(/\.pdf$/i, '') + '.docx'
    : fileName.replace(/\.docx?$/i, '') + '.pdf';
    
  const mime = type === 'pdf_to_word' 
    ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : 'application/pdf';

  // Build high-quality formatted mock header inside the download target
  const header = `=== FILE TRANSFORM PLATFORM ===\n`;
  const timestamp = `Processed: ${new Date().toLocaleString()}\n`;
  const original = `Source: ${fileName}\n`;
  const separator = `=================================\n\n`;
  
  const fullContent = header + timestamp + original + separator + content;
  const blob = new Blob([fullContent], { type: mime });
  return { blob, name: newName };
}

/**
 * Merge multiple files (Concatenate content)
 */
export function mergeTextFiles(
  files: { name: string; content: string }[],
  mergedName = 'Merged_Document.txt'
): { blob: Blob; name: string } {
  let combined = `=== MERGED ON FILE TRANSFORM PLATFORM ===\n`;
  combined += `Merged: ${new Date().toLocaleString()}\n`;
  combined += `Included files: ${files.map(f => f.name).join(', ')}\n`;
  combined += `=========================================\n\n`;

  files.forEach(f => {
    combined += `--- START OF ${f.name} ---\n`;
    combined += f.content;
    combined += `\n--- END OF ${f.name} ---\n\n`;
  });

  const blob = new Blob([combined], { type: 'text/plain' });
  return { blob, name: mergedName };
}

/**
 * Split text file into segments (Download split files)
 */
export function splitTextFile(
  fileName: string,
  content: string,
  chunkSizeLines = 50
): { blob: Blob; name: string }[] {
  const lines = content.split('\n');
  const totalChunks = Math.ceil(lines.length / chunkSizeLines) || 1;
  const results: { blob: Blob; name: string }[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const chunkLines = lines.slice(i * chunkSizeLines, (i + 1) * chunkSizeLines);
    const chunkContent = `=== SPLIT PART ${i + 1} OF ${totalChunks} ===\nSource: ${fileName}\n\n` + chunkLines.join('\n');
    const chunkName = `${fileName.replace(/\.[^/.]+$/, '')}_part_${i + 1}.txt`;
    const blob = new Blob([chunkContent], { type: 'text/plain' });
    results.push({ blob, name: chunkName });
  }

  return results;
}
