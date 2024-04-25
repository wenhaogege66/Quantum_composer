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

const quantumStates = [
  {state: '0011', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '0111', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1110', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1101', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1111', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '0101', probability: 0.1, amplitude: {real: -0.1 ,imaginary: -0.1}},
  {state: '0001', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1111', probability: 0.5, amplitude: {real: 0.2 ,imaginary: 0.8}}
];

export default function HomePage() {
  const data = [{ state: "19", probability: 0.1},{ state: "1215", probability: 0.4 },{ state: "00", probability: 0.5 }, { state: "10", probability: 0.5 }];
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
            <ComponentPanel />
          </div>
          <div style={circuitStyle}>
            {/* 量子电路容器 */}
            <QuantumCircuit />
          </div>
          <div style={codeStyle}>
            {/* 代码生成区，可以显示生成的 Qiskit 代码 */}
            <Code />
          </div>
        </div>
        <div style={{width: "100%", height: "100%", display: 'flex', flexDirection: "row"}}>
          <div style={graphStyle}>
            <QuantumCircuitOutputBar data={data}/>
          </div>
          <div style={graphStyle}>
            <QuantumSphereVisualization data={quantumStates}/>
          </div>
        </div>
      </div>
    </>
  );
}