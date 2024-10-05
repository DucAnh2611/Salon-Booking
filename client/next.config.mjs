/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "t4.ftcdn.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "api.vietqr.io",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "*",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/**",
            },
        ],
    },
    webpack: (config, { isServer }) => {
        isServer &&
            (config.externals = [...config.externals, "socket.io-client"]);
        return config;
    },
};
export default nextConfig;
