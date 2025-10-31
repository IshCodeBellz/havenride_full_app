# Complete Role System Guide for HavenRide

## 🎯 How Role Assignment Works

### **For Regular Users (Riders)**

1. Sign up anywhere in the app
2. Automatically get `RIDER` role on first visit
3. Can immediately book rides at `/rider`

**No action needed** - it just works! ✅

---

### **For Drivers**

1. Go to `/driver-signup`
2. Fill out driver application form
3. Sign in with Clerk (or sign up if new)
4. Automatically assigned `DRIVER` role
5. Redirected to `/driver` dashboard

**Recommended improvement**: Add document verification step before activating driver

---

### **For Admins** 🔐

**First Admin Setup** (One-time):

1. Sign up in the app with your admin email
2. Get your user ID:
   ```javascript
   fetch("/api/users/me")
     .then((r) => r.json())
     .then((d) => console.log(d));
   ```
3. Run this SQL:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE id = 'your_clerk_id_here';
   ```

**Subsequent Admins**:

- First admin can assign other admins via `/role-select`
- Protected: Only existing admins can assign ADMIN/DISPATCHER roles

---

### **For Dispatchers** 🔐

- Only admins can assign DISPATCHER role
- Use `/role-select` page
- Requires existing admin login

---

## 🔒 Security Features

### ✅ **Implemented:**

1. **Auto-assignment**: New users → RIDER (safe default)
2. **Driver signup**: Self-service but tracked
3. **Admin protection**: Can't self-assign admin roles
4. **Role verification**: RoleGate checks on every protected page

### ⚠️ **Should Add:**

1. **Driver document verification**: Approve drivers before they go online
2. **Audit log**: Track who assigned what role to whom
3. **Clerk webhooks**: More reliable role assignment
4. **Email verification**: Require verified email for drivers

---

## 📋 Role Assignment Endpoints

### `GET /api/users/ensure-role`

- **Purpose**: Auto-assigns RIDER if user has no role
- **Called by**: RoleGate on every protected page
- **Returns**: User's current role

### `POST /api/users/assign-role`

- **Purpose**: Manually assign a role
- **Body**: `{ "role": "RIDER" | "DRIVER" | "DISPATCHER" | "ADMIN" }`
- **Security**: Blocks self-assignment of ADMIN/DISPATCHER
- **Used by**: Driver signup, role-select page

### `GET /api/users/me`

- **Purpose**: Get current user's role
- **Returns**: `{ "role": "RIDER" | null }`

---

## 🧪 Testing Role Assignment

### Test as Rider:

```javascript
// Sign up normally - you're auto-assigned RIDER
fetch("/api/users/me")
  .then((r) => r.json())
  .then(console.log);
```

### Test as Driver:

```javascript
// After signing in, assign driver role
fetch("/api/users/assign-role", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role: "DRIVER" }),
})
  .then((r) => r.json())
  .then(console.log);
// Then go to: /driver
```

### Test as Admin:

```sql
-- Run in database first
UPDATE "User" SET role = 'ADMIN' WHERE id = 'your_clerk_id';
```

Then visit `/role-select` to assign roles to others.

---

## 🚀 Production Recommendations

### Phase 1: Launch (Current)

- ✅ Riders auto-assigned
- ✅ Drivers self-signup via form
- ✅ Manual admin setup via SQL
- ✅ Basic security (no self-admin)

### Phase 2: Scale

- [ ] Add driver document upload
- [ ] Admin approval workflow for drivers
- [ ] Clerk webhook for instant role assignment
- [ ] Email notifications on role changes

### Phase 3: Enterprise

- [ ] Role-based permissions (fine-grained)
- [ ] Multi-tenant support
- [ ] RBAC (Role-Based Access Control)
- [ ] Audit logs with compliance

---

## 📱 User Flows

### New Rider Flow:

```
Sign up → Auto: RIDER → Visit /rider → Start booking ✅
```

### New Driver Flow:

```
Visit /driver-signup → Fill form → Sign in → Auto: DRIVER → Visit /driver ✅
```

### Admin Creating Dispatcher Flow:

```
Admin logs in → Visit /role-select → Select user → Assign DISPATCHER ✅
```

---

## ❓ FAQ

**Q: What if someone tries to manually assign themselves ADMIN?**
A: The API blocks it - only existing admins can assign ADMIN/DISPATCHER roles.

**Q: Can a driver also be a rider?**
A: Not currently - each user has one role. Could add multi-role support later.

**Q: How do I remove someone's driver access?**
A: Change their role in database or build an admin panel to do it.

**Q: What happens if someone has no role?**
A: They get auto-assigned RIDER on their first page visit.

---

## 🔧 Troubleshooting

### "Failed to ensure role" error:

- Check if user exists in Clerk
- Check database connection
- Check `/api/users/ensure-role` logs
- Try manual role assignment via console script

### User stuck without role:

```javascript
// Force role assignment
fetch("/api/users/assign-role", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role: "RIDER" }),
})
  .then((r) => r.json())
  .then(console.log);
```

### Need to reset a user's role:

```sql
UPDATE "User" SET role = 'RIDER' WHERE id = 'user_clerk_id';
```
