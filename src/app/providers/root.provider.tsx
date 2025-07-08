import { QueryProviders } from '@/app/providers'

export function RootProvider({ children }: { children: React.ReactNode }) {
  return <QueryProviders>{children}</QueryProviders>
}
