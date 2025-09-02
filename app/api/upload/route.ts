import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '../../../lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (10MB max - much more generous with Cloudinary)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max size: 10MB.' }, { status: 400 });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary not configured, falling back to base64');
      
      // Fallback to base64 for demo/development
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      return NextResponse.json({ 
        success: true, 
        url: base64,
        filename: file.name,
        storage: 'local-base64'
      });
    }

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cloudinaryUrl = await uploadImage(buffer, file.name);
    
    return NextResponse.json({ 
      success: true, 
      url: cloudinaryUrl,
      filename: file.name,
      storage: 'cloudinary'
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // If Cloudinary fails, try base64 fallback (for development)
    if (error instanceof Error && error.message.includes('cloudinary')) {
      try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (file && file.size < 1024 * 1024) { // Only fallback for small files
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
          
          return NextResponse.json({ 
            success: true, 
            url: base64,
            filename: file.name,
            storage: 'fallback-base64'
          });
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
    
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' }, 
      { status: 500 }
    );
  }
}