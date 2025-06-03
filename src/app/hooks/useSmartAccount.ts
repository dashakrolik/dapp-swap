import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { setupKernelClient } from "@/lib/createKernelClient";
import { readContract } from "viem/actions";
import { publicClient } from "@/lib/publicClient";
import { erc20Abi } from "@/lib/erc20Abi";

const TOKENS: { symbol: string; address: `0x${string}` }[] = [
  { symbol: "PEPE", address: "0x0A6d2da2Fb1E1e99FaAE5ff33A3016D6f4e87502" },
  { symbol: "USDC", address: "0xaE5F874B68d3F1D00BfcA87Aa74c340Be6005c27" },
];

export default function useSmartAccount() {
  const { data: walletClient } = useWalletClient();
  const [smartAccount, setSmartAccount] = useState<`0x${string}` | null>(null);
  const [tokenBalance, setTokenBalance] = useState<{
    pepe?: bigint;
    USDC?: bigint;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshBalances = async (addr = smartAccount) => {
    if (!addr) return;
    try {
      const result: any = {};
      for (const token of TOKENS) {
        const raw = await readContract(publicClient, {
          abi: erc20Abi,
          address: token.address,
          functionName: "balanceOf",
          args: [addr],
        });
        result[token.symbol.toLowerCase()] = raw;
      }
      setTokenBalance(result);
    } catch (err) {
      console.error("Failed to refresh token balances -", err);
    }
  };

  const initialize = async () => {
    if (!walletClient) {
      console.warn("walletClient not yet available");
      return;
    }

    try {
      setIsLoading(true);

      const { accountAddress } = await setupKernelClient(walletClient);

      setSmartAccount(accountAddress);
      await refreshBalances(accountAddress);
    } catch (err) {
      console.error("Smart account setup failed - ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletClient && !smartAccount) {
      initialize();
    } else if (!walletClient) {
      setIsLoading(false);
    }
  }, [walletClient, smartAccount]);

  return {
    smartAccount,
    tokenBalance,
    refreshBalances,
    isLoading,
  };
}
