"use client";

import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

interface ThemeSwitchProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  // const theme = useTheme(); // No longer needed here

  // 处理点击事件
  const handleToggleTheme = () => {
    onToggleTheme();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ml: 2,
      }}
    >
      <Tooltip title={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}>
        <IconButton onClick={handleToggleTheme} color="inherit">
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ThemeSwitch;
