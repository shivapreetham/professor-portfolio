// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser:{
      sizeLimit: '500mb',
    }, // Disabling body parser for the API route
  },
};

export default nextConfig;