import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
export interface FlavorPairDataType {
  Flavor: string;
  v1: number;
  v2: number;
}

export interface DoubleCircularBarPlotProps {
  data: FlavorPairDataType[]; // データをプロパティとして受け取る
}

const DoubleCircularBarPlot: React.FC<DoubleCircularBarPlotProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const margin = { top: 20, right: 0, bottom: 0, left: 0 };
  const width = 460 - margin.left - margin.right;
  const height = 460 - margin.top - margin.bottom;
  const innerRadius = 90;
  const outerRadius = Math.min(width, height) / 2;

  const drawChart = () => {
    d3.select(svgRef.current).selectAll("*").remove();

    // SVGを初期化
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`
      );

    // Xスケール：2つのデータシリーズに共通
    const x = d3
      .scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(data.map((d) => d.Flavor)); // X軸のドメインは国名リスト

    // Yスケール（外側のバー用）
    const y = d3
      .scaleRadial()
      .range([innerRadius, outerRadius])
      .domain([0, 13000]); // Yのドメインはデータの最大値まで

    // 第2のバーグラフ用スケール
    const ybis = d3
      .scaleRadial()
      .range([innerRadius, 5])
      .domain([0, 13000]);

    // 棒グラフ（第1シリーズ）を追加
    svg
      .append("g")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "yo")
      .attr(
        "d",
        d3
          .arc<FlavorPairDataType>()
          .innerRadius(innerRadius)
          .outerRadius((d) => (d.v1 !== null ? y(d.v1) : innerRadius))
          .startAngle((d) => x(d.Flavor) as number)
          .endAngle((d) => (x(d.Flavor) as number) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius)
      );

    // ラベルの追加
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("text-anchor", (d) =>
        (x(d.Flavor)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? "end"
          : "start"
      )
      .attr("transform", (d) => {
        const angle = (x(d.Flavor)! + x.bandwidth() / 2) * (180 / Math.PI) - 90;
        return `rotate(${angle}) translate(${y(d.v1 !== null ? d.v1 : 0) + 10},0)`;
      })
      .append("text")
      .text((d) => d.Flavor)
      .attr("transform", (d) =>
        (x(d.Flavor)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
          ? "rotate(180)"
          : "rotate(0)"
      )
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");

    // 第2シリーズのバーを追加
    svg
      .append("g")
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("opacity", 0.5)
      .attr(
        "d",
        d3
          .arc<FlavorPairDataType>()
          .innerRadius(() => ybis(0))
          .outerRadius((d) => (d.v2 !== null ? ybis(d.v2) : innerRadius))
          .startAngle((d) => x(d.Flavor) as number)
          .endAngle((d) => (x(d.Flavor) as number) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius)
      );
  };

  // drawChart を呼び出す
  useEffect(() => {
    drawChart();
  }, [data]); // data の変更を監視

  return <svg ref={svgRef}></svg>;
};

export default DoubleCircularBarPlot;
