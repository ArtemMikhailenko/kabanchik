# Создание Next.js 15+ стартера с нуля (с pnpm)

Пошаговая инструкция по созданию современного стартового шаблона для Next.js 15+ с использованием pnpm - быстрого и эффективного пакетного менеджера.

## 🎯 Что мы будем создавать

Полнофункциональный стартер включающий:
- Next.js 15+ с TypeScript
- Tailwind CSS + shadcn/ui для стилизации
- Clerk для аутентификации
- Prisma ORM + PostgreSQL + Supabase
- ESLint + Prettier + Husky для качества кода

## 🚀 Что такое pnpm и зачем его использовать

**pnpm** - это быстрый и экономящий место пакетный менеджер для Node.js:
- ⚡ **Быстрее** npm и yarn в 2-3 раза
- 💾 **Экономит место** на диске благодаря умному кэшированию
- 🔒 **Безопаснее** - строгая изоляция зависимостей
- 🎯 **Совместим** со всеми npm пакетами

### Установка pnpm

```bash
# Windows (через PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# macOS/Linux (через curl)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Или через npm (если уже установлен)
npm install -g pnpm

# Проверяем установку
pnpm --version
```

### Основные команды pnpm (аналоги npm)

```bash
# npm install → pnpm install (или просто pnpm i)
# npm install package → pnpm add package
# npm install -D package → pnpm add -D package
# npm install -g package → pnpm add -g package
# npm run script → pnpm script (или pnpm run script)
# npm uninstall package → pnpm remove package
```

## 📋 Шаг 1: Создание Next.js проекта

```bash
# Создаем новый Next.js проект с TypeScript
pnpm create next-app@latest my-starter --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd my-starter

# Проверяем, что все установилось
pnpm dev
# Ctrl+C для остановки
```

## 📋 Шаг 2: Настройка Tailwind CSS и shadcn/ui

```bash
# Инициализируем shadcn/ui
pnpm dlx shadcn-ui@latest init

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
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add label
pnpm dlx shadcn-ui@latest add card
pnpm dlx shadcn-ui@latest add form
```

> **Примечание**: `pnpm dlx` - аналог `npx`, выполняет пакеты без установки

## 📋 Шаг 3: Настройка линтинга и форматирования

```bash
# Устанавливаем Prettier
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier

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
```

Обновляем `.eslintrc.json`:

```json
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
```

## 📋 Шаг 4: Настройка Husky и pre-commit hooks

```bash
# Устанавливаем Husky и lint-staged
pnpm add -D husky lint-staged

# Инициализируем Husky
pnpm dlx husky install

# Создаем pre-commit hook
pnpm dlx husky add .husky/pre-commit "pnpm lint-staged"

# Настраиваем lint-staged в package.json
# Добавляем в package.json:
```

Добавляем в `package.json` секцию:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  },
  "scripts": {
    "prepare": "husky install"
  }
}
```

```bash
# Запускаем prepare чтобы настроить husky
pnpm prepare
```

## 📋 Шаг 5: Настройка базы данных (Supabase + Prisma)

```bash
# Устанавливаем Prisma
pnpm add prisma @prisma/client
pnpm add -D prisma

# Инициализируем Prisma
pnpm dlx prisma init
```

1. **Создаем аккаунт на [supabase.com](https://supabase.com)**
2. **Создаем новый проект**
3. **Идем в Settings → Database → Connection string**
4. **Копируем URI строку подключения**

Обновляем `.env`:

```env
# Заменяем [password] на ваш реальный пароль
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
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
pnpm dlx prisma generate

# Применяем схему к базе данных
pnpm dlx prisma db push
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
pnpm add @clerk/nextjs
```

1. **Создаем аккаунт на [clerk.com](https://clerk.com)**
2. **Создаем новое приложение**
3. **Идем в API Keys**
4. **Копируем ключи**

Создаем `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Обновляем `src/app/layout.tsx`:

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

Создаем `src/middleware.ts`:

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

```bash
# Создаем папки
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/app/\(auth\)
```

Обновляем `src/app/page.tsx`:

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

Обновляем секцию `scripts` в `package.json`:

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
    "db:generate": "pnpm dlx prisma generate",
    "db:push": "pnpm dlx prisma db push", 
    "db:studio": "pnpm dlx prisma studio",
    "db:migrate": "pnpm dlx prisma migrate dev",
    "db:seed": "pnpm dlx tsx prisma/seed.ts",
    "prepare": "husky install"
  }
}
```

## 📋 Шаг 9: Создание seed файла для базы данных

```bash
# Устанавливаем tsx для выполнения TypeScript
pnpm add -D tsx
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
    "seed": "pnpm dlx tsx prisma/seed.ts"
  }
}
```

## 📋 Шаг 10: Создание .env.example

Создаем `.env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Clerk Authentication  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase (опционально)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🎉 Финальные шаги

```bash
# Устанавливаем все зависимости (если нужно)
pnpm install

# Форматируем весь код
pnpm format

# Проверяем линтинг
pnpm lint

# Генерируем Prisma Client
pnpm db:generate

# Заполняем базу тестовыми данными
pnpm db:seed

# Запускаем проект
pnpm dev
```

## 💡 Полезные pnpm команды для разработки

```bash
# Установка пакетов
pnpm add package-name              # Продакшн зависимость
pnpm add -D package-name           # Dev зависимость  
pnpm add -g package-name           # Глобально

# Удаление пакетов
pnpm remove package-name           # Удалить пакет
pnpm remove -g package-name        # Удалить глобально

# Информация
pnpm list                          # Список установленных пакетов
pnpm outdated                      # Устаревшие пакеты
pnpm why package-name              # Почему пакет установлен

# Очистка
pnpm store prune                   # Очистить неиспользуемые пакеты из store
pnpm install --frozen-lockfile     # Установка точно по lockfile (CI/CD)

# Запуск скриптов
pnpm dev                          # Краткая форма
pnpm run dev                      # Полная форма
```

## ✅ Что у нас получилось

Полнофункциональный Next.js 15+ стартер с pnpm:

- ✅ TypeScript настроен
- ✅ Tailwind CSS + shadcn/ui  
- ✅ ESLint + Prettier + Husky
- ✅ Clerk аутентификация
- ✅ Prisma ORM + PostgreSQL
- ✅ Supabase интеграция
- ✅ Правильная структура папок
- ✅ Git hooks для качества кода
- ✅ Готовые скрипты для разработки
- ✅ **pnpm** для быстрой установки пакетов

## 🚀 Почему pnpm лучше для этого проекта

- **Скорость**: Установка зависимостей в 2-3 раза быстрее
- **Место на диске**: Экономит до 50% места благодаря умному кэшированию
- **Безопасность**: Строгая изоляция предотвращает phantom dependencies
- **Совместимость**: Работает со всеми npm пакетами без изменений

Теперь у вас есть современная база для любого Next.js проекта с самым быстрым пакетным менеджером!