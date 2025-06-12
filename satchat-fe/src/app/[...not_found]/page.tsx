"use client";

import { Helmet } from "react-helmet-async";
import { styled } from "@mui/material/styles";
import { Typography, Container, Box, Button } from "@mui/material";
import Link from "next/link";

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 Page Not Found | Minimal UI </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: "var(--foreground)" }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </Typography>

          <Box
            component="img"
            src="/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: "auto", my: { xs: 5, sm: 10 } }}
          />

          <Link href="/">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              Go back to home
            </Button>
          </Link>
        </StyledContent>
      </Container>
    </>
  );
}
