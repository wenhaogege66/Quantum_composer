import React, { useState, useEffect, useRef } from 'react';
import QuantumCircuitOutputBar from './QuantumCircuitOutputBar';
import QuantumSphereVisualization from './QuantumSphereVisualization';

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
    // overflow: "auto",
};
interface GateInfo {
    gateType: string;
    qubitIndex: number;
    gateIndex: number;
}

interface Props {
    qubits: number;
    gates: GateInfo[];
}

const QuantumVisualization: React.FC<Props> = ({ qubits, gates }) => {
    const barParentDivRef = useRef(null);
    const [barParentDivWidth, setBarParentDivWidth] = useState(800);
    const [barParentDivHeight, setBarParentDivHeight] = useState(500);

    const sphereParentDivRef = useRef(null);
    const [sphereParentDivWidth, setSphereParentDivWidth] = useState(500);
    const [sphereParentDivHeight, setSphereParentDivHeight] = useState(500);

    useEffect(() => {
        const updateParentDivWidth = () => {
            if (barParentDivRef.current) {
                setBarParentDivWidth(barParentDivRef.current.offsetWidth);
                setBarParentDivHeight(barParentDivRef.current.offsetHeight);
            }
            if (sphereParentDivRef.current) {
                setSphereParentDivWidth(sphereParentDivRef.current.offsetWidth);
                setSphereParentDivHeight(sphereParentDivRef.current.offsetHeight);
            }
        };
        updateParentDivWidth();
        // 添加resize事件监听器
        window.addEventListener('resize', updateParentDivWidth);

        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('resize', updateParentDivWidth);
        };
    }, []);

    return (
    <div style={{width: "100%", height: "100%", display: 'flex', flexDirection: "row"}}>
        <div ref={barParentDivRef} id='barDiv' style={graphStyle}>
        <QuantumCircuitOutputBar qubits={qubits} gates={gates} parentWidth={barParentDivWidth} parentHeight={barParentDivHeight}/>
        </div>
        <div ref={sphereParentDivRef} id='sphereDiv' style={graphStyle}>
        <QuantumSphereVisualization qubits={qubits} gates={gates} parentWidth={sphereParentDivWidth} parentHeight={sphereParentDivHeight} />
        </div>
    </div>
    );
};

export default QuantumVisualization;