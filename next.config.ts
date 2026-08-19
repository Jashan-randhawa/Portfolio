import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // reactCompiler: true,
  },
  images: {
    remotePatterns: [
      { hostname: "pbs.twimg.com" },
      { hostname: "yt3.googleusercontent.com" },
      { hostname: "cdn.prod.website-files.com" },
      { hostname: "assets.aceternity.com" },
      { hostname: "images.unsplash.com" },
      // FIX: Added missing domains used in the app
      { hostname: "res.cloudinary.com" },
      { hostname: "res-console.cloudinary.com" },
      { hostname: "voocgavdbpy2gucg.public.blob.vercel-storage.com" },
      { hostname: "cdn.simpleicons.org" },
      // Added for auto-generated project screenshots (no local uploads needed)
      { hostname: "image.thum.io" },
      { hostname: "opengraph.githubassets.com" },
    ],
  },
}

export default nextConfig
