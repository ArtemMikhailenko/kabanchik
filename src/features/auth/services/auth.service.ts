import { createClerkClient } from '@clerk/nextjs/server'

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

class AuthService {
  async signIn() {
    return clerkClient.organizations.createOrganization({
      name: 'Default Organization',
    })
  }
}

export const authService = new AuthService()
