/**
 * 量子计算可视化平台主页
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Toolbar,
  IconButton,
  Drawer,
  Divider,
  Paper,
  Grid,
  AppBar,
  useTheme,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FileMenu from "@/components/FileMenu";
import EditMenu from "@/components/EditMenu";
import ViewMenu from "@/components/ViewMenu";
import QuantumCircuit from "@/components/Circuit";
import Code from "@/components/Code";
import LoginMenu from "@/components/LoginMenu";
import ThemeProvider, { useThemeContext } from "@/components/ThemeProvider";
import ThemeSwitch from "@/components/ThemeSwitch";
import EnhancedQuantumGates from "@/components/EnhancedQuantumGates";
import AlgorithmTemplates from "@/components/AlgorithmTemplates";
import CircuitModules from "@/components/CircuitModules";
import CircuitOptimizer from "@/components/CircuitOptimizer";
import QuantumVisualization from "@/components/QuantumVisualization";
import "./globals.css";

// 量子门信息接口
interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
  moduleId?: string;
}

// 左侧边栏标签页接口
interface LeftSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  qubits: number;
  gates: GateInfo[];
  onAddGate: (
    gateType: string,
    qubitIndex: number,
    targetIndex?: number,
    params?: any
  ) => void;
  onApplyTemplate: (templateGates: GateInfo[]) => void;
  onApplyModule: (moduleGates: GateInfo[]) => void;
  onSaveAsModule: () => void;
  onApplyOptimization: (
    originalGates: GateInfo[],
    optimizedGates: GateInfo[]
  ) => void;
}

// 左侧边栏标签页
function LeftSidebar({
  currentTab,
  setCurrentTab,
  qubits,
  gates,
  onAddGate,
  onApplyTemplate,
  onApplyModule,
  onSaveAsModule,
  onApplyOptimization,
}: LeftSidebarProps) {
  const tabs = [
    { label: "量子门库", value: "gates" },
    { label: "算法模板", value: "algorithms" },
    { label: "电路模块", value: "modules" },
    { label: "优化建议", value: "optimizer" },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "gates":
        return <EnhancedQuantumGates qubits={qubits} onAddGate={onAddGate} />;
      case "algorithms":
        return <AlgorithmTemplates onApplyTemplate={onApplyTemplate} />;
      case "modules":
        return (
          <CircuitModules
            currentCircuit={{ qubits, gates }}
            onApplyModule={onApplyModule}
            onSaveAsModule={onSaveAsModule}
          />
        );
      case "optimizer":
        return (
          <CircuitOptimizer
            circuit={{ qubits, gates }}
            onApplyOptimization={onApplyOptimization}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Paper
      sx={{
        height: "100%",
        overflow: "auto",
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{
          "& .MuiTab-root": {
            fontWeight: 500,
            fontSize: "0.875rem",
            textTransform: "none",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ p: 0 }}>{renderTabContent()}</Box>
    </Paper>
  );
}

export default function HomePage() {
  const [qubits, setQubits] = useState(3);
  const [gates, setGates] = useState<GateInfo[]>([]);
  const [currentTab, setCurrentTab] = useState("gates");
  const theme = useTheme();
  const { isDarkMode, toggleColorMode } = useThemeContext();
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingVert, setIsDraggingVert] = useState(false);
  const [circuitHeight, setCircuitHeight] = useState(60);

  const mainContentRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef<number>(0);
  const initialLeftPanelWidthRef = useRef<number>(0);

  // 添加量子比特
  const addQubit = () => {
    setQubits(qubits + 1);
  };

  // 删除量子比特
  const deleteQubit = () => {
    if (qubits <= 1) {
      return;
    }

    const updatedGates = gates.filter((gate) => gate.qubitIndex < qubits - 1);
    setGates(updatedGates);
    setQubits(qubits - 1);
  };

  // 添加量子门
  const addGate = (
    gateType: string,
    qubitIndex: number,
    targetIndex?: number,
    params?: any
  ) => {
    if (qubitIndex >= qubits) {
      console.log(`量子比特 ${qubitIndex} 不存在`);
      return;
    }

    if (targetIndex !== undefined && targetIndex >= qubits) {
      console.log(`目标量子比特 ${targetIndex} 不存在`);
      return;
    }

    // 找出当前量子比特上最大的门索引
    const existingGates = gates.filter(
      (gate) => gate.qubitIndex === qubitIndex
    );
    const gateIndex =
      existingGates.length > 0
        ? Math.max(...existingGates.map((g) => g.gateIndex)) + 1
        : 1;

    setGates((currentGates) => [
      ...currentGates,
      {
        gateType,
        qubitIndex,
        gateIndex,
        ...(targetIndex !== undefined && { targetIndex }),
        ...(params && { params }),
      },
    ]);
  };

  // 删除量子门
  const deleteGate = (
    gateType: string,
    qubitIndex: number,
    gateIndex: number
  ) => {
    const nullGate = { gateType: "delete", qubitIndex: -1, gateIndex: -1 };

    const updatedGates = gates.map((gate) => {
      if (gate.qubitIndex === qubitIndex && gate.gateIndex >= gateIndex) {
        return gate.gateIndex === gateIndex
          ? nullGate
          : { ...gate, gateIndex: gate.gateIndex - 1 };
      }
      return gate;
    });

    setGates(updatedGates.filter((gate) => gate !== nullGate));
  };

  // 应用算法模板
  const applyTemplate = (templateGates: GateInfo[]) => {
    // 计算当前电路最大的门索引
    const maxGateIndex =
      gates.length > 0 ? Math.max(...gates.map((g) => g.gateIndex)) : 0;

    // 调整门索引，确保添加到电路末尾
    const adjustedGates = templateGates.map((gate) => ({
      ...gate,
      gateIndex: gate.gateIndex + maxGateIndex,
    }));

    setGates([...gates, ...adjustedGates]);
  };

  // 应用电路模块
  const applyModule = (moduleGates: GateInfo[]) => {
    // 和应用算法模板逻辑相同
    applyTemplate(moduleGates);
  };

  // 保存为模块回调
  const saveAsModule = () => {
    // 模块已保存的提示可以在CircuitModules组件内部处理
    console.log("保存为电路模块");
  };

  // 应用优化建议
  const applyOptimization = (
    originalGates: GateInfo[],
    optimizedGates: GateInfo[]
  ) => {
    // 为优化的门创建一个映射表，以便快速查找
    const originalGateMap = new Map(
      originalGates.map((gate) => [
        `${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`,
        gate,
      ])
    );

    // 移除原始门并添加优化后的门
    const remainingGates = gates.filter((gate) => {
      const key = `${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`;
      return !originalGateMap.has(key);
    });

    // 如果优化后的门不为空，则添加它们
    if (optimizedGates.length > 0) {
      setGates([...remainingGates, ...optimizedGates]);
    } else {
      setGates(remainingGates);
    }
  };

  // 卡片样式
  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    borderRadius: 1,
  };

  // 卡片头部样式
  const cardHeaderStyle = {
    paddingBottom: 0,
    "& .MuiCardHeader-title": {
      fontSize: "1rem",
      fontWeight: 500,
    },
  };

  // 卡片内容样式
  const cardContentStyle = {
    padding: 1.5,
    flexGrow: 1,
    overflow: "auto",
  };

  // 开始拖动水平分隔线
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    initialLeftPanelWidthRef.current = leftPanelWidth;
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.body.style.cursor = "col-resize";

    // 添加拖动中的class
    const divider = e.currentTarget as HTMLElement;
    divider.classList.add("dragging");
  };

  // 拖动时调整左侧面板宽度
  const handleDragMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartXRef.current;
      const newWidth = initialLeftPanelWidthRef.current + deltaX;
      if (newWidth >= 200 && newWidth <= 450) {
        setLeftPanelWidth(newWidth);
      }
    }
  };

  // 结束拖动
  const handleDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.body.style.cursor = "default";

    // 移除所有拖动中class
    document.querySelectorAll(".dragging").forEach((el) => {
      el.classList.remove("dragging");
    });
  };

  // 开始垂直拖动分隔线
  const handleVertDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingVert(true);
    document.addEventListener("mousemove", handleVertDragMove);
    document.addEventListener("mouseup", handleVertDragEnd);
    document.body.style.cursor = "row-resize";

    // 添加拖动中的class
    const divider = e.currentTarget as HTMLElement;
    divider.classList.add("dragging");
  };

  // 垂直拖动时调整电路区域高度
  const handleVertDragMove = (e: MouseEvent) => {
    if (isDraggingVert && mainContentRef.current) {
      const mainContentRect = mainContentRef.current.getBoundingClientRect();
      const relativeMouseY = e.clientY - mainContentRect.top;

      if (mainContentRect.height > 0) {
        let newCircuitPercentage =
          (relativeMouseY / mainContentRect.height) * 100;
        // 限制在20%-80%之间
        newCircuitPercentage = Math.max(20, Math.min(80, newCircuitPercentage));
        setCircuitHeight(newCircuitPercentage);
      }
    }
  };

  // 结束垂直拖动
  const handleVertDragEnd = () => {
    setIsDraggingVert(false);
    document.removeEventListener("mousemove", handleVertDragMove);
    document.removeEventListener("mouseup", handleVertDragEnd);
    document.body.style.cursor = "default";

    // 移除所有拖动中class
    document.querySelectorAll(".dragging").forEach((el) => {
      el.classList.remove("dragging");
    });
  };

  // 初始化设置
  useEffect(() => {
    // 确保根据当前主题设置主题相关class
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <ThemeProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        }}
      >
        {/* 顶部导航栏 */}
        <AppBar
          position="static"
          color="primary"
          sx={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 0,
                mr: 2,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              量子计算可视化平台
            </Typography>

            <FileMenu />
            <EditMenu />
            <ViewMenu />

            <Box sx={{ flexGrow: 1 }} />

            <LoginMenu />
            <ThemeSwitch
              isDarkMode={isDarkMode}
              onToggleTheme={toggleColorMode}
            />
          </Toolbar>
        </AppBar>

        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          {/* 左侧面板 - 工具/组件库 */}
          <Box
            sx={{
              width: `${leftPanelWidth}px`,
              p: 1.5,
              borderRight: "1px solid",
              borderColor: "divider",
              position: "relative",
            }}
          >
            <LeftSidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              qubits={qubits}
              gates={gates}
              onAddGate={addGate}
              onApplyTemplate={applyTemplate}
              onApplyModule={applyModule}
              onSaveAsModule={saveAsModule}
              onApplyOptimization={applyOptimization}
            />
          </Box>

          {/* 可调节分隔线 */}
          <Box
            className="resizable-divider-h"
            onMouseDown={handleDragStart}
            sx={{
              height: "100%",
              position: "relative",
              zIndex: 10,
            }}
          />

          {/* 主内容区 */}
          <Box
            sx={{
              flexGrow: 1,
              p: 1.5,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
            ref={mainContentRef}
          >
            {/* 电路设计和代码区域 */}
            <Box
              sx={{
                height: `${circuitHeight}%`,
                display: "flex",
                mb: 0.5,
                flexShrink: 0,
              }}
            >
              <Grid container spacing={2} sx={{ margin: 0, width: "100%" }}>
                {/* 电路设计区 */}
                <Grid
                  item
                  xs={12}
                  md={8}
                  sx={{ height: "100%", paddingTop: "0 !important" }}
                >
                  <Card sx={cardStyle}>
                    <CardHeader title="量子电路设计" sx={cardHeaderStyle} />
                    <CardContent sx={cardContentStyle}>
                      <QuantumCircuit
                        qubits={qubits}
                        addQubit={addQubit}
                        deleteQubit={deleteQubit}
                        gates={gates}
                        deleteGate={deleteGate}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* 代码显示区 */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{ height: "100%", paddingTop: "0 !important" }}
                >
                  <Card sx={cardStyle}>
                    <CardHeader title="Qiskit代码" sx={cardHeaderStyle} />
                    <CardContent sx={cardContentStyle}>
                      <Code qubits={qubits} gates={gates} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* 可调节垂直分隔线 */}
            <Box
              className="resizable-divider-v"
              onMouseDown={handleVertDragStart}
              sx={{
                width: "100%",
                height: "8px",
                cursor: "row-resize",
                backgroundColor: theme.palette.divider,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                zIndex: 10,
                flexShrink: 0,
                my: 0.5,
              }}
            />

            {/* 可视化区域 */}
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                minHeight: 0,
              }}
            >
              <Card
                sx={{
                  ...cardStyle,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardHeader title="量子态可视化" sx={cardHeaderStyle} />
                <CardContent
                  sx={{
                    ...cardContentStyle,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 1,
                  }}
                >
                  <QuantumVisualization qubits={qubits} gates={gates} />
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
