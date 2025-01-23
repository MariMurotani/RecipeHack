import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';

export interface BarChartData {
    label: string;
    value: number;
}

const HeatmapBarChart = ({ data }: { data: BarChartData[] }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
  
    useEffect(() => {
      const width = 400;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 20, left: 50 };
      const svg = d3.select(svgRef.current);
  
      // 既存の要素をクリア
      svg.selectAll('*').remove();
  
      svg.attr('width', width).attr('height', height);
  
      // スケールの設定
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);
        
  
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) || 0])
        .range([width - margin.right, margin.left]); // 右から左
  
      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, (d) => d.value) || 0]);
  
      // X軸
      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(xScale));
  
      // 棒グラフ
      svg.selectAll('.bar')
        .data<BarChartData>(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d) => yScale(d.value))
        .attr('y', (d) => xScale(d.label) || 0)
        .attr('width', (d) => width - margin.right - yScale(d.value))
        .attr('height', xScale.bandwidth())
        .attr('fill', (d) => colorScale(d.value));
  
      // Y軸
      svg.append('g')
        .attr('transform', `translate(${width - margin.right}, 0)`)
        .call(d3.axisRight(yScale).ticks(5));
    }, [data]);
  
    return <svg ref={svgRef}></svg>;
  };

export default HeatmapBarChart;
