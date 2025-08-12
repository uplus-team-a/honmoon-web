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
        protocol: "http",
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
      {
        protocol: "https",
        hostname: "search1.daumcdn.net",
      },
      {
        protocol: "http",
        hostname: "search1.daumcdn.net",
      },
      {
        protocol: "https",
        hostname: "dapi.kakao.com",
      },
      {
        protocol: "http",
        hostname: "dapi.kakao.com",
      },
      {
        protocol: "https",
        hostname: "place.map.kakao.com",
      },
      {
        protocol: "http",
        hostname: "place.map.kakao.com",
      },
    ],
  },
};

export default nextConfig;
