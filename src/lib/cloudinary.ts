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

export type CloudinaryLibraryItem = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

/**
 * Lists previously uploaded images under a folder prefix (Admin API).
 * `folderPrefix` should match the `folder` used at upload time (e.g. `beautyline/products`).
 */
export async function listCloudinaryLibraryImages(opts: {
  folderPrefix: string;
  maxResults?: number;
  nextCursor?: string | null;
}): Promise<{ items: CloudinaryLibraryItem[]; nextCursor: string | null }> {
  ensureCloudinaryConfigured();
  const maxResults = Math.min(Math.max(opts.maxResults ?? 24, 1), 100);

  type ResourcesListResponse = {
    resources?: Array<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
    }>;
    next_cursor?: string;
  };

  const result = await new Promise<ResourcesListResponse>((resolve, reject) => {
    cloudinary.api.resources(
      {
        type: 'upload',
        resource_type: 'image',
        prefix: opts.folderPrefix,
        max_results: maxResults,
        ...(opts.nextCursor ? { next_cursor: opts.nextCursor } : {}),
      },
      (err, res) => {
        if (err) reject(err);
        else resolve(res as ResourcesListResponse);
      }
    );
  });

  const resources = result.resources ?? [];
  return {
    items: resources.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
      width: r.width,
      height: r.height,
    })),
    nextCursor: result.next_cursor ?? null,
  };
}

export default cloudinary;
