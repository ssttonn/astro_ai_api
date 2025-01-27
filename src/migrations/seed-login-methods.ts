import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    INSERT INTO "LoginMethod" ("user_id", "method", "key", "created_at", "updated_at")
    SELECT 
      "id" AS "user_id",
      'EMAIL' AS "method",
      "email" AS "email",
      NOW() AS "created_at",
      NOW() AS "updated_at"
    FROM "User"
    WHERE "id" NOT IN (
      SELECT DISTINCT "user_id" FROM "LoginMethod"
    );
  `);
  console.log('Default LoginMethod records added successfully!');
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
