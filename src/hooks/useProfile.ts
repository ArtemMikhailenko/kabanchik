import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getDisplayName, getUserInitials } from '@/lib/user-utils'

interface ProfileData {
  id?: string
  name?: string
  email?: string
  bio?: string
  avatar?: string
  city?: string
  birthDate?: string
  hourlyRate?: number
  skills?: string[]
  isVerified?: boolean
  role?: 'CUSTOMER' | 'SPECIALIST'
  hasProProfile?: boolean
  hasCustomerProfile?: boolean
  fromDatabase?: boolean
  displayName?: string
  initials?: string
  // Добавляем поля статистики отзывов
  reviewsCount?: number
  averageRating?: number
  positivePercentage?: number
  // Добавляем поля подписки
  subscription?: {
    plan: string
    validUntil: string
  }
}

export function useProfile() {
  const { user: clerkUser, isLoaded } = useUser()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = async (updateData?: {
    name?: string
    email?: string
    bio?: string
    avatar?: string
    city?: string
    birthDate?: string
    hourlyRate?: number
    skills?: string[]
  }) => {
    if (!clerkUser) return { success: false, error: 'User not authenticated' }

    try {
      let response;
      
      if (updateData) {
        // Если переданы данные для обновления, используем API profile
        response = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        })
      } else {
        // Если данные не переданы, используем старый API users для базового обновления
        response = await fetch('/api/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      if (response.ok) {
        // После успешного обновления, перезагружаем профиль
        const updatedData = await response.json()
        
        // Обновляем локальное состояние
        if (profile && updateData) {
          setProfile({
            ...profile,
            ...updateData,
            name: updateData.name || profile.name,
            email: updateData.email || profile.email,
            bio: updateData.bio !== undefined ? updateData.bio : profile.bio,
            city: updateData.city !== undefined ? updateData.city : profile.city,
            birthDate: updateData.birthDate !== undefined ? updateData.birthDate : profile.birthDate,
          })
        } else if (profile) {
          // Базовое обновление без новых данных
          setProfile({
            ...profile,
            name: updatedData.user?.name || profile.name,
            email: updatedData.user?.email || profile.email,
          })
        }
        
        return { success: true, data: updatedData }
      } else {
        const errorData = await response.json()
        return { success: false, error: errorData.error || 'Failed to update profile' }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: 'Network error while updating profile' }
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      if (!isLoaded || !clerkUser) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Сначала пытаемся получить данные из базы данных
        const response = await fetch('/api/profile')
        
        if (response.ok) {
          const data = await response.json()
          console.log('Profile from database:', data)
          
          // Вычисляем красивое имя для отображения
          const displayName = getDisplayName({
            dbName: data.name,
            clerkFullName: clerkUser.fullName,
            clerkFirstName: clerkUser.firstName,
            clerkLastName: clerkUser.lastName,
            email: data.email || clerkUser.primaryEmailAddress?.emailAddress
          })
          
          // Если данные из базы получены успешно
          const profileData: ProfileData = {
            id: data.data.id,
            name: data.data.name || clerkUser.fullName || clerkUser.firstName || 'Unknown',
            email: data.data.email || clerkUser.primaryEmailAddress?.emailAddress || '',
            role: data.data.role,
            avatar: data.data.avatar || clerkUser.imageUrl || null,
            bio: data.data.bio || null,
            city: data.data.city || null,
            birthDate: data.data.birthDate || null,
            isVerified: data.data.isVerified || false,
            // Добавляем статистику отзывов
            reviewsCount: data.data.reviewsCount || 0,
            averageRating: data.data.averageRating || 0,
            positivePercentage: data.data.positivePercentage || 100,
            // Добавляем данные подписки
            subscription: data.data.subscription || { plan: 'Basic', validUntil: 'N/A' },
            hasProProfile: data.data.hasProProfile || false,
            hasCustomerProfile: data.data.hasCustomerProfile || false,
            fromDatabase: true,
            displayName,
            initials: getUserInitials(displayName)
          }
          
          // Если имя равно "Unknown", попробуем обновить его через API
          if (data.name === 'Unknown' || !data.name) {
            console.log('User name is "Unknown", attempting to update...')
            updateProfile() // Вызываем обновление асинхронно
          }
          
          setProfile(profileData)
        } else {
          // Если база недоступна, используем данные из Clerk
          console.log('Database unavailable, using Clerk data')
          const fallbackDisplayName = getDisplayName({
            clerkFullName: clerkUser.fullName,
            clerkFirstName: clerkUser.firstName,
            clerkLastName: clerkUser.lastName,
            email: clerkUser.primaryEmailAddress?.emailAddress
          })
          
          const fallbackProfile: ProfileData = {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            role: undefined, // Роль неизвестна без базы данных
            avatar: clerkUser.imageUrl || undefined,
            bio: undefined,
            city: undefined,
            hasProProfile: false,
            hasCustomerProfile: false,
            fromDatabase: false,
            displayName: fallbackDisplayName,
            initials: getUserInitials(fallbackDisplayName)
          }
          setProfile(fallbackProfile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        
        // В случае ошибки используем данные из Clerk как fallback
        if (clerkUser) {
          const fallbackProfile: ProfileData = {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            role: undefined,
            avatar: clerkUser.imageUrl || undefined,
            bio: undefined,
            city: undefined,
            hasProProfile: false,
            hasCustomerProfile: false,
            fromDatabase: false
          }
          setProfile(fallbackProfile)
          setError('Failed to load profile from database, using cached data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [isLoaded, clerkUser])

  const refetch = async () => {
    if (!isLoaded || !clerkUser) return

    try {
      setLoading(true)
      setError(null)

      // Сначала пытаемся получить данные из базы данных
      const response = await fetch('/api/profile')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Profile from database:', data)
        
        // Если данные из базы получены успешно
        const profileData: ProfileData = {
          id: data.id,
          name: data.name || clerkUser.fullName || clerkUser.firstName || 'Unknown',
          email: data.email || clerkUser.primaryEmailAddress?.emailAddress || '',
          role: data.role,
          avatar: data.avatar || clerkUser.imageUrl || null,
          bio: data.bio || null,
          city: data.city || null,
          hasProProfile: data.hasProProfile || false,
          hasCustomerProfile: data.hasCustomerProfile || false,
          fromDatabase: true
        }
        
        setProfile(profileData)
      } else {
        // Если база недоступна, используем данные из Clerk
        console.log('Database unavailable, using Clerk data')
        const fallbackProfile: ProfileData = {
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          role: undefined, // Роль неизвестна без базы данных
          avatar: clerkUser.imageUrl || undefined,
          bio: undefined,
          city: undefined,
          hasProProfile: false,
          hasCustomerProfile: false,
          fromDatabase: false
        }
        setProfile(fallbackProfile)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      
      // В случае ошибки используем данные из Clerk как fallback
      if (clerkUser) {
        const fallbackProfile: ProfileData = {
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || 'Unknown',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          role: undefined,
          avatar: clerkUser.imageUrl || undefined,
          bio: undefined,
          city: undefined,
          hasProProfile: false,
          hasCustomerProfile: false,
          fromDatabase: false
        }
        setProfile(fallbackProfile)
        setError('Failed to load profile from database, using cached data')
      }
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, updateProfile, refetch }
}
