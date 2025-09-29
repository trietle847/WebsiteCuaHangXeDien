import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Opacity } from "@mui/icons-material";

const queryClient = new QueryClient();

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui": {
            color: "#000000", // Change label color when not focused
          },
        },
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray", // Default border
              "& .MuiInputLabel-root": {
              color: "#000000", // Change label color when not focused
              },
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "black", // Black on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#54a7f5", // Blue when focused
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#54a7f5",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#4A90E2",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          fontSize: "18px",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    background: {
      default: "#ffffff",
      paper: "#fffbfe",
    },
  },
});

interface ProviderProps {
  children: React.ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
