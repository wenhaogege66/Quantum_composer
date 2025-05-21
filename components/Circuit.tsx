"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import * as d3 from "d3";

import GateInfoModal from "./GateInfoModal";

// 引入不同的门图标
import HG from "../img/Hadamard_Gate.svg";
import XG from "../img/X_Gate.svg";
import YG from "../img/Y_Gate.svg";
import ZG from "../img/Z_Gate.svg";
import CXG from "../img/CX_Gate.svg";
import CZG from "../img/CZ_Gate.svg";
import RXG from "../img/RX_Gate.svg";
import RYG from "../img/RY_Gate.svg";
import RZG from "../img/RZ_Gate.svg";
import SWAPG from "../img/SWAP_Gate.svg";

interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
}

interface QuantumCircuitProps {
  qubits: number;
  addQubit: () => void;
  deleteQubit: () => void;
  gates: GateInfo[];
  deleteGate: (gateType: string, qubitIndex: number, gateIndex: number) => void;
  onAddGate?: (gateType: string, qubitIndex: number, targetIndex?: number, params?: any) => void;
}

// 门类型到图标的映射函数
const getGateIcon = (gateType: string) => {
  switch (gateType.toUpperCase()) {
    case "H":
      return HG.src;
    case "X":
      return XG.src;
    case "Y":
      return YG.src;
    case "Z":
      return ZG.src;
    case "CX":
    case "CNOT":
      return CXG.src;
    case "CZ":
      return CZG.src;
    case "RX":
      return RXG.src;
    case "RY":
      return RYG.src;
    case "RZ":
      return RZG.src;
    case "SWAP":
      return SWAPG.src;
    default:
      return HG.src; // 默认使用H门图标作为后备
  }
};

// 获取量子门背景颜色
const getGateBackgroundColor = (gateType: string) => {
  switch (gateType.toUpperCase()) {
    case "H":
      return "#E3F2FD"; // 蓝色背景
    case "X":
      return "#F3E5F5"; // 紫色背景
    case "Y":
      return "#E8EAF6"; // 靛蓝色背景
    case "Z":
      return "#E0F7FA"; // 青色背景
    case "CX":
    case "CNOT":
      return "#FFF3E0"; // 橙色背景
    case "CZ":
      return "#FFF8E1"; // 琥珀色背景
    case "RX":
      return "#E8F5E9"; // 绿色背景
    case "RY":
      return "#F1F8E9"; // 浅绿色背景
    case "RZ":
      return "#F9FBE7"; // 酸橙色背景
    case "SWAP":
      return "#FFEBEE"; // 红色背景
    default:
      return "#F5F5F5"; // 默认浅灰色背景
  }
};

// 获取量子门边框颜色
const getGateBorderColor = (gateType: string) => {
  switch (gateType.toUpperCase()) {
    case "H":
      return "#2196F3"; // 蓝色
    case "X":
      return "#9C27B0"; // 紫色
    case "Y":
      return "#3F51B5"; // 靛蓝色
    case "Z":
      return "#00BCD4"; // 青色
    case "CX":
    case "CNOT":
      return "#FF9800"; // 橙色
    case "CZ":
      return "#FFC107"; // 琥珀色
    case "RX":
      return "#4CAF50"; // 绿色
    case "RY":
      return "#8BC34A"; // 浅绿色
    case "RZ":
      return "#CDDC39"; // 酸橙色
    case "SWAP":
      return "#F44336"; // 红色
    default:
      return "#9E9E9E"; // 默认灰色
  }
};

// 获取量子门显示文本
const getGateLabel = (gateType: string) => {
  switch (gateType.toUpperCase()) {
    case "H":
      return "H";
    case "X":
      return "X";
    case "Y":
      return "Y";
    case "Z":
      return "Z";
    case "CX":
      return "CX";
    case "CNOT":
      return "CX";
    case "CZ":
      return "CZ";
    case "RX":
      return "RX";
    case "RY":
      return "RY";
    case "RZ":
      return "RZ";
    case "SWAP":
      return "SW";
    default:
      return gateType.substring(0, 2); // 默认截取前两个字符
  }
};

const QuantumCircuit: React.FC<QuantumCircuitProps> = ({
  qubits,
  addQubit,
  deleteQubit,
  gates,
  deleteGate,
  onAddGate,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<GateInfo | null>(null);
  const [highlightedQubit, setHighlightedQubit] = useState<number | null>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleGateClick = (event: React.MouseEvent<SVGElement | SVGRectElement | SVGTextElement>, gate: GateInfo) => {
    event.stopPropagation();
    const target = event.currentTarget as Element;
    setAnchorEl(target as unknown as HTMLElement);
    setSelectedGate(gate);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 添加一个辅助函数，确保关键DOM元素总是可见
  const ensureElementsVisible = () => {
    try {
      // 获取关键元素
      const circuitContainer = document.getElementById('circuit-container');
      const svg = document.getElementById('quantum-circuit-svg');
      const gates = document.querySelectorAll('.gate');
      
      if (circuitContainer) {
        (circuitContainer as HTMLElement).style.display = 'block';
        (circuitContainer as HTMLElement).style.visibility = 'visible';
        (circuitContainer as HTMLElement).style.opacity = '1';
      }
      
      if (svg) {
        (svg as HTMLElement).style.display = 'block';
        (svg as HTMLElement).style.visibility = 'visible';
        (svg as HTMLElement).style.opacity = '1';
      }
      
      gates.forEach(gate => {
        (gate as HTMLElement).style.display = 'block';
        (gate as HTMLElement).style.visibility = 'visible';
        (gate as HTMLElement).style.opacity = '1';
      });
    } catch (e) {
      console.error('Error ensuring elements visibility:', e);
    }
  };

  // 添加一个专门的检查和修复函数
  function checkAndFixGates() {
    console.log("检查量子门渲染 - 开始");
    
    // 1. 检查所有应该存在的量子门是否在DOM中
    gates.forEach((gate, idx) => {
      const gateId = `gate-${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`;
      const gateElement = document.getElementById(gateId);
      
      if (!gateElement) {
        console.warn(`门元素未找到: ${gateId}`);
      } else {
        console.log(`找到门元素: ${gateId}`);
        
        // 获取门元素的位置和尺寸信息
        const rect = gateElement.getBoundingClientRect();
        console.log(`门 ${gateId} 屏幕位置: x=${rect.left}, y=${rect.top}, 宽=${rect.width}, 高=${rect.height}`);
        
        // 检查foreignObject容器
        const containerID = `gate-container-${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`;
        const containerElement = document.getElementById(containerID);
        if (containerElement) {
          console.log(`找到容器元素: ${containerID}`);
          const containerRect = containerElement.getBoundingClientRect();
          console.log(`容器 ${containerID} 屏幕位置: x=${containerRect.left}, y=${containerRect.top}`);
        } else {
          console.warn(`容器元素未找到: ${containerID}`);
        }
        
        // 确保门的可见性和样式
        gateElement.style.display = 'block';
        gateElement.style.visibility = 'visible';
        gateElement.style.opacity = '1';
        gateElement.style.zIndex = '2000';
      }
    });
    
    // 2. 确认电路容器的可见性
    const circuitContainer = document.getElementById('circuit-container');
    if (circuitContainer) {
      console.log("circuit-container 已找到");
      console.log("circuit-container 尺寸:", {
        宽度: circuitContainer.clientWidth,
        高度: circuitContainer.clientHeight,
        偏移X: circuitContainer.offsetLeft,
        偏移Y: circuitContainer.offsetTop
      });
      circuitContainer.style.display = 'block';
      circuitContainer.style.visibility = 'visible';
      circuitContainer.style.opacity = '1';
      circuitContainer.style.zIndex = '30';
      circuitContainer.style.position = 'relative';
    } else {
      console.error("circuit-container 未找到");
    }
    
    // 3. 确认SVG元素可见
    const svg = document.getElementById('quantum-circuit-svg');
    if (svg) {
      console.log("quantum-circuit-svg 已找到");
      console.log("svg 尺寸:", {
        宽度: (svg as Element).clientWidth,
        高度: (svg as Element).clientHeight,
        视图框: svg.getAttribute('viewBox')
      });
      (svg as HTMLElement).style.display = 'block';
      (svg as HTMLElement).style.visibility = 'visible';
      (svg as HTMLElement).style.opacity = '1';
      (svg as HTMLElement).style.overflow = 'visible';
      (svg as HTMLElement).style.zIndex = '20';
    } else {
      console.error("quantum-circuit-svg 未找到");
    }
    
    // 4. 确认量子比特线和标签可见
    const qubitLines = document.querySelectorAll('.qubit-line');
    console.log(`找到 ${qubitLines.length} 条量子比特线`);
    qubitLines.forEach((line, idx) => {
      const x1 = (line as SVGLineElement).getAttribute('x1');
      const y1 = (line as SVGLineElement).getAttribute('y1');
      const x2 = (line as SVGLineElement).getAttribute('x2');
      const y2 = (line as SVGLineElement).getAttribute('y2');
      console.log(`比特线 ${idx} 位置: (${x1},${y1}) 到 (${x2},${y2})`);
    });
    
    // 5. 检查拖放区域是否可能遮挡量子门
    const dropzones = document.querySelectorAll('[id^="dropzone-"]');
    console.log(`找到 ${dropzones.length} 个拖放区域`);
    dropzones.forEach((zone, idx) => {
      const element = zone as HTMLElement;
      element.style.zIndex = '10';
      console.log(`拖放区域 ${idx} z-index: ${element.style.zIndex}`);
    });
    
    // 6. 检查foreignObject元素
    const foreignObjects = document.querySelectorAll('foreignObject');
    console.log(`找到 ${foreignObjects.length} 个foreignObject元素`);
    foreignObjects.forEach((fo, idx) => {
      const x = fo.getAttribute('x');
      const y = fo.getAttribute('y');
      console.log(`foreignObject ${idx} 位置: x=${x}, y=${y}`);
      // 确保可见性 - 使用setAttribute避免类型错误
      fo.setAttribute('style', 'overflow: visible; display: block; visibility: visible');
    });
    
    console.log("检查量子门渲染 - 完成");
  }

  // 监听视图变化确保元素可见
  useEffect(() => {
    // 初始绘制
    drawCircuit();
    
    // 设置一个interval定期检查元素可见性
    const checkInterval = setInterval(ensureElementsVisible, 1000);
    
    // 监听窗口大小改变
    window.addEventListener('resize', ensureElementsVisible);
    
    // 清理函数
    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('resize', ensureElementsVisible);
    };
  }, []);
  
  // 当qubits或gates改变时重新绘制电路
  useEffect(() => {
    drawCircuit();
    // 在重绘后检查和修复
    setTimeout(() => {
      checkAndFixGates();
      ensureElementsVisible();
      
      // 添加第二次检查，确保所有门都正确显示
      setTimeout(() => {
        console.log("进行第二次检查，确保量子门已正确渲染");
        
        // 获取当前应该存在的所有门ID
        const expectedGateIds = gates.map(gate => 
          `gate-${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`
        );
        
        // 检查每个门是否存在
        let missingGates = false;
        expectedGateIds.forEach(gateId => {
          const gateElement = document.getElementById(gateId);
          if (!gateElement) {
            console.warn(`第二次检查: 门元素 ${gateId} 未找到，将尝试恢复`);
            missingGates = true;
          }
        });
        
        // 如果有缺失的门，尝试强制重绘
        if (missingGates) {
          console.log("检测到缺失的门元素，强制重绘整个电路");
          // 调用函数重新绘制电路
          const redrawCircuit = () => {
            drawCircuit(); 
          };
          redrawCircuit();
          
          // 再次检查和设置样式
          setTimeout(() => {
            checkAndFixGates();
          }, 50);
        }
      }, 150);
    }, 100);
  }, [qubits, gates, highlightedQubit]);

  // 添加自适应高度钩子
  useEffect(() => {
    // 当量子比特数量发生变化时，重新计算容器高度
    const circuitMainContainer = document.getElementById('circuit-main-container');
    if (circuitMainContainer) {
      const calculatedHeight = Math.max(220, qubits * 40 + 100); // 基础高度220px + 每个比特40px + 额外空间
      circuitMainContainer.style.minHeight = `${calculatedHeight}px`;
    }
  }, [qubits]); // 仅在量子比特数量变化时执行

  // 修改拖动进入处理函数，从事件坐标推断量子比特索引
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const qubitIndex = getQubitIndexFromEvent(event);
    if (qubitIndex !== null) {
      setHighlightedQubit(qubitIndex);
    }
  };

  // 添加函数从事件坐标计算量子比特索引
  const getQubitIndexFromEvent = (event: React.DragEvent<HTMLDivElement>): number | null => {
    const container = document.getElementById('circuit-main-container');
    if (!container) return null;
    
    const rect = container.getBoundingClientRect();
    
    // 计算相对于容器的鼠标位置
    const relativeY = event.clientY - rect.top;
    
    // 计算量子比特索引（每个量子比特线高40px，从上到下）
    // 顶部padding约30px
    const calculatedIndex = Math.floor((relativeY - 30) / 40);
    
    // 确保索引在有效范围内
    if (calculatedIndex >= 0 && calculatedIndex < qubits) {
      return calculatedIndex;
    }
    
    return null;
  };

  // 修改拖动离开处理函数
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // 检查是否离开了整个电路区域
    const container = document.getElementById('circuit-main-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      setHighlightedQubit(null);
    }
  };

  // 添加回处理拖动悬停函数
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    
    // 在拖动悬停时也更新高亮的量子比特
    const qubitIndex = getQubitIndexFromEvent(event);
    if (qubitIndex !== null && qubitIndex !== highlightedQubit) {
      setHighlightedQubit(qubitIndex);
    }
  };

  // 修改拖放处理函数
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    // 从事件位置计算量子比特索引
    const qubitIndex = getQubitIndexFromEvent(event);
    if (qubitIndex === null) {
      setHighlightedQubit(null);
      return;
    }
    
    console.log("拖放事件触发 - qubitIndex:", qubitIndex);
    
    try {
      // 获取拖放的量子门数据
      const data = event.dataTransfer.getData("application/quantum-gate");
      if (!data) {
        console.error("无法获取拖放数据");
        setHighlightedQubit(null);
        return;
      }
      
      console.log("拖放数据:", data);
      
      const gateData = JSON.parse(data);
      const { gateType, gateInfo } = gateData;
      
      console.log("解析后的门数据:", { gateType, gateInfo });
      
      // 计算新门在该比特线上的索引
      // 找出当前在这个比特上的门的最大索引
      const currentQubitGates = gates.filter(g => g.qubitIndex === qubitIndex);
      console.log(`当前比特线 ${qubitIndex} 上已有 ${currentQubitGates.length} 个门`);
      
      // 新门的索引是当前最大索引 + 1 或 1（如果没有门）
      const maxGateIndex = currentQubitGates.length > 0 
        ? Math.max(...currentQubitGates.map(g => g.gateIndex)) 
        : 0;
      const newGateIndex = maxGateIndex + 1;
      
      console.log(`添加门: ${gateType}, 比特: ${qubitIndex}, 索引: ${newGateIndex}`);
      
      // 如果是需要目标量子比特的门，打开选择对话框
      if (gateInfo && gateInfo.targetRequired) {
        console.log("需要目标量子比特，打开选择对话框");
        setSelectedGate({
          gateType: gateType,
          qubitIndex: qubitIndex,
          gateIndex: newGateIndex,
          params: gateInfo.hasParams ? gateInfo.paramDefaults : undefined
        });
        setModalOpen(true);
      } else {
        // 获取app/page.tsx中定义的onAddGate函数参数
        const params = gateInfo && gateInfo.hasParams ? gateInfo.paramDefaults : undefined;
        
        // 调用父组件传入的添加量子门函数
        if (typeof onAddGate === 'function') {
          console.log("调用onAddGate函数添加门");
          onAddGate(gateType, qubitIndex, undefined, params);
          
          // 强制立即重绘电路
          setTimeout(() => {
            console.log("门添加后立即重绘电路");
            console.log("当前gates数组:", gates); // 注意：由于setState是异步的，这里可能还看不到新添加的门
            drawCircuit();
            
            // 再次检查DOM元素是否存在
            setTimeout(() => {
              console.log("检查门是否成功添加到DOM");
              const gateElements = document.querySelectorAll('.gate');
              console.log(`DOM中找到 ${gateElements.length} 个门元素`);
              
              // 检查电路容器可见性
              const circuitContainer = document.getElementById('circuit-container');
              if (circuitContainer) {
                console.log("circuit-container 样式:", {
                  display: circuitContainer.style.display,
                  visibility: circuitContainer.style.visibility,
                  zIndex: circuitContainer.style.zIndex,
                  position: circuitContainer.style.position
                });
              }
            }, 100);
          }, 50);
        } else {
          console.log("onAddGate函数未定义，无法添加门");
        }
      }
    } catch (error) {
      console.error("量子门拖放处理错误:", error);
    }
  };

  const drawCircuit = () => {
    // 添加调试信息
    console.log("开始绘制电路，gates数组:", gates);
    console.log(`当前有 ${gates.length} 个门，${qubits} 个量子比特`);
    
    // 确保容器存在
    const circuitMainContainer = document.getElementById('circuit-main-container');
    if (!circuitMainContainer) {
      console.error('Circuit main container not found');
      return;
    }
    
    // 确保circuit-container存在，如果不存在则创建
    let circuitContainer = document.getElementById('circuit-container');
    if (!circuitContainer) {
      console.log("创建新的circuit-container");
      circuitContainer = document.createElement('div');
      circuitContainer.id = 'circuit-container';
      circuitContainer.style.width = '100%';
      circuitContainer.style.height = '100%';
      circuitContainer.style.position = 'relative';
      circuitContainer.style.display = 'block';
      circuitContainer.style.visibility = 'visible';
      circuitContainer.style.opacity = '1';
      circuitContainer.style.zIndex = '30';
      circuitMainContainer.appendChild(circuitContainer);
    } else {
      console.log("已存在circuit-container");
    }

    // 清除容器内容
    const container = d3.select("#circuit-container");
    container.selectAll("*").remove();

    // 获取容器的宽度，用于计算SVG宽度和viewBox
    const containerWidth = circuitContainer.clientWidth || 300;
    
    const qubitLabelOffset = 80; // 增加左侧padding
    const circuitLineStartX = qubitLabelOffset + 10; // 电路线起点右移

    // 调整SVG的高度以适应量子比特的数量，确保不会过小
    const minContentWidth = gates.length * 30 + 100 + qubitLabelOffset;
    // 使用容器宽度和内容所需最小宽度中的较大值，但不小于300px
    const svgWidth = Math.max(300, minContentWidth, containerWidth - 20); // 减去一些padding
    const svgHeight = Math.max(qubits * 40 + 60, 120); // 增加高度确保有足够空间
    
    // 根据量子比特数量调整父容器的minHeight
    if (circuitMainContainer) {
      // 当量子比特数量增加时，确保容器高度合适
      const containerMinHeight = Math.max(220, svgHeight + 40); // 基础高度+额外padding
      circuitMainContainer.style.minHeight = `${containerMinHeight}px`;
    }

    // 创建带有ID的SVG元素，使其更容易被CSS选择器匹配
    const svg = container
      .append("svg")
      .attr("id", "quantum-circuit-svg")
      .attr("class", "quantum-circuit")
      .attr("width", "100%") // 宽度100%以适应容器
      .attr("height", svgHeight)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .style("background-color", "white") // 固定使用白色背景
      .style("border-radius", "4px")
      .style("display", "block")
      .style("visibility", "visible")
      .style("overflow", "visible")
      .style("max-width", "100%") // 确保SVG不超出父容器
      .style("opacity", "1")
      .style("z-index", "20");

    // 绘制量子线路
    svg
      .selectAll("line.qubit-line")
      .data(new Array(qubits))
      .enter()
      .append("line")
      .attr("class", "qubit-line")
      .attr("x1", circuitLineStartX)
      .attr("y1", (d, i) => 30 + i * 40)
      .attr("x2", svgWidth - 20)
      .attr("y2", (d, i) => 30 + i * 40)
      .attr("stroke", (d, i) => highlightedQubit === i ? "#2196f3" : "#1976d2") // 高亮色与正常色
      .attr("stroke-width", (d, i) => highlightedQubit === i ? 3.5 : 2.5) // 高亮线更粗
      .attr("stroke-opacity", (d, i) => highlightedQubit === i ? 1 : 0.9)
      .style("display", "block")
      .style("visibility", "visible");

    // 为高亮的量子比特线添加半透明背景
    if (highlightedQubit !== null) {
      svg.append("rect")
        .attr("class", "qubit-highlight")
        .attr("x", circuitLineStartX - 5)
        .attr("y", 30 + highlightedQubit * 40 - 15)
        .attr("width", svgWidth - circuitLineStartX - 10)
        .attr("height", 30)
        .attr("fill", "rgba(33, 150, 243, 0.1)")
        .attr("rx", 4)
        .style("z-index", "5"); // 确保在线条下方
    }

    // 绘制量子比特标签
    svg
      .selectAll("text.qubit-label")
      .data(new Array(qubits))
      .enter()
      .append("text")
      .attr("class", "qubit-label")
      .text((d, i) => `Q${i}:`)
      .attr("x", qubitLabelOffset - 15) // 更靠左
      .attr("y", (d, i) => 30 + i * 40 + 4)
      .attr("font-family", "'Inter', sans-serif")
      .attr("font-size", "14px") // 增大字体 
      .attr("font-weight", "600") // 加粗
      .attr("fill", "#000000") // 固定使用黑色文本
      .attr("text-anchor", "end")
      .style("display", "block")
      .style("visibility", "visible");
      
    // 绘制门 - 修复重叠和位置问题，改用单纯的g/rect/text元素
    console.log("开始绘制量子门 - 总数:", gates.length);
    console.time("绘制所有量子门");

    gates.forEach((gate, idx) => {
      // 确保门的gateIndex有效
      if (gate.gateIndex === undefined || gate.gateIndex === null) {
        console.error("Gate missing gateIndex:", gate);
        return;
      }
      
      console.log(`绘制第 ${idx+1}/${gates.length} 个门: ${gate.gateType}, 位于比特 ${gate.qubitIndex}, 索引 ${gate.gateIndex}`);
      console.time(`绘制门 ${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`);
      
      // 根据精确坐标计算门的位置
      const qubitY = 30 + gate.qubitIndex * 40; // 量子比特线的y坐标
      
      // 计算门的x坐标 - 应该基于门索引的水平位置
      // 索引从1开始，每个门占30个像素宽度，再加上起始偏移
      const gateX = circuitLineStartX + (gate.gateIndex * 30);
      
      // 计算门的y坐标 - 应该在量子比特线上垂直居中
      const gateY = qubitY - 12; // 门高度为24px，上移12px居中
      
      console.log(`门坐标: qubitY=${qubitY}, gateX=${gateX}, gateY=${gateY}`);
      
      // 创建一个包含门所有元素的组
      const gateGroup = svg.append("g")
        .attr("class", "gate")
        .attr("id", `gate-${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`)
        .style("cursor", "pointer");
      
      // 添加门的背景矩形
      gateGroup.append("rect")
        .attr("x", gateX)
        .attr("y", gateY)
        .attr("width", 24)
        .attr("height", 24)
        .attr("rx", 4)
        .attr("fill", getGateBackgroundColor(gate.gateType))
        .attr("stroke", getGateBorderColor(gate.gateType))
        .attr("stroke-width", 2);
      
      // 添加门的文本标签
      gateGroup.append("text")
        .attr("x", gateX + 12)
        .attr("y", gateY + 16)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-family", "Arial")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "#000000")
        .text(getGateLabel(gate.gateType));
      
      // 添加点击和悬停事件
      gateGroup.on("click", function(event) {
        handleGateClick(event, gate);
      });
      
      gateGroup.on("mouseover", function() {
        // 使用简单的颜色字符串避免类型错误
        d3.select(this).select("rect")
          .attr("fill", "#e0f7fa") // 使用浅蓝色突出显示
          .attr("stroke-width", 3);
      });
      
      gateGroup.on("mouseout", function() {
        d3.select(this).select("rect")
          .attr("fill", getGateBackgroundColor(gate.gateType))
          .attr("stroke-width", 2);
      });
      
      console.log(`已添加门图像`);
      console.timeEnd(`绘制门 ${gate.gateType}-${gate.qubitIndex}-${gate.gateIndex}`);
      
      // 为双量子比特门绘制连接线
      if (gate.targetIndex !== undefined) {
        const sourceY = qubitY; // 控制量子比特线的y坐标
        const targetY = 30 + gate.targetIndex * 40; // 目标量子比特线的y坐标
        const lineX = gateX + 12; // 线的x坐标（门中心）
        
        // 绘制垂直连接线
        svg
          .append("line")
          .attr("class", "gate-connector")
          .attr("x1", lineX)
          .attr("y1", sourceY)
          .attr("x2", lineX)
          .attr("y2", targetY)
          .attr("stroke", "#555")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "2,2")
          .style("z-index", 140);
          
        // 为控制点和目标点添加小圆圈指示
        if (gate.gateType === "CX" || gate.gateType === "CZ") {
          // 控制点 - 小实心圆
          svg
            .append("circle")
            .attr("class", "control-point")
            .attr("cx", lineX)
            .attr("cy", sourceY)
            .attr("r", 3)
            .attr("fill", "#333")
            .style("z-index", 145);
            
          // 目标点 - 在CNOT门的情况下添加一个X
          if (gate.gateType === "CX") {
            svg
              .append("circle")
              .attr("class", "target-point")
              .attr("cx", lineX)
              .attr("cy", targetY)
              .attr("r", 6)
              .attr("fill", "white")
              .attr("stroke", "#333")
              .attr("stroke-width", 1.5)
              .style("z-index", 145);
              
            // 添加一个X符号
            svg
              .append("line")
              .attr("class", "target-x")
              .attr("x1", lineX - 4)
              .attr("y1", targetY - 4)
              .attr("x2", lineX + 4)
              .attr("y2", targetY + 4)
              .attr("stroke", "#333")
              .attr("stroke-width", 1.5)
              .style("z-index", 146);
              
            svg
              .append("line")
              .attr("class", "target-x")
              .attr("x1", lineX - 4)
              .attr("y1", targetY + 4)
              .attr("x2", lineX + 4)
              .attr("y2", targetY - 4)
              .attr("stroke", "#333")
              .attr("stroke-width", 1.5)
              .style("z-index", 146);
          }
        }
      }
    });
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          量子比特数量: {qubits}
        </Typography>

        <ButtonGroup variant="outlined" size="small">
          <Tooltip title="添加量子比特">
            <Button
              onClick={addQubit}
              startIcon={<AddIcon />}
              sx={{ textTransform: "none" }}
            >
              添加比特
            </Button>
          </Tooltip>
          <Tooltip title="删除量子比特">
            <Button
              onClick={deleteQubit}
              disabled={qubits <= 1}
              startIcon={<RemoveIcon />}
              sx={{ textTransform: "none" }}
            >
              删除比特
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        id="circuit-main-container"
        sx={{
          flexGrow: 1,
          overflow: "auto", // 保持auto允许在需要时显示滚动条
          bgcolor: "white", // 改为白色固定背景
          p: 2,
          borderRadius: 1,
          position: "relative",
          border: "2px solid #e0e0e0", // 加粗边框，固定颜色
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          minHeight: "220px",
          maxHeight: "calc(100vh - 350px)", // 添加最大高度限制
          display: "block",
          visibility: "visible",
          opacity: 1,
          width: "100%", // 确保宽度为100%
          boxSizing: "border-box", // 确保padding不会增加元素宽度
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* 移除所有拖放区域，使用整个电路区域接收拖放事件 */}
      </Box>

      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 1,
            minWidth: 120,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <MenuItem
          onClick={() => setModalOpen(!modalOpen)}
          sx={{ color: "primary.main" }}
        >
          <InfoIcon sx={{ mr: 1, fontSize: 18 }} /> 查看信息
        </MenuItem>
        {selectedGate && (
          <MenuItem
            onClick={() => {
              deleteGate(
                selectedGate.gateType,
                selectedGate.qubitIndex,
                selectedGate.gateIndex
              );
              handleClose();
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} /> 删除门
          </MenuItem>
        )}
      </Menu>

      <GateInfoModal
        open={modalOpen}
        gateInfo={selectedGate}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default QuantumCircuit;
