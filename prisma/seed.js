const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Marketing Mix Modeling",
      slug: "marketing-mix-modeling",
      description: "Articles on Marketing Mix Modeling (MMM).",
    },
    {
      name: "Marketing Analytics",
      slug: "marketing-analytics",
      description: "Marketing analytics and attribution.",
    },
    {
      name: "Decision Intelligence",
      slug: "decision-intelligence",
      description: "Decision intelligence and optimization.",
    },
    {
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description: "AI, ML and Generative AI.",
    },
    {
      name: "Data Engineering",
      slug: "data-engineering",
      description: "Data engineering and pipelines.",
    },
    {
      name: "Company News",
      slug: "company-news",
      description: "RainMan company announcements.",
    },
  ];

  for (const category of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✅ Blog categories seeded.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });