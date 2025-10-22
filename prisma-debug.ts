// File: debug-prisma.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable full logging
});

// --- REPLACE WITH REAL, VALID OBJECTIDs FROM YOUR DATABASE ---
const testUserId = "68f25dd8cf58f82295c0ffd2"; // Example: Replace this
const testSellerId = "68f31ca840bf26ed5a071d44"; // Example: Replace this

async function main() {
  console.log("--- Starting Prisma Debug Script ---");

  try {
    // 1. Attempt to create the conversation group
    console.log("Creating conversationGroup...");
    const newGroup = await prisma.conversationGroup.create({
      data: {
        isGroup: false,
        creatorId: testUserId,
        participantsIds: [testUserId, testSellerId],
      },
    });
    console.log("✅ conversationGroup created successfully:", newGroup.id);

    // 2. Attempt to create the participants using two separate 'create' calls
    console.log("Creating participant for user...");
    await prisma.participant.create({
      data: {
        conversationId: newGroup.id,
        userId: testUserId,
      },
    });
    console.log("✅ User participant created.");

    console.log("Creating participant for seller...");
    await prisma.participant.create({
      data: {
        conversationId: newGroup.id,
        sellerId: testSellerId,
      },
    });
    console.log("✅ Seller participant created.");

    console.log("\n🎉 --- Script completed successfully! --- 🎉");

  } catch (error) {
    console.error("\n❌ --- SCRIPT FAILED --- ❌");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log("\n--- Prisma client disconnected. ---");
  }
}

main();