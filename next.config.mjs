
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Exclude API routes from static generation
  output: 'standalone',
  
  // Increase static generation timeout if needed
  staticPageGenerationTimeout: 120,
  
  // Optionally disable ISR for problematic routes
  experimental: {
    // Only if you're using older Next.js versions
    // isrMemoryCacheSize: 0,
  }
}

export default nextConfig;
