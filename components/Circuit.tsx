'use client';

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const QuantumCircuit: React.FC = () => {
    const [qubits, setQubits] = useState(1); // 初始量子比特数量

    useEffect(() => {
        drawCircuit(qubits);
    }, [qubits]);

    const drawCircuit = (numQubits: number) => {
        const container = d3.select('#circuit-container');
        container.selectAll('svg').remove(); // 清除已有的 SVG

        const svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', (numQubits + 1) * 30 + 30); // 增加30px以适应下方的c线

        // 绘制量子线路
        svg.selectAll('line')
            .data(new Array(numQubits))
            .enter()
            .append('line')
            .attr('x1', 50)
            .attr('y1', (d, i) => 30 + i * 30)
            .attr('x2', 300)
            .attr('y2', (d, i) => 30 + i * 30)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        // 绘制量子比特标签
        svg.selectAll('text')
            .data(new Array(numQubits))
            .enter()
            .append('text')
            .text((d, i) => `q[${i}]`)
            .attr('x', 40)
            .attr('y', (d, i) => 30 + i * 30 + 15)
            .attr('font-family', 'sans-serif')
            .attr('font-size', '14px')
            .attr('fill', 'black');

        // 绘制经典线（c线）
        svg.append('line')
            .attr('x1', 50)
            .attr('y1', 30 + numQubits * 30) // 在所有量子线路下方
            .attr('x2', 300)
            .attr('y2', 30 + numQubits * 30)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5 5'); // 虚线样式
    };

    // 增加量子比特数量
    const addQubit = () => {
        setQubits(qubits + 1);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div id="circuit-container" style={{ height: '300px' }} />
            <button onClick={addQubit} style={{ marginTop: '10px', marginLeft: '10px' }}>Add Qubit</button>
        </div>
    );
};

export default QuantumCircuit;