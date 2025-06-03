import { createPublicClient, http, erc20Abi } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http("https://rpc.sepolia.org"),
});

export async function getTokenBalance(
  account: `0x${string}`,
  tokenAddress: `0x${string}`,
  decimals: number
): Promise<number> {
  try {
    const balance = await client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account],
    });

    return Number(balance) / 10 ** decimals;
  } catch (error) {
    console.error("Failed to fetch token balance - ", error);
    return 0;
  }
}
