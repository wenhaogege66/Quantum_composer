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

// 定义事件处理器类型
type DragHandler = (e: MouseEvent) => void;
type DragEndHandler = () => void;

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
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          "& .MuiTab-root": {
            fontWeight: 500,
            fontSize: "0.875rem",
            textTransform: "none",
            color: "text.secondary",
          },
          "& .Mui-selected": {
            color: "primary.main",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Paper
        sx={{
          bgcolor: "background.paper",
          boxShadow: "none",
          borderRadius: 0,
          height: "100%",
          p: 0,
        }}
        square
      >
        {renderTabContent()}
      </Paper>
    </Paper>
  );
}

// 添加调试用的样式标签，确保所有关键元素可见
const debugStyle = `
  /* 强制显示SVG，避免ID冲突 */
  #quantum-circuit-svg {
    background-color: white !important;
    min-height: 120px !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
    position: relative !important;
    z-index: 20 !important;
  }
  
  /* 直接选择SVG元素，不通过容器ID */
  svg.quantum-circuit {
    background-color: white !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
    min-height: 120px !important;
    z-index: 20 !important;
  }
  
  /* 量子门强制显示 - 更高优先级 */
  .gate, g.gate, [id^="gate-"] {
    visibility: visible !important;
    opacity: 1 !important;
    display: block !important;
    z-index: 1500 !important;
    position: relative !important;
    pointer-events: all !important;
  }
  
  /* 量子门图像强制显示 */
  .gate image, g.gate image, [id^="gate-"] image {
    visibility: visible !important;
    opacity: 1 !important;
    display: block !important;
    pointer-events: all !important;
    filter: brightness(1.4) contrast(1.4) !important;
  }
  
  /* 叠加层级关系确保正确 */
  #circuit-main-container {
    z-index: 1 !important;
  }
  #circuit-container {
    z-index: 10 !important;
  }
  #quantum-circuit-svg {
    z-index: 20 !important;
  }
  .qubit-line, .qubit-label {
    z-index: 30 !important;
  }
  .gate-connector, .control-point, .target-point {
    z-index: 1400 !important;
  }
  .gate, g.gate, [id^="gate-"] {
    z-index: 1500 !important;
  }
  .gate image, g.gate image, [id^="gate-"] image {
    z-index: 1550 !important;
  }
  
  /* 启用GPU加速和3D变换以提高渲染性能 */
  #circuit-container,
  #quantum-circuit-svg,
  .gate {
    transform: translateZ(0) !important;
    backface-visibility: hidden !important;
    will-change: transform !important;
  }
  
  /* 移除特定MUI组件的边框 */
  .MuiBox-root.mui-7pf6at,
  .MuiBox-root[class*="mui-7pf6at"] {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.mui-i4bv87-MuiSvgIcon-root,
  .MuiSvgIcon-root[class*="mui-i4bv87"] {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  /* 通用的MUI组件移除边框 */
  .MuiBox-root,
  .MuiSvgIcon-root,
  [class*="MuiBox"],
  [class*="MuiSvgIcon"] {
    border: none !important;
  }
  
  /* 确保图标容器没有边框 */
  button .MuiSvgIcon-root,
  .MuiIconButton-root .MuiSvgIcon-root {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  /* 移除所有mui前缀类的边框 */
  [class^="mui-"],
  [class*=" mui-"] {
    border: none !important;
  }
  
  /* 直接针对算法模板中的特定元素 */
  .algorithm-templates-paper .MuiBox-root.mui-7pf6at,
  .algorithm-templates-paper [class*="mui-7pf6at"],
  .algorithm-templates-paper .MuiSvgIcon-root.MuiSvgIcon-fontSizeMedium.mui-i4bv87-MuiSvgIcon-root,
  .algorithm-templates-paper [class*="mui-i4bv87"] {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
  }
  
  /* 移除算法模板内所有元素的边框 */
  .algorithm-templates-paper * {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  /* 极端情况 - 移除所有展开的Accordion内元素的边框 */
  .MuiAccordion-root.Mui-expanded * {
    border: none !important;
    box-shadow: none !important;
  }
`;

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
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const vertDividerRef = useRef<HTMLDivElement>(null);
  
  // 使用原生JS处理水平分割线拖动
  useEffect(() => {
    const divider = dividerRef.current;
    const leftPanel = leftPanelRef.current;
    
    if (!divider || !leftPanel) return;
    
    let startX = 0;
    let startWidth = 0;
    let isDragging = false;
    
    const startDrag = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      startX = e.clientX;
      startWidth = leftPanel.offsetWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      divider.classList.add('dragging');
      
      console.log('水平拖动开始', { startX, startWidth });
      
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
    };
    
    const onDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(180, Math.min(450, startWidth + deltaX));
      
      console.log('水平拖动中', { 
        clientX: e.clientX, 
        deltaX, 
        newWidth, 
        isDragging 
      });
      
      leftPanel.style.width = `${newWidth}px`;
      divider.style.left = `${newWidth}px`;
      
      // 为了确保React状态也更新（但我们不依赖React重新渲染来更新DOM）
      setLeftPanelWidth(newWidth);
    };
    
    const stopDrag = () => {
      console.log('水平拖动结束');
      isDragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      divider.classList.remove('dragging');
      
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
      
      // 最终更新React状态
      setLeftPanelWidth(leftPanel.offsetWidth);
    };
    
    // 原生事件监听
    divider.addEventListener('mousedown', startDrag);
    
    // 清理函数
    return () => {
      divider.removeEventListener('mousedown', startDrag);
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, []); // 空依赖数组确保只在挂载时运行一次
  
  // 使用原生JS处理垂直分割线拖动
  useEffect(() => {
    const divider = vertDividerRef.current;
    const mainContent = mainContentRef.current;
    
    if (!divider || !mainContent) return;
    
    let startY = 0;
    let startPercentage = circuitHeight;
    let isDragging = false;
    
    const startDrag = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;
      startY = e.clientY;
      
      // 获取mainContent的位置和尺寸
      const mainContentRect = mainContent.getBoundingClientRect();
      // 计算鼠标相对于mainContent顶部的位置，并转换为百分比
      startPercentage = ((startY - mainContentRect.top) / mainContentRect.height) * 100;
      
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      divider.classList.add('dragging');
      
      console.log('垂直拖动开始', { startY, startPercentage });
      
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
    };
    
    const onDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const mainContentRect = mainContent.getBoundingClientRect();
      const relativeMouseY = e.clientY - mainContentRect.top;
      let newCircuitPercentage = (relativeMouseY / mainContentRect.height) * 100;
      
      // 限制在20%-80%之间
      newCircuitPercentage = Math.max(20, Math.min(80, newCircuitPercentage));
      
      console.log('垂直拖动中', { 
        clientY: e.clientY, 
        relativeMouseY, 
        newCircuitPercentage 
      });
      
      // 直接更新DOM
      const circuitBox = mainContent.querySelector(':scope > div') as HTMLElement;
      if (circuitBox) {
        circuitBox.style.height = `${newCircuitPercentage}%`;
      }
      
      // 更新React状态
      setCircuitHeight(newCircuitPercentage);
    };
    
    const stopDrag = () => {
      console.log('垂直拖动结束');
      isDragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      divider.classList.remove('dragging');
      
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
    
    // 原生事件监听
    divider.addEventListener('mousedown', startDrag);
    
    // 清理函数
    return () => {
      divider.removeEventListener('mousedown', startDrag);
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, []); // 空依赖数组确保只在挂载时运行一次

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

    // 找出当前量子比特线上已有的门
    const existingGates = gates.filter(
      (gate) => gate.qubitIndex === qubitIndex
    );
    
    // 计算新门的索引 - 关键点是确保位置计算正确
    // 新门索引 = 该量子比特上现有门的最大索引 + 1
    let newGateIndex = 1; // 默认从1开始
    
    if (existingGates.length > 0) {
      // 找出当前比特线上最大的门索引
      const maxGateIndex = Math.max(...existingGates.map((g) => g.gateIndex));
      newGateIndex = maxGateIndex + 1;
    }
    
    console.log(`添加量子门: ${gateType} 到量子比特 ${qubitIndex}, 索引 ${newGateIndex}, 当前gates长度: ${gates.length}`);

    // 构建新门对象 - 确保所有属性正确设置
    const newGate = {
      gateType,
      qubitIndex,
      gateIndex: newGateIndex, // 确保索引正确
      ...(targetIndex !== undefined && { targetIndex }),
      ...(params && { params }),
    };

    console.log("创建的新门对象:", newGate);

    // 更新状态，添加新门 - 使用回调获取最新状态
    // 重要：这里使用函数形式，确保总是基于最新状态更新
    setGates((prevGates) => {
      // 先复制当前的gates数组
      const updatedGates = [...prevGates, newGate];
      
      console.log("更新后的gates数组:", updatedGates);
      
      // 打印每个门的详细信息，便于调试
      updatedGates.forEach((g, i) => {
        console.log(`门 ${i+1}/${updatedGates.length}:`, {
          类型: g.gateType,
          比特: g.qubitIndex, 
          索引: g.gateIndex
        });
      });

      // 返回新的gates数组以更新状态
      return updatedGates;
    });
    
    // 在setState完成后的下一个渲染周期使用setTimeout确保DOM已更新
    // 使用较长的延迟，确保状态已完全更新且组件已重新渲染
    setTimeout(() => {
      // 直接访问DOM检查元素
      const gateId = `gate-${gateType}-${qubitIndex}-${newGateIndex}`;
      console.log(`检查门元素: ${gateId}`);
      
      const gateElement = document.getElementById(gateId);
      if (gateElement) {
        console.log(`找到门元素: ${gateId}，确保其可见性`);
        // 强制设置样式确保可见
        gateElement.style.display = 'block';
        gateElement.style.visibility = 'visible';
        gateElement.style.opacity = '1';
        gateElement.style.zIndex = '200'; // 使用更高的z-index确保在上层
        
        // 检查并确保图像元素可见
        const imageElement = gateElement.querySelector('image');
        if (imageElement) {
          // 由于是SVG元素，使用setAttribute方法而不是直接设置style属性
          imageElement.setAttribute('style', 'display: block; visibility: visible; opacity: 1');
          imageElement.setAttribute('opacity', '1');
          // 也可以设置其他SVG特有属性
          if (imageElement instanceof SVGElement) {
            (imageElement as SVGElement).style.display = 'block';
            (imageElement as SVGElement).style.visibility = 'visible';
          }
        } else {
          console.warn(`门 ${gateId} 缺少图像元素`);
        }
      } else {
        console.warn(`门元素 ${gateId} 未找到，强制触发电路重绘`);
        
        // 如果找不到元素，尝试强制重绘整个电路
        const circuitInstance = document.getElementById('circuit-container');
        if (circuitInstance) {
          // 先尝试通过样式变化触发重绘
          circuitInstance.style.display = 'none';
          
          // 强制浏览器重新计算布局
          void circuitInstance.offsetHeight;
          
          // 恢复显示
          circuitInstance.style.display = 'block';
          
          // 另一种方法：使用类似的技术模拟点击事件触发渲染
          const event = new Event('resize');
          window.dispatchEvent(event);
        }
      }
    }, 200); // 延长延迟到200ms，确保状态已更新完成
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

  // 初始化设置
  useEffect(() => {
    // 确保根据当前主题设置主题相关class
    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    
    // 记录面板宽度变化
    console.log("leftPanelWidth changed:", leftPanelWidth);
  }, [isDarkMode, leftPanelWidth]);

  // 添加调试样式
  useEffect(() => {
    const styleElem = document.createElement('style');
    styleElem.id = 'debug-quantum-circuit';
    styleElem.textContent = debugStyle;
    document.head.appendChild(styleElem);
    
    return () => {
      const existingStyle = document.getElementById('debug-quantum-circuit');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

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

        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", position: "relative" }}>
          {/* 左侧面板 - 工具/组件库 */}
          <Box
            ref={leftPanelRef}
            sx={{
              width: `${leftPanelWidth}px`,
              p: 1.5,
              borderRight: "1px solid",
              borderColor: "divider",
              height: "100%",
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

          {/* 可调节分隔线 - 使用原生div */}
          <div
            ref={dividerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: `${leftPanelWidth}px`,
              width: '10px',
              height: '100%',
              cursor: 'col-resize',
              zIndex: 1000,
            }}
            className="resizable-divider-h"
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
                        onAddGate={addGate}
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
                    <CardHeader title="量子编程语言" sx={cardHeaderStyle} />
                    <CardContent sx={cardContentStyle}>
                      <Code qubits={qubits} gates={gates} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* 可调节垂直分隔线 */}
            <div
              ref={vertDividerRef}
              className="resizable-divider-v"
              style={{
                width: "100%",
                height: "8px",
                cursor: "row-resize",
                backgroundColor: theme.palette.divider,
                zIndex: 1000,
                flexShrink: 0,
                margin: '4px 0',
                position: 'relative',
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
