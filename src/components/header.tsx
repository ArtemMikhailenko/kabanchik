import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Search, Grid3X3, ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="w-full bg-transparent absolute">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              LOGO
            </Link>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-2xl mx-8">
            <Button
              variant="secondary"
              className="bg-[#ffa657] hover:bg-orange-300 text-gray-800 rounded-full px-4 py-2 flex items-center gap-2"
            >
              <Grid3X3 size={16} />
              Categories
            </Button>

            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              {/* TODO: update to shadcn input */}
              <input
                type="text"
                placeholder="Search for..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-full px-3 py-1 flex items-center gap-1 bg-transparent border-black"
            >
              EN
              <ChevronDown size={14} />
            </Button>

            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button
                    variant="outline"
                    className="rounded-full bg-transparent border-black text-sm px-4 py-2"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <Link href="/role-selection">
                  <Button className="rounded-full bg-[#ffa657] hover:bg-orange-500 text-white text-sm px-4 py-2">
                    Register
                  </Button>
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}
