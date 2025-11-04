/**
 * Utility functions for user display names
 */

/**
 * Get a user-friendly display name from various user data sources
 */
export function getDisplayName(options: {
  dbName?: string | null
  clerkFullName?: string | null
  clerkFirstName?: string | null
  clerkLastName?: string | null
  email?: string | null
}): string {
  const { dbName, clerkFullName, clerkFirstName, clerkLastName, email } = options

  // If database name exists and is not email/unknown, use it
  if (dbName && dbName !== 'Unknown' && dbName !== 'null' && !isEmail(dbName)) {
    return dbName
  }

  // Try Clerk names
  if (clerkFullName) {
    return clerkFullName
  }

  if (clerkFirstName && clerkLastName) {
    return `${clerkFirstName} ${clerkLastName}`
  }

  if (clerkFirstName) {
    return clerkFirstName
  }

  if (clerkLastName) {
    return clerkLastName
  }

  // If we have email in database name, try to make it prettier
  if (dbName && isEmail(dbName)) {
    return getNameFromEmail(dbName)
  }

  // Fallback to email
  if (email) {
    return getNameFromEmail(email)
  }

  return 'User'
}

/**
 * Extract a display name from email address
 */
function getNameFromEmail(email: string): string {
  if (!email) return 'User'
  
  // Get the part before @
  const localPart = email.split('@')[0]
  
  // Remove common email separators and numbers
  const cleaned = localPart
    .replace(/[._+-]/g, ' ')
    .replace(/\d+/g, '')
    .trim()
  
  // Capitalize words
  const words = cleaned.split(' ').filter(word => word.length > 0)
  if (words.length === 0) return 'User'
  
  const capitalized = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    
  return capitalized || 'User'
}

/**
 * Check if a string is an email address
 */
function isEmail(str: string): boolean {
  if (!str) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(name: string): string {
  if (!name) return 'U'
  
  // If it's an email, get initials from the local part
  if (isEmail(name)) {
    const cleanName = getNameFromEmail(name)
    return getInitialsFromName(cleanName)
  }
  
  return getInitialsFromName(name)
}

function getInitialsFromName(name: string): string {
  const words = name.split(' ').filter(word => word.length > 0)
  
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }
  
  if (words.length === 1) {
    return words[0][0].toUpperCase()
  }
  
  return 'U'
}