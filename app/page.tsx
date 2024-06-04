'use client';

import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import FileMenu from '@/components/FileMenu';
import EditMenu from '@/components/EditMenu';
import ViewMenu from '@/components/ViewMenu';
import LeftDrawer from '@/components/LeftDrawer';
import ComponentPanel from "@/components/SVG";
import QuantumCircuit from "@/components/Circuit";
import Code from "@/components/Code";
import QuantumCircuitOutputBar from "@/components/QuantumCircuitOutputBar";
import QuantumSphereVisualization from "@/components/QuantumSphereVisualization";
import LoginMenu from '@/components/LoginMenu';

import React, {useState} from 'react';
import { AppBar } from '@mui/material';
import QuantumVisualization from '@/components/QuantumVisualization';

const graphStyle:React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderStyle: "solid",
  borderColor: "lightgrey",
  borderWidth: "1px",
  overflow: "auto",
};

const kitStyle:React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderStyle: "solid",
  borderColor: "lightgrey",
  borderWidth: "1px",
  overflow: "auto",
  flex: 1,
}

const circuitStyle:React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderStyle: "solid",
  borderColor: "lightgrey",
  borderWidth: "1px",
  overflow: "auto",
  flex: 2,
}

const codeStyle:React.CSSProperties = {
  width: "100%",
  height: "300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "left",
  justifyContent: "center",
  borderStyle: "solid",
  borderColor: "lightgrey",
  borderWidth: "1px",
  overflow: "auto",
  flex: 1,
  fontSize: "8px",
}


interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
}

export default function HomePage() {

  const [qubits, setQubits] = useState(1);
  const [gates, setGates] = useState<GateInfo[]>([]);

  const addQubit = () => {
    setQubits(qubits + 1);
  };

  const deleteQubit = () => {
    if (qubits <= 1) {
      return;
    }

    const updatedGates = gates.filter(gate => gate.qubitIndex < qubits-1);
    setGates(updatedGates);

    setQubits(qubits - 1);

  };

  const addGate = (gateType: string, qubitIndex: number) => {
    if (qubitIndex >= qubits) {
      console.log(`Quantum bit ${qubitIndex} does not exist.`);
      return;
    }

    let gateIndex: number = 0;
    const existingGates = gates.filter(gate => gate.qubitIndex === qubitIndex);
    if (existingGates === undefined) {
      gateIndex = 1;
    } else {
      gateIndex = existingGates.length + 1;
    }

    setGates(currentGates => {
      return [...currentGates, { gateType, qubitIndex, gateIndex }];
    });

  };

  const null_gate = {gateType:"delete",qubitIndex:-1,gateIndex:-1};
  const deleteGate = (gateType: string, qubitIndex: number, gateIndex: number) => {
    const updatedGates = gates.map(gate => {
      // 如果是要删除的门，或者门索引大于要删除的门，则返回 undefined（这将从数组中过滤掉）
      if (gate.qubitIndex === qubitIndex && gate.gateIndex >= gateIndex) {
        return gate.gateIndex === gateIndex ? null_gate : { ...gate, gateIndex: gate.gateIndex - 1 };
      }
      // 其他门保持不变
      return gate;
    });

    // 使用 filter 移除所有标记为 null 的门，并更新状态
    setGates(updatedGates.filter(gate => gate !== null_gate));
  };


  return (
    <>
      <CssBaseline />
      {/* <LeftDrawer /> */}
      <div style={{display: 'flex',flexDirection: "column",  alignItems: "center", justifyContent: "center", height: "100%"}}>
        <div style={{ width:"100%", borderStyle: "solid", borderColor: "lightgrey", borderWidth: "1px"}}>
        </div>
        <div style={{ width:"100%", height: "300px", display: 'flex', flexDirection: "row"}}>
          <div style={kitStyle}>
            {/* 元件面板，可以放置一些可拖拽的量子门元件 */}
            <ComponentPanel qubits={qubits} onAddGate={addGate} />
          </div>
          <div style={circuitStyle}>
            {/* 量子电路容器 */}
            <QuantumCircuit qubits={qubits} addQubit={addQubit} deleteQubit={deleteQubit} gates={gates} deleteGate={deleteGate} />
          </div>
          <div style={codeStyle}>
            {/* 代码生成区，可以显示生成的 Qiskit 代码 */}
            <Code qubits={qubits} gates={gates} />
          </div>
        </div>
        <QuantumVisualization qubits={qubits} gates={gates} />
      </div>
    </>
  );
}