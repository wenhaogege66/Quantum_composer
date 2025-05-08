"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Collapse,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BarChartIcon from "@mui/icons-material/BarChart";
import SpeedIcon from "@mui/icons-material/Speed";

// 量子门信息接口
interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
}

// 优化建议接口
interface OptimizationSuggestion {
  id: string;
  type: "redundant" | "simplify" | "reorder" | "equivalence";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  gates: {
    original: GateInfo[];
    optimized: GateInfo[];
  };
  explanation: string;
  applied: boolean;
}

interface CircuitOptimizerProps {
  circuit: {
    qubits: number;
    gates: GateInfo[];
  };
  onApplyOptimization: (
    originalGates: GateInfo[],
    optimizedGates: GateInfo[]
  ) => void;
}

const CircuitOptimizer: React.FC<CircuitOptimizerProps> = ({
  circuit,
  onApplyOptimization,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<
    OptimizationSuggestion[]
  >([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [expandedExplanations, setExpandedExplanations] = useState<
    Record<string, boolean>
  >({});
  const [circuitScore, setCircuitScore] = useState<number | null>(null);

  // 分析电路寻找优化机会
  const analyzeCircuit = () => {
    setIsAnalyzing(true);
    setOptimizationSuggestions([]);
    setCircuitScore(null);

    // 模拟分析过程（实际中应该有真实的电路分析算法）
    setTimeout(() => {
      const suggestions = findOptimizationSuggestions(circuit);
      setOptimizationSuggestions(suggestions);

      // 计算电路复杂度分数 (0-100，越低越好)
      const score = calculateCircuitScore(circuit, suggestions);
      setCircuitScore(score);

      setIsAnalyzing(false);
    }, 1500); // 模拟分析延迟
  };

  // 应用优化建议
  const applyOptimization = (suggestion: OptimizationSuggestion) => {
    onApplyOptimization(suggestion.gates.original, suggestion.gates.optimized);

    // 更新建议状态为已应用
    setOptimizationSuggestions((prev) =>
      prev.map((s) => (s.id === suggestion.id ? { ...s, applied: true } : s))
    );
  };

  // 切换建议选择
  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestion((prev) =>
      prev === suggestionId ? null : suggestionId
    );
  };

  // 切换解释展开/折叠
  const toggleExplanation = (suggestionId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [suggestionId]: !prev[suggestionId],
    }));
  };

  // 获取优化建议的严重性样式
  const getImpactStyle = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return { color: "error", label: "高" };
      case "medium":
        return { color: "warning", label: "中" };
      case "low":
        return { color: "info", label: "低" };
    }
  };

  // 计算电路优化分数
  const calculateCircuitScore = (
    circuit: { qubits: number; gates: GateInfo[] },
    suggestions: OptimizationSuggestion[]
  ): number => {
    if (circuit.gates.length === 0) return 100; // 空电路得分最高

    // 基础分数，取决于门的数量和量子比特数量
    let baseScore = 100 - Math.min(80, circuit.gates.length * 5);

    // 每个高优先级的优化点减少10分
    const highImpactCount = suggestions.filter(
      (s) => s.impact === "high"
    ).length;
    // 每个中优先级的优化点减少5分
    const mediumImpactCount = suggestions.filter(
      (s) => s.impact === "medium"
    ).length;
    // 每个低优先级的优化点减少2分
    const lowImpactCount = suggestions.filter((s) => s.impact === "low").length;

    const penalty =
      highImpactCount * 10 + mediumImpactCount * 5 + lowImpactCount * 2;

    // 最终分数
    const finalScore = Math.max(0, baseScore - penalty);
    return finalScore;
  };

  // 查找电路中的优化机会
  const findOptimizationSuggestions = (circuit: {
    qubits: number;
    gates: GateInfo[];
  }): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];
    const { gates } = circuit;

    // 1. 检查连续相同的基本门（可能是冗余的）
    for (let i = 0; i < gates.length - 1; i++) {
      const gate = gates[i];
      const nextGate = gates[i + 1];

      if (
        gate.gateType === nextGate.gateType &&
        gate.qubitIndex === nextGate.qubitIndex &&
        (gate.gateType === "X" ||
          gate.gateType === "Z" ||
          gate.gateType === "H")
      ) {
        suggestions.push({
          id: `redundant-${i}`,
          type: "redundant",
          title: `移除冗余的${gate.gateType}门`,
          description: `在量子比特Q${gate.qubitIndex}上有两个连续的${gate.gateType}门可以相互抵消`,
          impact: "high",
          gates: {
            original: [gate, nextGate],
            optimized: [], // 移除这两个门
          },
          explanation: `两个连续的${gate.gateType}门相当于恒等操作。应用两次${gate.gateType}门会让量子比特回到初始状态，因此可以安全地移除这两个门而不改变电路的功能。`,
          applied: false,
        });
      }
    }

    // 2. 检查HZH序列（可以替换为X门）
    for (let i = 0; i < gates.length - 2; i++) {
      const gate1 = gates[i];
      const gate2 = gates[i + 1];
      const gate3 = gates[i + 2];

      if (
        gate1.gateType === "H" &&
        gate2.gateType === "Z" &&
        gate3.gateType === "H" &&
        gate1.qubitIndex === gate2.qubitIndex &&
        gate2.qubitIndex === gate3.qubitIndex
      ) {
        suggestions.push({
          id: `simplify-hzh-${i}`,
          type: "simplify",
          title: "将HZH序列替换为X门",
          description: `在量子比特Q${gate1.qubitIndex}上的HZH序列可以替换为单个X门`,
          impact: "medium",
          gates: {
            original: [gate1, gate2, gate3],
            optimized: [
              {
                gateType: "X",
                qubitIndex: gate1.qubitIndex,
                gateIndex: gate1.gateIndex,
              },
            ],
          },
          explanation:
            "HZH序列在数学上等价于X门。将三个门替换为一个门可以减少电路深度并提高执行效率。",
          applied: false,
        });
      }
    }

    // 3. 检查连续的控制门，优化顺序
    if (gates.length > 3) {
      for (let i = 0; i < gates.length - 1; i++) {
        const gate1 = gates[i];
        const gate2 = gates[i + 1];

        if (
          gate1.gateType.startsWith("C") &&
          gate2.gateType.startsWith("C") &&
          gate1.qubitIndex !== gate2.qubitIndex &&
          gate1.targetIndex === gate2.qubitIndex
        ) {
          suggestions.push({
            id: `reorder-${i}`,
            type: "reorder",
            title: "重新排序控制门",
            description: `在量子比特Q${gate1.qubitIndex}→Q${gate1.targetIndex}和Q${gate2.qubitIndex}→Q${gate2.targetIndex}的控制门可以重新排序以减少电路深度`,
            impact: "low",
            gates: {
              original: [gate1, gate2],
              optimized: [gate2, gate1], // 交换顺序
            },
            explanation:
              "当两个控制门作用于不同的控制量子比特，并且它们的目标比特形成一条链时，可以考虑重新排序以优化电路的并行执行。",
            applied: false,
          });
        }
      }
    }

    // 4. 检查RZ(π)等价于Z门
    for (let i = 0; i < gates.length; i++) {
      const gate = gates[i];

      if (gate.gateType === "RZ" && gate.params && gate.params.theta === "π") {
        suggestions.push({
          id: `equivalence-rz-${i}`,
          type: "equivalence",
          title: "将RZ(π)替换为Z门",
          description: `在量子比特Q${gate.qubitIndex}上的RZ(π)门可以替换为更简单的Z门`,
          impact: "medium",
          gates: {
            original: [gate],
            optimized: [
              {
                gateType: "Z",
                qubitIndex: gate.qubitIndex,
                gateIndex: gate.gateIndex,
              },
            ],
          },
          explanation:
            "RZ(π)门在数学上等价于Z门。使用基本门而不是参数化门可以在某些量子硬件上执行得更高效。",
          applied: false,
        });
      }
    }

    // 如果没有找到任何建议，添加一个"电路已优化"的空建议
    if (suggestions.length === 0) {
      suggestions.push({
        id: "no-optimization",
        type: "redundant",
        title: "电路已经优化",
        description: "当前电路已经是最优的，没有发现可以优化的地方",
        impact: "low",
        gates: {
          original: [],
          optimized: [],
        },
        explanation:
          "当前电路结构简洁，没有冗余门或可以简化的模式。继续保持良好的设计实践。",
        applied: true,
      });
    }

    return suggestions;
  };

  // 一键优化所有高优先级建议
  const applyAllHighImpactOptimizations = () => {
    const highImpactSuggestions = optimizationSuggestions.filter(
      (s) => s.impact === "high" && !s.applied
    );

    highImpactSuggestions.forEach((suggestion) => {
      applyOptimization(suggestion);
    });
  };

  // 获取电路得分评价
  const getScoreEvaluation = (score: number) => {
    if (score >= 90) return { text: "优秀", color: "success.main" };
    if (score >= 70) return { text: "良好", color: "info.main" };
    if (score >= 50) return { text: "一般", color: "warning.main" };
    return { text: "需要优化", color: "error.main" };
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <TipsAndUpdatesIcon />
        电路优化助手
      </Typography>

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AutoFixHighIcon />}
          onClick={analyzeCircuit}
          disabled={isAnalyzing || circuit.gates.length === 0}
        >
          分析电路
        </Button>

        {circuitScore !== null && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SpeedIcon />
            <Typography variant="body1">
              电路得分:
              <Typography
                component="span"
                fontWeight="bold"
                color={getScoreEvaluation(circuitScore).color}
                sx={{ ml: 1 }}
              >
                {circuitScore}/100 ({getScoreEvaluation(circuitScore).text})
              </Typography>
            </Typography>
          </Box>
        )}
      </Box>

      {isAnalyzing && (
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            正在分析电路，寻找优化机会...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {!isAnalyzing && optimizationSuggestions.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">
              找到 {optimizationSuggestions.length} 条优化建议
            </Typography>

            {optimizationSuggestions.some(
              (s) => s.impact === "high" && !s.applied
            ) && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={applyAllHighImpactOptimizations}
              >
                一键应用所有高优先级优化
              </Button>
            )}
          </Box>

          <List sx={{ mb: 2 }}>
            {optimizationSuggestions.map((suggestion) => (
              <Paper
                key={suggestion.id}
                sx={{ mb: 1, opacity: suggestion.applied ? 0.7 : 1 }}
              >
                <ListItem
                  alignItems="flex-start"
                  selected={selectedSuggestion === suggestion.id}
                  onClick={() => toggleSuggestion(suggestion.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemIcon>
                    {suggestion.applied ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <AutoFixHighIcon
                        color={getImpactStyle(suggestion.impact).color as any}
                      />
                    )}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="subtitle1">
                          {suggestion.title}
                        </Typography>

                        <Chip
                          size="small"
                          label={`优先级: ${
                            getImpactStyle(suggestion.impact).label
                          }`}
                          color={getImpactStyle(suggestion.impact).color as any}
                        />

                        {suggestion.applied && (
                          <Chip size="small" label="已应用" color="success" />
                        )}
                      </Box>
                    }
                    secondary={suggestion.description}
                  />

                  {!suggestion.applied &&
                    suggestion.gates.original.length > 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyOptimization(suggestion);
                        }}
                        sx={{ ml: 1 }}
                      >
                        应用
                      </Button>
                    )}
                </ListItem>

                {selectedSuggestion === suggestion.id && (
                  <Box sx={{ p: 2, bgcolor: "background.paper" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                        优化详情
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExplanation(suggestion.id);
                        }}
                      >
                        {expandedExplanations[suggestion.id] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>

                    <Collapse in={expandedExplanations[suggestion.id]}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <AlertTitle>优化原理</AlertTitle>
                        {suggestion.explanation}
                      </Alert>
                    </Collapse>

                    <Box>
                      <Typography variant="body2" gutterBottom>
                        原始电路片段:
                      </Typography>
                      <Box
                        sx={{
                          pl: 2,
                          borderLeft: "2px solid",
                          borderColor: "primary.main",
                        }}
                      >
                        {suggestion.gates.original.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            无门
                          </Typography>
                        ) : (
                          suggestion.gates.original.map((gate, index) => (
                            <Typography key={index} variant="body2">
                              {gate.gateType} 门 (Q{gate.qubitIndex}
                              {gate.targetIndex !== undefined
                                ? ` → Q${gate.targetIndex}`
                                : ""}
                              )
                              {gate.params
                                ? ` 参数: ${JSON.stringify(gate.params)}`
                                : ""}
                            </Typography>
                          ))
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        优化后电路片段:
                      </Typography>
                      <Box
                        sx={{
                          pl: 2,
                          borderLeft: "2px solid",
                          borderColor: "success.main",
                        }}
                      >
                        {suggestion.gates.optimized.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            无门
                          </Typography>
                        ) : (
                          suggestion.gates.optimized.map((gate, index) => (
                            <Typography key={index} variant="body2">
                              {gate.gateType} 门 (Q{gate.qubitIndex}
                              {gate.targetIndex !== undefined
                                ? ` → Q${gate.targetIndex}`
                                : ""}
                              )
                              {gate.params
                                ? ` 参数: ${JSON.stringify(gate.params)}`
                                : ""}
                            </Typography>
                          ))
                        )}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Paper>
            ))}
          </List>
        </>
      )}

      {!isAnalyzing &&
        optimizationSuggestions.length === 0 &&
        circuit.gates.length > 0 && (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              点击&quot;分析电路&quot;按钮来寻找潜在的优化机会
            </Typography>
          </Paper>
        )}

      {!isAnalyzing && circuit.gates.length === 0 && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            请先构建量子电路，然后再尝试优化
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CircuitOptimizer;
