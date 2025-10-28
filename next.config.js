/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  reactStrictMode: true,
  // Ensure Next.js resolves the correct root when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname, ".."),
};

module.exports = nextConfig;
