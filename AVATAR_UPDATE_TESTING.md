# Руководство по тестированию обновления аватара

## Проблема
Аватар не обновлялся в хедере и профиле после загрузки из-за того, что разные компоненты использовали разные источники данных:
- Header использовал `user?.imageUrl` из Clerk
- ProfileHeader использовал `profile?.avatar` из базы данных

## Решение
Обновлены все компоненты для использования данных из базы данных с fallback на Clerk:

### 1. Header компоненты
- ✅ `src/components/header.tsx` - обновлен для использования `useProfile`
- ✅ `src/components/header-new.tsx` - обновлен для использования `useProfile`

### 2. Avatar Upload компонент
- ✅ `src/components/ui/avatar-upload.tsx` - обновлен для отображения аватара из профиля

### 3. Логика приоритетов
```typescript
const avatarUrl = profile?.avatar || user?.imageUrl
const userName = profile?.name || user?.fullName || user?.firstName || 'User'
```

## Тестирование

### 1. Настройка Cloudinary
Убедитесь, что в `.env` настроены переменные:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Запуск приложения
```bash
npm run dev
```

### 3. Тест обновления аватара
1. Войдите в систему
2. Перейдите в настройки профиля
3. Загрузите новый аватар
4. Проверьте, что аватар обновился:
   - ✅ В форме загрузки аватара
   - ✅ В хедере (правый верхний угол)
   - ✅ В профиле пользователя

### 4. Проверка API
Можно протестировать загрузку через API:
```bash
curl -X POST http://localhost:3000/api/profile/avatar \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -F "avatar=@/path/to/test-image.jpg"
```

## Ожидаемое поведение
1. При загрузке нового аватара он сохраняется в Cloudinary
2. URL аватара обновляется в базе данных
3. Компонент загрузки вызывает `refetch()` из useProfile
4. Все компоненты (Header, ProfileHeader) автоматически получают новые данные
5. Аватар обновляется везде без перезагрузки страницы

## Cloudinary особенности
- Автоматическая оптимизация изображений
- Аватары: 400x400px с детекцией лица
- Портфолио: до 800x600px
- Автоматическое сжатие и выбор формата
- CDN доставка по всему миру