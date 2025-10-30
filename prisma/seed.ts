import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@vendorbuddy.dev" },
    update: {},
    create: { email: "demo@vendorbuddy.dev", name: "Demo", credits: 10 },
  });

  const event = await prisma.event.create({
    data: {
      name: "Murrieta Night Market",
      location: "Murrieta, CA",
      category: "Night Market",
      startDate: new Date("2025-08-10"),
      endDate: new Date("2025-08-10"),
    },
  });

  await prisma.report.create({
    data: {
      userId: user.id,
      eventId: event.id,
      grossRevenue: 950,
      feesPaid: 150,
      hoursWorked: 7,
      date: new Date("2025-08-10"),
      notes: "Solid foot traffic; peak 6–8pm"
    }
  });

  console.log("Seeded demo data.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
