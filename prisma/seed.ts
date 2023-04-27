import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';

export * as dotenv from 'dotenv';

const prisma = new PrismaClient();

const createProducts = async (quantity: number) => {
  const products: Product[] = [];

  for (let i = 0; 1 < quantity; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName).toLowerCase(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price(10, 999, 0),
        images: Array.from({
          length: faker.datatype.number({ min: 1, max: 5 }),
        }).map(() => faker.image.imageUrl(500, 500)),
        category: {
          create: {
            name: categoryName,
            slug: faker.helpers.slugify(categoryName).toLowerCase(),
          },
        },
        reviews: {
          create: [
            {
              rating: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: '428a0bb6-c591-4f5f-b8fa-832aeecfb4ab',
                },
              },
            },
            {
              rating: faker.datatype.number({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: '428a0bb6-c591-4f5f-b8fa-832aeecfb4ab',
                },
              },
            },
          ],
        },
      },
    });
    products.push(product);
  }
  console.log(`Created ${products.length} products`);
};

async function main() {
  console.log('Seeding starting...');
  await createProducts(10);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
