import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create test rider
  const testRider = await prisma.user.upsert({
    where: { email: "rider@test.com" },
    update: {},
    create: {
      id: "test_rider_123",
      email: "rider@test.com",
      name: "Test Rider",
      role: "RIDER",
      rider: {
        create: {
          phone: "+44 7700 900001",
        },
      },
    },
  });
  console.log("✅ Created rider:", testRider.email);

  // Create test driver
  const testDriver = await prisma.user.upsert({
    where: { email: "driver@test.com" },
    update: {},
    create: {
      id: "test_driver_456",
      email: "driver@test.com",
      name: "Test Driver",
      role: "DRIVER",
      driver: {
        create: {
          phone: "+44 7700 900002",
          vehicleMake: "Toyota",
          vehicleModel: "Prius",
          vehiclePlate: "TEST123",
          wheelchairCapable: true,
          docsVerified: true,
          licenseNumber: "TEST-LIC-001",
          insuranceExpiry: new Date("2026-12-31"),
          wheelchairTraining: true,
          isOnline: false,
          lastLat: 51.5074, // London
          lastLng: -0.1278,
        },
      },
    },
  });
  console.log("✅ Created driver:", testDriver.email);

  // Create default settings if not exists
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      baseFare: 6.0,
      perKm: 1.8,
      wheelchairMult: 1.15,
      provider: "fallback",
      requirePickupPin: true,
      sendReceipts: true,
    },
  });
  console.log("✅ Created settings");

  console.log("🎉 Seed completed successfully!");
  console.log("\nTest Accounts:");
  console.log("─────────────────────────────────────");
  console.log("📱 Rider Account:");
  console.log("   Email: rider@test.com");
  console.log("   ID: test_rider_123");
  console.log("   Phone: +44 7700 900001");
  console.log("");
  console.log("🚗 Driver Account:");
  console.log("   Email: driver@test.com");
  console.log("   ID: test_driver_456");
  console.log("   Phone: +44 7700 900002");
  console.log("   Vehicle: Toyota Prius (TEST123)");
  console.log("   Wheelchair capable: Yes");
  console.log("─────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
