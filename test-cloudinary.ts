// Тест для проверки загрузки аватара через Cloudinary

import { uploadToCloudinary } from './src/lib/cloudinary'
import fs from 'fs'
import path from 'path'

async function testCloudinaryUpload() {
  try {
    console.log('🚀 Starting Cloudinary upload test...')
    
    // Проверяем переменные окружения
    const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars.join(', '))
      return
    }
    
    console.log('✅ All Cloudinary environment variables are set')
    console.log('📁 Cloud name:', process.env.CLOUDINARY_CLOUD_NAME)
    
    // Для тестирования создадим простое изображение (PNG пиксель)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
      0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ])
    
    console.log('📸 Test image buffer created (1x1 PNG)')
    
    // Загружаем в Cloudinary
    const result = await uploadToCloudinary({
      file: testImageBuffer,
      fileName: 'test-upload.png',
      folder: 'test',
      transformation: {
        width: 100,
        height: 100,
        crop: 'fill',
        quality: 'auto'
      }
    })
    
    console.log('🎉 Upload successful!')
    console.log('📝 Result details:')
    console.log('   - URL:', result.url)
    console.log('   - Secure URL:', result.secureUrl)
    console.log('   - Public ID:', result.publicId)
    console.log('   - Dimensions:', `${result.width}x${result.height}`)
    
    // Проверяем, доступно ли изображение
    const response = await fetch(result.secureUrl)
    if (response.ok) {
      console.log('✅ Image is accessible via URL')
      console.log('📊 Response status:', response.status)
      console.log('📄 Content type:', response.headers.get('content-type'))
    } else {
      console.log('❌ Image is not accessible:', response.status)
    }
    
  } catch (error) {
    console.error('❌ Upload failed:', error)
  }
}

// Запускаем тест только если файл запущен напрямую
if (require.main === module) {
  testCloudinaryUpload()
}

export { testCloudinaryUpload }