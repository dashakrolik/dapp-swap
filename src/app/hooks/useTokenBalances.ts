import { useEffect, useState } from "react";
import { readContract } from "viem/actions";
import { erc20Abi } from "@/lib/erc20Abi";
import { publicClient } from "@/lib/publicClient";

const TOKENS: { symbol: string; address: `0x${string}` }[] = [
  { symbol: "PEPE", address: "0x0A6d2da2Fb1E1e99FaAE5ff33A3016D6f4e87502" },
  { symbol: "USDC", address: "0xaE5F874B68d3F1D00BfcA87Aa74c340Be6005c27" },
];

export default function useTokenBalances(account: `0x${string}` | null) {
  const [tokenBalance, setTokenBalance] = useState<{
    pepe?: bigint;
    USDC?: bigint;
  }>({});

  useEffect(() => {
    if (!account) return;
    const fetch = async () => {
      const result: any = {};
      for (const token of TOKENS) {
        const raw = await readContract(publicClient, {
          abi: erc20Abi,
          address: token.address,
          functionName: "balanceOf",
          args: [account],
        });
        result[token.symbol.toLowerCase()] = raw;
      }
      setTokenBalance(result);
    };
    fetch();
  }, [account]);

  return { tokenBalance };
}
