import React from "react";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";

export interface IPageLayout {
  title: string;
  children?: React.ReactNode;
  actions?: object[];
  hiddenTitleBar?: boolean;
  navigate?: { goBack: () => void };
  onBack?: () => void;
}

export const PageLayout = (props: IPageLayout) => {
  const { title, children, actions, hiddenTitleBar, navigate, onBack } = props;

  const theme = useTheme();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        maxHeight: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingBottom: hiddenTitleBar ? 60 : undefined,
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: "100%",
          position: "relative",
        }}
      >
        <Container
          id={"pageContainer"}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "100%",
            flex: 1,
            padding: 8,
            backgroundColor: theme.palette.background.default,
          }}
        >
          {children}
        </Container>
      </div>
    </div>
  );
};
