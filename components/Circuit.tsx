'use client';

import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import * as d3 from 'd3';


import GateInfoModal from './GateInfoModal';

import HG from '../img/Hadamard_Gate.svg';

interface GateInfo {
    gateType: string;
    qubitIndex: number;
    gateIndex: number;
}

interface QuantumCircuitProps {
    qubits: number;
    addQubit: () => void;
    deleteQubit: () => void;
    gates: GateInfo[];
    deleteGate: (gateType: string, qubitIndex: number, gateIndex: number) => void;
}

const QuantumCircuit: React.FC<QuantumCircuitProps> = ({ qubits, addQubit, deleteQubit, gates, deleteGate }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : null;

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGate, setSelectedGate] = useState<GateInfo>(null);


    const handleCloseModal = () => {
        setModalOpen(false);
    };


    const handleGateClick = (event, gate) => {
        event.stopPropagation(); // 阻止事件冒泡
        setAnchorEl(event.currentTarget);
        // console.log(selectedGate);
        setSelectedGate(gate);
        // console.log(selectedGate);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        drawCircuit();
        // console.log(gates);
    }, [qubits, gates]);

    const drawCircuit = () => {
        const container = d3.select('#circuit-container');
        container.selectAll('svg').remove();

        // 创建新的 SVG 元素
        const svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', (qubits + 1) * 30); // 假设每条线路高度为 30px

        // 绘制量子线路
        svg.selectAll('line')
            .data(new Array(qubits))
            .enter()
            .append('line')
            .attr('x1', 50) // 起点 x 坐标
            .attr('y1', (d, i) => 30 + i * 30) // 起点 y 坐标
            .attr('x2', 300) // 终点 x 坐标
            .attr('y2', (d, i) => 30 + i * 30) // 终点 y 坐标
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        // 绘制量子比特标签
        svg.selectAll('text')
            .data(new Array(qubits))
            .enter()
            .append('text')
            .text((d, i) => `q[${i}]`)
            .attr('x', 20)
            .attr('y', (d, i) => 40 + i * 30 )
            .attr('font-family', 'sans-serif')
            .attr('font-size', '14px')
            .attr('fill', 'black');

        /*
        // 绘制经典线（c线）
        svg.append('line')
            .attr('x1', 50)
            .attr('y1', 30 + qubits * 30) // 在所有量子线路下方
            .attr('x2', 300)
            .attr('y2', 30 + qubits * 30)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5 5'); // 虚线样式
         */

        // 根据 gates 绘制量子门并添加点击事件
        const gatesGroup = svg.selectAll('.gate')
            .data(gates)
            .enter()
            .append('g')
            .attr('class', 'gate');

        gatesGroup.append('image')
            .attr('x', gate => 60 + (gate.gateIndex - 1) * 30)
            .attr('y', gate => 20 + gate.qubitIndex * 30)
            .attr('width', 20)
            .attr('height', 20)
            .attr('xlink:href', HG.src)
            .attr('data-gate-info', gate => JSON.stringify(gate)) // 将 gate 信息作为 JSON 字符串存储
            .on('click', handleGateClick) // 绑定点击事件
            .on('mouseover', handleMouseOver)  // 鼠标悬停事件
            .on('mouseout', handleMouseOut);  // 鼠标移出事件

    };

    // 鼠标悬停事件处理函数
    function handleMouseOver(event, d) {
        // 'd' 是与图像关联的数据
        // 更改鼠标指针样式为手形，表示可点击
        d3.select(event.currentTarget).style('cursor', 'pointer');
        // 可以在这里添加更多样式变化，比如改变图像的亮度或边框
        // 举例：为图像添加边框或改变不透明度
        d3.select(event.currentTarget).style('border', '2px solid #0000FF');
        d3.select(event.currentTarget).style('opacity', 0.8);
    }

// 鼠标移出事件处理函数
    function handleMouseOut(event, d) {
        // 恢复鼠标指针样式
        d3.select(event.currentTarget).style('cursor', 'auto');
        // 恢复图像样式到默认状态
        d3.select(event.currentTarget).style('border', null);
        d3.select(event.currentTarget).style('opacity', 1);
    }



    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <button onClick={addQubit} style={{marginTop: '10px', marginLeft: '10px'}}>Add Qubit</button>
                <button onClick={deleteQubit} style={{marginTop: '10px', marginLeft: '10px'}}>Delete Qubit</button>
            </div>
            <div id="circuit-container" style={{height: '300px'}}/>
            <Menu
                id={id}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <MenuItem onClick={() => setModalOpen(!modalOpen)}>
                    <InfoIcon></InfoIcon>
                </MenuItem>
                <MenuItem
                    onClick={() => deleteGate(selectedGate.gateType, selectedGate.qubitIndex, selectedGate.gateIndex)}>
                    <DeleteIcon></DeleteIcon>
                </MenuItem>
                <GateInfoModal
                    open={modalOpen}
                    gateInfo={selectedGate}
                    onClose={handleCloseModal}
                />
            </Menu>
        </div>
    );
};

export default QuantumCircuit;