// Простой тест для проверки обновления профиля
async function testProfileUpdate() {
  try {
    console.log('Testing profile update...')
    
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Profile update successful:', data)
    } else {
      const error = await response.json()
      console.error('Profile update failed:', error)
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}

// Экспортируем для использования в консоли браузера
(window as any).testProfileUpdate = testProfileUpdate