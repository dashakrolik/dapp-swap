import { Typography } from "@mui/material";

type WalletInfoSectionHeaderProps = {
  isMobile: boolean;
};

export default function WalletInfoSectionHeader({
  isMobile,
}: WalletInfoSectionHeaderProps) {
  return (
    <>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="bold"
        fontFamily="monospace"
        textAlign="center"
      >
        BitsoSwap
      </Typography>
      <Typography
        fontSize={isMobile ? 12 : 14}
        textAlign="center"
        fontFamily="monospace"
        color="text.secondary"
      >
        Gasless ERC-20 swaps with Smart Accounts
      </Typography>
    </>
  );
}
