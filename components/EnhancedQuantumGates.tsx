"use client";

import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Tooltip,
  Divider,
  Box,
} from "@mui/material";
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
import PG from "../img/PG.svg";
import CCXG from "../img/CCXG.svg";
import MG from "../img/MG.svg";
// 量子门SVG图像的接口
interface IGateImage {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}

// 量子门的详细信息接口
interface IGateInfo {
  id: string;
  name: string;
  symbol: string;
  category: string;
  description: string;
  matrix?: string[];
  hasParams?: boolean;
  paramNames?: string[];
  paramDefaults?: any;
  targetRequired?: boolean;
  image: IGateImage;
}

// 所有量子门的定义
const gateDefinitions: IGateInfo[] = [
  // 基本单量子比特门
  {
    id: "h",
    name: "Hadamard门",
    symbol: "H",
    category: "basic",
    description: "将量子比特置于叠加态，对应于绕布洛赫球面的X+Z轴旋转π/2",
    matrix: ["1/√2 * [1, 1]", "1/√2 * [1, -1]"],
    image: { src: HG.src, alt: "Hadamard Gate" },
  },
  {
    id: "x",
    name: "Pauli-X门",
    symbol: "X",
    category: "basic",
    description: "量子比特翻转门，相当于经典比特的NOT门",
    matrix: ["[0, 1]", "[1, 0]"],
    image: { src: XG.src, alt: "X Gate" }, // 此处应该使用X门的SVG
  },
  {
    id: "y",
    name: "Pauli-Y门",
    symbol: "Y",
    category: "basic",
    description: "绕布洛赫球面的Y轴旋转π",
    matrix: ["[0, -i]", "[i, 0]"],
    image: { src: YG.src, alt: "Y Gate" }, // 此处应该使用Y门的SVG
  },
  {
    id: "z",
    name: "Pauli-Z门",
    symbol: "Z",
    category: "basic",
    description: "绕布洛赫球面的Z轴旋转π",
    matrix: ["[1, 0]", "[0, -1]"],
    image: { src: ZG.src, alt: "Z Gate" }, // 此处应该使用Z门的SVG
  },

  // 参数化门
  {
    id: "rx",
    name: "RX(θ)门",
    symbol: "RX",
    category: "rotation",
    description: "绕X轴旋转θ角度",
    hasParams: true,
    paramNames: ["theta"],
    paramDefaults: { theta: "π/2" },
    image: { src: RXG.src, alt: "RX Gate" }, // 此处应该使用RX门的SVG
  },
  {
    id: "ry",
    name: "RY(θ)门",
    symbol: "RY",
    category: "rotation",
    description: "绕Y轴旋转θ角度",
    hasParams: true,
    paramNames: ["theta"],
    paramDefaults: { theta: "π/2" },
    image: { src: RYG.src, alt: "RY Gate" }, // 此处应该使用RY门的SVG
  },
  {
    id: "rz",
    name: "RZ(θ)门",
    symbol: "RZ",
    category: "rotation",
    description: "绕Z轴旋转θ角度",
    hasParams: true,
    paramNames: ["theta"],
    paramDefaults: { theta: "π/2" },
    image: { src: RZG.src, alt: "RZ Gate" }, // 此处应该使用RZ门的SVG
  },
  {
    id: "p",
    name: "Phase(φ)门",
    symbol: "P",
    category: "phase",
    description: "添加相位φ到|1⟩态",
    hasParams: true,
    paramNames: ["phi"],
    paramDefaults: { phi: "π/4" },
    image: { src: PG.src, alt: "P Gate" }, // 此处应该使用P门的SVG
  },

  // 多量子比特门
  {
    id: "cx",
    name: "受控X门",
    symbol: "CX",
    category: "multi",
    description: "受控NOT门，也称CNOT门",
    targetRequired: true,
    image: { src: CXG.src, alt: "CX Gate" }, // 此处应该使用CX门的SVG
  },
  {
    id: "cz",
    name: "受控Z门",
    symbol: "CZ",
    category: "multi",
    description: "受控相位门",
    targetRequired: true,
    image: { src: CZG.src, alt: "CZ Gate" }, // 此处应该使用CZ门的SVG
  },
  {
    id: "swap",
    name: "交换门",
    symbol: "SWAP",
    category: "multi",
    description: "交换两个量子比特的状态",
    targetRequired: true,
    image: { src: SWAPG.src, alt: "SWAP Gate" }, // 此处应该使用SWAP门的SVG
  },
  {
    id: "toffoli",
    name: "Toffoli门",
    symbol: "CCX",
    category: "multi",
    description: "受控受控NOT门，需要两个控制比特和一个目标比特",
    targetRequired: true,
    image: { src: CCXG.src, alt: "Toffoli Gate" }, // 此处应该使用Toffoli门的SVG
  },

  // 测量门
  {
    id: "measure",
    name: "测量门",
    symbol: "M",
    category: "measure",
    description: "在计算基底上测量量子比特",
    image: { src: MG.src, alt: "Measure Gate" }, // 此处应该使用测量门的SVG
  },
];

// 门分类
const gateCategories = [
  { id: "all", label: "全部量子门" },
  { id: "basic", label: "基本门" },
  { id: "rotation", label: "旋转门" },
  { id: "phase", label: "相位门" },
  { id: "multi", label: "多量子比特门" },
  { id: "measure", label: "测量操作" },
];

interface IGateButtonProps {
  gate: IGateInfo;
  onGateSelect: (gate: IGateInfo) => void;
}

// 量子门按钮组件
const GateButton: React.FC<IGateButtonProps> = ({ gate, onGateSelect }) => {
  return (
    <Tooltip
      title={
        <div>
          <Typography variant="subtitle2">{gate.name}</Typography>
          <Typography variant="body2">{gate.description}</Typography>
          {gate.matrix && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption">矩阵表示:</Typography>
              {gate.matrix.map((row, i) => (
                <Typography key={i} variant="caption" component="div">
                  {row}
                </Typography>
              ))}
            </Box>
          )}
        </div>
      }
      arrow
    >
      <Button
        onClick={() => onGateSelect(gate)}
        variant="outlined"
        sx={{
          width: 60,
          height: 60,
          margin: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 1,
          borderColor: "#3f51b5",
          "&:hover": {
            backgroundColor: "rgba(63, 81, 181, 0.08)",
          },
        }}
      >
        <img
          src={gate.image.src}
          alt={gate.image.alt}
          style={{ width: 30, height: 30 }}
        />
        <Typography variant="caption" sx={{ mt: 0.5 }}>
          {gate.symbol}
        </Typography>
      </Button>
    </Tooltip>
  );
};

interface EnhancedQuantumGatesProps {
  qubits: number;
  onAddGate: (
    gateType: string,
    qubitIndex: number,
    targetIndex?: number,
    params?: any
  ) => void;
}

// 增强的量子门组件库
const EnhancedQuantumGates: React.FC<EnhancedQuantumGatesProps> = ({
  qubits,
  onAddGate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<IGateInfo | null>(null);
  const [selectedQubit, setSelectedQubit] = useState<number | "">("");
  const [targetQubit, setTargetQubit] = useState<number | "">("");
  const [gateParams, setGateParams] = useState<Record<string, string>>({});

  // 处理类别变更
  const handleCategoryChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setSelectedCategory(newValue);
  };

  // 打开门选择对话框
  const handleGateSelect = (gate: IGateInfo) => {
    setSelectedGate(gate);
    setSelectedQubit("");
    setTargetQubit("");

    // 初始化参数
    if (gate.hasParams && gate.paramNames && gate.paramDefaults) {
      const initialParams = {};
      gate.paramNames.forEach((paramName) => {
        initialParams[paramName] = gate.paramDefaults[paramName] || "";
      });
      setGateParams(initialParams);
    } else {
      setGateParams({});
    }

    setOpen(true);
  };

  // 关闭对话框
  const handleClose = () => {
    setOpen(false);
  };

  // 处理参数变更
  const handleParamChange = (paramName: string, value: string) => {
    setGateParams((prev) => ({ ...prev, [paramName]: value }));
  };

  // 添加门到电路
  const handleAddGate = () => {
    if (selectedGate && selectedQubit !== "") {
      const qubitIndex = Number(selectedQubit);

      // 有目标比特的门
      if (selectedGate.targetRequired && targetQubit !== "") {
        onAddGate(
          selectedGate.symbol,
          qubitIndex,
          Number(targetQubit),
          selectedGate.hasParams ? gateParams : undefined
        );
      }
      // 单比特门
      else if (!selectedGate.targetRequired) {
        onAddGate(
          selectedGate.symbol,
          qubitIndex,
          undefined,
          selectedGate.hasParams ? gateParams : undefined
        );
      }
      // 缺少目标比特
      else {
        return; // 不关闭对话框，等待用户选择目标比特
      }

      handleClose();
    }
  };

  // 根据当前选择的类别筛选量子门
  const filteredGates =
    selectedCategory === "all"
      ? gateDefinitions
      : gateDefinitions.filter((gate) => gate.category === selectedCategory);

  return (
    <div style={{ width: "100%", padding: "10px" }}>
      <Typography variant="h6" gutterBottom>
        量子门库
      </Typography>

      <Tabs
        value={selectedCategory}
        onChange={handleCategoryChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="量子门类别"
        sx={{ mb: 2 }}
      >
        {gateCategories.map((category) => (
          <Tab key={category.id} label={category.label} value={category.id} />
        ))}
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={1}>
        {filteredGates.map((gate) => (
          <Grid item key={gate.id}>
            <GateButton gate={gate} onGateSelect={handleGateSelect} />
          </Grid>
        ))}
      </Grid>

      {/* 量子门参数配置对话框 */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="gate-dialog-title"
      >
        <DialogTitle id="gate-dialog-title">
          {selectedGate?.name || "选择量子门参数"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            {selectedGate?.description}
          </Typography>

          <TextField
            select
            fullWidth
            margin="normal"
            label="作用量子比特"
            value={selectedQubit}
            onChange={(e) => setSelectedQubit(Number(e.target.value))}
            helperText="选择要应用门的量子比特"
          >
            {Array.from({ length: qubits }, (_, i) => (
              <MenuItem key={i} value={i}>
                量子比特 {i}
              </MenuItem>
            ))}
          </TextField>

          {selectedGate?.targetRequired && (
            <TextField
              select
              fullWidth
              margin="normal"
              label="目标量子比特"
              value={targetQubit}
              onChange={(e) => setTargetQubit(Number(e.target.value))}
              helperText="选择目标量子比特"
              disabled={selectedQubit === ""}
            >
              {Array.from(
                { length: qubits },
                (_, i) =>
                  i !== selectedQubit && (
                    <MenuItem key={i} value={i}>
                      量子比特 {i}
                    </MenuItem>
                  )
              )}
            </TextField>
          )}

          {selectedGate?.hasParams && selectedGate.paramNames && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                门参数设置
              </Typography>
              {selectedGate.paramNames.map((paramName) => (
                <TextField
                  key={paramName}
                  fullWidth
                  margin="normal"
                  label={`参数 ${paramName}`}
                  value={gateParams[paramName] || ""}
                  onChange={(e) => handleParamChange(paramName, e.target.value)}
                  helperText={`输入 ${paramName} 参数值 (如: π/2, π/4)`}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button
            onClick={handleAddGate}
            color="primary"
            variant="contained"
            disabled={
              selectedQubit === "" ||
              (selectedGate?.targetRequired && targetQubit === "")
            }
          >
            添加到电路
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EnhancedQuantumGates;
