const { faker } = require("@faker-js/faker");
const prisma = require("./server");

const main = async () => {
  for (let i = 1; i <= 10; i++) {
    // Seed users
    await prisma.user.create({
      data: {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    // Seed articles
    await prisma.article.create({
      data: {
        title: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        author: {
          connect: {
            id: i + 27,
          },
        },
      },
    });

    // Seed comments
    await prisma.comment.create({
      data: {
        content: faker.lorem.sentence(),
        article: {
          connect: {
            id: i + 14,
          },
        },
        author: {
          connect: {
            id: i + 27,
          },
        },
      },
    });

    // Seed categories
    await prisma.category.create({
      data: {
        name: faker.lorem.word(),
      },
    });

    console.log("Data seeded successfully");
  }
};

module.exports = main;
