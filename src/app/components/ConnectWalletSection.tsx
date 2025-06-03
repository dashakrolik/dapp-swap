import { Button, Stack, Typography } from "@mui/material";
import { useConnect, useDisconnect, useAccount } from "wagmi";

const ACCENT = "#1DD100";
const ACCENT_HOVER = "#1ac000";

export default function ConnectWalletSection() {
  const account = useAccount();
  const { connect, connectors, error, status } = useConnect();
  const { disconnect } = useDisconnect();

  if (!account.isConnected) {
    if (!connectors || connectors.length === 0) {
      return (
        <Typography fontSize={12} color="error" fontFamily="monospace">
          No wallet connectors available.
        </Typography>
      );
    }

    return (
      <Stack spacing={1}>
        {connectors.map((connector, i) => (
          <Button
            key={connector.id || connector.name || i}
            onClick={() => {
              connect({ connector });
            }}
            fullWidth
            variant={i === 0 ? "contained" : "outlined"}
            sx={{
              backgroundColor: i === 0 ? ACCENT : "transparent",
              color: "#fff",
              borderColor: i === 0 ? "transparent" : "rgba(255,255,255,0.2)",
              fontFamily: "monospace",
              "&:hover": {
                backgroundColor:
                  i === 0 ? ACCENT_HOVER : "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.4)",
              },
            }}
          >
            {connector.name}
          </Button>
        ))}
        <Typography fontSize={12} color="error" fontFamily="monospace">
          {error?.message}
        </Typography>
      </Stack>
    );
  }

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={() => disconnect()}
      sx={{
        fontFamily: "monospace",
        borderColor: ACCENT,
        color: ACCENT,
        "&:hover": {
          borderColor: ACCENT_HOVER,
          color: ACCENT_HOVER,
        },
      }}
    >
      Disconnect Wallet
    </Button>
  );
}
