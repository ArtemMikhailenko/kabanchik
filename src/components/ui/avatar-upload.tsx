'use client'

import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, Upload, X } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'
import { useTranslations } from 'next-intl'

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  size?: 'sm' | 'md' | 'lg'
}

export function AvatarUpload({ currentAvatar, userName, size = 'lg' }: AvatarUploadProps) {
  const t = useTranslations('common')
  const { updateProfile, refetch, profile } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16', 
    lg: 'h-[180px] w-[180px] rounded-[10.2857px]'
  }

  const buttonSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
    lg: 'h-8 w-8'
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('avatar', file)

      // Upload to your API endpoint
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload avatar')
      }

      const data = await response.json()
      
      // Avatar is already updated in the database by the API
      // Just refetch the profile to get the latest data
      await refetch()
      
      // Clean up
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const displayAvatar = previewUrl || profile?.avatar || currentAvatar

  return (
    <div className="relative group">
      {/* Avatar */}
      <div 
        className={`relative cursor-pointer ${sizeClasses[size]} overflow-hidden`}
        onClick={handleAvatarClick}
      >
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={displayAvatar} alt={userName} />
          <AvatarFallback className={size === 'lg' ? 'text-4xl' : 'text-lg'}>
            {userName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Upload controls when preview is available */}
      {previewUrl && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white rounded-lg shadow-lg p-2 border">
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            size="sm"
            className="h-8 px-3"
          >
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 mr-1 animate-spin" />
                {t('uploading')}
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1" />
                {t('save')}
              </>
            )}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isUploading}
            size="sm"
            variant="outline"
            className="h-8 px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
