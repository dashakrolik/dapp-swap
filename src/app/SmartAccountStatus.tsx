"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SmartAccountBalances from "./SmartAccountBalances";

export default function SmartAccountStatus({
  smartAccount,
  tokenBalance,
}: {
  smartAccount: string;
  tokenBalance: { pepe?: bigint; USDC?: bigint };
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={2}
      py={isMobile ? 2 : 4}
    >
      <Card
        sx={{
          width: "100%",
          background: "#121212",
          borderRadius: 2,
          boxShadow: "0px 0px 10px rgba(0,0,0,0.6)",
          color: "white",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Smart Account Address
          </Typography>
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
              fontSize: "0.85rem",
              color: "#9e9e9e",
            }}
          >
            {smartAccount}
          </Typography>
          <Box mt={2}>
            <SmartAccountBalances balances={tokenBalance} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
