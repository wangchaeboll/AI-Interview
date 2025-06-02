import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ['http://127.0.0.1:3000','http://localhost:3000'],
    eslint:{
        ignoreDuringBuilds: true
    },
    typescript:{
        ignoreBuildErrors: true
    }
}


export default nextConfig;
