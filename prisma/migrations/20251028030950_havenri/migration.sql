-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('REQUESTED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('RIDER', 'DRIVER', 'DISPATCHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rider" (
    "id" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "vehiclePlate" TEXT,
    "wheelchairCapable" BOOLEAN NOT NULL DEFAULT false,
    "lastLat" DOUBLE PRECISION,
    "lastLng" DOUBLE PRECISION,
    "docsVerified" BOOLEAN NOT NULL DEFAULT false,
    "licenseNumber" TEXT,
    "insuranceExpiry" TIMESTAMP(3),
    "wheelchairTraining" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "driverId" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "pickupLat" DOUBLE PRECISION,
    "pickupLng" DOUBLE PRECISION,
    "dropoffLat" DOUBLE PRECISION,
    "dropoffLng" DOUBLE PRECISION,
    "pickupTime" TIMESTAMP(3) NOT NULL,
    "requiresWheelchair" BOOLEAN NOT NULL DEFAULT false,
    "specialNotes" TEXT,
    "priceEstimate" JSONB,
    "paymentIntentId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
    "estimatedDistance" DOUBLE PRECISION,
    "estimatedDuration" DOUBLE PRECISION,
    "riderPhone" TEXT,
    "driverPhone" TEXT,
    "finalFareAmount" DOUBLE PRECISION,
    "finalFareCurrency" TEXT DEFAULT 'GBP',
    "pinCode" INTEGER NOT NULL,
    "pickupVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "sender" "SenderType" NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "baseFare" DOUBLE PRECISION NOT NULL DEFAULT 6.0,
    "perKm" DOUBLE PRECISION NOT NULL DEFAULT 1.8,
    "wheelchairMult" DOUBLE PRECISION NOT NULL DEFAULT 1.15,
    "provider" TEXT NOT NULL DEFAULT 'fallback',
    "requirePickupPin" BOOLEAN NOT NULL DEFAULT true,
    "sendReceipts" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
