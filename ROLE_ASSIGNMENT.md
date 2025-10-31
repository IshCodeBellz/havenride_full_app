# Role Assignment Strategy for HavenRide

## Overview

This document explains how users get assigned roles in the HavenRide app using Clerk authentication.

## Role Types

- **RIDER** - Regular users who book rides
- **DRIVER** - Verified drivers who provide rides
- **DISPATCHER** - Staff who manage ride assignments
- **ADMIN** - Full system access

## Role Assignment Methods

### 1. **Default: New Users → RIDER** ✅

- **When**: Any new user signs up (not through driver signup)
- **How**: `/api/users/ensure-role` automatically assigns RIDER
- **Where**: Triggered on first page visit after signup
- **File**: `app/api/users/ensure-role/route.ts`

### 2. **Driver Signup → DRIVER** ✅

- **When**: User signs up via `/driver-signup`
- **How**: After Clerk signup, automatically assigns DRIVER role
- **Where**: `app/driver-signup/page.tsx` calls `/api/users/assign-role`
- **Process**:
  1. User fills driver application form
  2. If signed in: Immediately assigns DRIVER role
  3. If not signed in: Shows "sign in" prompt, then assigns role
  4. Creates Driver record in database with vehicle details

### 3. **Manual Assignment → ADMIN/DISPATCHER** 🔐

- **When**: Internal staff needs special access
- **How**: Admin uses `/role-select` page
- **Where**: `app/role-select/page.tsx`
- **Security**: ⚠️ Should be protected (see improvements below)

### 4. **Clerk Webhooks (Recommended)** 🎯

- **When**: Real-time on Clerk user creation
- **How**: Clerk sends webhook → Your API → Assign role based on signup path
- **Where**: Create `app/api/webhooks/clerk/route.ts`
- **Benefits**:
  - Instant role assignment
  - More reliable than client-side
  - Can track signup source

## Current Implementation Issues

### ⚠️ Problems:

1. `/role-select` is publicly accessible - anyone can change their role
2. Driver signup works but doesn't verify driver documents first
3. No webhook implementation for instant role assignment
4. Admin/Dispatcher roles have no protection

## Recommended Improvements

### Priority 1: Secure Role Assignment

```typescript
// app/api/users/assign-role/route.ts
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  const { role } = await req.json();

  // ⚠️ ADD THIS: Prevent users from self-assigning privileged roles
  if (["ADMIN", "DISPATCHER"].includes(role)) {
    // Check if current user is already an admin
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  }

  // Rest of assignment logic...
}
```

### Priority 2: Add Clerk Webhooks

See: `WEBHOOK_SETUP.md` (to be created)

### Priority 3: Driver Verification Workflow

1. Driver signs up → Gets "DRIVER_PENDING" role
2. Admin reviews documents → Approves
3. Role changes to "DRIVER" → Can go online

## Usage Examples

### For Testing:

```javascript
// Browser console - Assign yourself as driver
fetch("/api/users/assign-role", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role: "DRIVER" }),
})
  .then((r) => r.json())
  .then(console.log);
```

### For Production:

- Riders: Sign up normally → Auto-assigned RIDER
- Drivers: Use `/driver-signup` → Reviewed → Approved
- Admin: Manually created in database or via secure admin panel
