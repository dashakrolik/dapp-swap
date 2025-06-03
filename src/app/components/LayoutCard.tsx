import { Card, CardContent, CardProps } from "@mui/material";

const BORDER_COLOR = "rgba(255, 255, 255, 0.05)";

export default function LayoutCard({ children, ...props }: CardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        border: `1px solid ${BORDER_COLOR}`,
        backgroundColor: "#121212",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.4)",
      }}
      {...props}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
}
