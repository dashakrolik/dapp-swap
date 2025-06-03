import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/wagmi";

export function getServerWagmiConfig() {
  const config = getConfig();
  const cookies = headers().get("cookie");
  const initialState = cookieToInitialState(config, cookies);
  return { config, initialState };
}
