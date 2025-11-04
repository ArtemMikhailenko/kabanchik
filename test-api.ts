import prisma from './src/lib/prisma.js';

async function testCategoriesAPI() {
  try {
    console.log('Testing categories API logic...');
    
    // Get parent categories with subcategories  
    const parentCategories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      include: {
        subcategories: {
          where: { isActive: true },
          select: { id: true }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    console.log('Found', parentCategories.length, 'parent categories');
    
    if (parentCategories.length === 0) {
      console.log('No parent categories found!');
      return;
    }
    
    // For each parent category, count orders from both the category and its subcategories
    const categoriesWithOrderCounts = await Promise.all(
      parentCategories.slice(0, 3).map(async (category) => {
        // Get all category IDs (parent + subcategories)
        const categoryIds = [category.id, ...category.subcategories.map(sub => sub.id)];
        
        console.log(`Category: ${category.name}, IDs to check: ${categoryIds.join(', ')}`);
        
        // Count orders in this category and all its subcategories
        const orderCount = await prisma.order.count({
          where: {
            categoryId: {
              in: categoryIds
            },
            status: {
              in: ['OPEN', 'IN_PROGRESS', 'COMPLETED']
            }
          }
        });

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          iconColor: category.iconColor,
          ordersCount: orderCount
        };
      })
    );

    console.log('Results:');
    categoriesWithOrderCounts.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.ordersCount} orders`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCategoriesAPI();