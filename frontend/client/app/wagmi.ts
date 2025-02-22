import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia, polygonMumbai, baseSepolia } from "wagmi/chains"; // Include required chains
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
  return createConfig({
    chains: [mainnet, sepolia, polygonMumbai, baseSepolia], // Add desired chains here
    connectors,
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [sepolia.id]: http(), // Define HTTP transport for specific chains if needed
      [polygonMumbai.id]: http(), // Add transport for polygonMumbai
      [baseSepolia.id]: http(), // Add transport for baseSepolia
      [mainnet.id]: http(), // Add transport for mainnet
    },
  });
}

// TypeScript declaration for the new config
declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
