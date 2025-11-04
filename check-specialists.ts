import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const specialists = await prisma.pro.findMany({
    where: { isActive: true },
    include: {
      user: true,
      profile: true
    },
    take: 5
  });
  
  console.log('Total active specialists:', specialists.length);
  specialists.forEach(spec => {
    console.log(`- ${spec.user.name}: verified: ${spec.isVerified}, has profile: ${!!spec.profile}`);
    if (spec.profile) {
      console.log(`  categories: ${spec.profile.categories}`);
    }
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);