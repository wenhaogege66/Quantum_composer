"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Typography,
  Paper,
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
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<GateInfo | null>(null);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleGateClick = (
    event: React.MouseEvent<HTMLElement>,
    gate: GateInfo
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedGate(gate);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    drawCircuit();
  }, [qubits, gates]);

  const drawCircuit = () => {
    const container = d3.select("#circuit-container");
    container.selectAll("svg").remove();

    const qubitLabelOffset = 80; // 增加左侧padding
    const circuitLineStartX = qubitLabelOffset + 10; // 电路线起点右移

    // 创建SVG元素并设置样式
    const svgWidth = Math.max(300, gates.length * 30 + 100 + qubitLabelOffset); // 画布宽度也要加padding
    const svgHeight = qubits * 40 + 20;

    const svg = container
      .append("svg")
      .attr("width", "100%")
      .attr("height", svgHeight)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .style("background-color", "var(--mui-palette-background-paper, white)")
      .style("border-radius", "4px");

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
      .attr("stroke", "var(--mui-palette-primary-main, #1976d2)")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.7);

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
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("fill", "var(--mui-palette-text-primary, #333)")
      .attr("text-anchor", "end");

    // 绘制门时x坐标也要右移
    const gatesGroup = svg
      .selectAll(".gate")
      .data(gates)
      .enter()
      .append("g")
      .attr("class", "gate")
      .attr("transform", (gate) => {
        const x = circuitLineStartX + (gate.gateIndex - 1) * 30;
        const y = 20 + gate.qubitIndex * 40;
        return `translate(${x}, ${y})`;
      });

    // 添加门图标背景
    gatesGroup
      .append("rect")
      .attr("width", 24)
      .attr("height", 24)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("fill", (gate) => getGateBackgroundColor(gate.gateType))
      .attr("stroke", (gate) => getGateBorderColor(gate.gateType))
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer")
      .on("click", handleGateClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    // 添加门标签文本
    gatesGroup
      .append("text")
      .text((gate) => getGateLabel(gate.gateType))
      .attr("x", 12)
      .attr("y", 16)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family", "'Inter', sans-serif")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", (gate) => getGateBorderColor(gate.gateType))
      .attr("cursor", "pointer")
      .on("click", handleGateClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    // 添加门图像（仅作为背景装饰）
    gatesGroup
      .append("image")
      .attr("x", 4)
      .attr("y", 4)
      .attr("width", 16)
      .attr("height", 16)
      .attr("opacity", 0.2) // 降低图像不透明度，作为背景
      .attr("xlink:href", (gate) => getGateIcon(gate.gateType))
      .attr("data-gate-info", (gate) => JSON.stringify(gate))
      .attr("cursor", "pointer")
      .on("click", handleGateClick)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    // 为双量子比特门绘制连接线
    gates.forEach((gate) => {
      if (gate.targetIndex !== undefined) {
        const sourceY = 30 + gate.qubitIndex * 40;
        const targetY = 30 + gate.targetIndex * 40;
        const gateX = 72 + (gate.gateIndex - 1) * 30;

        // 绘制垂直连接线
        svg
          .append("line")
          .attr("x1", gateX)
          .attr("y1", sourceY)
          .attr("x2", gateX)
          .attr("y2", targetY)
          .attr("stroke", "#555")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "2,2");

        // 为控制点和目标点添加小圆圈指示
        if (gate.gateType === "CX" || gate.gateType === "CZ") {
          // 控制点 - 小实心圆
          svg
            .append("circle")
            .attr("cx", gateX)
            .attr("cy", sourceY)
            .attr("r", 3)
            .attr("fill", "#333");

          // 目标点 - 在CNOT门的情况下添加一个X
          if (gate.gateType === "CX") {
            svg
              .append("circle")
              .attr("cx", gateX)
              .attr("cy", targetY)
              .attr("r", 6)
              .attr("fill", "white")
              .attr("stroke", "#333")
              .attr("stroke-width", 1.5);

            // 添加一个X符号
            svg
              .append("line")
              .attr("x1", gateX - 4)
              .attr("y1", targetY - 4)
              .attr("x2", gateX + 4)
              .attr("y2", targetY + 4)
              .attr("stroke", "#333")
              .attr("stroke-width", 1.5);

            svg
              .append("line")
              .attr("x1", gateX - 4)
              .attr("y1", targetY + 4)
              .attr("x2", gateX + 4)
              .attr("y2", targetY - 4)
              .attr("stroke", "#333")
              .attr("stroke-width", 1.5);
          }
        }
      }
    });
  };

  // 鼠标悬停事件处理函数
  function handleMouseOver(event: any, d: any) {
    const element = d3.select(event.currentTarget);
    element.transition().duration(200).attr("transform", "scale(1.1)");
    element.style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))");
  }

  // 鼠标移出事件处理函数
  function handleMouseOut(event: any, d: any) {
    const element = d3.select(event.currentTarget);
    element.transition().duration(200).attr("transform", "scale(1)");
    element.style("filter", "none");
  }

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

      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          bgcolor: "background.default",
          p: 2,
          borderRadius: 1,
        }}
      >
        <Box id="circuit-container" sx={{ width: "100%", height: "100%" }} />
      </Paper>

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
