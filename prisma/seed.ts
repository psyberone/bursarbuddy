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
  for (const user of users) {
    const { password, ...rest } = user;
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...rest, passwordHash: bcrypt.hashSync(password, 10) },
    });
  }
  console.log(`seeded ${users.length} users`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
