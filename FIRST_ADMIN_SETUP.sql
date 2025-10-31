/**
 * First Admin Setup Script
 * 
 * Run this ONCE to create your first admin account.
 * After this, admins can assign other admins through the UI.
 * 
 * INSTRUCTIONS:
 * 1. Sign up in your app with your admin email
 * 2. Get your Clerk user ID from browser console:
 *    fetch('/api/users/me').then(r => r.json()).then(d => console.log(d))
 * 3. Replace <YOUR_CLERK_ID> below with your actual ID
 * 4. Run this in your database (PostgreSQL):
 */

-- Replace <YOUR_CLERK_ID> with your actual Clerk user ID
UPDATE "User" 
SET role = 'ADMIN' 
WHERE id = '<YOUR_CLERK_ID>';

-- Verify it worked:
SELECT id, email, role FROM "User" WHERE role = 'ADMIN';

/**
 * Alternative: Using Prisma Studio
 * 
 * 1. Run: npx prisma studio
 * 2. Open User table
 * 3. Find your user
 * 4. Change role to "ADMIN"
 * 5. Save
 */
