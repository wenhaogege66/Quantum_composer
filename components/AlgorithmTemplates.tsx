"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
  Box,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import TransformIcon from "@mui/icons-material/Transform";
import CalculateIcon from "@mui/icons-material/Calculate";
import MemoryIcon from "@mui/icons-material/Memory";
import SecurityIcon from "@mui/icons-material/Security";

// 定义量子门信息的接口
interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
}

// 定义算法模板的接口
interface AlgorithmTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  difficulty: string;
  templateGates: GateInfo[];
}

interface AlgorithmTemplatesProps {
  onApplyTemplate: (templateGates: GateInfo[]) => void;
}

// 常见量子算法模板定义
const algorithmTemplates: AlgorithmTemplate[] = [
  {
    id: "grover",
    name: "Grover搜索算法",
    description: "量子搜索算法，可以在未排序数据中以O(√N)复杂度找到目标项",
    icon: <SearchIcon />,
    category: "搜索与优化",
    difficulty: "中级",
    templateGates: [
      { gateType: "H", qubitIndex: 0, gateIndex: 1 },
      { gateType: "H", qubitIndex: 1, gateIndex: 1 },
      { gateType: "X", qubitIndex: 1, gateIndex: 2 },
      { gateType: "CX", qubitIndex: 0, targetIndex: 1, gateIndex: 3 },
      { gateType: "X", qubitIndex: 1, gateIndex: 4 },
      { gateType: "H", qubitIndex: 0, gateIndex: 5 },
      { gateType: "H", qubitIndex: 1, gateIndex: 5 },
    ],
  },
  {
    id: "qft",
    name: "量子傅里叶变换",
    description: "量子版的离散傅里叶变换，是许多量子算法的基础",
    icon: <TransformIcon />,
    category: "变换",
    difficulty: "中级",
    templateGates: [
      { gateType: "H", qubitIndex: 0, gateIndex: 1 },
      { gateType: "P", qubitIndex: 0, gateIndex: 2, params: { phi: "π/2" } },
      { gateType: "H", qubitIndex: 1, gateIndex: 1 },
    ],
  },
  {
    id: "shor",
    name: "Shor因数分解算法",
    description: "量子因数分解算法，可以在多项式时间内分解大整数",
    icon: <CalculateIcon />,
    category: "密码学",
    difficulty: "高级",
    templateGates: [
      { gateType: "H", qubitIndex: 0, gateIndex: 1 },
      { gateType: "H", qubitIndex: 1, gateIndex: 1 },
      { gateType: "H", qubitIndex: 2, gateIndex: 1 },
      { gateType: "CX", qubitIndex: 2, targetIndex: 3, gateIndex: 2 },
    ],
  },
  {
    id: "vqe",
    name: "变分量子本征求解器",
    description: "混合量子-经典算法，用于求解分子能级等问题",
    icon: <MemoryIcon />,
    category: "量子化学",
    difficulty: "高级",
    templateGates: [
      { gateType: "RY", qubitIndex: 0, gateIndex: 1, params: { theta: "θ1" } },
      { gateType: "RY", qubitIndex: 1, gateIndex: 1, params: { theta: "θ2" } },
      { gateType: "CX", qubitIndex: 0, targetIndex: 1, gateIndex: 2 },
    ],
  },
  {
    id: "qkd",
    name: "BB84量子密钥分发",
    description: "量子通信协议，用于安全地创建和分享加密密钥",
    icon: <SecurityIcon />,
    category: "量子通信",
    difficulty: "入门",
    templateGates: [
      { gateType: "H", qubitIndex: 0, gateIndex: 1 },
      { gateType: "MEASURE", qubitIndex: 0, gateIndex: 2 },
    ],
  },
];

const AlgorithmTemplates: React.FC<AlgorithmTemplatesProps> = ({
  onApplyTemplate,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmTemplate | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAlgorithmSelect = (algorithm: AlgorithmTemplate) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleApplyTemplate = () => {
    if (selectedAlgorithm) {
      onApplyTemplate(selectedAlgorithm.templateGates);
      handleClose();
    }
  };

  const filteredAlgorithms =
    filter === "all"
      ? algorithmTemplates
      : algorithmTemplates.filter((algo) => algo.category === filter);

  const categories = [
    "all",
    ...Array.from(new Set(algorithmTemplates.map((algo) => algo.category))),
  ];

  // 组件主体内容
  const renderTemplateList = () => (
    <Box>
      {filteredAlgorithms.map((algorithm) => (
        <Accordion
          key={algorithm.id}
          expanded={selectedAlgorithm?.id === algorithm.id}
          onChange={() => {
            if (selectedAlgorithm?.id === algorithm.id) {
              setSelectedAlgorithm(null);
            } else {
              handleAlgorithmSelect(algorithm);
            }
          }}
          sx={{
            mb: 1,
            "&:before": {
              display: "none",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ListItemIcon>{algorithm.icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={500}>
                    {algorithm.name}
                  </Typography>
                }
                secondary={`难度: ${algorithm.difficulty}`}
              />
              <Typography variant="body2" color="textSecondary">
                {algorithm.category}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{algorithm.description}</Typography>
            <Typography variant="subtitle2">此模板将添加以下量子门:</Typography>
            <List dense>
              {algorithm.templateGates.map((gate, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${gate.gateType} 门 (Q${gate.qubitIndex}${
                      gate.targetIndex !== undefined
                        ? " → Q" + gate.targetIndex
                        : ""
                    })`}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  // 渲染简单视图（左侧边栏）
  return (
    <Paper
      sx={{
        p: 1.5,
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
        选择常用量子算法模板:
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setFilter(category)}
            variant={filter === category ? "contained" : "outlined"}
            size="small"
            sx={{ textTransform: "none" }}
          >
            {category === "all" ? "全部" : category}
          </Button>
        ))}
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>{renderTemplateList()}</Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6">量子算法模板库</Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: "flex", mb: 2 }}>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setFilter(category)}
                variant={filter === category ? "contained" : "outlined"}
                size="small"
                sx={{ mr: 1, textTransform: "capitalize" }}
              >
                {category === "all" ? "全部" : category}
              </Button>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>{renderTemplateList()}</Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button
            onClick={handleApplyTemplate}
            color="primary"
            disabled={!selectedAlgorithm}
            variant="contained"
          >
            应用模板
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AlgorithmTemplates;
