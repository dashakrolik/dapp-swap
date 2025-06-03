import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia as defaultSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const sepolia: any = {
  ...defaultSepolia,
  rpcUrls: {
    default: "https://rpc.sepolia.org",
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
};

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: "00978dcf24b7f29d4ff28d0c34faaeaf" }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(sepolia.rpcUrls.default),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
