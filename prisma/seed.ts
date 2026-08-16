import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    email: "victim@example.edu",
    password: "hunter2victim",
    fullName: "Dana Whitfield",
    campusAddress: "228 Rockwell Hall, 1600 Campus Loop",
    phone: "555-0142",
    studentId: "FAKE-882014",
    bankLast4: "0000",
  },
  {
    email: "attacker@example.edu",
    password: "hunter2attacker",
    fullName: "Cory Lindqvist",
    campusAddress: "119 Rockwell Hall, 1600 Campus Loop",
    phone: "555-0177",
    studentId: "FAKE-882015",
    bankLast4: "0000",
  },
];

async function main() {
  const createdUsers = [];
  for (const user of users) {
    const { password, ...rest } = user;
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...rest, passwordHash: bcrypt.hashSync(password, 10) },
    });
    createdUsers.push(created);
  }
  console.log(`seeded ${createdUsers.length} users`);

  const [victim, attacker] = createdUsers;

  const group = await prisma.expenseGroup.create({
    data: { name: "Apartment 4B" },
  });

  await prisma.groupMember.createMany({
    data: [
      { userId: victim.id, groupId: group.id },
      { userId: attacker.id, groupId: group.id },
    ],
  });

  await prisma.expense.createMany({
    data: [
      { userId: victim.id, groupId: group.id, description: "Groceries at Kroger", amountCents: 8432 },
      { userId: victim.id, groupId: group.id, description: "Textbook: Intro to Statistics", amountCents: 12100 },
      { userId: victim.id, description: "Coffee", amountCents: 475 },
      { userId: attacker.id, groupId: group.id, description: "Internet bill", amountCents: 6000 },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
