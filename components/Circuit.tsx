'use client';

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import HG from '../img/Hadamard_Gate.svg';

interface GateInfo {
    gateType: string;
    qubitIndex: number;
    gateIndex: number;
}

interface QuantumCircuitProps {
    qubits: number;
    addQubit: () => void;
    gates: GateInfo[];
}

const QuantumCircuit: React.FC<QuantumCircuitProps> = ({ qubits, addQubit, gates }) => {

    useEffect(() => {
        drawCircuit();
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

        // 根据 gates 绘制量子门
        gates.forEach(gate => {
            // 根据 gate.type 绘制不同的门
            // 这里只是一个示例，您可能需要根据实际的门类型绘制不同的图形
            svg.append('image')
                .attr('x', 60 + (gate.gateIndex - 1) * 30) // 门的 x 坐标，根据实际布局调整
                .attr('y', 20 + gate.qubitIndex * 30 ) // 门的 y 坐标
                .attr('width', 20)
                .attr('height', 20)
                .attr('xlink:href', HG.src)
        });
    };



    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <button onClick={addQubit} style={{marginTop: '10px', marginLeft: '10px'}}>Add Qubit</button>
            <div id="circuit-container" style={{height: '300px'}}/>
        </div>
    );
};

export default QuantumCircuit;