import React, { useRef, useEffect } from "react";
import * as d3 from 'd3';

const PADDING_BUBBLE = 15;
const PADDING_LABEL = 30;
const BUBBLE_SIZE_MIN = 4;
const BUBBLE_SIZE_MAX = 20;
const diameter = 560;
const radius = diameter / 2;

export interface DataNode {
  id: string;
  name: string;
  size: number;
  edge_titles: string[];
  imports: string[];
}

interface NetworkGraphProps {
  data: DataNode[];
  hover_callback: (event:MouseEvent, id: string, show: boolean) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, hover_callback }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = { top: 20, right: 0, bottom: 0, left: 0 };
  const width = 460 - margin.left - margin.right;
  const height = 460 - margin.top - margin.bottom;
  const innerRadius = 90;
  
  // D3.jsの処理を直接呼び出す関数に変更
  const drawChart = () => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`
      );
      
    const cluster = d3.cluster<DataNode>().size([360, innerRadius]);

    // d3.lineRadial() を使用する
    var line = d3.lineRadial()
      .curve(d3.curveBundle.beta(0.6))
      .radius(function (d: any) { return d.y; })
      .angle(function (d: any) { return d.x / 180 * Math.PI; });

    const bubbleSizeScale = d3.scaleLinear()
      .domain([0, 100])
      .range([BUBBLE_SIZE_MIN, BUBBLE_SIZE_MAX]);

    const root = packageHierarchy(data)
      .sum((d) => d.size || 0);

    cluster(root);
    const leaves = root.leaves();
    const packaged_leaves = packageImports(leaves)
    ///console.log(root);
    //console.log(packaged_leaves);
    
    svg.append('g')
      .selectAll('.link')
      .data(packaged_leaves)
      .enter().append('path')
      .each((d: any) => { d.source = d[0]; d.target = d[d.length - 1]; })
      .attr('class', 'link')
      .attr('id', (d: any, i: number) => `linkPath${i}`) // ユニークなIDを設定
      .attr('d', line as any)
      .attr('fill', 'none')
      .attr('stroke', 'lightblue')
      .attr('stroke-width', 1) 
      .attr('stroke-opacity', 0.3)
      .style('pointer-events', 'all');

      // サークルのラベル
      svg.append('g')
      .selectAll('.label')
      .data(leaves)
      .enter().append('text')
      .attr('class', 'label')
      .attr('dy', '0.31em')
      .attr('transform', (d: any) => `rotate(${d.x - 90})translate(${d.y + PADDING_LABEL},0)${d.x < 180 ? '' : 'rotate(180)'}`)
      .attr('text-anchor', (d: any) => (d.x < 180 ? 'start' : 'end'))
      .text((d: any) => d.data.name);

      // サークル部分
      svg.append('g')
      .selectAll('.bubble')
      .data(leaves)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('transform', (d: any) => `rotate(${d.x - 90})translate(${d.y + PADDING_BUBBLE},0)`)
      .attr('r', (d: any) => bubbleSizeScale(d.value || 0))
      .attr('stroke', 'black')
      .attr('fill', '#69a3b2')
      .style('opacity', 0.3) // Use .style() for opacity
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(50) 
          .style('opacity', 0.8); 
        hover_callback(event, d.data.id, true);
        // TODO: リアクト側のツールチップを表示する
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .transition()
          .duration(50) // Duration should be a number
          .style('opacity', 0.3); // Reset to the initial opacity
          hover_callback(event, d.data.id, false);
        });
      };

  // Lazily construct the package hierarchy from class names.
  // https://d3js.org/d3-hierarchy/partition
  function packageHierarchy(classes: DataNode[]) {
    const map: { [key: string]: any } = {};
    map[""] = { name: "root", children: [] };

    function find(name: string, data?: any) {
      let node = map[name];
      if (!node) {
        node = map[name] = data || { name: name, children: [] };
        node.parent = map[""];
        node.parent.children.push(node);
        node.key = name
      }
      return node;
    }

    classes.forEach((d: any) => {
      find(d.id, d);
    });

    console.log(map);
    
    return d3.hierarchy(map[""]);
  }

  // Return a list of imports for the given array of nodes.
  function packageImports(nodes: any) {
    const map: { [key: string]: any } = {};
    const imports: any[] = [];

    // Compute a map from name to node.
    nodes.forEach(function (d: any) {
      map[d.data.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function (d: any) {
      if (d.data.imports) d.data.imports.forEach(function (i: any) {
        imports.push(map[d.data.name].path(map[i]));
      });
    });

    return imports;
  }

  // drawChart を呼び出す
  useEffect(() => {
    drawChart();
  }, [data]); // data の変更を監視

  return <svg ref={svgRef}></svg>;
};

export default NetworkGraph;
