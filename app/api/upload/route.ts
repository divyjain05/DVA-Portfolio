import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Ensure config is fresh for each request to avoid any stale state
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
  });
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pin = formData.get('pin') as string;

    if (pin !== process.env.ADMIN_PIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Initialize config
    configureCloudinary();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Using a promise-based approach with upload_stream for direct buffer handling
    // This is often more reliable than Base64 for signature generation
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'dva_portfolio',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Error Detail:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json({ 
      error: error.message || 'Unknown upload error',
      details: error.message?.includes('Signature') ? 'Check your Cloudinary API Secret/Key' : undefined
    }, { status: 500 });
  }
}
