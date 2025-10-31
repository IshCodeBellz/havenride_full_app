-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "accessibilityNotes" TEXT,
ADD COLUMN     "clientComfort" TEXT,
ADD COLUMN     "documentedAt" TIMESTAMP(3),
ADD COLUMN     "issuesReported" TEXT,
ADD COLUMN     "rideQuality" TEXT;
