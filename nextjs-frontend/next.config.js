/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/nextjs',
    output: 'standalone',
    logging: {
        fetches: {
            fullUrl: true
        }
    }
}

module.exports = nextConfig
