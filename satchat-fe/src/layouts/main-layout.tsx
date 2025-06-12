import { HomeView } from "@/sections/home";
import { SideBarLeft } from "./sidebar-left";
import { SideBarRight } from "./sidebar-right";
import { Box, Container } from "@mui/material";
import { ScrollToTop } from "@/components/scroll-to-top";
import { OrderCart } from "@/components/order-cart";
import { BottomNavigationBar } from "./bottom-navigation-bar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div suppressHydrationWarning>
      <HomeView>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            minHeight: "100vh",
          }}
        >
          <Box
            className="overflow-y-scroll scrollbar-hide"
            sx={{
              width: { xs: 0, md: "280px", lg: "320px" },
              flexShrink: 0,
              position: { xs: "fixed", md: "sticky" },
              top: 0,
              height: "100vh",
              display: { xs: "none", md: "block" },
              transition: "all 0.3s ease",
              zIndex: 10,
              overflow: "hidden auto",
            }}
          >
            <SideBarLeft />
          </Box>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: {
                xs: "100%",
                md: `calc(100% - 560px)`,
                lg: `calc(100% - 640px)`,
              },
              padding: { xs: 2, sm: 3, md: 4 },
              transition: "all 0.3s ease",
            }}
          >
            <Container
              maxWidth="lg"
              disableGutters
              sx={{
                height: "100%",
              }}
            >
              {children}
            </Container>
          </Box>

          <Box
            className="overflow-y-scroll scrollbar-hide"
            sx={{
              width: { xs: 0, md: "280px", lg: "320px" },
              flexShrink: 0,
              position: { xs: "fixed", md: "sticky" },
              top: 0,
              right: 0,
              height: "100vh",
              display: { xs: "none", md: "none", lg: "block" },
              borderLeft: "1px solid",
              borderColor: "divider",
              transition: "all 0.3s ease",
              zIndex: 5,
              overflow: "hidden auto",
            }}
          >
            <SideBarRight />
          </Box>

          <Box
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              zIndex: 20,
            }}
          >
            <OrderCart />
            <ScrollToTop />
          </Box>

          <BottomNavigationBar />
        </Box>
      </HomeView>
    </div>
  );
};
