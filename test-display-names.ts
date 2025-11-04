import { getDisplayName, getUserInitials } from './src/lib/user-utils'

// Тестируем различные сценарии
console.log('Testing display name utility functions...\n')

const testCases = [
  {
    name: 'User with proper database name',
    input: {
      dbName: 'John Doe',
      clerkFullName: 'John Smith',
      email: 'john@example.com'
    }
  },
  {
    name: 'User with email as database name',
    input: {
      dbName: 'john.doe@example.com',
      clerkFullName: null,
      email: 'john.doe@example.com'
    }
  },
  {
    name: 'User with "Unknown" database name',
    input: {
      dbName: 'Unknown',
      clerkFullName: 'John Clerk',
      clerkFirstName: 'John',
      clerkLastName: 'Clerk',
      email: 'john@example.com'
    }
  },
  {
    name: 'User with null database name',
    input: {
      dbName: null,
      clerkFirstName: 'Jane',
      clerkLastName: 'Smith',
      email: 'jane.smith@example.com'
    }
  },
  {
    name: 'User with only email',
    input: {
      dbName: null,
      clerkFullName: null,
      email: 'user123@company.com'
    }
  },
  {
    name: 'User with complex email',
    input: {
      dbName: null,
      clerkFullName: null,
      email: 'first.last+tag@example.co.uk'
    }
  },
  {
    name: 'User with only first name in Clerk',
    input: {
      dbName: 'Unknown',
      clerkFirstName: 'Alex',
      email: 'alex@test.com'
    }
  }
]

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`)
  console.log(`   Input:`, testCase.input)
  
  const displayName = getDisplayName(testCase.input)
  const initials = getUserInitials(displayName)
  
  console.log(`   Display Name: "${displayName}"`)
  console.log(`   Initials: "${initials}"`)
  console.log('')
})

console.log('Testing complete!')