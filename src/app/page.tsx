"use client";

import {
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAccount } from "wagmi";
import SmartAccountStatus from "./SmartAccountStatus";
import SwapForm from "./SwapForm";

import useSmartAccount from "./hooks/useSmartAccount";
import ConnectWalletSection from "./components/ConnectWalletSection";
import LayoutCard from "./components/LayoutCard";
import WalletInfoSectionHeader from "./components/WalletInfoSectionHeader";

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const account = useAccount();
  const { smartAccount, tokenBalance, refreshBalances, isLoading } =
    useSmartAccount();

  if (isLoading || (account.isConnected && !smartAccount)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor={theme.palette.background.default}
      >
        <CircularProgress size={40} color="success" />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      px={1}
      py={4}
      bgcolor={theme.palette.background.default}
      color={theme.palette.text.primary}
    >
      <Stack
        spacing={4}
        direction="column"
        alignItems="center"
        sx={{ width: "100%", maxWidth: 420 }}
      >
        <LayoutCard>
          <WalletInfoSectionHeader isMobile={isMobile} />
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)", my: 2 }} />

          {/* ✅ Wallet connect / disconnect */}
          <ConnectWalletSection />

          {/* ✅ Smart Account Info */}
          {account.isConnected && smartAccount && (
            <SmartAccountStatus
              smartAccount={smartAccount}
              tokenBalance={tokenBalance}
            />
          )}
        </LayoutCard>

        {/* ✅ Swap Form */}
        {account.isConnected && smartAccount && (
          <SwapForm
            tokenBalance={tokenBalance}
            setTokenBalance={() => {}}
            refreshBalances={() => refreshBalances(smartAccount)}
          />
        )}
      </Stack>
    </Box>
  );
}
