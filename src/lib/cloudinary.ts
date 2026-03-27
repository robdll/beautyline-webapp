import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  return {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  };
}

function ensureCloudinaryConfigured() {
  if (!configured) {
    cloudinary.config(getCloudinaryConfig());
    configured = true;
  }
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'beautyline',
  options?: {
    publicId?: string;
    resourceType?: 'image' | 'raw' | 'video' | 'auto';
    format?: string;
  }
): Promise<string> {
  ensureCloudinaryConfigured();

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: options?.resourceType ?? 'auto',
          public_id: options?.publicId,
          format: options?.format,
          unique_filename: false,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      )
      .end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  ensureCloudinaryConfigured();
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
