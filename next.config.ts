const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },{
                protocol: 'https',
                hostname: 't1.daumcdn.net',
            }
        ],
    },
};

export default nextConfig;
