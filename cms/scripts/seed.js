import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function run() {
  const tips = await prisma.category.upsert({
    where: { slug: 'tips' },
    update: {},
    create: { name: 'Tips', slug: 'tips' }
  })
  const reviews = await prisma.category.upsert({
    where: { slug: 'reviews' },
    update: {},
    create: { name: 'Reviews', slug: 'reviews' }
  })

  await prisma.post.upsert({
    where: { slug: '10-essential-golf-tips-for-beginners' },
    update: {},
    create: {
      title: '10 Essential Golf Tips for Beginners',
      slug: '10-essential-golf-tips-for-beginners',
      excerpt: 'Starting your golf journey? These fundamental tips will help you build a solid foundation and improve your game from day one.',
      content: '# 10 Essential Golf Tips for Beginners\n\nYour grip is the foundation of your swing...\n',
      author: 'Mike Johnson',
      date: new Date('2024-01-15T00:00:00.000Z'),
      image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=200&fit=crop',
      featured: true,
      categoryId: tips.id,
    }
  })

  await prisma.post.upsert({
    where: { slug: 'pebble-beach-golf-links-complete-review' },
    update: {},
    create: {
      title: 'Pebble Beach Golf Links: A Complete Review',
      slug: 'pebble-beach-golf-links-complete-review',
      excerpt: 'Discover what makes Pebble Beach one of the world\'s most iconic golf courses in our comprehensive review.',
      content: '# Pebble Beach Golf Links: A Complete Review\n\n...\n',
      author: 'Sarah Williams',
      date: new Date('2024-01-10T00:00:00.000Z'),
      image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=200&fit=crop',
      featured: true,
      categoryId: reviews.id,
    }
  })
}

run().then(() => {
  console.log('Seed complete')
  process.exit(0)
}).catch((e) => {
  console.error(e)
  process.exit(1)
})
