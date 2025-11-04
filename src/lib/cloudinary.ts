import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadToCloudinaryParams {
  file: Buffer
  fileName: string
  folder?: string
  transformation?: any
}

export interface UploadToCloudinaryResult {
  url: string
  secureUrl: string
  publicId: string
  width?: number
  height?: number
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary({
  file,
  fileName,
  folder = 'uploads',
  transformation
}: UploadToCloudinaryParams): Promise<UploadToCloudinaryResult> {
  try {
    // Convert buffer to base64 data URL
    const base64Data = `data:image/png;base64,${file.toString('base64')}`
    
    // Generate unique public_id
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2)
    const publicId = `${folder}/${timestamp}-${randomString}`

    const uploadOptions: any = {
      public_id: publicId,
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    }

    // Add transformation if provided
    if (transformation) {
      uploadOptions.transformation = transformation
    }

    const result = await cloudinary.uploader.upload(base64Data, uploadOptions)

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload file to Cloudinary')
  }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Failed to delete file from Cloudinary')
  }
}

/**
 * Extract Cloudinary public_id from URL
 */
export function extractCloudinaryPublicId(url: string): string | null {
  try {
    // Cloudinary URLs have format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/file.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/)
    return match ? match[1] : null
  } catch (error) {
    console.error('Error extracting public_id from URL:', error)
    return null
  }
}

/**
 * Generate optimized image URL with transformations
 */
export function generateOptimizedUrl(
  publicId: string, 
  options: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
  } = {}
): string {
  try {
    return cloudinary.url(publicId, {
      width: options.width,
      height: options.height,
      crop: options.crop || 'fill',
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
    })
  } catch (error) {
    console.error('Error generating optimized URL:', error)
    return ''
  }
}