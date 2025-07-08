import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/admin(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/register(.*)',
  '/role-selection',
  '/registration-success',
  '/api/webhooks(.*)',
  '/api/user/create',
])

export default clerkMiddleware(async (auth, req) => {
  const sessionClaims = {
    metadata: async () => {
      const { userId } = await auth()
      if (!userId) return {}

      try {
        const { createClerkClient } = await import('@clerk/nextjs/server')
        const clerkClient = createClerkClient({
          secretKey: process.env.CLERK_SECRET_KEY!,
        })
        const user = await clerkClient.users.getUser(userId)

        return {
          role: user.publicMetadata?.role || null,
          profileCreated: user.publicMetadata?.profileCreated || false,
        }
      } catch (error) {
        console.error('Error fetching user metadata:', error)
        return {}
      }
    },
  }

  if (isPublicRoute(req)) {
    return
  }

  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth()

    if (!userId) {
      return redirectToSignIn()
    }

    if (req.nextUrl.pathname.startsWith('/admin')) {
      const userMetadata = await sessionClaims.metadata()

      if (userMetadata.role !== 'ADMIN') {
        return Response.redirect(new URL('/unauthorized', req.url))
      }
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
