# Testing Guide

## Seeded Test Accounts

The database has been seeded with test accounts for manual testing.

### 📱 Rider Account

- **Email**: `rider@test.com`
- **User ID**: `test_rider_123`
- **Phone**: `+44 7700 900001`
- **Role**: `RIDER`

### 🚗 Driver Account

- **Email**: `driver@test.com`
- **User ID**: `test_driver_456`
- **Phone**: `+44 7700 900002`
- **Vehicle**: Toyota Prius (TEST123)
- **Wheelchair Capable**: Yes
- **Documents Verified**: Yes
- **Role**: `DRIVER`

## How to Use with Clerk

Since this app uses Clerk for authentication, here's the easiest way to set up a test driver account:

### ⚡ Quick Setup (Easiest Method)

1. **Sign up** in your app with any email
2. **Open browser console** (F12 or right-click → Inspect → Console)
3. **Copy and paste this script**:
   ```javascript
   async function setupDriver() {
     const res = await fetch("/api/users/assign-role", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ role: "DRIVER" }),
     });
     const data = await res.json();
     console.log(data);
     if (res.ok) {
       console.log("✅ Driver role assigned! Redirecting...");
       setTimeout(() => (window.location.href = "/driver"), 500);
     } else {
       console.error("❌ Failed:", data);
     }
   }
   setupDriver();
   ```
4. Press Enter - you'll be redirected to `/driver` with full access!

### Alternative: Use the UI

1. **Sign up** in your app with `driver@test.com` (or any email)
2. **Open browser console** and run this to get your Clerk ID:
   ```javascript
   fetch("/api/users/me")
     .then((r) => r.json())
     .then(console.log);
   ```
3. **Copy your user ID** from the console output
4. **Run these SQL commands** in your database (replace `<YOUR_CLERK_ID>`):

   ```sql
   -- Delete the test driver user (we'll use your real Clerk user)
   DELETE FROM "Driver" WHERE id = 'test_driver_456';
   DELETE FROM "User" WHERE id = 'test_driver_456';

   -- Update your user to be a driver with all the test data
   UPDATE "User" SET role = 'DRIVER' WHERE id = '<YOUR_CLERK_ID>';

   -- Create a driver record with all the test data
   INSERT INTO "Driver" (
     id, "isOnline", "vehicleMake", "vehicleModel", "vehiclePlate",
     "wheelchairCapable", "docsVerified", "licenseNumber",
     "insuranceExpiry", "wheelchairTraining", phone,
     "lastLat", "lastLng", "updatedAt"
   ) VALUES (
     '<YOUR_CLERK_ID>', false, 'Toyota', 'Prius', 'TEST123',
     true, true, 'TEST-LIC-001',
     '2026-12-31', true, '+44 7700 900002',
     51.5074, -0.1278, NOW()
   )
   ON CONFLICT (id) DO UPDATE SET
     "vehicleMake" = 'Toyota',
     "vehicleModel" = 'Prius',
     "vehiclePlate" = 'TEST123',
     "wheelchairCapable" = true,
     "docsVerified" = true,
     "licenseNumber" = 'TEST-LIC-001',
     "insuranceExpiry" = '2026-12-31',
     "wheelchairTraining" = true,
     phone = '+44 7700 900002';
   ```

5. **Refresh the page** - you should now have full driver access!

### Alternative: Use Role-Select Page

1. Sign up with any email in Clerk
2. Visit `/role-select` to manually assign yourself a role
3. Choose "Driver" to access driver features
4. The system will create a basic driver record automatically (without test vehicle data)

### For Rider Testing

Riders are auto-created on first sign-up:

1. Sign up with any email
2. You'll automatically get the RIDER role
3. Navigate to `/rider` to start booking rides

### Option 3: Fresh test accounts (Recommended)

Instead of using seed data, just:

1. Sign up as a driver at `/driver-signup` - follow the onboarding flow
2. Sign up as a rider - any new user is auto-assigned the `RIDER` role
3. Test with real Clerk authentication and fresh data

## Re-running the Seed

To reset the test data:

```bash
npm run prisma:seed
```

This will upsert the accounts, so it's safe to run multiple times.

## Testing Scenarios

### Rider Testing

1. Log in as the rider
2. Navigate to `/rider`
3. Create a booking
4. Test the chat/messaging feature
5. Verify PIN code at pickup

### Driver Testing

1. Log in as the driver
2. Navigate to `/driver`
3. Toggle online status
4. Accept bookings
5. Update location
6. Complete rides
7. Check earnings at `/driver/earnings`

### Admin/Dispatcher Testing

You'll need to create an admin account separately and assign the appropriate role.
