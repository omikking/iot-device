/** @type {import('next').NextConfig} */
module.exports = {
    webpack(config) {
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule) =>
            rule.test?.test?.('.svg'),
        )

        config.module.rules.push(
            // Reapply the existing rule, but only for svg imports ending in ?url
            {
                ...fileLoaderRule,
                test: /\.svg$/i,
                resourceQuery: /url/, // *.svg?url
            },
            // Convert all other *.svg imports to React components
            {
                test: /\.svg$/i,
                issuer: fileLoaderRule.issuer,
                resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
                use: ['@svgr/webpack'],
            },
        );

        // Modify the file loader rule to ignore *.svg, since we have it handled now.
        fileLoaderRule.exclude = /\.svg$/i;
        
        return config;
    },
    images: {
        remotePatterns: [
            // Local development
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3333',
                pathname: '/uploads/**',
            },
            // Production
            ...(process.env.NEXT_PUBLIC_API_URL
                ? [
                    {
                        protocol: 'https',
                        hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
                        port: new URL(process.env.NEXT_PUBLIC_API_URL).port || undefined,
                        pathname: '/uploads/**',
                    },
                ]
                : []),
            ],
        },
        reactStrictMode: true,
        transpilePackages: ['@gsp/ui-core'],
}