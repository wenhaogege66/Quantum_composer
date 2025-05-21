import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import CheckIcon from "@mui/icons-material/Check";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useThemeContext } from "./ThemeProvider";

// 门信息接口
interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
}

interface CodeProps {
  qubits: number;
  gates: GateInfo[];
}

// 代码语言类型
type CodeLanguage = "qiskit" | "cirq";

const Code: React.FC<CodeProps> = ({ qubits, gates }) => {
  const [qiskitCode, setQiskitCode] = useState<string>("");
  const [cirqCode, setCirqCode] = useState<string>("");
  const [language, setLanguage] = useState<CodeLanguage>("qiskit");
  const [copied, setCopied] = useState<boolean>(false);
  const { isDarkMode } = useThemeContext();

  useEffect(() => {
    // 生成Qiskit代码
    const qCode = generateQiskitCode(qubits, gates);
    setQiskitCode(qCode);
    
    // 生成Cirq代码
    const cCode = generateCirqCode(qubits, gates);
    setCirqCode(cCode);
  }, [qubits, gates]);

  const generateQiskitCode = (qubits: number, gates: GateInfo[]): string => {
    // 导入语句
    let code = `from qiskit import QuantumCircuit, Aer, execute\nfrom qiskit.visualization import plot_histogram\n\n`;

    // 创建量子电路
    code += `# 创建具有${qubits}个量子比特和${qubits}个经典比特的量子电路\n`;
    code += `qc = QuantumCircuit(${qubits}, ${qubits})\n\n`;

    // 按比特和位置排序门
    const sortedGates = [...gates].sort((a, b) => {
      if (a.gateIndex !== b.gateIndex) {
        return a.gateIndex - b.gateIndex;
      }
      return a.qubitIndex - b.qubitIndex;
    });

    // 添加各种量子门
    if (sortedGates.length > 0) {
      code += `# 添加量子门\n`;

      // 用于跟踪我们已经添加注释的门的索引
      const commentedGateIndices = new Set<number>();

      for (const gate of sortedGates) {
        const gateType = gate.gateType.toLowerCase();

        // 为每个新的门索引添加注释
        if (!commentedGateIndices.has(gate.gateIndex)) {
          code += `\n# 步骤 ${gate.gateIndex}\n`;
          commentedGateIndices.add(gate.gateIndex);
        }

        switch (gateType) {
          case "h":
            code += `qc.h(${gate.qubitIndex})\n`;
            break;
          case "x":
            code += `qc.x(${gate.qubitIndex})\n`;
            break;
          case "y":
            code += `qc.y(${gate.qubitIndex})\n`;
            break;
          case "z":
            code += `qc.z(${gate.qubitIndex})\n`;
            break;
          case "cx":
          case "cnot":
            if (gate.targetIndex !== undefined) {
              code += `qc.cx(${gate.qubitIndex}, ${gate.targetIndex})\n`;
            }
            break;
          case "cz":
            if (gate.targetIndex !== undefined) {
              code += `qc.cz(${gate.qubitIndex}, ${gate.targetIndex})\n`;
            }
            break;
          case "rx":
            {
              const theta = gate.params?.theta || "pi/2";
              code += `qc.rx(${theta}, ${gate.qubitIndex})\n`;
            }
            break;
          case "ry":
            {
              const theta = gate.params?.theta || "pi/2";
              code += `qc.ry(${theta}, ${gate.qubitIndex})\n`;
            }
            break;
          case "rz":
            {
              const phi = gate.params?.phi || "pi/2";
              code += `qc.rz(${phi}, ${gate.qubitIndex})\n`;
            }
            break;
          case "swap":
            if (gate.targetIndex !== undefined) {
              code += `qc.swap(${gate.qubitIndex}, ${gate.targetIndex})\n`;
            }
            break;
          case "p":
            {
              const phi = gate.params?.phi || "pi/2";
              code += `qc.p(${phi}, ${gate.qubitIndex})\n`;
            }
            break;
          case "measure":
            code += `qc.measure(${gate.qubitIndex}, ${gate.qubitIndex})\n`;
            break;
        }
      }
    }

    // 添加测量
    code += `\n# 测量所有量子比特\n`;
    code += `qc.measure_all()\n\n`;

    // 添加模拟执行代码
    code += `# 在模拟器上执行电路\n`;
    code += `simulator = Aer.get_backend('qasm_simulator')\n`;
    code += `job = execute(qc, simulator, shots=1024)\n`;
    code += `result = job.result()\n`;
    code += `counts = result.get_counts(qc)\n\n`;

    // 添加绘图代码
    code += `# 绘制结果\n`;
    code += `plot_histogram(counts)`;

    return code;
  };

  const generateCirqCode = (qubits: number, gates: GateInfo[]): string => {
    // 导入语句
    let code = `import cirq\nimport numpy as np\nfrom matplotlib import pyplot as plt\n\n`;

    // 创建量子比特
    code += `# 创建${qubits}个量子比特\n`;
    code += `qubits = [cirq.LineQubit(i) for i in range(${qubits})]\n\n`;

    // 创建电路
    code += `# 创建电路\ncircuit = cirq.Circuit()\n\n`;

    // 按比特和位置排序门
    const sortedGates = [...gates].sort((a, b) => {
      if (a.gateIndex !== b.gateIndex) {
        return a.gateIndex - b.gateIndex;
      }
      return a.qubitIndex - b.qubitIndex;
    });

    // 添加各种量子门
    if (sortedGates.length > 0) {
      code += `# 添加量子门\n`;

      // 用于跟踪已经添加注释的门的索引
      const commentedGateIndices = new Set<number>();

      let momentOperations: string[] = [];
      let currentGateIndex = -1;

      for (const gate of sortedGates) {
        const gateType = gate.gateType.toLowerCase();
        
        // 如果门索引变化，添加前一个moment
        if (currentGateIndex !== gate.gateIndex) {
          if (momentOperations.length > 0) {
            code += `circuit.append([${momentOperations.join(', ')}])\n`;
            momentOperations = [];
          }
          currentGateIndex = gate.gateIndex;
          code += `\n# 步骤 ${gate.gateIndex}\n`;
        }

        let operation = "";
        switch (gateType) {
          case "h":
            operation = `cirq.H(qubits[${gate.qubitIndex}])`;
            break;
          case "x":
            operation = `cirq.X(qubits[${gate.qubitIndex}])`;
            break;
          case "y":
            operation = `cirq.Y(qubits[${gate.qubitIndex}])`;
            break;
          case "z":
            operation = `cirq.Z(qubits[${gate.qubitIndex}])`;
            break;
          case "cx":
          case "cnot":
            if (gate.targetIndex !== undefined) {
              operation = `cirq.CNOT(qubits[${gate.qubitIndex}], qubits[${gate.targetIndex}])`;
            }
            break;
          case "cz":
            if (gate.targetIndex !== undefined) {
              operation = `cirq.CZ(qubits[${gate.qubitIndex}], qubits[${gate.targetIndex}])`;
            }
            break;
          case "rx":
            {
              const theta = gate.params?.theta || "np.pi/2";
              operation = `cirq.rx(${theta})(qubits[${gate.qubitIndex}])`;
            }
            break;
          case "ry":
            {
              const theta = gate.params?.theta || "np.pi/2";
              operation = `cirq.ry(${theta})(qubits[${gate.qubitIndex}])`;
            }
            break;
          case "rz":
            {
              const phi = gate.params?.phi || "np.pi/2";
              operation = `cirq.rz(${phi})(qubits[${gate.qubitIndex}])`;
            }
            break;
          case "swap":
            if (gate.targetIndex !== undefined) {
              operation = `cirq.SWAP(qubits[${gate.qubitIndex}], qubits[${gate.targetIndex}])`;
            }
            break;
          case "p":
            {
              const phi = gate.params?.phi || "np.pi/2";
              operation = `cirq.ZPowGate(exponent=${phi}/np.pi)(qubits[${gate.qubitIndex}])`;
            }
            break;
          case "measure":
            operation = `cirq.measure(qubits[${gate.qubitIndex}], key='q${gate.qubitIndex}')`;
            break;
        }

        if (operation) {
          code += `circuit.append(${operation})\n`;
        }
      }
    }

    // 添加测量
    code += `\n# 为所有量子比特添加测量\n`;
    code += `circuit.append(cirq.measure(*qubits, key='result'))\n\n`;

    // 添加模拟执行代码
    code += `# 在模拟器上执行电路\n`;
    code += `simulator = cirq.Simulator()\n`;
    code += `result = simulator.run(circuit, repetitions=1024)\n\n`;

    // 添加结果处理
    code += `# 处理结果\n`;
    code += `frequencies = result.histogram(key='result')\n\n`;

    // 添加绘图代码
    code += `# 绘制电路图\n`;
    code += `print(circuit)\n\n`;
    code += `# 绘制结果直方图\n`;
    code += `plt.figure(figsize=(10, 6))\n`;
    code += `plt.bar(frequencies.keys(), frequencies.values())\n`;
    code += `plt.xlabel('Measurement Result')\n`;
    code += `plt.ylabel('Frequency')\n`;
    code += `plt.title('Measurement Results')\n`;
    code += `plt.show()`;

    return code;
  };

  const handleChangeLanguage = (
    event: React.MouseEvent<HTMLElement>,
    newLanguage: CodeLanguage,
  ) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  const handleCopyCode = () => {
    const codeToCopy = language === "qiskit" ? qiskitCode : cirqCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const codeToCopy = language === "qiskit" ? qiskitCode : cirqCode;
    const filename = language === "qiskit" ? "quantum_circuit_qiskit.py" : "quantum_circuit_cirq.py";
    
    const element = document.createElement("a");
    const file = new Blob([codeToCopy], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          mb: 1,
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 2 }}>
            Python 代码
          </Typography>
          <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleChangeLanguage}
            size="small"
            aria-label="代码语言"
            sx={{ 
              ml: 1, 
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                py: 0.5,
                px: 1,
              }
            }}
          >
            <ToggleButton value="qiskit">Qiskit</ToggleButton>
            <ToggleButton value="cirq">Cirq</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box>
          <Tooltip title={copied ? "已复制!" : "复制代码"}>
            <IconButton onClick={handleCopyCode} size="small">
              {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="下载代码">
            <IconButton onClick={handleDownloadCode} size="small">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          bgcolor: isDarkMode ? "grey.900" : "grey.50",
          p: 0,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <SyntaxHighlighter
          language="python"
          style={isDarkMode ? atomDark : oneLight}
          customStyle={{
            margin: 0,
            borderRadius: "4px",
            height: "100%",
            fontSize: "0.85rem",
            lineHeight: "1.5",
          }}
          showLineNumbers
        >
          {language === "qiskit" ? qiskitCode : cirqCode}
        </SyntaxHighlighter>
      </Paper>
    </Box>
  );
};

export default Code;
