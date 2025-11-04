export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    description: 'Базовый план для начинающих специалистов',
    price: 0,
    priceId: '', // Бесплатный план
    features: [
      'Базовый профиль',
      'До 5 откликов в месяц',
      'Стандартная поддержка'
    ],
    limits: {
      responsesPerMonth: 5,
      portfolioItems: 3
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    description: 'Для активных специалистов',
    price: 990, // 9.90 USD в центах
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    features: [
      'Расширенный профиль',
      'До 50 откликов в месяц',
      'Приоритетная поддержка',
      'Статистика и аналитика',
      'Возможность добавлять до 10 работ в портфолио'
    ],
    limits: {
      responsesPerMonth: 50,
      portfolioItems: 10
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    description: 'Максимальные возможности для профессионалов',
    price: 1990, // 19.90 USD в центах
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
    features: [
      'Премиум профиль',
      'Неограниченные отклики',
      'VIP поддержка',
      'Детальная аналитика',
      'Неограниченное портфолио',
      'Размещение в топе результатов поиска',
      'Персональный менеджер'
    ],
    limits: {
      responsesPerMonth: -1, // Неограниченно
      portfolioItems: -1 // Неограниченно
    }
  }
}

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS

export const getSubscriptionPlan = (planId: SubscriptionPlanId) => {
  return SUBSCRIPTION_PLANS[planId]
}

export const getAllSubscriptionPlans = () => {
  return Object.values(SUBSCRIPTION_PLANS)
}

export const formatPrice = (priceInCents: number) => {
  return (priceInCents / 100).toFixed(2)
}