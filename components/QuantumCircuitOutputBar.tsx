// QuantumCircuitOutputBar.tsx
"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface GateInfo {
  gateType: string;
  qubitIndex: number;
  gateIndex: number;
  targetIndex?: number;
  params?: any;
}

interface Props {
  qubits: number;
  gates: GateInfo[];
  parentWidth: number;
  parentHeight: number;
}

function binaryToHex(binaryStr: string, maxLength: number): string {
  if (binaryStr.length > maxLength) {
    // 将二进制字符串转换为十六进制
    const decimalValue = parseInt(binaryStr, 2);
    const hexValue = decimalValue.toString(16);
    return hexValue;
  } else {
    return binaryStr;
  }
}

const QuantumCircuitOutputBar: React.FC<Props> = ({
  qubits,
  gates,
  parentWidth,
  parentHeight,
}) => {
  const d3Container = useRef<SVGSVGElement>(null);

  // 自适应宽度和高度设置
  const svgWidth = parentWidth || 600;
  const svgHeight = parentHeight || 300;

  useEffect(() => {
    if (d3Container.current) {
      // 清除之前的内容
      d3.select(d3Container.current).selectAll("*").remove();

      const svg = d3
        .select(d3Container.current)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      // 优化边距，特别是底部和左侧，确保轴标签有足够空间
      const margin = {
        top: 10,
        right: 20,
        bottom: Math.max(60, svgHeight * 0.15), // 增加底部边距确保标签显示
        left: Math.max(60, svgWidth * 0.12), // 增加左侧边距确保标签显示
      };
      const width = svgWidth - margin.left - margin.right;
      const height = svgHeight - margin.top - margin.bottom;

      // 确定每个量子比特上H门的数量
      const hGateCounts = new Array(qubits).fill(0);
      gates.forEach((gate) => {
        if (gate.gateType === "H") {
          hGateCounts[gate.qubitIndex] += 1;
        }
      });

      // 计算每个量子态的概率
      const quantumStates: { state: string; probability: number }[] = [];
      for (let i = 0; i < Math.pow(2, qubits); i++) {
        const state = i.toString(2).padStart(qubits, "0");
        let probability = 1.0; // 初始概率

        // 调整每个量子比特上H门数量为奇数的概率
        for (let qIndex = 0; qIndex < qubits; qIndex++) {
          if (
            hGateCounts[qIndex] % 2 === 0 &&
            state[qubits - qIndex - 1] === "1"
          ) {
            probability = 0;
            break;
          } else if (
            hGateCounts[qIndex] % 2 === 0 &&
            state[qubits - qIndex - 1] === "0"
          ) {
            // 状态不变
          } else if (hGateCounts[qIndex] % 2 === 1) {
            probability = probability / 2;
          }
        }
        quantumStates.push({ state, probability });
      }

      // 创建图表
      const chartGroup = svg
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(quantumStates.map((q) => q.state))
        .padding(0.2); // 保持柱状图之间的间距

      const yScale = d3
        .scaleLinear()
        .range([height, 0])
        .domain([
          0,
          Math.max(1, d3.max(quantumStates, (d) => d.probability) * 1.1),
        ]); // 略微提高上限以便有空间

      // 自适应柱状图宽度计算
      const totalBars = quantumStates.length;
      const barWidth = Math.min(
        (width / totalBars) * 0.8, // 标准计算宽度的80%
        80, // 最大宽度
        xScale.bandwidth() // 确保不超过分配的带宽
      );

      // 绘制柱状图
      chartGroup
        .selectAll(".bar")
        .data(quantumStates)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr(
          "x",
          (d) => (xScale(d.state) || 0) + (xScale.bandwidth() - barWidth) / 2
        )
        .attr("width", barWidth)
        .attr("y", (d) => yScale(d.probability))
        .attr("height", (d) => height - yScale(d.probability))
        .attr("fill", d3.rgb(100, 140, 240))
        .attr("rx", 2) // 圆角效果
        .attr("ry", 2);

      // 添加x轴并优化标签显示
      const xAxis = chartGroup
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      // 更智能地优化x轴标签显示
      const totalWidth = width;
      const avgCharWidth = 8; // 估计每个字符的宽度（像素）
      const idealLabelCount = Math.floor(totalWidth / (avgCharWidth * 6)); // 估计合适的标签数量
      const skipFactor = Math.max(1, Math.ceil(totalBars / idealLabelCount));

      // 根据空间调整标签
      if (totalBars > 6) {
        xAxis
          .selectAll(".tick text")
          .style("text-anchor", "end")
          .attr("dx", "-0.8em")
          .attr("dy", "0.15em")
          .attr("transform", "rotate(-45)")
          .style(
            "font-size",
            `${Math.min(12, Math.max(8, 20 - totalBars / 2))}px`
          ) // 动态调整字体大小
          .text((d, i) => (i % skipFactor === 0 ? binaryToHex(d, 4) : ""))
          .append("title")
          .text((d) => d); // 添加鼠标悬停提示
      } else {
        xAxis
          .selectAll(".tick text")
          .style("font-size", "12px")
          .text((d) => binaryToHex(d, 4))
          .append("title")
          .text((d) => d);
      }

      // 添加y轴，并减少刻度数量
      chartGroup
        .append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).ticks(Math.min(5, height / 50))); // 根据高度动态调整刻度数量

      // 添加x轴标签
      chartGroup
        .append("text")
        .attr("class", "x-axis-label")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.bottom * 0.6})`
        )
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("状态");

      // 添加y轴标签
      chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left * 0.7)
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("概率");

      // 为每个数据添加数值标签（当状态数量较少时）
      if (totalBars <= 8) {
        chartGroup
          .selectAll(".bar-label")
          .data(quantumStates.filter((d) => d.probability > 0.05)) // 只给有意义的概率值添加标签
          .enter()
          .append("text")
          .attr("class", "bar-label")
          .attr("x", (d) => (xScale(d.state) || 0) + xScale.bandwidth() / 2)
          .attr("y", (d) => yScale(d.probability) - 5)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text((d) => d.probability.toFixed(2));
      }
    }
  }, [qubits, gates, svgWidth, svgHeight]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // 确保子元素相对于此容器定位
      }}
    >
      <svg
        ref={d3Container}
        width={svgWidth}
        height={svgHeight}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          position: "absolute", // 使SVG完全覆盖容器
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default QuantumCircuitOutputBar;
