const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                protocol: "https",
                hostname: "t1.daumcdn.net",
            },
            {
                protocol: "https",
                hostname: "encrypted-tbn0.gstatic.com",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/honmoon-bucket/**",
            },
        ],
    },
};

export default nextConfig;
