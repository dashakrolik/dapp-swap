"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { encodeFunctionData, parseUnits } from "viem";
import { useWalletClient } from "wagmi";
import { setupKernelClient } from "@/lib/createKernelClient";

const TOKENS = {
  PEPE: {
    symbol: "PEPE",
    address: "0x0A6d2da2Fb1E1e99FaAE5ff33A3016D6f4e87502",
    decimals: 2,
  },
  USDC: {
    symbol: "USDC",
    address: "0xaE5F874B68d3F1D00BfcA87Aa74c340Be6005c27",
    decimals: 2,
  },
};

const MOCKSWAP_ADDRESS = "0x307B8bfe52B091Dd9995A88e380Bc665DA77Cec4";

export default function SwapForm({
  tokenBalance,
  setTokenBalance,
  refreshBalances,
}: {
  tokenBalance: any;
  setTokenBalance: (val: any) => void;
  refreshBalances: () => Promise<void>;
}) {
  const [fromTokenKey, setFromTokenKey] = useState<"PEPE" | "USDC">("PEPE");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();

  const toTokenKey = fromTokenKey === "PEPE" ? "USDC" : "PEPE";
  const fromToken = TOKENS[fromTokenKey];
  const toToken = TOKENS[toTokenKey];

  const ACCENT = "#1DD100";
  const ACCENT_HOVER = "#1ac000";
  const BORDER_COLOR = "rgba(255, 255, 255, 0.05)";

  const handleSwap = async () => {
    if (!walletClient || !amount) return;
    setStatus("loading");
    setErrorMsg("");
    setTxHash(null);

    try {
      const { kernelClient } = await setupKernelClient(walletClient);
      const rawAmount = parseUnits(amount, fromToken.decimals);
      const rawAmountBigInt = BigInt(rawAmount.toString());

      const approveData = encodeFunctionData({
        abi: [
          {
            name: "approve",
            type: "function",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "approve",
        args: [MOCKSWAP_ADDRESS as `0x${string}`, rawAmountBigInt],
      });

      const approveHash = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([
          {
            to: fromToken.address as `0x${string}`,
            value: BigInt(0),
            data: approveData,
          },
        ]),
      });

      await kernelClient.waitForUserOperationReceipt({
        hash: approveHash,
        timeout: 30000,
      });

      const swapData = encodeFunctionData({
        abi: [
          {
            name: "swap",
            type: "function",
            inputs: [
              { name: "fromToken", type: "address" },
              { name: "toToken", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "swap",
        args: [
          fromToken.address as `0x${string}`,
          toToken.address as `0x${string}`,
          rawAmountBigInt,
        ],
      });

      const swapHash = await kernelClient.sendUserOperation({
        callData: await kernelClient.account.encodeCalls([
          {
            to: MOCKSWAP_ADDRESS as `0x${string}`,
            value: BigInt(0),
            data: swapData,
          },
        ]),
      });

      const receipt = await kernelClient.waitForUserOperationReceipt({
        hash: swapHash,
        timeout: 30000,
      });

      setTxHash(receipt.receipt.transactionHash);

      setStatus("success");
      await refreshBalances?.();
      await refreshBalances?.();
    } catch (err: any) {
      console.error("Swap failed - ", err);
      setErrorMsg(err?.cause?.message || err.message || "Swap failed");
      setStatus("error");
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        border: `1px solid ${BORDER_COLOR}`,
        backgroundColor: "#121212",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold" fontFamily="monospace">
            Swap {fromToken.symbol}
          </Typography>
          <IconButton
            onClick={() =>
              setFromTokenKey((prev) => (prev === "PEPE" ? "USDC" : "PEPE"))
            }
            sx={{ color: ACCENT }}
            aria-label="Switch direction"
          >
            <AutorenewIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" fontFamily="monospace">
            {toToken.symbol}
          </Typography>
        </Box>

        <TextField
          fullWidth
          label={`Amount (${fromToken.symbol})`}
          variant="outlined"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "white" },
            label: { color: "#aaa" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#444" },
              "&:hover fieldset": { borderColor: "#666" },
            },
          }}
        />
        {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
          <Typography
            fontSize={13}
            color="text.secondary"
            fontFamily="monospace"
            sx={{ mb: 2, ml: 0.5 }}
          >
            You will receive ≈ {amount} {toToken.symbol} (1:1 mock rate)
          </Typography>
        )}
        <Button
          onClick={handleSwap}
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: ACCENT,
            color: "white",
            fontFamily: "monospace",
            textTransform: "none",
            "&:hover": {
              backgroundColor: ACCENT_HOVER,
              transform: "scale(1.01)",
            },
          }}
          disabled={
            status === "loading" ||
            !amount ||
            isNaN(Number(amount)) ||
            Number(amount) <= 0 ||
            (() => {
              try {
                const rawAmount = BigInt(
                  parseUnits(amount, fromToken.decimals).toString()
                );
                return (
                  rawAmount > (tokenBalance[fromTokenKey.toLowerCase()] || 0n)
                );
              } catch {
                return true;
              }
            })()
          }
        >
          {status === "loading" ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `Swap ${fromToken.symbol} → ${toToken.symbol}`
          )}
        </Button>

        {status === "success" && (
          <Alert sx={{ mt: 2 }} severity="success">
            Swap submitted. Gas paid by sponsor.{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: ACCENT }}
            >
              View on explorer
            </a>
          </Alert>
        )}

        {status === "error" && (
          <Alert sx={{ mt: 2 }} severity="error">
            {errorMsg}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
