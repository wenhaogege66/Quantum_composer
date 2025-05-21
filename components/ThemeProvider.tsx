"use client";

import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextType {
  toggleColorMode: () => void;
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
  isDarkMode: false,
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 从本地存储初始化主题模式
  const [mode, setMode] = useState<"light" | "dark">(() => {
    // 检查是否在浏览器环境
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("theme-preference");
      // 检查系统偏好
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (savedMode === "dark" || (savedMode === null && prefersDark)) {
        return "dark";
      }
    }
    return "light";
  });

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme-preference") === null) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    // 添加监听器
    mediaQuery.addEventListener("change", handleChange);

    // 清理监听器
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme-preference", newMode);
          return newMode;
        });
      },
      isDarkMode: mode === "dark",
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#3f51b5" : "#7986cb",
          },
          secondary: {
            main: mode === "light" ? "#f50057" : "#ff4081",
          },
          background: {
            default: mode === "light" ? "#f5f5f5" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
        typography: {
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(","),
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                /*
                scrollbarColor:
                  mode === "light" ? "#bfbfbf #f5f5f5" : "#6b6b6b #2b2b2b",
                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                  backgroundColor: mode === "light" ? "#f5f5f5" : "#2b2b2b",
                  width: "8px",
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  borderRadius: 8,
                  backgroundColor: mode === "light" ? "#bfbfbf" : "#6b6b6b",
                  minHeight: 24,
                },
                "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
                  {
                    backgroundColor: mode === "light" ? "#999999" : "#848484",
                  },
                "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
                  {
                    backgroundColor: mode === "light" ? "#999999" : "#848484",
                  },
                "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                  {
                    backgroundColor: mode === "light" ? "#999999" : "#848484",
                  },
                */
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow:
                  mode === "light"
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "0 2px 4px rgba(0,0,0,0.3)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  mode === "light"
                    ? "0 1px 3px rgba(0,0,0,0.1)"
                    : "0 1px 4px rgba(0,0,0,0.3)",
              },
            },
          },
        },
      }),
    [mode]
  );

  // 设置全局CSS变量
  useEffect(() => {
    // 设置文档的数据主题属性
    document.documentElement.setAttribute("data-theme", mode);

    // 添加/移除主题类
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }

    // 保存到本地存储
    localStorage.setItem("theme-preference", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
