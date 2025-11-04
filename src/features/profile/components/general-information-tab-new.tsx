'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { Edit, Check, X } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

interface GeneralInformationTabProps {
  // Убираем зависимость от моковых данных
}

export function GeneralInformationTab({}: GeneralInformationTabProps) {
  const { profile, updateProfile, isLoading } = useProfile()
  
  // Состояния для редактирования
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  
  // Временные значения для редактирования
  const [editValues, setEditValues] = useState({
    email: profile?.email || '',
    city: profile?.city || '',
    birthDate: profile?.birthDate || '',
    about: profile?.bio || ''
  })

  // Обновляем editValues когда профиль загружается
  React.useEffect(() => {
    if (profile) {
      setEditValues({
        email: profile.email || '',
        city: profile.city || '',
        birthDate: profile.birthDate || '',
        about: profile.bio || ''
      })
    }
  }, [profile])

  const handleSaveEmail = async () => {
    try {
      await updateProfile({ email: editValues.email })
      setIsEditingEmail(false)
    } catch (error) {
      console.error('Error updating email:', error)
    }
  }

  const handleSavePersonal = async () => {
    try {
      await updateProfile({ 
        city: editValues.city,
        birthDate: editValues.birthDate
      })
      setIsEditingPersonal(false)
    } catch (error) {
      console.error('Error updating personal info:', error)
    }
  }

  const handleSaveAbout = async () => {
    try {
      await updateProfile({ bio: editValues.about })
      setIsEditingAbout(false)
    } catch (error) {
      console.error('Error updating about:', error)
    }
  }

  const handleCancel = (field: string) => {
    switch (field) {
      case 'email':
        setEditValues(prev => ({ ...prev, email: profile?.email || '' }))
        setIsEditingEmail(false)
        break
      case 'personal':
        setEditValues(prev => ({ 
          ...prev, 
          city: profile?.city || '',
          birthDate: profile?.birthDate || ''
        }))
        setIsEditingPersonal(false)
        break
      case 'about':
        setEditValues(prev => ({ ...prev, about: profile?.bio || '' }))
        setIsEditingAbout(false)
        break
    }
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg p-8 space-y-8">
      
      {/* Contact Email - Editable */}
      <div className="bg-[#d4f4f4] rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6 flex-1">
            <span className="text-lg font-medium text-gray-800 min-w-[140px]">
              Contact e-mail:
            </span>
            {isEditingEmail ? (
              <div className="flex items-center gap-3 flex-1">
                <Input
                  value={editValues.email}
                  onChange={(e) => setEditValues(prev => ({ ...prev, email: e.target.value }))}
                  className="max-w-sm"
                  type="email"
                  placeholder="Enter email"
                />
                <Button
                  onClick={handleSaveEmail}
                  disabled={isLoading}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleCancel('email')}
                  size="sm"
                  variant="outline"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <span className="text-lg text-gray-800">
                {editValues.email}
              </span>
            )}
          </div>
          {!isEditingEmail && (
            <Button
              onClick={() => setIsEditingEmail(true)}
              variant="ghost"
              size="sm"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </Button>
          )}
        </div>
      </div>

      {/* Personal Details - Editable */}
      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
          {!isEditingPersonal && (
            <Button
              onClick={() => setIsEditingPersonal(true)}
              variant="ghost"
              size="sm"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <span className="text-lg font-medium text-gray-800 min-w-[140px]">
              City:
            </span>
            {isEditingPersonal ? (
              <Input
                value={editValues.city}
                onChange={(e) => setEditValues(prev => ({ ...prev, city: e.target.value }))}
                className="max-w-sm"
                placeholder="Enter city"
              />
            ) : (
              <span className="text-lg text-gray-800">
                {editValues.city}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-lg font-medium text-gray-800 min-w-[140px]">
              Birth Date:
            </span>
            {isEditingPersonal ? (
              <Input
                value={editValues.birthDate}
                onChange={(e) => setEditValues(prev => ({ ...prev, birthDate: e.target.value }))}
                className="max-w-sm"
                type="date"
              />
            ) : (
              <span className="text-lg text-gray-800">
                {editValues.birthDate}
              </span>
            )}
          </div>

          {isEditingPersonal && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSavePersonal}
                disabled={isLoading}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => handleCancel('personal')}
                size="sm"
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* About Me - Editable */}
      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">About Me</h3>
          {!isEditingAbout && (
            <Button
              onClick={() => setIsEditingAbout(true)}
              variant="ghost"
              size="sm"
            >
              <Edit className="w-5 h-5 text-gray-600" />
            </Button>
          )}
        </div>
        
        {isEditingAbout ? (
          <div className="space-y-4">
            <Textarea
              value={editValues.about}
              onChange={(e) => setEditValues(prev => ({ ...prev, about: e.target.value }))}
              className="min-h-[120px] resize-none"
              placeholder="Tell us about yourself..."
            />
            <div className="flex gap-3">
              <Button
                onClick={handleSaveAbout}
                disabled={isLoading}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={() => handleCancel('about')}
                size="sm"
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
            {editValues.about}
          </p>
        )}
      </div>

      {/* My Orders Section */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Orders</h3>
        <div className="space-y-3">
          <p className="text-gray-500 italic">No orders yet</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h3>
        <div className="space-y-3">
          {['Email notifications for new orders', 'SMS notifications for urgent updates', 'Push notifications for messages'].map((notification, index) => (
            <div key={index} className="flex items-center gap-3">
              <Checkbox id={`notification-${index}`} />
              <label 
                htmlFor={`notification-${index}`}
                className="text-lg text-gray-700 cursor-pointer"
              >
                {notification}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
