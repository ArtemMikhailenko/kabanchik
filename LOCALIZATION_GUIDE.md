# Інструкція по завершенню локалізації проекту

## ✅ Що вже зроблено:

1. Встановлено `next-intl`
2. Створено файли перекладів `/messages/en.json` та `/messages/ru.json`
3. Створено конфігурацію i18n в `/src/i18n.ts`
4. Оновлено `next.config.ts` для підтримки next-intl
5. Оновлено middleware для підтримки локалізації + Clerk
6. Створено layout для локалей `/src/app/[locale]/layout.tsx`
7. Створено компонент перемикача мови `<LanguageSwitcher />`

## 📋 Що потрібно зробити далі:

### 1. Додати перемикач мови в Header

У файл `/src/components/header-new.tsx` додати імпорт та компонент:

```tsx
import LanguageSwitcher from './language-switcher'

// Додати в розмітку header (біля Sign In або Profile):
<LanguageSwitcher />
```

### 2. Оновити Root Layout

У файлі `/src/app/layout.tsx` обгорнути children в `NextIntlClientProvider`:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### 3. Використання перекладів в компонентах

#### Для Client Components:
```tsx
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('specialist')
  
  return <div>{t('reviews')}</div>
}
```

#### Для Server Components:
```tsx
import { useTranslations } from 'next-intl'

export default function MyServerComponent() {
  const t = useTranslations('specialist')
  
  return <div>{t('reviews')}</div>
}
```

### 4. Приклади застосування в існуючих файлах:

#### `/src/app/specialists/[id]/page.tsx`:
```tsx
'use client'
import { useTranslations } from 'next-intl'

// В компоненті:
const t = useTranslations('specialist')

// Замінити:
- "Reviews" → {t('reviewsTab')}
- "Services" → {t('services')}
- "Photos of the works" → {t('photosOfWorks')}
- "No reviews yet" → {t('noReviewsYet')}
- "reviews" → {t('reviews')}
- "positive" → {t('positive')}
- "Quality of work:" → {t('qualityOfWork')}
- "view profile" → {t('viewProfile')}
```

#### `/src/components/customer/order-completion-section.tsx`:
```tsx
'use client'
import { useTranslations } from 'next-intl'

const t = useTranslations('review')

// Замінити:
- "send a review" → {t('sendReview')}
- "close the order" → {t('closeOrder')}
```

#### `/src/app/(auth)/order/[id]/page.tsx`:
```tsx
'use client'
import { useTranslations } from 'next-intl'

const tOrder = useTranslations('order')

// Замінити статуси:
- "Waiting for a specialist" → {tOrder('status.open')}
- "Order in progress" → {tOrder('status.inProgress')}
- "Completed" → {tOrder('status.completed')}
- "Cancelled" → {tOrder('status.cancelled')}
```

### 5. Додати більше перекладів

Відредагуйте файли `/messages/en.json` та `/messages/ru.json`, додавши всі тексти з вашого проекту:

- Форми створення замовлення
- Описи категорій
- Повідомлення про помилки
- Кнопки та лейбли
- FAQ тексти
- Footer тексти

### 6. Структура URL

Після налаштування локалізації URL будуть виглядати так:
- Англійська: `/en/specialists/123`
- Російська: `/ru/specialists/123` або просто `/specialists/123` (за замовчуванням)

### 7. Тестування

1. Запустіть сервер: `pnpm dev`
2. Перевірте що сайт відкривається на обох мовах
3. Перевірте перемикач мови
4. Перевірте що всі сторінки працюють з обома мовами

## 🔧 Корисні команди:

```bash
# Перевірка типів TypeScript
pnpm type-check

# Білд проекту
pnpm build

# Запуск dev сервера
pnpm dev
```

## 📚 Додаткові ресурси:

- [next-intl документація](https://next-intl-docs.vercel.app/)
- [Приклади next-intl](https://github.com/amannn/next-intl/tree/main/examples)

## ⚠️ Важливі примітки:

1. **API routes** не потребують локалізації (вони залишаються без префікса локалі)
2. **Clerk auth** маршрути теж залишаються без локалі
3. Для **динамічних маршрутів** (як `/order/[id]`) потрібно додати локаль: `/[locale]/order/[id]`
4. **Дефолтна мова** - російська (`ru`), тому `/` та `/ru/` ведуть на одну сторінку

## 🎯 Пріоритетні файли для локалізації:

1. ✅ Header/Footer компоненти
2. ✅ Сторінка спеціаліста
3. ✅ Сторінка замовлення
4. ✅ Профіль користувача  
5. ✅ Форми створення замовлення
6. Landing page
7. Категорії
8. Пошук

Після застосування локалізації до всіх компонентів, ваш сайт буде повністю двомовним! 🌍
