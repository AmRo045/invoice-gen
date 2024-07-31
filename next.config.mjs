const isProd = process.env.NODE_ENV === "production";

/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "build",
    images: { unoptimized: true },
    assetPrefix: isProd ? "https://amro045.github.io/invoice-gen" : undefined
};

export default nextConfig;
