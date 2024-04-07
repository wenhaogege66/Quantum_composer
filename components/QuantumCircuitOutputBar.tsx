// QuantumCircuitOutputBar.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { QuantumState } from '../utils/types';
  
interface Props {
  data: QuantumState[];
}

const QuantumCircuitOutputBar: React.FC<Props> = ({ data }) => {
    const d3Container = useRef(null);

    const svgWidth = 500, svgHeight = 300;
    useEffect(() => {
      if (data && d3Container.current) {
        const svg = d3.select(d3Container.current);
  
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;
  
        // 检查是否已经存在g元素，如果不存在则添加
        const g = svg.selectAll("g.chart-content").data([null]);
        const gEnter = g.enter().append("g")
          .attr("class", "chart-content");
        gEnter.merge(g)
          .attr('transform', `translate(${margin.left},${margin.top})`);
  
        const xScale = d3.scaleBand()
          .range([0, width])
          .domain(data.map(d => d.state))
          .padding(0.1);
  
        const yScale = d3.scaleLinear()
          .range([height, 0])
          .domain([0, 1]);

        // 使用更新后的选择集来绘制和更新图形
        const gUpdate = svg.select(".chart-content");
  
        const bars = gUpdate.selectAll(".bar")
          .data(data, (d: { state: any; }) => d.state);
  
        // 退出阶段
        bars.exit()
          .transition()
          .duration(500)
          .attr("y", height)
          .attr("height", 0)
          .remove();
  
        // 进入阶段 + 更新阶段
        bars.enter().append("rect")
            .attr("class", "bar")
            // 初始状态
            .attr("y", height)
            .attr("height", 0)
          .merge(bars) // 合并进入和更新的选择集
            .transition()
            .duration(500)
            .attr("x", (d: { state: any; }) => (xScale(d.state) || 0) + xScale.bandwidth() / 2 - 15)
            .attr("width", 30)
            .attr("y", (d: { probability: any; }) => yScale(d.probability))
            .attr("height", (d: { probability: any; }) => height - yScale(d.probability))
            .attr("fill", d3.rgb(150,168,255));

          // 创建或选择x轴和y轴的占位符
          const xAxisGroup = gUpdate.selectAll('.x-axis-group').data([0]);
          const yAxisGroup = gUpdate.selectAll('.y-axis-group').data([0]);

          xAxisGroup.enter()
            .append('g')
              .attr('class', 'x-axis-group')
              .attr('transform', `translate(0, ${height})`) // 假设height是你的SVG高度减去上下边距
            .merge(xAxisGroup)
              .call(d3.axisBottom(xScale)); // 更新x轴

          yAxisGroup.enter()
            .append('g')
              .attr('class', 'y-axis-group')
            .merge(yAxisGroup)
              .call(d3.axisLeft(yScale)); // 更新y轴

        // 添加x轴标签
        gUpdate.append("text")
            .attr("class", "x-axis-label")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
            .style("text-anchor", "middle")
            .text("State");

        // 添加y轴标签
        gUpdate.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Probability(%)");  
        }
  }, [data]); // 依赖于data的变化

  return (
    <svg ref={d3Container} height={svgHeight} width={svgWidth}/>
  );
};

export default QuantumCircuitOutputBar;
