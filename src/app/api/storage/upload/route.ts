import { MAX_FILE_SIZE } from '@/lib/constants';
import { S3Provider } from '@/storage/provider/s3';
import { StorageError } from '@/storage/types';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment variables
    console.log('Storage config check:', {
      hasAccessKey: !!process.env.STORAGE_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.STORAGE_SECRET_ACCESS_KEY,
      hasEndpoint: !!process.env.STORAGE_ENDPOINT,
      hasBucket: !!process.env.STORAGE_BUCKET_NAME,
      accessKeyLength: process.env.STORAGE_ACCESS_KEY_ID?.length,
    });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.log('uploadFile, file size exceeds the server limit', file.size);
      return NextResponse.json(
        { error: 'File size exceeds the server limit' },
        { status: 400 }
      );
    }

    // Validate file type (optional, based on your requirements)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('uploadFile, file type not supported', file.type);
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create S3Provider with explicit config
    const storageProvider = new S3Provider({
      region: 'auto',
      endpoint: 'https://5a61f966cf1cba6036269623117c4b91.r2.cloudflarestorage.com',
      accessKeyId: '5bc174eb8ea7910be679885c8ae53669',
      secretAccessKey: 'dbab531767b0036382366a77583a638e9d52d18820f22fb407fe31aa5b290cef',
      bucketName: 'kling-o1',
      publicUrl: 'https://img.klingo1video.io',
      forcePathStyle: true,
    });

    // Upload to storage
    const result = await storageProvider.uploadFile({
      file: buffer,
      filename: file.name,
      contentType: file.type,
      folder: folder || undefined,
    });

    console.log('uploadFile, result', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading file:', error);

    if (error instanceof StorageError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Something went wrong while uploading the file' },
      { status: 500 }
    );
  }
}
