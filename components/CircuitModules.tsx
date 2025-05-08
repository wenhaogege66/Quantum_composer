"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
  Tooltip,
  Chip,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LayersIcon from "@mui/icons-material/Layers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// 电路模块接口
interface CircuitModule {
  id: string;
  name: string;
  description: string;
  qubits: number;
  gates: GateInfo[];
  createdAt: string;
  updatedAt: string;
  isVisible: boolean;
  isExpanded: boolean;
}

// 量子门信息接口
interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
  moduleId?: string;
}

interface CircuitModulesProps {
  currentCircuit: {
    qubits: number;
    gates: GateInfo[];
  };
  onApplyModule: (moduleGates: GateInfo[]) => void;
  onSaveAsModule: () => void;
}

const CircuitModules: React.FC<CircuitModulesProps> = ({
  currentCircuit,
  onApplyModule,
  onSaveAsModule,
}) => {
  // 示例模块数据
  const [modules, setModules] = useState<CircuitModule[]>([
    {
      id: "module1",
      name: "Bell态准备",
      description: "创建一个Bell态 (|00⟩ + |11⟩)/√2",
      qubits: 2,
      gates: [
        { gateType: "H", qubitIndex: 0, gateIndex: 1 },
        { gateType: "CX", qubitIndex: 0, targetIndex: 1, gateIndex: 2 },
      ],
      createdAt: "2023-10-15T10:30:00Z",
      updatedAt: "2023-10-15T10:30:00Z",
      isVisible: true,
      isExpanded: false,
    },
    {
      id: "module2",
      name: "GHZ态准备",
      description: "创建一个三量子比特GHZ态 (|000⟩ + |111⟩)/√2",
      qubits: 3,
      gates: [
        { gateType: "H", qubitIndex: 0, gateIndex: 1 },
        { gateType: "CX", qubitIndex: 0, targetIndex: 1, gateIndex: 2 },
        { gateType: "CX", qubitIndex: 1, targetIndex: 2, gateIndex: 3 },
      ],
      createdAt: "2023-10-16T14:20:00Z",
      updatedAt: "2023-10-16T14:20:00Z",
      isVisible: true,
      isExpanded: false,
    },
  ]);

  // 各种状态管理
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState<CircuitModule | null>(
    null
  );
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 打开模块详情对话框
  const handleOpenDialog = (module: CircuitModule) => {
    setSelectedModule(module);
    setOpenDialog(true);
  };

  // 关闭模块详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 打开新建模块对话框
  const handleOpenNewDialog = () => {
    setNewModuleName("");
    setNewModuleDescription("");
    setOpenNewDialog(true);
  };

  // 关闭新建模块对话框
  const handleCloseNewDialog = () => {
    setOpenNewDialog(false);
  };

  // 应用模块到当前电路
  const handleApplyModule = (module: CircuitModule) => {
    onApplyModule(module.gates);
  };

  // 验证模块名称的函数
  const validateModuleName = (
    name: string
  ): { isValid: boolean; message?: string } => {
    if (!name.trim()) {
      return { isValid: false, message: "模块名称不能为空" };
    }

    // 检查模块名称格式，更宽松的规则，允许中文、英文、数字、常见标点符号
    const validNameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_\s\-\+\(\)]+$/;
    if (!validNameRegex.test(name)) {
      return {
        isValid: false,
        message:
          "模块名称包含无效字符，只允许中英文、数字、下划线、空格和常见标点",
      };
    }

    return { isValid: true };
  };

  // 格式化模块名称
  const formatModuleName = (name: string): string => {
    // 去除首尾空格
    const trimmedName = name.trim();
    // 将连续的空格替换为单个空格
    const formattedName = trimmedName.replace(/\s+/g, " ");

    // 如果是英文开头，确保首字母大写
    if (/^[a-zA-Z]/.test(formattedName)) {
      return formattedName.replace(/^[a-z]/, (char) => char.toUpperCase());
    }

    return formattedName;
  };

  // 保存为新模块
  const handleSaveAsModule = () => {
    const validation = validateModuleName(newModuleName);

    if (!validation.isValid) {
      // 这里可以添加错误提示UI，但这里简化处理
      console.error(validation.message);
      return;
    }

    const formattedName = formatModuleName(newModuleName);

    const newModule: CircuitModule = {
      id: `module-${Date.now()}`,
      name: formattedName,
      description: newModuleDescription,
      qubits: currentCircuit.qubits,
      gates: [...currentCircuit.gates], // 复制当前电路的门
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVisible: true,
      isExpanded: false,
    };

    setModules([...modules, newModule]);
    handleCloseNewDialog();
    onSaveAsModule();
  };

  // 删除模块
  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  // 导出模块
  const handleExportModule = (module: CircuitModule) => {
    const blob = new Blob([JSON.stringify(module, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${module.name.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 切换模块可见性
  const handleToggleVisibility = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, isVisible: !m.isVisible } : m
      )
    );
  };

  // 切换模块展开/折叠状态
  const handleToggleExpand = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  // 根据搜索词过滤模块
  const filteredModules = modules.filter(
    (module) =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        电路模块库
      </Typography>

      <Box sx={{ display: "flex", mb: 2, gap: 1 }}>
        <TextField
          size="small"
          label="搜索模块"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={handleOpenNewDialog}
          size="small"
        >
          新建
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {filteredModules.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="textSecondary">没有找到匹配的模块</Typography>
        </Paper>
      ) : (
        <Box
          sx={{ overflowY: "auto", flex: 1, maxHeight: "calc(100% - 120px)" }}
        >
          {filteredModules.map((module) => (
            <Paper
              key={module.id}
              elevation={1}
              sx={{
                mb: 2,
                opacity: module.isVisible ? 1 : 0.6,
                overflow: "visible",
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "70%" }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LayersIcon fontSize="small" />
                  </ListItemIcon>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "text.primary",
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {module.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {module.description}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip
                    size="small"
                    label={`${module.qubits}Q`}
                    sx={{ mr: 1 }}
                  />

                  <Tooltip title="应用此模块">
                    <IconButton
                      size="small"
                      onClick={() => handleApplyModule(module)}
                    >
                      <FileCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={module.isVisible ? "隐藏模块" : "显示模块"}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleVisibility(module.id)}
                    >
                      {module.isVisible ? (
                        <VisibilityIcon fontSize="small" />
                      ) : (
                        <VisibilityOffIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Collapse in={module.isExpanded}>
                <Divider />
                <Box sx={{ p: 1.5 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    sx={{ mb: 1, fontSize: "0.8rem" }}
                  >
                    {module.description}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontSize: "0.85rem" }}
                  >
                    包含的量子门:
                  </Typography>

                  <List dense>
                    {module.gates.slice(0, 3).map((gate, index) => (
                      <ListItem key={index} sx={{ py: 0.25 }}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {`${gate.gateType} 门 (Q${gate.qubitIndex}${
                                gate.targetIndex !== undefined
                                  ? " → Q" + gate.targetIndex
                                  : ""
                              })`}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                    {module.gates.length > 3 && (
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.secondary",
                          pl: 2,
                        }}
                      >
                        ...共 {module.gates.length} 个量子门
                      </Typography>
                    )}
                  </List>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleDeleteModule(module.id)}
                      sx={{ fontSize: "0.75rem" }}
                    >
                      删除
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(module)}
                      sx={{ fontSize: "0.75rem" }}
                    >
                      详情
                    </Button>
                  </Box>
                </Box>
              </Collapse>

              <Divider />
              <Box
                sx={{
                  p: 0.5,
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => handleToggleExpand(module.id)}
              >
                <ExpandMoreIcon
                  sx={{
                    transform: module.isExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  fontSize="small"
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* 模块详情对话框 */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedModule && (
          <>
            <DialogTitle>{selectedModule.name}</DialogTitle>

            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedModule.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                量子比特数量: {selectedModule.qubits}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                量子门数量: {selectedModule.gates.length}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                创建时间: {new Date(selectedModule.createdAt).toLocaleString()}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                最后更新: {new Date(selectedModule.updatedAt).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                量子门列表:
              </Typography>

              <List>
                {selectedModule.gates.map((gate, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${gate.gateType} 门`}
                      secondary={`作用于量子比特 Q${gate.qubitIndex}${
                        gate.targetIndex !== undefined
                          ? ` → Q${gate.targetIndex}`
                          : ""
                      }, 位置 ${gate.gateIndex}${
                        gate.params
                          ? `, 参数: ${JSON.stringify(gate.params)}`
                          : ""
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                关闭
              </Button>
              <Button
                onClick={() => {
                  handleApplyModule(selectedModule);
                  handleCloseDialog();
                }}
                color="primary"
                variant="contained"
              >
                应用此模块
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 新建模块对话框 */}
      <Dialog open={openNewDialog} onClose={handleCloseNewDialog}>
        <DialogTitle>创建新模块</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="模块名称"
            type="text"
            fullWidth
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
          />

          <TextField
            margin="dense"
            label="模块描述"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newModuleDescription}
            onChange={(e) => setNewModuleDescription(e.target.value)}
          />

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            此模块将包含当前电路中的 {currentCircuit.qubits} 个量子比特和{" "}
            {currentCircuit.gates.length} 个量子门
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseNewDialog} color="primary">
            取消
          </Button>
          <Button
            onClick={handleSaveAsModule}
            color="primary"
            variant="contained"
            disabled={!newModuleName.trim()}
            startIcon={<SaveIcon />}
          >
            保存模块
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CircuitModules;
