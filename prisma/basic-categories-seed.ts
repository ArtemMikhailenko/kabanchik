import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simplified categories for initial setup
const basicCategories = [
  { name: "Домашний мастер", slug: "home-services" },
  { name: "Ремонт техники", slug: "tech-repair" },
  { name: "Отделочные работы", slug: "finishing-works" },
  { name: "Строительные работы", slug: "construction-works" },
  { name: "Мебельные работы", slug: "furniture-services" },
  { name: "Клининговые услуги", slug: "cleaning-services" },
  { name: "Транспортные услуги", slug: "transport-services" },
  { name: "Бытовые услуги", slug: "household-services" },
  { name: "Ремонт авто", slug: "auto-repair" },
  { name: "Путешествия", slug: "travel" },
  { name: "Курьерские услуги", slug: "courier-services" },
  { name: "Digital marketing", slug: "digital-marketing" },
  { name: "AI услуги", slug: "ai-services" },
  { name: "Деловые услуги", slug: "business-services" },
  { name: "Услуги для животных", slug: "pet-services" },
  { name: "Услуги красоты и здоровья", slug: "beauty-health" },
  { name: "Организация праздников", slug: "event-organization" },
  { name: "Бюро переводов", slug: "translation-services" },
  { name: "Репетиторы", slug: "tutoring" },
  { name: "Разработка сайтов", slug: "web-development" },
  { name: "Фото и видео", slug: "photo-video" },
  { name: "Кулинария", slug: "culinary" },
  { name: "Услуги тренеров", slug: "training-services" },
  { name: "Дизайн", slug: "design" },
  { name: "Психологическая поддержка", slug: "psychological-support" },
  { name: "Медицинские услуги", slug: "medical-services" },
  { name: "Обучение", slug: "education" },
  { name: "Охрана", slug: "security" }
]

export async function seedBasicCategories() {
  console.log('🌱 Seeding basic categories...')
  
  // Check if categories already exist
  const existingCategories = await prisma.category.findMany()
  if (existingCategories.length > 0) {
    console.log('📁 Categories already exist. Skipping seed...')
    return
  }
  
  // Create categories
  for (const categoryData of basicCategories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        slug: categoryData.slug,
        isActive: true
      }
    })
    
    console.log(`✅ Created category: ${category.name}`)
  }
  
  console.log('✨ Basic categories seeded successfully!')
}

if (require.main === module) {
  seedBasicCategories()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
