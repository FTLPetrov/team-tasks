import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./pages/routes";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient.config";
import { AuthProvider } from "./utils/providers/AuthProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter(routes);

function App() {
  const theme = createTheme();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
