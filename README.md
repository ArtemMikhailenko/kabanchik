# Создание Next.js 15+ стартера с нуля

Пошаговая инструкция по созданию современного стартового шаблона для Next.js 15+ с полным стеком технологий.

## 🎯 Что мы будем создавать

Полнофункциональный стартер включающий:
- Next.js 15+ с TypeScript
- Tailwind CSS + shadcn/ui для стилизации
- Clerk для аутентификации
- Prisma ORM + PostgreSQL + Supabase
- ESLint + Prettier + Husky для качества кода

## 📋 Шаг 1: Создание Next.js проекта

```bash
# Создаем новый Next.js проект с TypeScript
npx create-next-app@latest my-starter --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd my-starter
```

## 📋 Шаг 2: Настройка Tailwind CSS и shadcn/ui

```bash
# Инициализируем shadcn/ui
npx shadcn-ui@latest init

# При инициализации выбираем:
# - Would you like to use TypeScript? Yes
# - Which style would you like to use? Default
# - Which color would you like to use as base color? Slate
# - Where is your global CSS file? src/app/globals.css
# - Would you like to use CSS variables for colors? Yes
# - Where is your tailwind.config.js located? tailwind.config.js
# - Configure the import alias for components? src/components
# - Configure the import alias for utils? src/lib/utils

# Устанавливаем базовые компоненты
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
```

## 📋 Шаг 3: Настройка линтинга и форматирования

```bash
# Устанавливаем Prettier
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Создаем .prettierrc
echo '{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}' > .prettierrc

# Создаем .prettierignore
echo 'node_modules
.next
out
dist
*.md' > .prettierignore

# Обновляем .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
EOF
```

## 📋 Шаг 4: Настройка Husky и pre-commit hooks

```bash
# Устанавливаем Husky и lint-staged
npm install --save-dev husky lint-staged

# Инициализируем Husky
npx husky install

# Создаем pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Настраиваем lint-staged в package.json
npm pkg set lint-staged.*.{js,jsx,ts,tsx}="[\"eslint --fix\", \"prettier --write\"]"
npm pkg set lint-staged.*.{json,md}="[\"prettier --write\"]"

# Добавляем prepare script
npm pkg set scripts.prepare="husky install"
```

## 📋 Шаг 5: Настройка базы данных (Supabase + Prisma)

```bash
# Устанавливаем Prisma
npm install prisma @prisma/client
npm install --save-dev prisma

# Инициализируем Prisma
npx prisma init

# Создаем аккаунт на supabase.com и создаем новый проект
# Получаем DATABASE_URL из настроек проекта

# Обновляем .env (создастся автоматически)
# DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

Создаем базовую схему в `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

```bash
# Генерируем Prisma Client
npx prisma generate

# Применяем схему к базе данных
npx prisma db push
```

Создаем `src/lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

## 📋 Шаг 6: Настройка аутентификации (Clerk)

```bash
# Устанавливаем Clerk
npm install @clerk/nextjs
```

```bash
# Создаем аккаунт на clerk.com
# Создаем новое приложение
# Копируем ключи в .env.local
```

Добавляем в `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Создаем `src/app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js Starter',
  description: 'Modern Next.js starter with full stack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

Создаем middleware для защищенных маршрутов `src/middleware.ts`:

```typescript
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

## 📋 Шаг 7: Создание базовой структуры

Создаем папки:

```bash
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/app/(auth)
```

Создаем `src/app/page.tsx`:

```typescript
import { UserButton, auth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { userId } = auth()

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Next.js Starter</h1>
        {userId && <UserButton />}
      </div>
      
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Добро пожаловать в современный Next.js стартер!
        </p>
        <Button>Начать работу</Button>
      </div>
    </main>
  )
}
```

## 📋 Шаг 8: Обновление package.json scripts

Добавляем полезные скрипты в `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## 📋 Шаг 9: Создание seed файла для базы данных

Устанавливаем tsx для выполнения TypeScript:

```bash
npm install --save-dev tsx
```

Создаем `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Начинаем заполнение базы данных...')
  
  // Создаем тестовые данные
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Тестовый пользователь',
    },
  })

  console.log('База данных заполнена!', { user })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Добавляем в `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## 📋 Шаг 10: Создание .env.example

```bash
# Создаем пример файла окружения
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase (опционально)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
EOF
```

## 🎉 Финальные шаги

```bash
# Устанавливаем все зависимости
npm install

# Форматируем весь код
npm run format

# Проверяем линтинг
npm run lint

# Генерируем Prisma Client
npm run db:generate

# Запускаем проект
npm run dev
```

## ✅ Что у нас получилось

Полнофункциональный Next.js 15+ стартер с:

- ✅ TypeScript настроен
- ✅ Tailwind CSS + shadcn/ui
- ✅ ESLint + Prettier + Husky
- ✅ Clerk аутентификация  
- ✅ Prisma ORM + PostgreSQL
- ✅ Supabase интеграция
- ✅ Правильная структура папок
- ✅ Git hooks для качества кода
- ✅ Готовые скрипты для разработки

Теперь у вас есть современная база для любого Next.js проекта!
