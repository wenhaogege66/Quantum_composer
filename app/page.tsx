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

const graphStyle = {
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

const kitStyle = {
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

const circuitStyle = {
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

const codeStyle = {
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
  fontsize: "8px",
}


interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
}

export default function HomePage() {
  const data = [{ state: "19", probability: 0.1},{ state: "1215", probability: 0.4 },{ state: "00", probability: 0.5 }, { state: "10", probability: 0.5 }];

  const [qubits, setQubits] = useState(1);
  const [gates, setGates] = useState<GateInfo[]>([]);

  const addQubit = () => {
    setQubits(qubits + 1);
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


  return (
    <>
      <CssBaseline />
      <LeftDrawer />
      <div style={{display: 'flex',flexDirection: "column",  alignItems: "center", justifyContent: "center", height: "100%", marginLeft: 60}}>
        <div style={{ width:"100%", borderStyle: "solid", borderColor: "lightgrey", borderWidth: "1px"}}>
          <Toolbar>
            <TextField id="name" variant="standard" defaultValue={"Untitled circuit"} style={{marginRight: 15}}/>
            <Divider orientation="vertical" variant="middle" flexItem style={{borderRightWidth:"2px"}}/>
            <FileMenu />
            <EditMenu />
            <ViewMenu />
            <div style={{marginLeft: "auto"}}>
              <LoginMenu />
            </div>
          </Toolbar>
        </div>
        <div style={{ width:"100%", height: "300px", display: 'flex', flexDirection: "row"}}>
          <div style={kitStyle}>
            {/* 元件面板，可以放置一些可拖拽的量子门元件 */}
            <ComponentPanel qubits={qubits} onAddGate={addGate} />
          </div>
          <div style={circuitStyle}>
            {/* 量子电路容器 */}
            <QuantumCircuit qubits={qubits} addQubit={addQubit} gates={gates} />
          </div>
          <div style={codeStyle}>
            {/* 代码生成区，可以显示生成的 Qiskit 代码 */}
            <Code qubits={qubits} gates={gates} />
          </div>
        </div>
        <div style={{width: "100%", height: "100%", display: 'flex', flexDirection: "row"}}>
          <div style={graphStyle}>
            <QuantumCircuitOutputBar qubits={qubits} gates={gates} />
          </div>
          <div style={graphStyle}>
            <QuantumSphereVisualization qubits={qubits} gates={gates} />
          </div>
        </div>
      </div>
    </>
  );
}