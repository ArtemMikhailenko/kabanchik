# Cloudinary Configuration

## Setup Instructions

1. **Create Cloudinary Account**:
   - Go to [cloudinary.com](https://cloudinary.com) and sign up
   - Navigate to Dashboard to get your credentials

2. **Get Cloudinary Credentials**:
   - **Cloud Name**: Found in your dashboard
   - **API Key**: Found in your dashboard  
   - **API Secret**: Found in your dashboard (click "Reveal")

3. **Configure Environment Variables**:
   Update your `.env` file with the following:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Features Implemented

### ✅ Avatar Upload
- **API**: `/api/profile/avatar`
- **Method**: POST
- **Features**: 
  - Uploads to Cloudinary `avatars/` folder
  - Automatically deletes old avatar when new one is uploaded
  - Validates file type (images only) and size (max 5MB)
  - Auto-optimized: 400x400px, face detection, auto quality
  - Returns secure Cloudinary URL

### ✅ Portfolio Upload
- **API**: `/api/profile/portfolio`
- **Method**: POST
- **Features**:
  - Uploads to Cloudinary `portfolio/` folder
  - Validates file type (images only) and size (max 10MB)
  - Supports tags and descriptions
  - Auto-optimized: max 800x600px, auto quality
  - Returns secure Cloudinary URL

### ✅ Portfolio Delete
- **API**: `/api/profile/portfolio?id={portfolioId}`
- **Method**: DELETE
- **Features**:
  - Deletes image from Cloudinary
  - Removes database record
  - Only allows users to delete their own portfolio items

## File Structure

```
src/
├── lib/
│   └── cloudinary.ts             # Cloudinary utilities
├── app/api/
│   └── profile/
│       ├── avatar/route.ts       # Avatar upload API
│       └── portfolio/route.ts    # Portfolio CRUD API
```

## Cloudinary Features Used

### 🎨 **Automatic Optimizations**
- **Format**: Auto-converts to WebP/AVIF when supported
- **Quality**: Intelligent compression based on content
- **Responsive**: Automatic resizing for different devices

### 🖼️ **Image Transformations**
- **Avatars**: 400x400px, face-centered cropping
- **Portfolio**: Limited to 800x600px, preserves aspect ratio
- **Lazy Loading**: URLs support lazy loading attributes

### ⚡ **Performance Benefits**
- **CDN**: Global content delivery network
- **Caching**: Automatic edge caching
- **Compression**: Advanced image optimization

## Security Features

1. **Authentication**: All endpoints require Clerk authentication
2. **File Validation**: Type and size validation for all uploads
3. **Ownership Checks**: Users can only modify their own files
4. **Automatic Cleanup**: Old files are deleted when replaced
5. **Secure URLs**: HTTPS-only delivery

## URL Format

Uploaded files will have URLs in the format:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/folder/filename.jpg
```

Examples:
- Avatar: `https://res.cloudinary.com/myapp/image/upload/v1672531200/avatars/1672531200000-abc123.jpg`
- Portfolio: `https://res.cloudinary.com/myapp/image/upload/v1672531200/portfolio/1672531200000-xyz789.png`

## Advanced Features Available

### 🔄 **Dynamic Transformations**
```javascript
// Generate different sizes on-the-fly
const thumbnailUrl = generateOptimizedUrl(publicId, {
  width: 150,
  height: 150,
  crop: 'fill'
})

const largeUrl = generateOptimizedUrl(publicId, {
  width: 1200,
  quality: 80,
  format: 'jpg'
})
```

### 📱 **Responsive Images**
- Automatic device-appropriate sizing
- Retina display support
- Bandwidth-aware delivery

### 🎭 **AI-Powered Features**
- Auto face detection and cropping
- Background removal (premium)
- Content-aware cropping
- Auto-tagging and categorization