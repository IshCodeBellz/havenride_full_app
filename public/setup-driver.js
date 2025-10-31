/**
 * Browser Console Setup Script
 * Run this in your browser console while signed in to set up your driver account
 */

async function setupDriverAccount() {
  console.log("🚗 Setting up driver account...");

  try {
    // First, get your current user info
    const meRes = await fetch("/api/users/me");
    const meData = await meRes.json();

    if (!meData.role) {
      console.log("❌ No user found. Please sign in first.");
      return;
    }

    console.log("✅ Current user info:", meData);

    // Now assign driver role
    const assignRes = await fetch("/api/users/assign-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "DRIVER" }),
    });

    if (!assignRes.ok) {
      const error = await assignRes.json();
      console.error("❌ Failed to assign driver role:", error);
      return;
    }

    console.log("✅ Driver role assigned!");
    console.log("🎉 Setup complete! Redirecting to driver dashboard...");

    setTimeout(() => {
      window.location.href = "/driver";
    }, 1000);
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
}

// Run the setup
setupDriverAccount();
