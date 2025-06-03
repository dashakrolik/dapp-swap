"use client";

import { Box, Typography, Card, CardContent, Stack, Fade } from "@mui/material";
import { formatUnits } from "viem";
import { useEffect, useRef, useState } from "react";

interface TokenBalanceProps {
  balances?: {
    pepe?: bigint;
    USDC?: bigint;
  };
}

export default function SmartAccountBalances({
  balances = {},
}: TokenBalanceProps) {
  const [flash, setFlash] = useState<{ [symbol: string]: boolean }>({});
  const prevBalances = useRef<{ [symbol: string]: bigint | undefined }>({});

  useEffect(() => {
    const changed: { [symbol: string]: boolean } = {};
    for (const [symbol, current] of Object.entries(balances)) {
      const prev = prevBalances.current[symbol];
      if (prev !== undefined && current !== prev) {
        changed[symbol] = true;
        setTimeout(() => {
          setFlash((f) => ({ ...f, [symbol]: false }));
        }, 1000);
      }
    }
    setFlash((f) => ({ ...f, ...changed }));
    prevBalances.current = balances;
  }, [balances]);

  return (
    <Box mt={3}>
      <Typography variant="h6" fontFamily="monospace" mb={1}>
        Token Balances
      </Typography>
      <Stack spacing={2}>
        {Object.entries(balances).map(([symbol, value]) => {
          const formatted = formatUnits(value || 0n, 2);
          return (
            <Card
              key={symbol}
              sx={{
                backgroundColor: "#1a1a1a",
                borderRadius: 1,
                px: 2,
                py: 1,
                color: "white",
                border: flash[symbol]
                  ? "1px solid #1DD100"
                  : "1px solid rgba(255,255,255,0.05)",
                boxShadow: flash[symbol]
                  ? "0 0 10px #1DD100"
                  : "0 0 0 rgba(0,0,0,0)",
                transition: "all 0.6s ease",
              }}
            >
              <CardContent sx={{ p: 1 }}>
                <Typography fontSize={14} fontFamily="monospace">
                  {symbol.toUpperCase()}: {formatted}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
